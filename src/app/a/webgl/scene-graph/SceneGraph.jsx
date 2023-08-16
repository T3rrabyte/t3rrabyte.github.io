"use client";

import { Context, Buffer, BufferInfo, Program, Vao } from "@lakuna/ugl";
import AnimatedCanvas from "#app/a/webgl/AnimatedCanvas.jsx";
import { ortho, translate, rotateZ, scale } from "@lakuna/umath/Matrix4";

const vss = `\
#version 300 es

in vec4 a_position;

uniform mat4 u_world;

void main() {
	gl_Position = u_world * a_position;
}`;

const fss = `\
#version 300 es

precision highp float;

out vec4 outColor;

void main() {
	outColor = vec4(0, 0, 0, 1);
}`;

const data = new Float32Array([
	-1, 1,
	-1, -1,
	1, -1,
	1, 1
]);

const indices = new Uint8Array([
	0, 1, 2,
	0, 2, 3
]);

const rotationSpeed = 0.001;
const squareCount = 20;
const scaleFalloff = 0.9;
const childDistance = 10;

export default (props) => {
	return AnimatedCanvas((canvas) => {
		const gl = new Context(canvas);
		const program = Program.fromSource(gl, vss, fss);

		const buffer = new Buffer(gl, data);
		const vao = new Vao(program, [
			new BufferInfo("a_position", buffer, 2)
		], indices);

		const matrix = new Float32Array(16);
		let canvasMin = 0;

		return (now) => {
			gl.resize();
			gl.clear([0, 0, 0, 0]);

			canvasMin = Math.min(canvas.width, canvas.height);

			ortho(0, canvas.width, 0, canvas.height, -1, 1, matrix);
			translate(matrix, [canvas.width / 2, canvasMin / 5, 0], matrix);
			scale(matrix, [
				canvasMin / 20,
				canvasMin / 20,
				1
			], matrix);
			for (let i = 0; i < squareCount; i++) {
				translate(matrix, [childDistance * Math.sin(now * rotationSpeed), 0, 0], matrix);
				rotateZ(matrix, now * rotationSpeed, matrix);
				scale(matrix, [scaleFalloff, scaleFalloff, 1], matrix);

				vao.draw({ "u_world": matrix });
			}
		};
	}, props);
};
