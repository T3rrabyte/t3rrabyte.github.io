"use client";

// Based on "Order Independent Transparency with Dual Depth Peeling" by Louis Bavoil and Kevin Myers (NVIDIA).

import {
	BlendEquation,
	Context,
	Ebo,
	Framebuffer,
	Program,
	Texture2d,
	TextureFilter,
	TextureFormat,
	Vao,
	Vbo
} from "@lakuna/ugl";
import {
	createMatrix4Like,
	identity,
	lookAt,
	multiply,
	perspective,
	rotateY
} from "@lakuna/umath/Matrix4";
import {
	createVector4Like,
	fromValues as fromValues4
} from "@lakuna/umath/Vector4";
import type { Props } from "#Props";
import ReactCanvas from "@lakuna/react-canvas";
import { epsilon } from "@lakuna/umath";

const depthPeelVss = `\
#version 300 es

in vec4 a_position;

uniform mat4 u_worldViewProjMat;

void main() {
	gl_Position = u_worldViewProjMat * a_position;
}
`;

const depthPeelFss = `\
#version 300 es

precision mediump float;

uniform sampler2D u_depthTex;
uniform sampler2D u_frontColorTex;
uniform sampler2D u_backColorTex;
uniform vec4 u_color;

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
		outFrontColor += (1.0 - lastFrontColor.a) * u_color.a;
		outFrontColor.rgb *= u_color.rgb;
		return;
	}

	float alphaFactor = 1.0 - u_color.a;
	outBackColor.rgb = u_color.a * u_color.rgb + alphaFactor * outBackColor.rgb;
	outBackColor.a = u_color.a + alphaFactor * outBackColor.a;
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

				const planePositionBuffer = new Vbo(gl, planePositionData);
				const planeIndexBuffer = new Ebo(gl, planeIndexData);

				const depthPeelPlaneVao = new Vao(
					depthPeelProgram,
					// eslint-disable-next-line camelcase
					{ a_position: { size: 2, vbo: planePositionBuffer } },
					planeIndexBuffer
				);

				const finalPlaneVao = new Vao(
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

				const red = fromValues4(1, 0, 0, 0.25, createVector4Like());
				const redMat = identity(createMatrix4Like());
				rotateY(redMat, Math.PI / 4, redMat);
				const redViewProjMat = createMatrix4Like();

				const green = fromValues4(0, 1, 0, 0.25, createVector4Like());
				const greenMat = identity(createMatrix4Like());
				rotateY(greenMat, -Math.PI / 4, greenMat);
				const greenViewProjMat = createMatrix4Like();

				const blue = fromValues4(0, 0, 1, 0.25, createVector4Like());
				const blueMat = identity(createMatrix4Like());
				const blueViewProjMat = createMatrix4Like();

				const projMat = createMatrix4Like();
				const viewMat = lookAt(
					[0, 2, 2],
					[0, 0, 0],
					[0, 1, 0],
					createMatrix4Like()
				);
				const viewProjMat = createMatrix4Like();

				const resizeViewProj = () => {
					const w = canvas.width;
					const h = canvas.height;
					perspective(Math.PI / 2, w / (h || 1), 1, 5, projMat);
					multiply(projMat, viewMat, viewProjMat);
					multiply(viewProjMat, redMat, redViewProjMat);
					multiply(viewProjMat, greenMat, greenViewProjMat);
					multiply(viewProjMat, blueMat, blueViewProjMat);
				};

				resizeViewProj();

				const drawScene = (
					depthTarget: Texture2d,
					frontColorTarget: Texture2d,
					backColorTarget: Texture2d,
					depthPeelFbo: Framebuffer
				) => {
					depthPeelPlaneVao.draw(
						{
							// eslint-disable-next-line camelcase
							u_backColorTex: backColorTarget,
							// eslint-disable-next-line camelcase
							u_color: red,
							// eslint-disable-next-line camelcase
							u_depthTex: depthTarget,
							// eslint-disable-next-line camelcase
							u_frontColorTex: frontColorTarget,
							// eslint-disable-next-line camelcase
							u_worldViewProjMat: redViewProjMat
						},
						void 0,
						void 0,
						depthPeelFbo
					);
					depthPeelPlaneVao.draw(
						{
							// eslint-disable-next-line camelcase
							u_backColorTex: backColorTarget,
							// eslint-disable-next-line camelcase
							u_color: green,
							// eslint-disable-next-line camelcase
							u_depthTex: depthTarget,
							// eslint-disable-next-line camelcase
							u_frontColorTex: frontColorTarget,
							// eslint-disable-next-line camelcase
							u_worldViewProjMat: greenViewProjMat
						},
						void 0,
						void 0,
						depthPeelFbo
					);
					depthPeelPlaneVao.draw(
						{
							// eslint-disable-next-line camelcase
							u_backColorTex: backColorTarget,
							// eslint-disable-next-line camelcase
							u_color: blue,
							// eslint-disable-next-line camelcase
							u_depthTex: depthTarget,
							// eslint-disable-next-line camelcase
							u_frontColorTex: frontColorTarget,
							// eslint-disable-next-line camelcase
							u_worldViewProjMat: blueViewProjMat
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

				return () => {
					if (gl.resize()) {
						resizeTargets();
						resizeViewProj();
					}

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
					const passCount = 2;
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
