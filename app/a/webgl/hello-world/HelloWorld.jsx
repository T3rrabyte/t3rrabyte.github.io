"use client";

import AnimatedCanvas from "../AnimatedCanvas";
import { Program, Buffer, VAO, AttributeState, clearContext, Color, resizeContext } from "@lakuna/umbra.js";

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
		const gl = canvas.getContext("webgl2");
		if (!gl) { throw new Error("Your browser does not support WebGL2."); }

		const program = Program.fromSource(gl, vss, fss);

		const buffer = new Buffer(gl, bufferData);

		const vao = new VAO(program, [
			new AttributeState("a_position", buffer, 2)
		]);

		return function render() {
			clearContext(gl, transparent);

			resizeContext(gl);

			vao.draw();
		}
	}, props);
}
