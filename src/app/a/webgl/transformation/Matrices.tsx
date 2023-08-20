"use client";

import { Context, Buffer, BufferInfo, Program, Vao } from "@lakuna/ugl";
import AnimatedCanvas from "@lakuna/react-canvas";
import {
	ortho,
	translate,
	rotateZ,
	scale,
	type Matrix4Like
} from "@lakuna/umath/Matrix4";
import type { CanvasHTMLAttributes, DetailedHTMLProps, JSX } from "react";

const vss: string = `\
#version 300 es

in vec4 a_position;

uniform mat4 u_matrix;

void main() {
	gl_Position = u_matrix * a_position;
}`;

const fss: string = `\
#version 300 es

precision highp float;

out vec4 outColor;

void main() {
	outColor = vec4(0, 0, 0, 1);
}`;

const data: Float32Array = new Float32Array([-1, 1, -1, -1, 1, -1, 1, 1]);

const indices: Uint8Array = new Uint8Array([0, 1, 2, 0, 2, 3]);

const scalingSpeed = 0.001;

export default function Matrices(
	props: DetailedHTMLProps<
		CanvasHTMLAttributes<HTMLCanvasElement>,
		HTMLCanvasElement
	>
): JSX.Element {
	return AnimatedCanvas((canvas: HTMLCanvasElement): FrameRequestCallback => {
		const gl: Context = new Context(canvas);
		const program: Program = Program.fromSource(gl, vss, fss);

		const buffer: Buffer = new Buffer(gl, data);
		const vao: Vao = new Vao(
			program,
			[new BufferInfo("a_position", buffer, 2)],
			indices
		);

		const matrix: Matrix4Like = new Float32Array(16) as Matrix4Like;
		let canvasMin = 0;

		return (now: number): void => {
			gl.resize();
			gl.clear([0, 0, 0, 0]);

			canvasMin = Math.min(canvas.width, canvas.height);

			ortho(
				-canvas.width / 2,
				canvas.width / 2,
				-canvas.height / 2,
				canvas.height / 2,
				-1,
				1,
				matrix
			);
			rotateZ(matrix, now * 0.001, matrix);
			translate(matrix, [100, 0, 0], matrix);
			rotateZ(matrix, now * 0.002, matrix);
			scale(
				matrix,
				[
					((1 + Math.cos(now * scalingSpeed) / 2) * canvasMin) / 10,
					((1 + Math.cos(now * scalingSpeed) / 2) * canvasMin) / 10,
					1
				],
				matrix
			);

			vao.draw({ u_matrix: matrix });
		};
	}, props);
}
