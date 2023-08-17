"use client";

import { Context, Buffer, BufferInfo, Program, Vao } from "@lakuna/ugl";
import AnimatedCanvas from "#app/a/webgl/AnimatedCanvas.tsx";
import type { CanvasHTMLAttributes, DetailedHTMLProps, JSX } from "react";

const vss: string = `\
#version 300 es

in vec4 a_position;

uniform vec4 u_scaling;

void main() {
	gl_Position = a_position * u_scaling;
}`;

const fss: string = `\
#version 300 es

precision highp float;

out vec4 outColor;

void main() {
	outColor = vec4(0, 0, 0, 1);
}`;

const data: Float32Array = new Float32Array([
	-0.2, 0.2, -0.2, -0.2, 0.2, -0.2, 0.2, 0.2
]);

const indices: Uint8Array = new Uint8Array([0, 1, 2, 0, 2, 3]);

export default function Scaling(
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

		return (now: number): void => {
			gl.resize();
			gl.clear([0, 0, 0, 0]);

			const scale: number = 2 + Math.cos(now * 0.001);

			vao.draw({ u_scaling: [scale, scale, 1, 1] });
		};
	}, props);
}
