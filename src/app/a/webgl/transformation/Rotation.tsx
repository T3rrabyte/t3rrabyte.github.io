"use client";

import { Context, Buffer, BufferInfo, Program, Vao } from "@lakuna/ugl";
import AnimatedCanvas from "@lakuna/react-canvas";
import type { CanvasHTMLAttributes, DetailedHTMLProps, JSX } from "react";

const vss: string = `\
#version 300 es

in vec4 a_position;

uniform float u_rotation;

void main() {
	float x = a_position.x * sin(u_rotation) + a_position.y * cos(u_rotation);
	float y = a_position.y * sin(u_rotation) - a_position.x * cos(u_rotation);
	gl_Position = vec4(x, y, a_position.zw);
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

export default function Rotation(
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

			vao.draw({ u_rotation: now * 0.001 });
		};
	}, props);
}
