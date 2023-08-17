"use client";

import {
	Context,
	Buffer,
	BufferInfo,
	Program,
	Texture2d,
	Vao,
	FaceDirection
} from "@lakuna/ugl";
import {
	identity,
	perspective,
	rotateX,
	rotateY,
	translate,
	invert,
	multiply,
	type Matrix4Like
} from "@lakuna/umath/Matrix4";
import AnimatedCanvas from "#app/a/webgl/AnimatedCanvas.tsx";
import domain from "#domain";
import type { CanvasHTMLAttributes, DetailedHTMLProps, JSX } from "react";

const vss: string = `\
#version 300 es

in vec4 a_position;
in vec2 a_texcoord;

uniform mat4 u_matrix;

out vec2 v_texcoord;

void main() {
	gl_Position = u_matrix * a_position;
	v_texcoord = a_texcoord;
}`;

const fss: string = `\
#version 300 es

precision highp float;

in vec2 v_texcoord;

uniform sampler2D u_texture;

out vec4 outColor;

void main() {
	outColor = texture(u_texture, v_texcoord);
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

const texcoordData: Float32Array = new Float32Array([
	// Front
	0 / 3,
	0 / 2,
	0 / 3,
	1 / 2,
	1 / 3,
	1 / 2,
	1 / 3,
	0 / 2,

	// Back
	1 / 3,
	0 / 2,
	1 / 3,
	1 / 2,
	2 / 3,
	1 / 2,
	2 / 3,
	0 / 2,

	// Left
	2 / 3,
	0 / 2,
	2 / 3,
	1 / 2,
	3 / 3,
	1 / 2,
	3 / 3,
	0 / 2,

	// Right
	0 / 3,
	1 / 2,
	0 / 3,
	2 / 2,
	1 / 3,
	2 / 2,
	1 / 3,
	1 / 2,

	// Top
	1 / 3,
	1 / 2,
	1 / 3,
	2 / 2,
	2 / 3,
	2 / 2,
	2 / 3,
	1 / 2,

	// Bottom
	2 / 3,
	1 / 2,
	2 / 3,
	2 / 2,
	3 / 3,
	2 / 2,
	3 / 3,
	1 / 2
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

export default function TextureAtlases(
	props: DetailedHTMLProps<
		CanvasHTMLAttributes<HTMLCanvasElement>,
		HTMLCanvasElement
	>
): JSX.Element {
	return AnimatedCanvas((canvas: HTMLCanvasElement): FrameRequestCallback => {
		const gl: Context = new Context(canvas);
		const program: Program = Program.fromSource(gl, vss, fss);

		const positionBuffer: Buffer = new Buffer(gl, positionData);
		const texcoordBuffer: Buffer = new Buffer(gl, texcoordData);
		const vao: Vao = new Vao(
			program,
			[
				new BufferInfo("a_position", positionBuffer),
				new BufferInfo("a_texcoord", texcoordBuffer, 2)
			],
			indices
		);

		const texture: Texture2d = Texture2d.fromImageUrl(
			gl,
			`${domain}images/webgl-example-texture-atlas.png`
		);

		const projectionMatrix: Matrix4Like = new Float32Array(16) as Matrix4Like;
		const cameraMatrix: Matrix4Like = new Float32Array(16) as Matrix4Like;
		const viewMatrix: Matrix4Like = new Float32Array(16) as Matrix4Like;
		const viewProjectionMatrix: Matrix4Like = new Float32Array(
			16
		) as Matrix4Like;
		const matrix: Matrix4Like = new Float32Array(16) as Matrix4Like;

		identity(cameraMatrix);
		translate(cameraMatrix, [0, 0, 5], cameraMatrix);
		invert(cameraMatrix, viewMatrix);

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
			rotateX(matrix, now * 0.0005, matrix);
			rotateY(matrix, now * 0.001, matrix);
			multiply(viewProjectionMatrix, matrix, matrix);

			vao.draw({ u_matrix: matrix, u_texture: texture });
		};
	}, props);
}
