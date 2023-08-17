"use client";

import {
	Context,
	Buffer,
	BufferInfo,
	FaceDirection,
	Program,
	Vao
} from "@lakuna/ugl";
import AnimatedCanvas from "#app/a/webgl/AnimatedCanvas.tsx";
import {
	perspective,
	translate,
	rotateZ,
	rotateX,
	type Matrix4Like
} from "@lakuna/umath/Matrix4";
import { positions, colors } from "./f.ts";
import type { CanvasHTMLAttributes, DetailedHTMLProps, JSX } from "react";

const vss: string = `\
#version 300 es

in vec4 a_position;
in vec4 a_color;

uniform mat4 u_matrix;

out vec4 v_color;

void main() {
	gl_Position = u_matrix * a_position;
    v_color = a_color;
}`;

const fss: string = `\
#version 300 es

precision highp float;

in vec4 v_color;

out vec4 outColor;

void main() {
	outColor = v_color;
}`;

export default function Perspective(
	props: DetailedHTMLProps<
		CanvasHTMLAttributes<HTMLCanvasElement>,
		HTMLCanvasElement
	>
): JSX.Element {
	return AnimatedCanvas((canvas: HTMLCanvasElement): FrameRequestCallback => {
		const gl: Context = new Context(canvas);
		const program: Program = Program.fromSource(gl, vss, fss);

		const positionBuffer: Buffer = new Buffer(gl, positions);
		const colorBuffer: Buffer = new Buffer(gl, colors);
		const vao: Vao = new Vao(program, [
			new BufferInfo("a_position", positionBuffer),
			new BufferInfo("a_color", colorBuffer, 3, true)
		]);

		const matrix: Matrix4Like = new Float32Array(16) as Matrix4Like;

		return (now: number): void => {
			gl.resize();
			gl.clear([0, 0, 0, 0], 1);
			gl.cullFace = FaceDirection.BACK;

			perspective(
				Math.PI / 4,
				canvas.width / (canvas.height || 1),
				1,
				1000,
				matrix
			);
			translate(matrix, [0, 0, -500], matrix);
			rotateZ(matrix, now * 0.001, matrix);
			rotateX(matrix, now * 0.0007, matrix);

			vao.draw({ u_matrix: matrix });
		};
	}, props);
}
