"use client";

import { AttributeState, Buffer, clearContext, Color, Program, resizeContext, Texture2D, TextureFilter, VAO } from "uugl";
import { mat4 } from "gl-matrix";
import AnimatedCanvas from "../AnimatedCanvas";
import defaultDomain from "../../../domain";

const textureUrl = `${defaultDomain}/images/webgl-example-texture.png`;

const vss = `#version 300 es
in vec4 a_position;
in vec2 a_texcoord;
uniform mat4 u_matrix;
out vec2 v_texcoord;
void main() {
	v_texcoord = a_texcoord;
	gl_Position = u_matrix * a_position;
}`;

const fss = `#version 300 es
precision highp float;
in vec2 v_texcoord;
uniform sampler2D u_texture;
out vec4 outColor;
void main() {
	outColor = texture(u_texture, v_texcoord);
}`;

const positionBufferData = new Float32Array([
	-1, 1,
	-1, -1,
	1, -1,
	1, 1
]);

const texcoordBufferData = new Float32Array([
	0, 0,
	0, 1,
	1, 1,
	1, 0
]);

const indexData = new Uint8Array([
	0, 1, 2,
	0, 2, 3
]);

const transparent = new Color(0, 0, 0, 0);

export default function Mipmaps(props) {
	return AnimatedCanvas((canvas) => {
		const gl = canvas.getContext("webgl2");
		if (!gl) { throw new Error("Your browser does not support WebGL2."); }

		const program = Program.fromSource(gl, vss, fss);

		const positionBuffer = new Buffer(gl, positionBufferData);
		const texcoordBuffer = new Buffer(gl, texcoordBufferData);

		const vao = new VAO(program, [
			new AttributeState("a_position", positionBuffer, 2),
			new AttributeState("a_texcoord", texcoordBuffer, 2)
		], indexData);

		const texture = new Texture2D({
			gl,
			pixels: new Uint8Array([0xFF, 0x00, 0xFF, 0xFF]),
			width: 1,
			height: 1,
			minFilter: TextureFilter.LINEAR_MIPMAP_LINEAR,
			magFilter: TextureFilter.LINEAR
		});

		const image = new Image();
		image.addEventListener("load", () => {
			texture.pixels = image;
			texture.width = undefined;
			texture.height = undefined;
		});
		image.crossOrigin = "";
		image.src = textureUrl;

		const mat = mat4.create();

		return function render(now) {
			clearContext(gl, transparent);

			resizeContext(gl);

			const scale = Math.cos(now * 0.001) * 2 + 2.5;
			mat4.identity(mat);
			if (canvas.clientWidth > canvas.clientHeight) {
				mat4.scale(mat, mat, [(canvas.clientHeight / canvas.clientWidth) * scale, scale, scale]);
			} else {
				mat4.scale(mat, mat, [scale, (canvas.clientWidth / canvas.clientHeight) * scale, scale]);
			}

			vao.draw({ "u_matrix": mat, "u_texture": texture });
		}
	}, props);
}
