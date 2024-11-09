"use client";

import { Context, Ebo, Program, Vao, Vbo } from "@lakuna/ugl";
import {
	createMatrix4Like,
	ortho,
	rotateZ,
	scale,
	translate
} from "@lakuna/umath/Matrix4";
import type { Props } from "#Props";
import ReactCanvas from "@lakuna/react-canvas";

const vss = `\
#version 300 es

in vec4 a_position;

uniform mat4 u_matrix;

out vec4 v_color;

void main() {
	gl_Position = u_matrix * a_position;
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
	// Point 0 at (-1, 1)
	-1, 1,

	// Point 1 at (-1, -1)
	-1, -1,

	// Point 2 at (1, -1)
	1, -1,

	// Point 3 at (1, 1)
	1, 1
]);

const indexData = new Uint8Array([
	// Triangle 0
	0, 1, 2,

	// Triangle 1
	0, 2, 3
]);

export default function Matrices(props: Props<HTMLCanvasElement>) {
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

				const matrix = createMatrix4Like();

				return (now) => {
					gl.resize();
					gl.clear();

					const w = canvas.width;
					const h = canvas.height;
					ortho(-w / 2, w / 2, -h / 2, h / 2, -1, 1, matrix);
					rotateZ(matrix, now * 0.001, matrix);
					translate(matrix, [100, 0, 0], matrix);
					rotateZ(matrix, now * 0.002, matrix);
					const s = ((1 + Math.cos(now * 0.001) / 2) * Math.min(w, h)) / 10;
					scale(matrix, [s, s, 1], matrix);

					// eslint-disable-next-line camelcase
					rectVao.draw({ u_matrix: matrix });
				};
			}}
			{...props}
		/>
	);
}
