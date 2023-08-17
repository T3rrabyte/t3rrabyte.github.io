"use client";

import {
	Context,
	Buffer,
	BufferInfo,
	Program,
	Vao,
	FaceDirection
} from "@lakuna/ugl";
import {
	identity,
	invert,
	multiply,
	perspective,
	translate,
	rotateX,
	rotateY,
	type Matrix4Like
} from "@lakuna/umath/Matrix4";
import { normalize, type Vector3Like } from "@lakuna/umath/Vector3";
import { normalFromMatrix4, type Matrix3Like } from "@lakuna/umath/Matrix3";
import AnimatedCanvas from "@lakuna/react-canvas";
import type { CanvasHTMLAttributes, DetailedHTMLProps, JSX } from "react";

const vss: string = `\
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

const fss: string = `\
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

const positionData: Float32Array = new Float32Array([
	// Front
	-1, 1, 1, -1, -1, 1, 1, -1, 1, 1, 1, 1,

	// Back
	1, 1, -1, 1, -1, -1, -1, -1, -1, -1, 1, -1,

	// Left
	-1, 1, -1, -1, -1, -1, -1, -1, 1, -1, 1, 1,

	// Right
	1, 1, 1, 1, -1, 1, 1, -1, -1, 1, 1, -1,

	// Top
	-1, 1, -1, -1, 1, 1, 1, 1, 1, 1, 1, -1,

	// Bottom
	-1, -1, 1, -1, -1, -1, 1, -1, -1, 1, -1, 1
]);

const normalData: Float32Array = new Float32Array([
	// Front
	0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,

	// Back
	0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1,

	// Left
	-1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0,

	// Right
	1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,

	// Top
	0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0,

	// Bottom
	0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0
]);

const indices: Uint8Array = new Uint8Array([
	// Top
	0, 1, 2, 0, 2, 3,

	// Bottom
	4, 5, 6, 4, 6, 7,

	// Left
	8, 9, 10, 8, 10, 11,

	// Right
	12, 13, 14, 12, 14, 15,

	// Top
	16, 17, 18, 16, 18, 19,

	// Bottom
	20, 21, 22, 20, 22, 23
]);

export default function SpotLighting(
	props: DetailedHTMLProps<
		CanvasHTMLAttributes<HTMLCanvasElement>,
		HTMLCanvasElement
	>
): JSX.Element {
	return AnimatedCanvas((canvas: HTMLCanvasElement): FrameRequestCallback => {
		const gl: Context = new Context(canvas);
		const program: Program = Program.fromSource(gl, vss, fss);

		const positionBuffer: Buffer = new Buffer(gl, positionData);
		const normalBuffer: Buffer = new Buffer(gl, normalData);
		const vao: Vao = new Vao(
			program,
			[
				new BufferInfo("a_position", positionBuffer),
				new BufferInfo("a_normal", normalBuffer)
			],
			indices
		);

		const cameraMatrix: Matrix4Like = new Float32Array(16) as Matrix4Like;
		identity(cameraMatrix);
		rotateX(cameraMatrix, -Math.PI / 5, cameraMatrix);
		translate(cameraMatrix, [0, 0, 5], cameraMatrix);

		const viewMatrix: Matrix4Like = new Float32Array(16) as Matrix4Like;
		invert(cameraMatrix, viewMatrix);

		const lightPosition: Vector3Like = new Float32Array([
			1, 1.4, 2
		]) as Vector3Like;
		const reverseLightDirection: Vector3Like = new Float32Array(
			3
		) as Vector3Like;
		normalize(lightPosition, reverseLightDirection);

		const matrix: Matrix4Like = new Float32Array(16) as Matrix4Like;
		const projectionMatrix: Matrix4Like = new Float32Array(16) as Matrix4Like;
		const viewProjectionMatrix: Matrix4Like = new Float32Array(
			16
		) as Matrix4Like;
		const normalMatrix: Matrix3Like = new Float32Array(9) as Matrix3Like;

		return (now: number): void => {
			gl.resize();
			gl.clear([0, 0, 0, 0], 1);
			gl.cullFace = FaceDirection.BACK;

			perspective(
				Math.PI / 4,
				canvas.width / (canvas.height || 1),
				1,
				10,
				projectionMatrix
			);

			multiply(projectionMatrix, viewMatrix, viewProjectionMatrix);

			identity(matrix);
			rotateY(matrix, now * 0.001, matrix);

			normalFromMatrix4(matrix, normalMatrix);

			vao.draw({
				u_viewProjection: viewProjectionMatrix,
				u_world: matrix,
				u_normal: normalMatrix,
				u_lightPosition: lightPosition,
				u_reverseLightDirection: reverseLightDirection,
				u_color: [1, 1, 1, 1],
				u_innerLimit: Math.cos(Math.PI / 16),
				u_outerLimit: Math.cos(Math.PI / 14)
			});
		};
	}, props);
}
