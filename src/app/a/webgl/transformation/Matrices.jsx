"use client";

import { Context, Buffer, BufferInfo, Program, Vao } from "@lakuna/ugl";
import AnimatedCanvas from "#app/a/webgl/AnimatedCanvas.jsx";
import { ortho, translate, rotateZ, scale } from "@lakuna/umath/Matrix4";

const vss = `\
#version 300 es

in vec4 a_position;

uniform mat4 u_matrix;

void main() {
	gl_Position = u_matrix * a_position;
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

const translationSpeed = 0.001;
const rotationSpeed = 0.002;
const scalingSpeed = 0.001;

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

			ortho(-canvas.width / 2, canvas.width / 2, -canvas.height / 2, canvas.height / 2, -1, 1, matrix);
			translate(matrix, [
				canvasMin / 3 * Math.cos(now * translationSpeed),
				canvasMin / 3 * Math.sin(now * translationSpeed),
				1
			], matrix);
			rotateZ(matrix, now * rotationSpeed, matrix);
			scale(matrix, [
				(1 + Math.cos(now * scalingSpeed) / 2) * canvasMin / 10,
				(1 + Math.cos(now * scalingSpeed) / 2) * canvasMin / 10,
				1
			], matrix);

			vao.draw({ "u_matrix": matrix });
		};
	}, props);
};
