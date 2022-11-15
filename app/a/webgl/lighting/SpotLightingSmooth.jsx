"use client";

import { AttributeState, Buffer, clearContext, Color, Program, resizeContext, VAO } from "@lakuna/umbra.js";
import { mat4, vec3 } from "gl-matrix";
import AnimatedCanvas from "../AnimatedCanvas";

const vss = `#version 300 es
in vec4 a_position;
in vec3 a_normal;
uniform mat4 u_viewProjMat;
uniform mat4 u_worldMat;
uniform mat4 u_invTransWorldMat;
uniform vec3 u_lightPos;
out vec3 v_normal;
out vec3 v_lightDir;
void main() {
	mat4 mat = u_viewProjMat * u_worldMat;
	gl_Position = mat * a_position;
	v_normal = mat3(u_invTransWorldMat) * a_normal;
	vec3 surfacePos = (u_worldMat * a_position).xyz;
	v_lightDir = u_lightPos - surfacePos;
}`;

const fss = `#version 300 es
precision highp float;
in vec3 v_normal;
in vec3 v_lightDir;
uniform vec4 u_color;
uniform vec3 u_reverseLightDir;
uniform float u_lightDotInnerLimit;
uniform float u_lightDotOuterLimit;
out vec4 outColor;
void main() {
	vec3 normal = normalize(v_normal);
	vec3 lightDir = normalize(v_lightDir);
	float angularDist = dot(lightDir, u_reverseLightDir);
	float light = smoothstep(u_lightDotOuterLimit, u_lightDotInnerLimit, angularDist) * dot(normal, lightDir);
	outColor = u_color;
	outColor.rgb *= light;
}`;

const positionBufferData = new Float32Array([
	// Front
	-1, 1, 1,
	-1, -1, 1,
	1, -1, 1,
	1, 1, 1,

	// Back
	1, 1, -1,
	1, -1, -1,
	-1, -1, -1,
	-1, 1, -1,

	// Left
	-1, 1, -1,
	-1, -1, -1,
	-1, -1, 1,
	-1, 1, 1,

	// Right
	1, 1, 1,
	1, -1, 1,
	1, -1, -1,
	1, 1, -1,

	// Top
	-1, 1, -1,
	-1, 1, 1,
	1, 1, 1,
	1, 1, -1,

	// Bottom
	-1, -1, 1,
	-1, -1, -1,
	1, -1, -1,
	1, -1, 1
]);

const normalBufferData = new Float32Array([
	// Front
	0, 0, 1,
	0, 0, 1,
	0, 0, 1,
	0, 0, 1,

	// Back
	0, 0, -1,
	0, 0, -1,
	0, 0, -1,
	0, 0, -1,

	// Left
	-1, 0, 0,
	-1, 0, 0,
	-1, 0, 0,
	-1, 0, 0,

	// Right
	1, 0, 0,
	1, 0, 0,
	1, 0, 0,
	1, 0, 0,

	// Top
	0, 1, 0,
	0, 1, 0,
	0, 1, 0,
	0, 1, 0,

	// Bottom
	0, -1, 0,
	0, -1, 0,
	0, -1, 0,
	0, -1, 0
]);

const indexData = new Uint8Array([
	// Top
	0, 1, 2,
	0, 2, 3,

	// Bottom
	4, 5, 6,
	4, 6, 7,

	// Left
	8, 9, 10,
	8, 10, 11,

	// Right
	12, 13, 14,
	12, 14, 15,

	// Top
	16, 17, 18,
	16, 18, 19,

	// Bottom
	20, 21, 22,
	20, 22, 23
]);

const transparent = new Color(0, 0, 0, 0);
const cubeColor = new Color(1, 1, 1, 1);

const camPos = vec3.set(vec3.create(), 0, 0, 5);
const lightPos = vec3.set(vec3.create(), 0, 0, 5);
const reverseLightDir = vec3.set(vec3.create(), 0, 0, 5);
vec3.normalize(reverseLightDir, reverseLightDir);
const lightDotInnerLimit = Math.cos(Math.PI / 16);
const lightDotOuterLimit = Math.cos(Math.PI / 14);

export default function SpotLighting(props) {
	return AnimatedCanvas((canvas) => {
		const gl = canvas.getContext("webgl2");
		if (!gl) { throw new Error("Your browser does not support WebGL2."); }

		const program = Program.fromSource(gl, vss, fss);

		const positionBuffer = new Buffer(gl, positionBufferData);
		const normalBuffer = new Buffer(gl, normalBufferData);

		const vao = new VAO(program, [
			new AttributeState("a_position", positionBuffer),
			new AttributeState("a_normal", normalBuffer)
		], indexData);

		const projMat = mat4.create();
		const camMat = mat4.create();
		const viewMat = mat4.create();
		const viewProjMat = mat4.create();
		const mat = mat4.create();
		const invTransMat = mat4.create();

		return function render(now) {
			clearContext(gl, transparent, 1);
			resizeContext(gl);
			gl.enable(gl.CULL_FACE);

			mat4.perspective(projMat, Math.PI / 4, canvas.clientWidth / canvas.clientHeight, 1, 1000);

			mat4.identity(camMat);
			mat4.translate(camMat, camMat, camPos);

			mat4.invert(viewMat, camMat);

			mat4.multiply(viewProjMat, projMat, viewMat);

			mat4.identity(mat);
			mat4.rotateX(mat, mat, Math.PI / 4);
			mat4.rotateY(mat, mat, 0.001 * now);

			mat4.invert(invTransMat, mat);
			mat4.transpose(invTransMat, invTransMat);

			vao.draw({
				"u_viewProjMat": viewProjMat,
				"u_worldMat": mat,
				"u_invTransWorldMat": invTransMat,
				"u_lightPos": lightPos,
				"u_color": cubeColor,
				"u_reverseLightDir": reverseLightDir,
				"u_lightDotInnerLimit": lightDotInnerLimit,
				"u_lightDotOuterLimit": lightDotOuterLimit
			});
		}
	}, props);
}
