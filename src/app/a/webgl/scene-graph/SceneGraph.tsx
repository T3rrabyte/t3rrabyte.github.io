"use client";

import {
	Context,
	ElementBuffer,
	Program,
	VertexArray,
	VertexBuffer
} from "@lakuna/ugl";
import {
	createMatrix4Like,
	ortho,
	rotateZ,
	scale,
	translate
} from "@lakuna/umath/Matrix4";
import type { JSX } from "react";
import ReactCanvas from "@lakuna/react-canvas";

const vss = `\
#version 300 es

in vec4 a_position;

uniform mat4 u_world;

out vec4 v_color;

void main() {
	gl_Position = u_world * a_position;
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

export default function SceneGraph(props: JSX.IntrinsicElements["canvas"]) {
	return (
		<ReactCanvas
			init={(canvas) => {
				const gl = Context.get(canvas);

				const program = Program.fromSource(gl, vss, fss);

				const positionBuffer = new VertexBuffer(gl, positionData);
				const indexBuffer = new ElementBuffer(gl, indexData);

				const rectVao = new VertexArray(
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
					const min = Math.min(w, h);
					ortho(0, w, 0, h, -1, 1, matrix);
					translate(matrix, [w / 2, min / 5, 0], matrix);
					scale(matrix, [min / 20, min / 20, 1], matrix);
					for (let i = 0; i < 20; i++) {
						translate(matrix, [10 * Math.sin(now * 0.001), 0, 0], matrix);
						rotateZ(matrix, now * 0.001, matrix);
						scale(matrix, [0.9, 0.9, 1], matrix);

						rectVao.draw({
							// eslint-disable-next-line camelcase
							u_world: matrix
						});
					}
				};
			}}
			{...props}
		/>
	);
}
