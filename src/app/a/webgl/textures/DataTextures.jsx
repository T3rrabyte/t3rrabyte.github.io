"use client";

import { Context, Buffer, BufferInfo, Program, Texture2d, Vao, Mipmap, Texture2dMip, TextureInternalFormat } from "@lakuna/ugl";
import { identity, scale } from "@lakuna/umath/Matrix4";
import AnimatedCanvas from "#app/a/webgl/AnimatedCanvas.jsx";

const vss = `\
#version 300 es

in vec4 a_position;
in vec2 a_texcoord;

uniform mat4 u_matrix;

out vec2 v_texcoord;

void main() {
	gl_Position = u_matrix * a_position;
	v_texcoord = a_texcoord;
}`;

const fss = `\
#version 300 es

precision highp float;

in vec2 v_texcoord;

uniform sampler2D u_texture;

out vec4 outColor;

void main() {
	outColor = texture(u_texture, v_texcoord);
}`;

const positionData = new Float32Array([
	-1, 1,
	-1, -1,
	1, -1,
	1, 1
]);

const texcoordData = new Float32Array([
	0, 0,
	0, 1,
	1, 1,
	1, 0
]);

const indices = new Uint8Array([
	0, 1, 2,
	0, 2, 3
]);

export default (props) => {
	return AnimatedCanvas((canvas) => {
		const gl = new Context(canvas);
		const program = Program.fromSource(gl, vss, fss);

		const positionBuffer = new Buffer(gl, positionData);
		const texcoordBuffer = new Buffer(gl, texcoordData);
		const vao = new Vao(program, [
			new BufferInfo("a_position", positionBuffer, 2),
			new BufferInfo("a_texcoord", texcoordBuffer, 2)
		], indices);

		const texture = new Texture2d(gl, new Mipmap(new Texture2dMip(
			new Uint8Array([
				0x80, 0x40, 0x80,
				0x00, 0xC0, 0x00
			]),
			TextureInternalFormat.R8,
			3,
			2
		)));

		const matrix = new Float32Array(16);

		return () => {
			gl.resize();
			gl.clear([0, 0, 0, 0]);

			identity(matrix);
			scale(
				matrix,
				canvas.width > canvas.height
					? [canvas.height / canvas.width, 1, 1]
					: [1, canvas.width / canvas.height, 1],
				matrix);

			vao.draw({ "u_matrix": matrix, "u_texture": texture });
		};
	}, props);
};
