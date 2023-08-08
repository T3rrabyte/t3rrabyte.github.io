"use client";

import { Context, Buffer, BufferInfo, Program, VAO } from "@lakuna/ugl";
import AnimatedCanvas from "#app/a/webgl/AnimatedCanvas.jsx";

const vss = `\
#version 300 es

in vec4 a_position;

uniform float u_rotation;

void main() {
	float x = a_position.x * sin(u_rotation) + a_position.y * cos(u_rotation);
	float y = a_position.y * sin(u_rotation) - a_position.x * cos(u_rotation);
	gl_Position = vec4(x, y, a_position.zw);
}`;

const fss = `\
#version 300 es

precision highp float;

out vec4 outColor;

void main() {
	outColor = vec4(0, 0, 0, 1);
}`;

const data = new Float32Array([
	-0.2, 0.2,
	-0.2, -0.2,
	0.2, -0.2,
	0.2, 0.2
]);

const indices = new Uint8Array([
	0, 1, 2,
	0, 2, 3
]);

const speed = 0.001;

export default (props) => {
	return AnimatedCanvas((canvas) => {
		const gl = new Context(canvas);
		const program = Program.fromSource(gl, vss, fss);

		const buffer = new Buffer(gl, data);
		const vao = new VAO(program, [
			new BufferInfo("a_position", buffer, 2)
		], indices);

		return (now) => {
			gl.resize();
			gl.clear([0, 0, 0, 0]);

			vao.draw({ "u_rotation": now * speed });
		};
	}, props);
};
