"use client";

import { Context, Buffer, BufferInfo, Program, VAO, FaceDirection } from "@lakuna/ugl";
import { identity, invert, multiply, perspective, translate, rotateX, rotateY } from "@lakuna/umath/Matrix4";
import { normalize } from "@lakuna/umath/Vector3";
import { normalFromMatrix4 } from "@lakuna/umath/Matrix3";
import AnimatedCanvas from "#app/a/webgl/AnimatedCanvas.jsx";

const vss = `\
#version 300 es

in vec4 a_position;
in vec3 a_normal;

uniform mat4 u_viewProjection;
uniform mat4 u_world;
uniform mat3 u_normal;
uniform vec3 u_lightPosition;

out vec3 v_normal;
out vec3 v_directionToLight;

void main() {
	gl_Position = u_viewProjection * u_world * a_position;
	v_normal = u_normal * a_normal;
	vec3 surfacePosition = (u_world * a_position).xyz;
	v_directionToLight = u_lightPosition - surfacePosition;
}`;

const fss = `\
#version 300 es

precision highp float;

in vec3 v_normal;
in vec3 v_directionToLight;

uniform vec4 u_color;
uniform vec3 u_reverseLightDirection;
uniform float u_innerLimit;
uniform float u_outerLimit;

out vec4 outColor;

void main() {
	vec3 normal = normalize(v_normal);
	vec3 directionToLight = normalize(v_directionToLight);

	float angularDistance =
		dot(directionToLight, u_reverseLightDirection);
	float brightness =
		smoothstep(u_outerLimit, u_innerLimit, angularDistance)
		* dot(normal, directionToLight);

	outColor = u_color;
	outColor.rgb *= brightness;
}`;

const positionData = new Float32Array([
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

const normalData = new Float32Array([
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

const indices = new Uint8Array([
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

const speed = 0.001;
const lightPosition = [1, 1.4, 2];
const reverseLightDirection = [];
normalize(lightPosition, reverseLightDirection);
const innerLimit = Math.cos(Math.PI / 16);
const outerLimit = Math.cos(Math.PI / 14);

export default (props) => {
	return AnimatedCanvas((canvas) => {
		const gl = new Context(canvas);
		const program = Program.fromSource(gl, vss, fss);

		const positionBuffer = new Buffer(gl, positionData);
		const normalBuffer = new Buffer(gl, normalData);
		const vao = new VAO(program, [
			new BufferInfo("a_position", positionBuffer),
			new BufferInfo("a_normal", normalBuffer)
		], indices);

		const cameraMatrix = new Float32Array(16);
		identity(cameraMatrix);
		rotateX(cameraMatrix, -Math.PI / 5, cameraMatrix);
		translate(cameraMatrix, [0, 0, 5], cameraMatrix);

		const viewMatrix = new Float32Array(16);
		invert(cameraMatrix, viewMatrix);

		const matrix = new Float32Array(16);
		const projectionMatrix = new Float32Array(16);
		const viewProjectionMatrix = new Float32Array(16);
		const normalMatrix = new Float32Array(9);

		return (now) => {
			gl.resize();
			gl.clear([0, 0, 0, 0], 1);
			gl.cullFace = FaceDirection.BACK;

			perspective(Math.PI / 4, canvas.width / canvas.height, 1, 10, projectionMatrix);

			multiply(projectionMatrix, viewMatrix, viewProjectionMatrix);

			identity(matrix);
			rotateY(matrix, now * speed, matrix);

			normalFromMatrix4(matrix, normalMatrix);

			vao.draw({
				"u_viewProjection": viewProjectionMatrix,
				"u_world": matrix,
				"u_normal": normalMatrix,
				"u_lightPosition": lightPosition,
				"u_reverseLightDirection": reverseLightDirection,
				"u_color": [1, 1, 1, 1],
				"u_innerLimit": innerLimit,
				"u_outerLimit": outerLimit
			});
		};
	}, props);
};
