"use client";

import { Context, Ebo, Program, Vao, Vbo } from "@lakuna/ugl";
import type { Props } from "#Props";
import ReactCanvas from "@lakuna/react-canvas";

const vss = `\
#version 300 es

in vec4 a_position;

uniform vec4 u_scaling;

out vec4 v_color;

void main() {
	gl_Position = a_position * u_scaling;
}
`;

const fss = `\
#version 300 es

precision mediump float;

out vec4 outColor;

void main() {
	outColor = vec4(0, 0, 0, 1);
}
`;

const positionData = new Float32Array([
	// Point 0 at (-0.2, 0.2)
	-0.2, 0.2,

	// Point 1 at (-0.2, -0.2)
	-0.2, -0.2,

	// Point 2 at (0.2, -0.2)
	0.2, -0.2,

	// Point 3 at (0.2, 0.2)
	0.2, 0.2
]);

const indexData = new Uint8Array([
	// Triangle 0
	0, 1, 2,

	// Triangle 1
	0, 2, 3
]);

export default function Scaling(props: Props<HTMLCanvasElement>) {
	return (
		<ReactCanvas
			init={(canvas) => {
				const gl = Context.get(canvas);

				const program = Program.fromSource(gl, vss, fss);

				const positionBuffer = new Vbo(gl, positionData);
				const indexBuffer = new Ebo(gl, indexData);

				const rectVao = new Vao(
					program,
					// eslint-disable-next-line camelcase
					{ a_position: { size: 2, vbo: positionBuffer } },
					indexBuffer
				);

				return (now) => {
					gl.resize();
					gl.clear();
					const scale = 2 + Math.cos(now * 0.001);
					rectVao.draw({
						// eslint-disable-next-line camelcase
						u_scaling: [scale, scale, 1, 1]
					});
				};
			}}
			{...props}
		/>
	);
}
