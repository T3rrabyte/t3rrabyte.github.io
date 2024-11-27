"use client";

import { Context, Program, VertexArray, VertexBuffer } from "@lakuna/ugl";
import {
	createMatrix4Like,
	ortho,
	rotateX,
	rotateZ,
	translate
} from "@lakuna/umath/Matrix4";
import type { JSX } from "react";
import ReactCanvas from "@lakuna/react-canvas";

const vss = `\
#version 300 es

in vec4 a_position;
in vec4 a_color;

uniform mat4 u_world;

out vec4 v_color;

void main() {
	gl_Position = u_world * a_position;
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
	0, 0, 0, 0, 150, 0, 30, 0, 0, 0, 150, 0, 30, 150, 0, 30, 0, 0, 30, 0, 0, 30,
	30, 0, 100, 0, 0, 30, 30, 0, 100, 30, 0, 100, 0, 0, 30, 60, 0, 30, 90, 0, 67,
	60, 0, 30, 90, 0, 67, 90, 0, 67, 60, 0, 0, 0, 30, 30, 0, 30, 0, 150, 30, 0,
	150, 30, 30, 0, 30, 30, 150, 30, 30, 0, 30, 100, 0, 30, 30, 30, 30, 30, 30,
	30, 100, 0, 30, 100, 30, 30, 30, 60, 30, 67, 60, 30, 30, 90, 30, 30, 90, 30,
	67, 60, 30, 67, 90, 30, 0, 0, 0, 100, 0, 0, 100, 0, 30, 0, 0, 0, 100, 0, 30,
	0, 0, 30, 100, 0, 0, 100, 30, 0, 100, 30, 30, 100, 0, 0, 100, 30, 30, 100, 0,
	30, 30, 30, 0, 30, 30, 30, 100, 30, 30, 30, 30, 0, 100, 30, 30, 100, 30, 0,
	30, 30, 0, 30, 60, 30, 30, 30, 30, 30, 30, 0, 30, 60, 0, 30, 60, 30, 30, 60,
	0, 67, 60, 30, 30, 60, 30, 30, 60, 0, 67, 60, 0, 67, 60, 30, 67, 60, 0, 67,
	90, 30, 67, 60, 30, 67, 60, 0, 67, 90, 0, 67, 90, 30, 30, 90, 0, 30, 90, 30,
	67, 90, 30, 30, 90, 0, 67, 90, 30, 67, 90, 0, 30, 90, 0, 30, 150, 30, 30, 90,
	30, 30, 90, 0, 30, 150, 0, 30, 150, 30, 0, 150, 0, 0, 150, 30, 30, 150, 30, 0,
	150, 0, 30, 150, 30, 30, 150, 0, 0, 0, 0, 0, 0, 30, 0, 150, 30, 0, 0, 0, 0,
	150, 30, 0, 150, 0
]);

const colorData = new Uint8Array([
	200, 70, 120, 200, 70, 120, 200, 70, 120, 200, 70, 120, 200, 70, 120, 200, 70,
	120, 200, 70, 120, 200, 70, 120, 200, 70, 120, 200, 70, 120, 200, 70, 120,
	200, 70, 120, 200, 70, 120, 200, 70, 120, 200, 70, 120, 200, 70, 120, 200, 70,
	120, 200, 70, 120, 80, 70, 200, 80, 70, 200, 80, 70, 200, 80, 70, 200, 80, 70,
	200, 80, 70, 200, 80, 70, 200, 80, 70, 200, 80, 70, 200, 80, 70, 200, 80, 70,
	200, 80, 70, 200, 80, 70, 200, 80, 70, 200, 80, 70, 200, 80, 70, 200, 80, 70,
	200, 80, 70, 200, 70, 200, 210, 70, 200, 210, 70, 200, 210, 70, 200, 210, 70,
	200, 210, 70, 200, 210, 200, 200, 70, 200, 200, 70, 200, 200, 70, 200, 200,
	70, 200, 200, 70, 200, 200, 70, 210, 100, 70, 210, 100, 70, 210, 100, 70, 210,
	100, 70, 210, 100, 70, 210, 100, 70, 210, 160, 70, 210, 160, 70, 210, 160, 70,
	210, 160, 70, 210, 160, 70, 210, 160, 70, 70, 180, 210, 70, 180, 210, 70, 180,
	210, 70, 180, 210, 70, 180, 210, 70, 180, 210, 100, 70, 210, 100, 70, 210,
	100, 70, 210, 100, 70, 210, 100, 70, 210, 100, 70, 210, 76, 210, 100, 76, 210,
	100, 76, 210, 100, 76, 210, 100, 76, 210, 100, 76, 210, 100, 140, 210, 80,
	140, 210, 80, 140, 210, 80, 140, 210, 80, 140, 210, 80, 140, 210, 80, 90, 130,
	110, 90, 130, 110, 90, 130, 110, 90, 130, 110, 90, 130, 110, 90, 130, 110,
	160, 160, 220, 160, 160, 220, 160, 160, 220, 160, 160, 220, 160, 160, 220,
	160, 160, 220
]);

export default function Orthographic(props: JSX.IntrinsicElements["canvas"]) {
	return (
		<ReactCanvas
			init={(canvas) => {
				const gl = Context.get(canvas);

				const program = Program.fromSource(gl, vss, fss);

				const positionBuffer = new VertexBuffer(gl, positionData);
				const colorBuffer = new VertexBuffer(gl, colorData);

				const fVao = new VertexArray(program, {
					// eslint-disable-next-line camelcase
					a_color: { normalized: true, vbo: colorBuffer },
					// eslint-disable-next-line camelcase
					a_position: positionBuffer
				});

				const matrix = createMatrix4Like();

				return (now) => {
					gl.resize();
					gl.clear();

					const w = canvas.width;
					const h = canvas.height;
					ortho(0, w, 0, h, 0, 1000, matrix);
					translate(matrix, [w / 2, h / 2, -500], matrix);
					rotateZ(matrix, now * 0.001, matrix);
					rotateX(matrix, now * 0.0007, matrix);

					// eslint-disable-next-line camelcase
					fVao.draw({ u_world: matrix });
				};
			}}
			{...props}
		/>
	);
}
