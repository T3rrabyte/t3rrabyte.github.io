"use client";

import {
	type Matrix4Like,
	createMatrix4Like,
	fromTranslation,
	identity,
	invert,
	perspective,
	rotateX,
	rotateY,
	translate
} from "@lakuna/umath/Matrix4";
import { Context, Program, Vao, Vbo } from "@lakuna/ugl";
import type { Props } from "#Props";
import ReactCanvas from "@lakuna/react-canvas";

const vss = `\
#version 300 es

in vec4 a_position;
in vec4 a_color;

uniform mat4 u_projMat;
uniform mat4 u_viewMat;
uniform mat4 u_worldMat;

out vec4 v_color;
out vec4 v_worldViewPos;

void main() {
	v_worldViewPos = u_viewMat * u_worldMat * a_position;
	gl_Position = u_projMat * v_worldViewPos;
	v_color = a_color;
}
`;

const fss = `\
#version 300 es

precision mediump float;

in vec4 v_color;
in vec4 v_worldViewPos;

uniform vec4 u_fogColor;
uniform float u_fogDensity;

out vec4 outColor;

void main() {
	float fogDepth = length(v_worldViewPos);
	float fogAmount = clamp(1.0 - exp2(-u_fogDensity * u_fogDensity * fogDepth * fogDepth * 1.442695), 0.0, 1.0);
	outColor = mix(v_color, u_fogColor, fogAmount);
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

export default function Fog(props: Props<HTMLCanvasElement>) {
	return (
		<ReactCanvas
			init={(canvas) => {
				const gl = Context.get(canvas);

				const program = Program.fromSource(gl, vss, fss);

				const positionBuffer = new Vbo(gl, positionData);
				const colorBuffer = new Vbo(gl, colorData);

				const fVao = new Vao(program, {
					// eslint-disable-next-line camelcase
					a_color: { normalized: true, vbo: colorBuffer },
					// eslint-disable-next-line camelcase
					a_position: positionBuffer
				});

				const matrices: (Float32Array & Matrix4Like)[] = [];
				for (let i = 0; i < 5; i++) {
					const r = (i * Math.PI * 2) / 5;
					const s = Math.sin(r);
					const c = Math.cos(r);
					matrices.push(
						fromTranslation([c * 200, 0, s * 200], createMatrix4Like())
					);
				}

				const proj = createMatrix4Like();
				const cam = createMatrix4Like();
				const view = createMatrix4Like();

				return (now) => {
					gl.resize();
					gl.doCullFace = true;
					gl.doDepthTest = true;
					gl.clear();

					const w = canvas.width;
					const h = canvas.height;
					perspective(Math.PI / 4, w / (h || 1), 1, 1000, proj);
					identity(cam);
					rotateY(cam, now * 0.001, cam);
					rotateX(cam, (Math.PI * 9) / 10, cam);
					translate(cam, [0, 0, 500], cam);
					invert(cam, view);

					for (const matrix of matrices) {
						fVao.draw({
							// eslint-disable-next-line camelcase
							u_fogColor: [0, 0, 0, 0],
							// eslint-disable-next-line camelcase
							u_fogDensity: 0.003,
							// eslint-disable-next-line camelcase
							u_projMat: proj,
							// eslint-disable-next-line camelcase
							u_viewMat: view,
							// eslint-disable-next-line camelcase
							u_worldMat: matrix
						});
					}
				};
			}}
			{...props}
		/>
	);
}
