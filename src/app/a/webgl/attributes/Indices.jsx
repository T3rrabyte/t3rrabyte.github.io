"use client";

import { Context, Buffer, BufferInfo, Program, VAO } from "@lakuna/ugl";
import AnimatedCanvas from "#app/a/webgl/AnimatedCanvas.jsx";

const vss = `\
#version 300 es

in vec4 a_position;

void main() {
	gl_Position = a_position;
}`;

const fss = `\
#version 300 es

precision highp float;

out vec4 outColor;

void main() {
	outColor = vec4(0, 0, 0, 1);
}`;

const data = new Float32Array([
	0, 0.5,
	0, 0,
	0.7, 0,
	0.7, 0.5
]);

const indices = new Uint8Array([
	0, 1, 2,
	0, 2, 3
]);

export default (props) => {
	return AnimatedCanvas((canvas) => {
		const gl = new Context(canvas);
		const program = Program.fromSource(gl, vss, fss);

		const buffer = new Buffer(gl, data);
		const vao = new VAO(program, [
			new BufferInfo("a_position", buffer, 2)
		], indices);

		return () => {
			gl.resize();
			gl.clear([0, 0, 0, 0]);

			vao.draw();
		};
	}, props);
};
