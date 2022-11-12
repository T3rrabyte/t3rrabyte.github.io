"use client";

import { AttributeState, Buffer, clearContext, Color, Program, resizeContext, Texture2D, TextureFilter, VAO } from "@lakuna/umbra.js";
import { mat4 } from "gl-matrix";
import AnimatedCanvas from "../AnimatedCanvas";
import defaultDomain from "../../../domain";

const textureUrl = `${defaultDomain}/images/webgl-example-texture-atlas.png`;

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

const texcoordBufferData = new Float32Array([
	// Front
	0 / 3, 0 / 2,
	0 / 3, 1 / 2,
	1 / 3, 1 / 2,
	1 / 3, 0 / 2,

	// Back
	1 / 3, 0 / 2,
	1 / 3, 1 / 2,
	2 / 3, 1 / 2,
	2 / 3, 0 / 2,

	// Left
	2 / 3, 0 / 2,
	2 / 3, 1 / 2,
	3 / 3, 1 / 2,
	3 / 3, 0 / 2,

	// Right
	0 / 3, 1 / 2,
	0 / 3, 2 / 2,
	1 / 3, 2 / 2,
	1 / 3, 1 / 2,

	// Top
	1 / 3, 1 / 2,
	1 / 3, 2 / 2,
	2 / 3, 2 / 2,
	2 / 3, 1 / 2,

	// Bottom
	2 / 3, 1 / 2,
	2 / 3, 2 / 2,
	3 / 3, 2 / 2,
	3 / 3, 1 / 2
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

const cameraRadius = 400;
const cubeSideLength = 50;

const transparent = new Color(0, 0, 0, 0);

export default function TextureAtlases(props) {
	return AnimatedCanvas((canvas) => {
		const gl = canvas.getContext("webgl2");
		if (!gl) { throw new Error("Your browser does not support WebGL2."); }

		const program = Program.fromSource(gl, vss, fss);

		const positionBuffer = new Buffer(gl, positionBufferData);
		const texcoordBuffer = new Buffer(gl, texcoordBufferData);

		const vao = new VAO(program, [
			new AttributeState("a_position", positionBuffer),
			new AttributeState("a_texcoord", texcoordBuffer, 2)
		], indexData);

		const texture = new Texture2D({
			gl,
			pixels: new Uint8Array([0xFF, 0x00, 0xFF, 0xFF]),
			width: 1,
			height: 1,
			minFilter: TextureFilter.NEAREST,
			magFilter: TextureFilter.NEAREST
		});

		const image = new Image();
		image.addEventListener("load", () => {
			texture.pixels = image;
			texture.width = undefined;
			texture.height = undefined;
		});
		image.crossOrigin = "";
		image.src = textureUrl;

		const projMat = mat4.create();
		const camMat = mat4.create();
		const viewMat = mat4.create();
		const viewProjMat = mat4.create();
		const tempMat = mat4.create();

		const mat = mat4.create();
		mat4.scale(mat, mat, [cubeSideLength, cubeSideLength, cubeSideLength]);

		return function render(now) {
			clearContext(gl, transparent, 1);

			resizeContext(gl);

			gl.enable(gl.CULL_FACE);

			mat4.perspective(projMat, Math.PI / 4, canvas.clientWidth / canvas.clientHeight, 1, 1000);
			mat4.identity(camMat);
			mat4.rotateX(camMat, camMat, 0.001 * now);
			mat4.rotateY(camMat, camMat, 0.0005 * now);
			mat4.rotateZ(camMat, camMat, 0.00025 * now);
			mat4.translate(camMat, camMat, [0, 0, cameraRadius]);
			mat4.invert(viewMat, camMat);
			mat4.multiply(viewProjMat, projMat, viewMat);
			mat4.multiply(tempMat, viewProjMat, mat);

			vao.draw({ "u_matrix": tempMat, "u_texture": texture });
		}
	}, props);
}
