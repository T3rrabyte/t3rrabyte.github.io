"use client";

import AnimatedCanvas from "../AnimatedCanvas";
import { Program, Buffer, VAO, AttributeState, clearContext, Color, resizeContext } from "@lakuna/ugl";
import { mat4 } from "gl-matrix";

const vss = `#version 300 es
in vec4 a_position;
uniform mat4 u_matrix;
void main() {
	gl_Position = u_matrix * a_position;
}`;

const fss = `#version 300 es
precision highp float;
out vec4 outColor;
void main() {
	outColor = vec4(1, 0, 0, 1);
}`;

const bufferData = new Float32Array([
	0, 0,
	0, 300,
	300, 0
]);

const transparent = new Color(0, 0, 0, 0);

export default function Matrices(props) {
	return AnimatedCanvas((canvas) => {
		const gl = canvas.getContext("webgl2");
		if (!gl) { throw new Error("Your browser does not support WebGL2."); }

		const program = Program.fromSource(gl, vss, fss);

		const buffer = new Buffer(gl, bufferData);

		const vao = new VAO(program, [
			new AttributeState("a_position", buffer, 2)
		]);

		const mat = mat4.create();

		return function render(now) {
			clearContext(gl, transparent);

			resizeContext(gl);

			mat4.ortho(mat, 0, canvas.clientWidth, 0, canvas.clientHeight, 0, 1);
			mat4.translate(mat, mat, [canvas.clientWidth / 2, canvas.clientHeight / 2, 0]);
			mat4.rotateZ(mat, mat, 0.001 * now);

			vao.draw({ "u_matrix": mat });
		}
	}, props);
}
