"use client";

import { Program, Buffer, VAO, AttributeState, Color, Texture2D, TextureFormat, TextureFilter, clearContext, resizeContext, Primitive } from "@lakuna/umbra.js";
import { mat4 } from "gl-matrix";
import AnimatedCanvas from "../AnimatedCanvas";
import defaultDomain from "../../../domain";

const textureUrl = `${defaultDomain}/images/webgl-example-texture.png`;

const vss = `#version 300 es
in vec4 a_position;
in vec2 a_texcoord;
uniform mat4 u_projMat;
uniform mat4 u_viewMat;
uniform mat4 u_matrix;
uniform mat4 u_texMat;
out vec2 v_texcoord;
out vec4 v_projectedTexcoord;
void main() {
	vec4 pos = u_matrix * a_position;
	mat4 viewProjMat = u_projMat * u_viewMat;
	gl_Position = viewProjMat * pos;
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
	vec3 projectedTexcoord = v_projectedTexcoord.xyz / v_projectedTexcoord.w;
	bool inRange =
		projectedTexcoord.x >= 0.0
		&& projectedTexcoord.x <= 1.0
		&& projectedTexcoord.y >= 0.0
		&& projectedTexcoord.y <= 1.0;
	
	vec4 projectedTexColor = texture(u_projectedTexture, projectedTexcoord.xy);
	vec4 texColor = texture(u_texture, v_texcoord) * u_color;
	float projectedAmount = inRange ? 1.0 : 0.0;
	outColor = mix(texColor, projectedTexColor, projectedAmount);
}`;

const wireframeVss = `#version 300 es
in vec4 a_position;
uniform mat4 u_projMat;
uniform mat4 u_viewMat;
uniform mat4 u_matrix;
void main() {
	vec4 pos = u_matrix * a_position;
	mat4 viewProjMat = u_projMat * u_viewMat;
	gl_Position = viewProjMat * pos;
}`;

const wireframeFss = `#version 300 es
precision highp float;
out vec4 outColor;
void main() {
	outColor = vec4(0, 0, 0, 1);
}`;

const planePositionBufferData = new Float32Array([
	-1, 1,
	-1, -1,
	1, -1,
	1, 1
]);

const planeTexcoordBufferData = new Float32Array([
	0, 0,
	0, 10,
	10, 10,
	10, 0
]);

const planeIndexData = new Uint8Array([
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

const projectorFov = Math.PI / 12;
const projectorNear = 1;
const projectorFar = 25;
const projectorScale = new Float32Array([25, 25, 25]);
const up = new Float32Array([0, 1, 0]);
const fov = Math.PI / 4;
const near = 1;
const far = 1500;
const planeScale = new Float32Array([500, 500, 1]);
const planePos = new Float32Array([0, 0, 0]);
const icoScale = new Float32Array([50, 50, 50]);
const icoPos = new Float32Array([50, 50, 100]);

export default function ProjectionMapping(props) {
	return AnimatedCanvas((canvas) => {
		const gl = canvas.getContext("webgl2");
		if (!gl) { throw new Error("Your browser does not support WebGL2."); }

		const program = Program.fromSource(gl, vss, fss);
		const wireframeProgram = Program.fromSource(gl, wireframeVss, wireframeFss);

		const planePositionBuffer = new Buffer(gl, planePositionBufferData);
		const planeTexcoordBuffer = new Buffer(gl, planeTexcoordBufferData);
		const icoPositionBuffer = new Buffer(gl, icoPositionBufferData);
		const icoTexcoordBuffer = new Buffer(gl, icoTexcoordBufferData);
		const projectorPositionBuffer = new Buffer(gl, projectorPositionBufferData);
		const frustumPositionBuffer = new Buffer(gl, frustumPositionBufferData);

		const planeVao = new VAO(program, [
			new AttributeState("a_position", planePositionBuffer, 2),
			new AttributeState("a_texcoord", planeTexcoordBuffer, 2)
		], planeIndexData);

		const icoVao = new VAO(program, [
			new AttributeState("a_position", icoPositionBuffer),
			new AttributeState("a_texcoord", icoTexcoordBuffer, 2)
		], icoIndexData);

		const projectorVao = new VAO(wireframeProgram, [
			new AttributeState("a_position", projectorPositionBuffer)
		], projectorIndexData);

		const frustumVao = new VAO(wireframeProgram, [
			new AttributeState("a_position", frustumPositionBuffer)
		], frustumIndexData);

		const tileTexture = new Texture2D({
			gl,
			pixels: new Uint8Array([
				0x80, 0xC0,
				0xC0, 0x80
			]),
			width: 2,
			height: 2,
			internalFormat: TextureFormat.LUMINANCE,
			minFilter: TextureFilter.NEAREST,
			magFilter: TextureFilter.NEAREST
		});

		const projectedTexture = new Texture2D({
			gl,
			pixels: new Uint8Array([0xFF, 0x00, 0xFF, 0xFF]),
			width: 1,
			height: 1
		});

		const projectedImage = new Image();
		projectedImage.addEventListener("load", () => {
			projectedTexture.pixels = projectedImage;
			projectedTexture.width = undefined;
			projectedTexture.height = undefined;
		});
		projectedImage.crossOrigin = "";
		projectedImage.src = textureUrl;

		const planeMat = mat4.create();
		const icoMat = mat4.create();
		const projectorMat = mat4.create();
		const frustumMat = mat4.create();
		const camMat = mat4.create();
		const projMat = mat4.create();
		const viewMat = mat4.create();
		const texMat = mat4.create();

		return function render(now) {
			clearContext(gl, transparent, 1);
			resizeContext(gl);
			gl.enable(gl.CULL_FACE);

			mat4.identity(planeMat);
			mat4.rotateX(planeMat, planeMat, Math.PI * 3 / 2);
			mat4.translate(planeMat, planeMat, planePos);
			mat4.scale(planeMat, planeMat, planeScale);

			mat4.identity(icoMat);
			mat4.translate(icoMat, icoMat, icoPos);
			mat4.scale(icoMat, icoMat, icoScale);

			mat4.perspective(projMat, projectorFov, canvas.clientWidth / canvas.clientHeight, projectorNear, projectorFar);
			mat4.targetTo(projectorMat, [Math.cos(now * 0.0008) * 400, 200, Math.sin(now * 0.0008) * 400], planePos, up);
			mat4.scale(projectorMat, projectorMat, projectorScale);
			mat4.invert(viewMat, projectorMat);
			mat4.multiply(texMat, projMat, viewMat);

			mat4.invert(frustumMat, projMat);
			mat4.multiply(frustumMat, projectorMat, frustumMat);

			mat4.perspective(projMat, fov, canvas.clientWidth / canvas.clientHeight, near, far);
			mat4.targetTo(camMat, [Math.sin(now * 0.0002) * 500, 300, Math.cos(now * 0.0002) * 500], planePos, up);
			mat4.invert(viewMat, camMat);

			planeVao.draw({
				"u_color": red,
				"u_projMat": projMat,
				"u_viewMat": viewMat,
				"u_matrix": planeMat,
				"u_texture": projectedTexture,
				"u_projectedTexture": tileTexture,
				"u_texMat": texMat
			});

			icoVao.draw({
				"u_color": green,
				"u_projMat": projMat,
				"u_viewMat": viewMat,
				"u_matrix": icoMat,
				"u_texture": projectedTexture,
				"u_projectedTexture": tileTexture,
				"u_texMat": texMat
			});

			projectorVao.draw({
				"u_projMat": projMat,
				"u_viewMat": viewMat,
				"u_matrix": projectorMat
			}, Primitive.LINES);

			frustumVao.draw({
				"u_projMat": projMat,
				"u_viewMat": viewMat,
				"u_matrix": frustumMat
			}, Primitive.LINES);
		}
	}, props);
}
