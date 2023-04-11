"use client";

import AnimatedCanvas from "../AnimatedCanvas";
import { Program, Buffer, VAO, AttributeState, Color, Context } from "@lakuna/ugl";

const vss = `#version 300 es
in vec4 a_position;
void main() {
	gl_Position = a_position;
}`;

const fss = `#version 300 es
precision highp float;
out vec4 outColor;
void main() {
	outColor = vec4(1, 0, 0, 1);
}`;

const bufferData = new Float32Array([
	0, 0,
	0, 0.5,
	0.7, 0
]);

const transparent = new Color(0, 0, 0, 0);

export default function HelloWorld(props) {
	return AnimatedCanvas((canvas) => {
		const gl = new Context(canvas);

		const program = Program.fromSource(gl, vss, fss);

		const buffer = new Buffer(gl, bufferData);

		const vao = new VAO(program, [
			new AttributeState("a_position", buffer, 2)
		]);

		return function render() {
			gl.clear(transparent);

			gl.resize();

			vao.draw();
		}
	}, props);
}
