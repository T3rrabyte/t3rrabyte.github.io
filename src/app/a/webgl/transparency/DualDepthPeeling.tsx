"use client";

// Based on "Order Independent Transparency with Dual Depth Peeling" by Louis Bavoil and Kevin Myers (NVIDIA).

import {
	BlendEquation,
	Context,
	ElementBuffer,
	Framebuffer,
	Program,
	Texture2d,
	TextureFilter,
	TextureFormat,
	VertexArray,
	VertexBuffer
} from "@lakuna/ugl";
import {
	createMatrix4Like,
	perspective,
	rotateX,
	rotateZ,
	translate
} from "@lakuna/umath/Matrix4";
import type { Props } from "#Props";
import ReactCanvas from "@lakuna/react-canvas";
import { epsilon } from "@lakuna/umath";

const depthPeelVss = `\
#version 300 es

in vec4 a_position;
in vec4 a_color;

uniform mat4 u_worldViewProjMat;

out vec4 v_color;

void main() {
	gl_Position = u_worldViewProjMat * a_position;
	v_color = a_color;
}
`;

const depthPeelFss = `\
#version 300 es

precision mediump float;

in vec4 v_color;

uniform sampler2D u_depthTex;
uniform sampler2D u_frontColorTex;
uniform sampler2D u_backColorTex;

layout(location = 0) out vec2 outDepth;
layout(location = 1) out vec4 outFrontColor;
layout(location = 2) out vec4 outBackColor;

void main() {
	float depth = gl_FragCoord.z;
	ivec2 fragCoord = ivec2(gl_FragCoord.xy);
	
	vec2 lastDepth = texelFetch(u_depthTex, fragCoord, 0).rg;
	vec4 lastFrontColor = texelFetch(u_frontColorTex, fragCoord, 0);
	vec4 lastBackColor = texelFetch(u_backColorTex, fragCoord, 0);

	float nearDepth = -lastDepth.r;
	float farDepth = lastDepth.g;

	outDepth = vec2(-1.000001);
	outFrontColor = lastFrontColor;
	outBackColor = lastBackColor;

	if (depth < nearDepth || depth > farDepth) {
		return;
	}

	if (depth > nearDepth && depth < farDepth) {
		outDepth = vec2(-depth, depth);
		return;
	}

	if (depth == nearDepth) {
		outFrontColor += (1.0 - lastFrontColor.a) * v_color.a;
		outFrontColor.rgb *= v_color.rgb;
		return;
	}

	float alphaFactor = 1.0 - v_color.a;
	outBackColor.rgb = v_color.a * v_color.rgb + alphaFactor * outBackColor.rgb;
	outBackColor.a = v_color.a + alphaFactor * outBackColor.a;
}
`;

const finalVss = `\
#version 300 es

in vec4 a_position;

void main() {
	gl_Position = a_position;
}
`;

const finalFss = `\
#version 300 es

precision mediump float;

uniform sampler2D u_frontColorTex;
uniform sampler2D u_backColorTex;

out vec4 outColor;

void main() {
	ivec2 fragCoord = ivec2(gl_FragCoord.xy);

	vec4 frontColor = texelFetch(u_frontColorTex, fragCoord, 0);
	vec4 backColor = texelFetch(u_backColorTex, fragCoord, 0);

	outColor.rgb = frontColor.rgb + (1.0 - frontColor.a) * backColor.rgb;
	outColor.a = frontColor.a + backColor.a;
}
`;

// XY plane/quad.
const planePositionData = new Float32Array([-1, 1, -1, -1, 1, -1, 1, 1]);
const planeIndexData = new Uint8Array([0, 1, 2, 0, 2, 3]);

// F position data.
const positionData = new Float32Array([
	0, 0, 0, 0, 150, 0, 30, 0, 0, 0, 150, 0, 30, 150, 0, 30, 0, 0, 30, 0, 0, 30,
	30, 0, 100, 0, 0, 30, 30, 0, 100, 30, 0, 100, 0, 0, 30, 60, 0, 30, 90, 0, 67,
	60, 0, 30, 90, 0, 67, 90, 0, 67, 60, 0, 0, 0, 30, 30, 0, 30, 0, 150, 30, 0,
	150, 30, 30, 0, 30, 30, 150, 30, 30, 0, 30, 100, 0, 30, 30, 30, 30, 30, 30,
	30, 100, 0, 30, 100, 30, 30, 30, 60, 30, 67, 60, 30, 30, 90, 30, 30, 90, 30,
	67, 60, 30, 67, 90, 30, 0, 0, 0, 100, 0, 0, 100, 0, 30, 0, 0, 0, 100, 0, 30,
	0, 0, 30, 100, 0, 0, 100, 30, 0, 100, 30, 30, 100, 0, 0, 100, 30, 30, 100, 0,
	30, 30, 30, 0, 30, 30, 30, 100, 30, 30, 30, 30, 0, 100, 30, 30, 100, 30, 0,
	30, 30, 0, 30, 60, 30, 30, 30, 30, 30, 30, 0, 30, 60, 0, 30, 60, 30, 30, 60,
	0, 67, 60, 30, 30, 60, 30, 30, 60, 0, 67, 60, 0, 67, 60, 30, 67, 60, 0, 67,
	90, 30, 67, 60, 30, 67, 60, 0, 67, 90, 0, 67, 90, 30, 30, 90, 0, 30, 90, 30,
	67, 90, 30, 30, 90, 0, 67, 90, 30, 67, 90, 0, 30, 90, 0, 30, 150, 30, 30, 90,
	30, 30, 90, 0, 30, 150, 0, 30, 150, 30, 0, 150, 0, 0, 150, 30, 30, 150, 30, 0,
	150, 0, 30, 150, 30, 30, 150, 0, 0, 0, 0, 0, 0, 30, 0, 150, 30, 0, 0, 0, 0,
	150, 30, 0, 150, 0
]);

// F color data.
const colorData = new Uint8Array([
	200, 70, 120, 0x80, 200, 70, 120, 0x80, 200, 70, 120, 0x80, 200, 70, 120,
	0x80, 200, 70, 120, 0x80, 200, 70, 120, 0x80, 200, 70, 120, 0x80, 200, 70,
	120, 0x80, 200, 70, 120, 0x80, 200, 70, 120, 0x80, 200, 70, 120, 0x80, 200,
	70, 120, 0x80, 200, 70, 120, 0x80, 200, 70, 120, 0x80, 200, 70, 120, 0x80,
	200, 70, 120, 0x80, 200, 70, 120, 0x80, 200, 70, 120, 0x80, 80, 70, 200, 0x80,
	80, 70, 200, 0x80, 80, 70, 200, 0x80, 80, 70, 200, 0x80, 80, 70, 200, 0x80,
	80, 70, 200, 0x80, 80, 70, 200, 0x80, 80, 70, 200, 0x80, 80, 70, 200, 0x80,
	80, 70, 200, 0x80, 80, 70, 200, 0x80, 80, 70, 200, 0x80, 80, 70, 200, 0x80,
	80, 70, 200, 0x80, 80, 70, 200, 0x80, 80, 70, 200, 0x80, 80, 70, 200, 0x80,
	80, 70, 200, 0x80, 70, 200, 210, 0x80, 70, 200, 210, 0x80, 70, 200, 210, 0x80,
	70, 200, 210, 0x80, 70, 200, 210, 0x80, 70, 200, 210, 0x80, 200, 200, 70,
	0x80, 200, 200, 70, 0x80, 200, 200, 70, 0x80, 200, 200, 70, 0x80, 200, 200,
	70, 0x80, 200, 200, 70, 0x80, 210, 100, 70, 0x80, 210, 100, 70, 0x80, 210,
	100, 70, 0x80, 210, 100, 70, 0x80, 210, 100, 70, 0x80, 210, 100, 70, 0x80,
	210, 160, 70, 0x80, 210, 160, 70, 0x80, 210, 160, 70, 0x80, 210, 160, 70,
	0x80, 210, 160, 70, 0x80, 210, 160, 70, 0x80, 70, 180, 210, 0x80, 70, 180,
	210, 0x80, 70, 180, 210, 0x80, 70, 180, 210, 0x80, 70, 180, 210, 0x80, 70,
	180, 210, 0x80, 100, 70, 210, 0x80, 100, 70, 210, 0x80, 100, 70, 210, 0x80,
	100, 70, 210, 0x80, 100, 70, 210, 0x80, 100, 70, 210, 0x80, 76, 210, 100,
	0x80, 76, 210, 100, 0x80, 76, 210, 100, 0x80, 76, 210, 100, 0x80, 76, 210,
	100, 0x80, 76, 210, 100, 0x80, 140, 210, 80, 0x80, 140, 210, 80, 0x80, 140,
	210, 80, 0x80, 140, 210, 80, 0x80, 140, 210, 80, 0x80, 140, 210, 80, 0x80, 90,
	130, 110, 0x80, 90, 130, 110, 0x80, 90, 130, 110, 0x80, 90, 130, 110, 0x80,
	90, 130, 110, 0x80, 90, 130, 110, 0x80, 160, 160, 220, 0x80, 160, 160, 220,
	0x80, 160, 160, 220, 0x80, 160, 160, 220, 0x80, 160, 160, 220, 0x80, 160, 160,
	220, 0x80
]);

export default function DualDepthPeeling(props: Props<HTMLCanvasElement>) {
	return (
		<ReactCanvas
			init={(canvas) => {
				const gl = Context.get(canvas);

				const depthPeelProgram = Program.fromSource(
					gl,
					depthPeelVss,
					depthPeelFss
				);
				const finalProgram = Program.fromSource(gl, finalVss, finalFss);

				const planePositionBuffer = new VertexBuffer(gl, planePositionData);
				const planeIndexBuffer = new ElementBuffer(gl, planeIndexData);
				const positionBuffer = new VertexBuffer(gl, positionData);
				const colorBuffer = new VertexBuffer(gl, colorData);

				const depthPeelVao = new VertexArray(depthPeelProgram, {
					// eslint-disable-next-line camelcase
					a_color: { normalized: true, size: 4, vbo: colorBuffer },
					// eslint-disable-next-line camelcase
					a_position: positionBuffer
				});

				const finalPlaneVao = new VertexArray(
					finalProgram,
					// eslint-disable-next-line camelcase
					{ a_position: { size: 2, vbo: planePositionBuffer } },
					planeIndexBuffer
				);

				const createTarget = (targetGl: Context) => {
					const target = new Texture2d(targetGl);
					target.format = TextureFormat.RGBA32F;
					target.magFilter = TextureFilter.NEAREST;
					target.minFilter = TextureFilter.NEAREST;
					return target;
				};

				const depthTarget0 = createTarget(gl);
				const frontColorTarget0 = createTarget(gl);
				const backColorTarget0 = createTarget(gl);
				const depthTarget1 = createTarget(gl);
				const frontColorTarget1 = createTarget(gl);
				const backColorTarget1 = createTarget(gl);

				const resizeTargets = () => {
					depthTarget0.setMip(void 0, 0, void 0, [
						0,
						0,
						gl.drawingBufferWidth,
						gl.drawingBufferHeight
					]);

					frontColorTarget0.setMip(void 0, 0, void 0, [
						0,
						0,
						gl.drawingBufferWidth,
						gl.drawingBufferHeight
					]);

					backColorTarget0.setMip(void 0, 0, void 0, [
						0,
						0,
						gl.drawingBufferWidth,
						gl.drawingBufferHeight
					]);

					depthTarget1.setMip(void 0, 0, void 0, [
						0,
						0,
						gl.drawingBufferWidth,
						gl.drawingBufferHeight
					]);

					frontColorTarget1.setMip(void 0, 0, void 0, [
						0,
						0,
						gl.drawingBufferWidth,
						gl.drawingBufferHeight
					]);

					backColorTarget1.setMip(void 0, 0, void 0, [
						0,
						0,
						gl.drawingBufferWidth,
						gl.drawingBufferHeight
					]);
				};

				resizeTargets();

				const depthPeelFbo0 = new Framebuffer(gl);
				depthPeelFbo0.attach(0, depthTarget0);
				depthPeelFbo0.attach(1, frontColorTarget0);
				depthPeelFbo0.attach(2, backColorTarget0);

				const depthPeelFbo1 = new Framebuffer(gl);
				depthPeelFbo1.attach(0, depthTarget1);
				depthPeelFbo1.attach(1, frontColorTarget1);
				depthPeelFbo1.attach(2, backColorTarget1);

				const matrix = createMatrix4Like();

				const drawScene = (
					depthTarget: Texture2d,
					frontColorTarget: Texture2d,
					backColorTarget: Texture2d,
					depthPeelFbo: Framebuffer
				) => {
					depthPeelVao.draw(
						{
							// eslint-disable-next-line camelcase
							u_backColorTex: backColorTarget,
							// eslint-disable-next-line camelcase
							u_depthTex: depthTarget,
							// eslint-disable-next-line camelcase
							u_frontColorTex: frontColorTarget,
							// eslint-disable-next-line camelcase
							u_worldViewProjMat: matrix
						},
						void 0,
						void 0,
						depthPeelFbo
					);
				};

				gl.doBlend = true;
				gl.blendEquation = BlendEquation.MAX;
				gl.depthMask = false;
				gl.doCullFace = false;

				return (now) => {
					if (gl.resize()) {
						resizeTargets();
					}

					// Transformation.
					const w = canvas.width;
					const h = canvas.height;
					perspective(Math.PI / 4, w / (h || 1), 1, 1000, matrix);
					translate(matrix, [0, 0, -500], matrix);
					rotateZ(matrix, now * 0.001, matrix);
					rotateX(matrix, now * 0.0007, matrix);

					// Initialize the min-max depth framebuffers.
					depthPeelFbo1.drawBuffers = [0];
					gl.clear([epsilon, 1 + epsilon, 0, 0], false, false, depthPeelFbo1);

					depthPeelFbo1.drawBuffers = [1, 2];
					gl.clear([0, 0, 0, 0], false, false, depthPeelFbo1);

					depthPeelFbo0.drawBuffers = [0];
					gl.clear(
						[-(1 + epsilon), -epsilon, 0, 0],
						false,
						false,
						depthPeelFbo0
					);

					depthPeelFbo0.drawBuffers = [1, 2];
					gl.clear([0, 0, 0, 0], false, false, depthPeelFbo0);

					depthPeelFbo0.drawBuffers = [0];
					drawScene(
						depthTarget1,
						frontColorTarget1,
						backColorTarget1,
						depthPeelFbo0
					);

					// Dual depth peeling ping-pong.
					const passCount = 3;
					for (let i = 0; i < passCount; i++) {
						const depthPeelFbo = i % 2 === 0 ? depthPeelFbo1 : depthPeelFbo0;
						const depthTarget = i % 2 === 0 ? depthTarget0 : depthTarget1;
						const frontColorTarget =
							i % 2 === 0 ? frontColorTarget0 : frontColorTarget1;
						const backColorTarget =
							i % 2 === 0 ? backColorTarget0 : backColorTarget1;

						depthPeelFbo.drawBuffers = [0];
						gl.clear(
							[-(1 + epsilon), -epsilon, 0, 0],
							false,
							false,
							depthPeelFbo
						);

						depthPeelFbo.drawBuffers = [1, 2];
						gl.clear([0, 0, 0, 0], false, false, depthPeelFbo);

						depthPeelFbo.drawBuffers = [0, 1, 2];
						drawScene(
							depthTarget,
							frontColorTarget,
							backColorTarget,
							depthPeelFbo
						);
					}

					// Final render.
					const frontColorTarget =
						passCount % 2 === 0 ? frontColorTarget0 : frontColorTarget1;
					const backColorTarget =
						passCount % 2 === 0 ? backColorTarget0 : backColorTarget1;

					gl.clear([0, 0, 0, 0], false, false);
					finalPlaneVao.draw({
						// eslint-disable-next-line camelcase
						u_backColorTex: backColorTarget,
						// eslint-disable-next-line camelcase
						u_frontColorTex: frontColorTarget
					});
				};
			}}
			{...props}
		/>
	);
}
