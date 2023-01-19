"use client";

import { Color, Program, Buffer, VAO, AttributeState, clearContext, resizeContext } from "@lakuna/ugl";
import { mat4 } from "gl-matrix";
import AnimatedCanvas from "../AnimatedCanvas";

const vss = `#version 300 es
in vec4 a_position;
uniform mat4 u_matrix;
out vec4 v_color;
void main() {
	gl_Position = u_matrix * a_position;
	v_color = a_position;
}`;

const fss = `#version 300 es
precision highp float;
in vec4 v_color;
out vec4 outColor;
void main() {
	outColor = v_color;
}`;

const bufferData = new Float32Array([
	// Front
	-1, 1, 1,
	-1, -1, 1,
	1, -1, 1,
	1, 1, 1,

	// Back
	1, 1, -1,
	1, -1, -1,
	-1, -1, -1,
	-1, 1, -1,

	// Left
	-1, 1, -1,
	-1, -1, -1,
	-1, -1, 1,
	-1, 1, 1,

	// Right
	1, 1, 1,
	1, -1, 1,
	1, -1, -1,
	1, 1, -1,

	// Top
	-1, 1, -1,
	-1, 1, 1,
	1, 1, 1,
	1, 1, -1,

	// Bottom
	-1, -1, 1,
	-1, -1, -1,
	1, -1, -1,
	1, -1, 1
]);

const indexData = new Uint8Array([
	// Top
	0, 1, 2,
	0, 2, 3,

	// Bottom
	4, 5, 6,
	4, 6, 7,

	// Left
	8, 9, 10,
	8, 10, 11,

	// Right
	12, 13, 14,
	12, 14, 15,

	// Top
	16, 17, 18,
	16, 18, 19,

	// Bottom
	20, 21, 22,
	20, 22, 23
]);

const transparent = new Color(0, 0, 0, 0);

export default function Perspective(props) {
	return AnimatedCanvas((canvas) => {
		const gl = canvas.getContext("webgl2");
		if (!gl) { throw new Error("Your browser does not support WebGL2."); }

		const program = Program.fromSource(gl, vss, fss);

		const buffer = new Buffer(gl, bufferData);

		const vao = new VAO(program, [
			new AttributeState("a_position", buffer),
		], indexData);

		const orthoMat = mat4.create();
		const perspectiveMat = mat4.create();

		return function render() {
			clearContext(gl, transparent, 1);

			resizeContext(gl);

			gl.enable(gl.CULL_FACE);

			mat4.ortho(orthoMat, 0, canvas.clientWidth, 0, canvas.clientHeight, 0, 1000);
			mat4.translate(orthoMat, orthoMat, [canvas.clientWidth / 4, canvas.clientHeight / 2, -500]);
			mat4.scale(orthoMat, orthoMat, [100, 100, 100]);

			mat4.perspective(perspectiveMat, 45, canvas.clientWidth / canvas.clientHeight, 1, 1000);
			mat4.translate(perspectiveMat, perspectiveMat, [canvas.clientWidth / 4, 0, -500]);
			mat4.scale(perspectiveMat, perspectiveMat, [100, 100, 100]);

			vao.draw({ "u_matrix": orthoMat });
			vao.draw({ "u_matrix": perspectiveMat });
		}
	}, props);
}
