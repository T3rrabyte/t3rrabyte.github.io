"use client";

import { Color, Program, Buffer, VAO, AttributeState, clearContext, resizeContext } from "@lakuna/ugl";
import { mat4 } from "gl-matrix";
import AnimatedCanvas from "../AnimatedCanvas";

const vss = `#version 300 es
in vec4 a_position;
in vec4 a_color;
uniform mat4 u_matrix;
out vec4 v_color;
void main() {
	gl_Position = u_matrix * a_position;
	v_color = a_color;
}`;

const fss = `#version 300 es
precision highp float;
in vec4 v_color;
out vec4 outColor;
void main() {
	outColor = v_color;
}`;

const positionBufferData = new Float32Array([
	0, 0, 0,
	30, 0, 0,
	0, 150, 0,
	0, 150, 0,
	30, 0, 0,
	30, 150, 0,
	30, 0, 0,
	100, 0, 0,
	30, 30, 0,
	30, 30, 0,
	100, 0, 0,
	100, 30, 0,
	30, 60, 0,
	67, 60, 0,
	30, 90, 0,
	30, 90, 0,
	67, 60, 0,
	67, 90, 0,
	0, 0, 30,
	30, 0, 30,
	0, 150, 30,
	0, 150, 30,
	30, 0, 30,
	30, 150, 30,
	30, 0, 30,
	100, 0, 30,
	30, 30, 30,
	30, 30, 30,
	100, 0, 30,
	100, 30, 30,
	30, 60, 30,
	67, 60, 30,
	30, 90, 30,
	30, 90, 30,
	67, 60, 30,
	67, 90, 30,
	0, 0, 0,
	100, 0, 0,
	100, 0, 30,
	0, 0, 0,
	100, 0, 30,
	0, 0, 30,
	100, 0, 0,
	100, 30, 0,
	100, 30, 30,
	100, 0, 0,
	100, 30, 30,
	100, 0, 30,
	30, 30, 0,
	30, 30, 30,
	100, 30, 30,
	30, 30, 0,
	100, 30, 30,
	100, 30, 0,
	30, 30, 0,
	30, 30, 30,
	30, 60, 30,
	30, 30, 0,
	30, 60, 30,
	30, 60, 0,
	30, 60, 0,
	30, 60, 30,
	67, 60, 30,
	30, 60, 0,
	67, 60, 30,
	67, 60, 0,
	67, 60, 0,
	67, 60, 30,
	67, 90, 30,
	67, 60, 0,
	67, 90, 30,
	67, 90, 0,
	30, 90, 0,
	30, 90, 30,
	67, 90, 30,
	30, 90, 0,
	67, 90, 30,
	67, 90, 0,
	30, 90, 0,
	30, 90, 30,
	30, 150, 30,
	30, 90, 0,
	30, 150, 30,
	30, 150, 0,
	0, 150, 0,
	0, 150, 30,
	30, 150, 30,
	0, 150, 0,
	30, 150, 30,
	30, 150, 0,
	0, 0, 0,
	0, 0, 30,
	0, 150, 30,
	0, 0, 0,
	0, 150, 30,
	0, 150, 0
]);

const colorBufferData = new Uint8Array([
	200, 70, 120,
	200, 70, 120,
	200, 70, 120,
	200, 70, 120,
	200, 70, 120,
	200, 70, 120,
	200, 70, 120,
	200, 70, 120,
	200, 70, 120,
	200, 70, 120,
	200, 70, 120,
	200, 70, 120,
	200, 70, 120,
	200, 70, 120,
	200, 70, 120,
	200, 70, 120,
	200, 70, 120,
	200, 70, 120,
	80, 70, 200,
	80, 70, 200,
	80, 70, 200,
	80, 70, 200,
	80, 70, 200,
	80, 70, 200,
	80, 70, 200,
	80, 70, 200,
	80, 70, 200,
	80, 70, 200,
	80, 70, 200,
	80, 70, 200,
	80, 70, 200,
	80, 70, 200,
	80, 70, 200,
	80, 70, 200,
	80, 70, 200,
	80, 70, 200,
	70, 200, 210,
	70, 200, 210,
	70, 200, 210,
	70, 200, 210,
	70, 200, 210,
	70, 200, 210,
	200, 200, 70,
	200, 200, 70,
	200, 200, 70,
	200, 200, 70,
	200, 200, 70,
	200, 200, 70,
	210, 100, 70,
	210, 100, 70,
	210, 100, 70,
	210, 100, 70,
	210, 100, 70,
	210, 100, 70,
	210, 160, 70,
	210, 160, 70,
	210, 160, 70,
	210, 160, 70,
	210, 160, 70,
	210, 160, 70,
	70, 180, 210,
	70, 180, 210,
	70, 180, 210,
	70, 180, 210,
	70, 180, 210,
	70, 180, 210,
	100, 70, 210,
	100, 70, 210,
	100, 70, 210,
	100, 70, 210,
	100, 70, 210,
	100, 70, 210,
	76, 210, 100,
	76, 210, 100,
	76, 210, 100,
	76, 210, 100,
	76, 210, 100,
	76, 210, 100,
	140, 210, 80,
	140, 210, 80,
	140, 210, 80,
	140, 210, 80,
	140, 210, 80,
	140, 210, 80,
	90, 130, 110,
	90, 130, 110,
	90, 130, 110,
	90, 130, 110,
	90, 130, 110,
	90, 130, 110,
	160, 160, 220,
	160, 160, 220,
	160, 160, 220,
	160, 160, 220,
	160, 160, 220,
	160, 160, 220
]);

const transparent = new Color(0, 0, 0, 0);

export default function OrthoNoCull(props) {
	return AnimatedCanvas((canvas) => {
		const gl = canvas.getContext("webgl2");
		if (!gl) { throw new Error("Your browser does not support WebGL2."); }

		const program = Program.fromSource(gl, vss, fss);

		const positionBuffer = new Buffer(gl, positionBufferData);
		const colorBuffer = new Buffer(gl, colorBufferData);

		const vao = new VAO(program, [
			new AttributeState("a_position", positionBuffer),
			new AttributeState("a_color", colorBuffer, 3, true)
		]);

		const mat = mat4.create();

		return function render(now) {
			clearContext(gl, transparent);

			resizeContext(gl);

			mat4.ortho(mat, 0, canvas.clientWidth, 0, canvas.clientHeight, 0, 1000);
			mat4.translate(mat, mat, [canvas.clientWidth / 2, canvas.clientHeight / 2, -500]);
			mat4.rotateZ(mat, mat, 0.001 * now);
			mat4.rotateX(mat, mat, 0.0007 * now);

			vao.draw({ "u_matrix": mat });
		}
	}, props);
}
