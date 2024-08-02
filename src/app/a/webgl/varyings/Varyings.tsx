"use client";

import { Context, Ebo, Program, Vao, Vbo } from "@lakuna/ugl";
import type { Props } from "#Props";
import ReactCanvas from "@lakuna/react-canvas";

const vss = `\
#version 300 es

in vec4 a_position;
in vec4 a_color;

out vec4 v_color;

void main() {
	gl_Position = a_position;
	v_color = a_color;
}
`;

const fss = `\
#version 300 es

precision mediump float;

in vec4 v_color;

out vec4 outColor;

void main() {
	outColor = v_color;
}
`;

const positionData = new Float32Array([
	// Point 0 at (0, 0.5)
	0, 0.5,

	// Point 1 at (0, 0)
	0, 0,

	// Point 2 at (0.7, 0)
	0.7, 0,

	// Point 3 at (0.7, 0.5)
	0.7, 0.5
]);

const colorData = new Float32Array([
	// Point 0 (red)
	1, 0, 0,

	// Point 1 (green)
	0, 1, 0,

	// Point 2 (blue)
	0, 0, 1,

	// Point 3 (magenta)
	1, 0, 1
]);

const indexData = new Uint8Array([
	// Triangle 0
	0, 1, 2,

	// Triangle 1
	0, 2, 3
]);

export default function Indices(props: Props<HTMLCanvasElement>) {
	return (
		<ReactCanvas
			init={(canvas) => {
				const gl = new Context(canvas);

				const program = Program.fromSource(gl, vss, fss);

				const positionBuffer = new Vbo(gl, positionData);
				const colorBuffer = new Vbo(gl, colorData);
				const indexBuffer = new Ebo(gl, indexData);

				const rectVao = new Vao(
					program,
					{
						// eslint-disable-next-line camelcase
						a_color: colorBuffer,
						// eslint-disable-next-line camelcase
						a_position: { size: 2, vbo: positionBuffer }
					},
					indexBuffer
				);

				return () => {
					gl.resize();
					gl.clear();
					rectVao.draw();
				};
			}}
			{...props}
		/>
	);
}
