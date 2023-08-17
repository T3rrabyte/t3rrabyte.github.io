"use client";

import { Context, Buffer, BufferInfo, Program, Vao } from "@lakuna/ugl";
import AnimatedCanvas from "@lakuna/react-canvas";
import type { CanvasHTMLAttributes, DetailedHTMLProps, JSX } from "react";

const vss: string = `\
#version 300 es

in vec4 a_position;
in vec4 a_color;

out vec4 v_color;

void main() {
	gl_Position = a_position;
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

const positionData: Float32Array = new Float32Array([
	0, 0.5, 0, 0, 0.7, 0, 0.7, 0.5
]);

const colorData: Float32Array = new Float32Array([
	1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 1
]);

const indices: Uint8Array = new Uint8Array([0, 1, 2, 0, 2, 3]);

export default function Varyings(
	props: DetailedHTMLProps<
		CanvasHTMLAttributes<HTMLCanvasElement>,
		HTMLCanvasElement
	>
): JSX.Element {
	return AnimatedCanvas((canvas: HTMLCanvasElement): FrameRequestCallback => {
		const gl: Context = new Context(canvas);
		const program: Program = Program.fromSource(gl, vss, fss);

		const positionBuffer: Buffer = new Buffer(gl, positionData);
		const colorBuffer: Buffer = new Buffer(gl, colorData);
		const vao: Vao = new Vao(
			program,
			[
				new BufferInfo("a_position", positionBuffer, 2),
				new BufferInfo("a_color", colorBuffer)
			],
			indices
		);

		return (): void => {
			gl.resize();
			gl.clear([0, 0, 0, 0]);

			vao.draw();
		};
	}, props);
}
