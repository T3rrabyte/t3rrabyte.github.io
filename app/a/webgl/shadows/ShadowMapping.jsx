"use client";

import { Program, Buffer, VAO, AttributeState, Color, Texture2D, TextureInternalFormat, TextureMagFilter, TextureMinFilter, Context, Primitive, FaceDirection, Mipmap, Texture2DMip, TextureWrapFunction, Framebuffer } from "@lakuna/ugl";
import { mat4, vec3 } from "gl-matrix";
import AnimatedCanvas from "../AnimatedCanvas";

const vss = `#version 300 es
in vec4 a_position;
in vec2 a_texcoord;
uniform mat4 u_viewProjMat;
uniform mat4 u_worldMat;
uniform mat4 u_texMat;
out vec2 v_texcoord;
out vec4 v_projectedTexcoord;
void main() {
	vec4 pos = u_worldMat * a_position;
	gl_Position = u_viewProjMat * pos;
	v_texcoord = a_texcoord;
	v_projectedTexcoord = u_texMat * pos;
}`;

const fss = `#version 300 es
precision highp float;
in vec2 v_texcoord;
in vec4 v_projectedTexcoord;
uniform vec4 u_color;
uniform sampler2D u_texture;
uniform sampler2D u_projectedTexture;
out vec4 outColor;
void main() {
	vec2 projectedTexcoord = (v_projectedTexcoord.xyz / v_projectedTexcoord.w).xy;
	bool inRange =
		projectedTexcoord.x >= 0.0
		&& projectedTexcoord.x <= 1.0
		&& projectedTexcoord.y >= 0.0
		&& projectedTexcoord.y <= 1.0;
	vec4 projectedTexColor = vec4(texture(u_projectedTexture, projectedTexcoord).rrr, 1);
	vec4 texColor = texture(u_texture, v_texcoord) * u_color;
	outColor = inRange ? projectedTexColor : texColor;
}`;

const wireframeVss = `#version 300 es
in vec4 a_position;
uniform mat4 u_viewProjMat;
uniform mat4 u_worldMat;
void main() {
	gl_Position = u_viewProjMat * u_worldMat * a_position;
}`;

const wireframeFss = `#version 300 es
precision highp float;
out vec4 outColor;
void main() {
	outColor = vec4(0, 0, 0, 1);
}`;

const quadPositionBufferData = new Float32Array([
	-1, 1,
	-1, -1,
	1, -1,
	1, 1
]);

const quadTexcoordBufferData = new Float32Array([
	0, 0,
	0, 10,
	10, 10,
	10, 0
]);

const quadIndexData = new Uint8Array([
	0, 1, 2,
	0, 2, 3
]);

const icoPositionBufferData = (() => {
	const t = (1 + Math.sqrt(5)) / 2; // The golden ratio (tau).

	return new Float32Array([
		1, t, 0,
		0, 1, t,
		t, 0, 1,
		t, 0, -1,

		t, 0, -1,
		t, 0, 1,
		1, -t, 0,
		0, -1, -t,

		t, 0, 1,
		0, 1, t,
		0, -1, t,
		1, -t, 0,

		1, -t, 0,
		0, -1, t,
		-1, -t, 0,
		0, -1, -t,

		0, -1, t,
		0, 1, t,
		-t, 0, 1,
		-1, -t, 0,

		-1, -t, 0,
		-t, 0, 1,
		-t, 0, -1,
		0, -1, -t,

		-t, 0, 1,
		0, 1, t,
		-1, t, 0,
		-t, 0, -1,

		-t, 0, -1,
		-1, t, 0,
		0, 1, -t,
		0, -1, -t,

		-1, t, 0,
		0, 1, t,
		1, t, 0,
		0, 1, -t,

		0, 1, -t,
		1, t, 0,
		t, 0, -1,
		0, -1, -t
	]).map((n) => n / t);
})();

const icoTexcoordBufferData = new Float32Array([
	0, 0,
	0, 5,
	5, 5,
	5, 0,

	0, 0,
	0, 5,
	5, 5,
	5, 0,

	0, 0,
	0, 5,
	5, 5,
	5, 0,

	0, 0,
	0, 5,
	5, 5,
	5, 0,

	0, 0,
	0, 5,
	5, 5,
	5, 0,

	0, 0,
	0, 5,
	5, 5,
	5, 0,

	0, 0,
	0, 5,
	5, 5,
	5, 0,

	0, 0,
	0, 5,
	5, 5,
	5, 0,

	0, 0,
	0, 5,
	5, 5,
	5, 0,

	0, 0,
	0, 5,
	5, 5,
	5, 0
]);

const icoIndexData = new Uint8Array([
	0, 1, 2,
	0, 2, 3,

	4, 5, 6,
	4, 6, 7,

	8, 9, 10,
	8, 10, 11,

	12, 13, 14,
	12, 14, 15,

	16, 17, 18,
	16, 18, 19,

	20, 21, 22,
	20, 22, 23,

	24, 25, 26,
	24, 26, 27,

	28, 29, 30,
	28, 30, 31,

	32, 33, 34,
	32, 34, 35,

	36, 37, 38,
	36, 38, 39
]);

const projectorConeRes = 6;

const projectorPositionBufferData = (() => {
	const out = [
		-1, -1, 1,
		1, -1, 1,
		-1, 1, 1,
		1, 1, 1,
		-1, -1, 3,
		1, -1, 3,
		-1, 1, 3,
		1, 1, 3,
		0, 0, 1
	];

	for (let i = 0; i < projectorConeRes; i++) {
		const angle = i / projectorConeRes * Math.PI * 2;
		out.push(Math.cos(angle), Math.sin(angle), 0);
	}

	return new Float32Array(out);
})();

const projectorIndexData = (() => {
	const out = [
		0, 1,
		1, 3,
		3, 2,
		2, 0,

		4, 5,
		5, 7,
		7, 6,
		6, 4,

		0, 4,
		1, 5,
		3, 7,
		2, 6
	];

	const coneBaseIndex = 9;
	for (let i = 0; i < projectorConeRes; i++) {
		out.push(
			coneBaseIndex - 1, // Cone tip
			coneBaseIndex + i,

			coneBaseIndex + i,
			coneBaseIndex + (i + 1) % projectorConeRes
		);
	}

	return new Uint8Array(out);
})();

const frustumPositionBufferData = new Float32Array([
	0, 0, 0,
	1, 0, 0,
	0, 1, 0,
	1, 1, 0,
	0, 0, 1,
	1, 0, 1,
	0, 1, 1,
	1, 1, 1
]);

const frustumIndexData = new Uint8Array([
	0, 1,
	1, 3,
	3, 2,
	2, 0,

	4, 5,
	5, 7,
	7, 6,
	6, 4,

	0, 4,
	1, 5,
	3, 7,
	2, 6
]);

const transparent = new Color(0, 0, 0, 0);
const red = new Color(0xFF0000);
const green = new Color(0x00FF00);
const viewCamFov = Math.PI / 3;
const viewCamNear = 1;
const viewCamFar = 2000;
const projCamFov = Math.PI * 2 / 3;
const projCamAspect = 1;
const projCamNear = 0.1;
const projCamFar = 10;
const projCamScale = vec3.fromValues(1 / 3, 1 / 3, 1 / 3);
const up = vec3.fromValues(0, 1, 0);
const quadScale = vec3.fromValues(20, 20, 1);
const quadPos = vec3.fromValues(0, 0, 0);
const icoScale = vec3.fromValues(1, 1, 1);
const icoPos = vec3.fromValues(2, 3, 4);
const viewCamPos = vec3.fromValues(6, 5, 7);
const projCamPos = vec3.fromValues(2.5, 4.8, 4.3);
const viewCamTarget = vec3.fromValues(0, 0, 0);
const projCamTarget = vec3.fromValues(2.5, 0, 3.5);

export default function ShadowMapping(props) {
	return AnimatedCanvas((canvas) => {
		const gl = new Context(canvas);

		const program = Program.fromSource(gl, vss, fss);
		const wireframeProgram = Program.fromSource(gl, wireframeVss, wireframeFss);

		const quadPositionBuffer = new Buffer(gl, quadPositionBufferData);
		const quadTexcoordBuffer = new Buffer(gl, quadTexcoordBufferData);
		const icoPositionBuffer = new Buffer(gl, icoPositionBufferData);
		const icoTexcoordBuffer = new Buffer(gl, icoTexcoordBufferData);
		const projectorPositionBuffer = new Buffer(gl, projectorPositionBufferData);
		const frustumPositionBuffer = new Buffer(gl, frustumPositionBufferData);

		const quadVao = new VAO(program, [
			new AttributeState("a_position", quadPositionBuffer, 2),
			new AttributeState("a_texcoord", quadTexcoordBuffer, 2)
		], quadIndexData);

		const icoVao = new VAO(program, [
			new AttributeState("a_position", icoPositionBuffer),
			new AttributeState("a_texcoord", icoTexcoordBuffer, 2)
		], icoIndexData);

		const monoQuadVao = new VAO(wireframeProgram, [
			new AttributeState("a_position", quadPositionBuffer, 2)
		], quadIndexData);

		const monoIcoVao = new VAO(wireframeProgram, [
			new AttributeState("a_position", icoPositionBuffer)
		], icoIndexData);

		const projectorVao = new VAO(wireframeProgram, [
			new AttributeState("a_position", projectorPositionBuffer)
		], projectorIndexData);

		const frustumVao = new VAO(wireframeProgram, [
			new AttributeState("a_position", frustumPositionBuffer)
		], frustumIndexData);

		const tileTexture = new Texture2D(
			gl,
			new Mipmap(new Map([
				[0, new Texture2DMip(
					new Uint8Array([
						0x80, 0xC0,
						0xC0, 0x80
					]),
					TextureInternalFormat.LUMINANCE,
					2,
					2
				)]
			]))
		);

		const shadowTexture = new Texture2D(
			gl,
			new Mipmap(new Map([
				[0, new Texture2DMip(
					undefined,
					TextureInternalFormat.DEPTH_COMPONENT32F,
					512,
					512
				)]
			])),
			undefined,
			undefined,
			TextureWrapFunction.CLAMP_TO_EDGE,
			TextureWrapFunction.CLAMP_TO_EDGE
		);

		const shadowFramebuffer = new Framebuffer(
			gl,
			undefined,
			shadowTexture.face
		);

		const quadWorldMat = mat4.create();
		const icoWorldMat = mat4.create();
		const viewCamWorldMat = mat4.create();
		const viewCamViewMat = mat4.create();
		const viewCamProjMat = mat4.create();
		const viewCamViewProjMat = mat4.create();
		const projCamWorldMat = mat4.create();
		const projCamDisplayWorldMat = mat4.create();
		const projCamViewMat = mat4.create();
		const projCamProjMat = mat4.create();
		const projCamViewProjMat = mat4.create();
		const projCamInvViewProjMat = mat4.create();

		return function render() {
			gl.cullFace = FaceDirection.BACK;

			mat4.identity(quadWorldMat);
			mat4.rotateX(quadWorldMat, quadWorldMat, Math.PI * 3 / 2); // XZ plane.
			mat4.translate(quadWorldMat, quadWorldMat, quadPos);
			mat4.scale(quadWorldMat, quadWorldMat, quadScale);
			mat4.identity(icoWorldMat);
			mat4.translate(icoWorldMat, icoWorldMat, icoPos);
			mat4.scale(icoWorldMat, icoWorldMat, icoScale);
			mat4.perspective(viewCamProjMat, viewCamFov, canvas.clientWidth / canvas.clientHeight, viewCamNear, viewCamFar); // projectionMatrix
			mat4.perspective(projCamProjMat, projCamFov, projCamAspect, projCamNear, projCamFar); // textureProjectionMatrix
			mat4.targetTo(viewCamWorldMat, viewCamPos, viewCamTarget, up); // cameraMatrix
			mat4.targetTo(projCamWorldMat, projCamPos, projCamTarget, up); // textureWorldMatrix
			mat4.scale(projCamDisplayWorldMat, projCamWorldMat, projCamScale);
			mat4.invert(viewCamViewMat, viewCamWorldMat); // viewMatrix
			mat4.invert(projCamViewMat, projCamWorldMat);
			mat4.multiply(viewCamViewProjMat, viewCamProjMat, viewCamViewMat);
			mat4.multiply(projCamViewProjMat, projCamProjMat, projCamViewMat); // textureMatrix
			mat4.invert(projCamInvViewProjMat, projCamViewProjMat); // mat

			// Render to framebuffer.
			shadowFramebuffer.bind();
			gl.resize(0, 0, shadowTexture.face.top.width, shadowTexture.face.top.height);
			gl.clear(transparent, 1);
			monoQuadVao.draw({
				"u_viewProjMat": projCamViewProjMat,
				"u_worldMat": quadWorldMat
			});
			monoIcoVao.draw({
				"u_viewProjMat": projCamViewProjMat,
				"u_worldMat": icoWorldMat
			});

			// Draw scene.
			Framebuffer.unbind(gl);
			gl.resize();
			gl.clear(transparent, 1);
			quadVao.draw({
				"u_color": red,
				"u_viewProjMat": viewCamViewProjMat,
				"u_worldMat": quadWorldMat,
				"u_texture": tileTexture,
				"u_projectedTexture": shadowTexture,
				"u_texMat": projCamViewProjMat
			});
			icoVao.draw({
				"u_color": green,
				"u_viewProjMat": viewCamViewProjMat,
				"u_worldMat": icoWorldMat,
				"u_texture": tileTexture,
				"u_projectedTexture": shadowTexture,
				"u_texMat": projCamViewProjMat
			});
			projectorVao.draw({
				"u_viewProjMat": viewCamViewProjMat,
				"u_worldMat": projCamDisplayWorldMat
			}, Primitive.LINES);
			frustumVao.draw({
				"u_viewProjMat": viewCamViewProjMat,
				"u_worldMat": projCamInvViewProjMat
			}, Primitive.LINES);
		}
	}, props);
}
