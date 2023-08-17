"use client";

import {
	Context,
	Buffer,
	BufferInfo,
	Program,
	Vao,
	FaceDirection,
	Framebuffer,
	Texture2d,
	Mipmap,
	Texture2dMip,
	TextureInternalFormat,
	Renderbuffer,
	RenderbufferFormat,
	FramebufferTarget
} from "@lakuna/ugl";
import {
	identity,
	rotateX,
	rotateY,
	rotateZ,
	perspective,
	invert,
	multiply,
	translate,
	type Matrix4Like
} from "@lakuna/umath/Matrix4";
import AnimatedCanvas from "#app/a/webgl/AnimatedCanvas.tsx";
import type { CanvasHTMLAttributes, DetailedHTMLProps, JSX } from "react";

const vss: string = `\
#version 300 es

in vec4 a_position;
in vec2 a_texcoord;

uniform mat4 u_matrix;

out vec2 v_texcoord;

void main() {
	gl_Position = u_matrix * a_position;
	v_texcoord = a_texcoord;
}`;

const fss: string = `\
#version 300 es

precision highp float;

in vec2 v_texcoord;

uniform sampler2D u_texture;

out vec4 outColor;

void main() {
	outColor = texture(u_texture, v_texcoord);
}`;

const positionData: Float32Array = new Float32Array([
	// Front
	-1, 1, 1, -1, -1, 1, 1, -1, 1, 1, 1, 1,

	// Back
	1, 1, -1, 1, -1, -1, -1, -1, -1, -1, 1, -1,

	// Left
	-1, 1, -1, -1, -1, -1, -1, -1, 1, -1, 1, 1,

	// Right
	1, 1, 1, 1, -1, 1, 1, -1, -1, 1, 1, -1,

	// Top
	-1, 1, -1, -1, 1, 1, 1, 1, 1, 1, 1, -1,

	// Bottom
	-1, -1, 1, -1, -1, -1, 1, -1, -1, 1, -1, 1
]);

const texcoordData: Float32Array = new Float32Array([
	// Front
	0, 0, 0, 1, 1, 1, 1, 0,

	// Back
	0, 0, 0, 1, 1, 1, 1, 0,

	// Left
	0, 0, 0, 1, 1, 1, 1, 0,

	// Right
	0, 0, 0, 1, 1, 1, 1, 0,

	// Top
	0, 0, 0, 1, 1, 1, 1, 0,

	// Bottom
	0, 0, 0, 1, 1, 1, 1, 0
]);

const indices: Uint8Array = new Uint8Array([
	// Top
	0, 1, 2, 0, 2, 3,

	// Bottom
	4, 5, 6, 4, 6, 7,

	// Left
	8, 9, 10, 8, 10, 11,

	// Right
	12, 13, 14, 12, 14, 15,

	// Top
	16, 17, 18, 16, 18, 19,

	// Bottom
	20, 21, 22, 20, 22, 23
]);

const speed = 0.001;

export default function Cameras(
	props: DetailedHTMLProps<
		CanvasHTMLAttributes<HTMLCanvasElement>,
		HTMLCanvasElement
	>
): JSX.Element {
	return AnimatedCanvas((canvas: HTMLCanvasElement): FrameRequestCallback => {
		const gl: Context = new Context(canvas);
		const program: Program = Program.fromSource(gl, vss, fss);

		const positionBuffer: Buffer = new Buffer(gl, positionData);
		const texcoordBuffer: Buffer = new Buffer(gl, texcoordData);
		const vao: Vao = new Vao(
			program,
			[
				new BufferInfo("a_position", positionBuffer),
				new BufferInfo("a_texcoord", texcoordBuffer, 2)
			],
			indices
		);

		const redTexture: Texture2d = new Texture2d(
			gl,
			new Mipmap(
				new Texture2dMip(new Uint8Array([0xff]), TextureInternalFormat.R8, 1, 1)
			)
		);
		const greenTexture: Texture2d = new Texture2d(
			gl,
			new Mipmap(
				new Texture2dMip(
					new Uint8Array([0x0, 0xff]),
					TextureInternalFormat.RG8,
					1,
					1
				)
			)
		);
		const renderTexture: Texture2d = new Texture2d(
			gl,
			new Mipmap(new Texture2dMip(undefined, undefined, 0x100, 0x100))
		);
		const renderDepth: Renderbuffer = new Renderbuffer(
			gl,
			RenderbufferFormat.DEPTH_COMPONENT24,
			0x100,
			0x100
		);
		const framebuffer: Framebuffer = new Framebuffer(
			gl,
			[renderTexture.face],
			renderDepth
		);

		const cameraMatrix: Matrix4Like = new Float32Array(16) as Matrix4Like;
		identity(cameraMatrix);
		translate(cameraMatrix, [0, 0, 5], cameraMatrix);

		const viewMatrix: Matrix4Like = new Float32Array(16) as Matrix4Like;
		invert(cameraMatrix, viewMatrix);

		const framebufferCameraMatrix: Matrix4Like = new Float32Array(
			16
		) as Matrix4Like;
		identity(framebufferCameraMatrix);
		translate(framebufferCameraMatrix, [0, 0, 5], framebufferCameraMatrix);

		const framebufferViewMatrix: Matrix4Like = new Float32Array(
			16
		) as Matrix4Like;
		invert(framebufferCameraMatrix, framebufferViewMatrix);

		const projectionMatrix: Matrix4Like = new Float32Array(16) as Matrix4Like;
		const viewProjectionMatrix: Matrix4Like = new Float32Array(
			16
		) as Matrix4Like;
		const framebufferProjectionMatrix: Matrix4Like = new Float32Array(
			16
		) as Matrix4Like;
		const framebufferViewProjectionMatrix: Matrix4Like = new Float32Array(
			16
		) as Matrix4Like;
		const redMatrix: Matrix4Like = new Float32Array(16) as Matrix4Like;
		const greenMatrix: Matrix4Like = new Float32Array(16) as Matrix4Like;
		const blueMatrix: Matrix4Like = new Float32Array(16) as Matrix4Like;

		return (now: number): void => {
			perspective(
				Math.PI / 4,
				canvas.width / (canvas.height || 1),
				1,
				10,
				projectionMatrix
			);

			multiply(projectionMatrix, viewMatrix, viewProjectionMatrix);

			perspective(
				Math.PI / 4,
				(renderTexture.face.top.width as number) /
					(renderTexture.face.top.height as number),
				1,
				10,
				framebufferProjectionMatrix
			);

			multiply(
				framebufferProjectionMatrix,
				framebufferViewMatrix,
				framebufferViewProjectionMatrix
			);

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
			gl.resize(
				0,
				0,
				renderTexture.face.top.width as number,
				renderTexture.face.top.height as number
			);
			gl.clear([0, 0, 1, 1], 1);
			gl.cullFace = FaceDirection.BACK;

			vao.draw({ u_matrix: redMatrix, u_texture: redTexture });
			vao.draw({ u_matrix: greenMatrix, u_texture: greenTexture });

			Framebuffer.unbind(gl, FramebufferTarget.FRAMEBUFFER);
			gl.resize();
			gl.clear([0, 0, 0, 0], 1);
			gl.cullFace = FaceDirection.BACK;

			vao.draw({ u_matrix: blueMatrix, u_texture: renderTexture });
		};
	}, props);
}
