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

uniform mat4 u_world;

void main() {
	gl_Position = u_world * a_position;
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

const rotationSpeed = 0.001;
const scaleFalloff = 0.9;

export default function SceneGraph(
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

			ortho(0, canvas.width, 0, canvas.height, -1, 1, matrix);
			translate(matrix, [canvas.width / 2, canvasMin / 5, 0], matrix);
			scale(matrix, [canvasMin / 20, canvasMin / 20, 1], matrix);
			for (let i = 0; i < 20; i++) {
				translate(matrix, [10 * Math.sin(now * rotationSpeed), 0, 0], matrix);
				rotateZ(matrix, now * rotationSpeed, matrix);
				scale(matrix, [scaleFalloff, scaleFalloff, 1], matrix);

				vao.draw({ u_world: matrix });
			}
		};
	}, props);
}
