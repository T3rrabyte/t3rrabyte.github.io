"use client";

import { Context, Buffer, BufferInfo, Program, VAO, FaceDirection, Framebuffer, Texture2D, Mipmap, Texture2DMip, TextureInternalFormat, Renderbuffer, RenderbufferFormat } from "@lakuna/ugl";
import { identity, rotateX, rotateY, rotateZ, perspective, invert, multiply, translate } from "@lakuna/umath/Matrix4";
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

const texcoordData = new Float32Array([
	// Front
	0, 0,
	0, 1,
	1, 1,
	1, 0,

	// Back
	0, 0,
	0, 1,
	1, 1,
	1, 0,

	// Left
	0, 0,
	0, 1,
	1, 1,
	1, 0,

	// Right
	0, 0,
	0, 1,
	1, 1,
	1, 0,

	// Top
	0, 0,
	0, 1,
	1, 1,
	1, 0,

	// Bottom
	0, 0,
	0, 1,
	1, 1,
	1, 0
]);

const indices = new Uint8Array([
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

const speed = 0.001;

export default (props) => {
	return AnimatedCanvas((canvas) => {
		const gl = new Context(canvas);
		const program = Program.fromSource(gl, vss, fss);

		const positionBuffer = new Buffer(gl, positionData);
		const texcoordBuffer = new Buffer(gl, texcoordData);
		const vao = new VAO(program, [
			new BufferInfo("a_position", positionBuffer),
			new BufferInfo("a_texcoord", texcoordBuffer, 2)
		], indices);

		const redTexture = new Texture2D(gl, new Mipmap(new Texture2DMip(
			new Uint8Array([0xFF]),
			TextureInternalFormat.R8,
			1,
			1
		)));
		const greenTexture = new Texture2D(gl, new Mipmap(new Texture2DMip(
			new Uint8Array([0x0, 0xFF]),
			TextureInternalFormat.RG8,
			1,
			1
		)));
		const renderTexture = new Texture2D(gl, new Mipmap(new Texture2DMip(undefined, undefined, 0x100, 0x100)));
		const renderDepth = new Renderbuffer(gl, RenderbufferFormat.DEPTH_COMPONENT24, 0x100, 0x100);
		const framebuffer = new Framebuffer(gl, [renderTexture.face], renderDepth);

		const cameraMatrix = new Float32Array(16);
		identity(cameraMatrix);
		translate(cameraMatrix, [0, 0, 5], cameraMatrix);

		const viewMatrix = new Float32Array(16);
		invert(cameraMatrix, viewMatrix);

		const framebufferCameraMatrix = new Float32Array(16);
		identity(framebufferCameraMatrix);
		translate(framebufferCameraMatrix, [0, 0, 5], framebufferCameraMatrix);

		const framebufferViewMatrix = new Float32Array(16);
		invert(framebufferCameraMatrix, framebufferViewMatrix);

		const projectionMatrix = new Float32Array(16);
		const viewProjectionMatrix = new Float32Array(16);
		const framebufferProjectionMatrix = new Float32Array(16);
		const framebufferViewProjectionMatrix = new Float32Array(16);
		const redMatrix = new Float32Array(16);
		const greenMatrix = new Float32Array(16);
		const blueMatrix = new Float32Array(16);

		return (now) => {
			perspective(Math.PI / 4, canvas.width / canvas.height, 1, 10, projectionMatrix);

			multiply(projectionMatrix, viewMatrix, viewProjectionMatrix);

			perspective(Math.PI / 4, renderTexture.face.top.width / renderTexture.face.top.height, 1, 10, framebufferProjectionMatrix);

			multiply(framebufferProjectionMatrix, framebufferViewMatrix, framebufferViewProjectionMatrix);

			identity(redMatrix);
			rotateX(redMatrix, now * speed, redMatrix);
			rotateY(redMatrix, now * speed, redMatrix);
			multiply(framebufferViewProjectionMatrix, redMatrix, redMatrix);

			identity(greenMatrix);
			multiply(framebufferViewProjectionMatrix, greenMatrix, greenMatrix);

			identity(blueMatrix);
			rotateY(blueMatrix, now * speed, blueMatrix);
			rotateZ(blueMatrix, now * speed, blueMatrix);
			multiply(viewProjectionMatrix, blueMatrix, blueMatrix);

			framebuffer.bind();
			gl.resize(0, 0, renderTexture.face.top.width, renderTexture.face.top.height);
			gl.clear([0, 0, 1, 1], 1);
			gl.cullFace = FaceDirection.BACK;

			vao.draw({ "u_matrix": redMatrix, "u_texture": redTexture });
			vao.draw({ "u_matrix": greenMatrix, "u_texture": greenTexture });

			Framebuffer.unbind(gl);
			gl.resize();
			gl.clear([0, 0, 0, 0], 1);
			gl.cullFace = FaceDirection.BACK;

			vao.draw({ "u_matrix": blueMatrix, "u_texture": renderTexture });
		};
	}, props);
};
