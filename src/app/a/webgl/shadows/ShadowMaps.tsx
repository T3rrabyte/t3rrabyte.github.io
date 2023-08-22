"use client";

import {
	Context,
	Buffer,
	BufferInfo,
	Program,
	Texture2d,
	Vao,
	Mipmap,
	Texture2dMip,
	FaceDirection,
	TextureInternalFormat,
	Primitive,
	Framebuffer
} from "@lakuna/ugl";
import {
	identity,
	invert,
	multiply,
	perspective,
	translate,
	rotateX,
	rotateY,
	scale
} from "@lakuna/umath/Matrix4";
import AnimatedCanvas from "@lakuna/react-canvas";
import type { Matrix4Like } from "@lakuna/umath";
import type { CanvasHTMLAttributes, DetailedHTMLProps, JSX } from "react";

const vss: string = `\
#version 300 es

in vec4 a_position;
in vec2 a_texcoord;

uniform mat4 u_world;
uniform mat4 u_viewerViewProjection;
uniform mat4 u_textureMatrix;

out vec2 v_texcoord;
out vec4 v_projectedTexcoord;

void main() {
	vec4 worldPosition = u_world * a_position;
	gl_Position = u_viewerViewProjection * worldPosition;
	v_texcoord = a_texcoord;
	v_projectedTexcoord = u_textureMatrix * worldPosition;
}`;

const fss: string = `\
#version 300 es

precision highp float;

in vec2 v_texcoord;
in vec4 v_projectedTexcoord;

uniform vec4 u_color;
uniform sampler2D u_texture;
uniform sampler2D u_projectedTexture;

out vec4 outColor;

void main() {
	vec3 projectedTexcoord = v_projectedTexcoord.xyz / v_projectedTexcoord.w;
	float depth = projectedTexcoord.z;

	bool inRange = projectedTexcoord.x >= 0.0
		&& projectedTexcoord.x <= 1.0
		&& projectedTexcoord.y >= 0.0
		&& projectedTexcoord.y <= 1.0;
	
	float projectedDepth = texture(u_projectedTexture, projectedTexcoord.xy).r;
	float shadowLight = inRange && projectedDepth <= depth ? 0.0 : 1.0;

	vec4 textureColor = texture(u_texture, v_texcoord) * u_color;
	outColor = vec4(textureColor.rgb * shadowLight, textureColor.a);
}`;

const solidVss: string = `\
#version 300 es

in vec4 a_position;

uniform mat4 u_world;
uniform mat4 u_viewerViewProjection;

void main() {
	gl_Position = u_viewerViewProjection * u_world * a_position;
}`;

const solidFss: string = `\
#version 300 es

precision highp float;

out vec4 outColor;

void main() {
	outColor = vec4(0, 0, 0, 1);
}`;

const planePositionData: Float32Array = new Float32Array([
	-1, 1, -1, -1, 1, -1, 1, 1
]);

const planeTexcoordData: Float32Array = new Float32Array([
	0, 0, 0, 10, 10, 10, 10, 0
]);

const planeIndices: Uint8Array = new Uint8Array([0, 1, 2, 0, 2, 3]);

const cubePositionData: Float32Array = new Float32Array([
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

const cubeTexcoordData: Float32Array = new Float32Array([
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

const cubeIndices: Uint8Array = new Uint8Array([
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

const frustumPositionData: Float32Array = new Float32Array([
	-1, -1, -1, 1, -1, -1, -1, 1, -1, 1, 1, -1, -1, -1, 1, 1, -1, 1, -1, 1, 1, 1,
	1, 1
]);

const frustumIndices: Uint8Array = new Uint8Array([
	0, 1, 1, 3, 3, 2, 2, 0,

	4, 5, 5, 7, 7, 6, 6, 4,

	0, 4, 1, 5, 3, 7, 2, 6
]);

const projectedTextureDim = 1024;
const cameraDistance = 2;
const cameraRotationX: number = -Math.PI / 5;

export default function ShadowMaps(
	props: DetailedHTMLProps<
		CanvasHTMLAttributes<HTMLCanvasElement>,
		HTMLCanvasElement
	>
): JSX.Element {
	return AnimatedCanvas((canvas: HTMLCanvasElement): FrameRequestCallback => {
		const gl: Context = new Context(canvas);
		const program: Program = Program.fromSource(gl, vss, fss);
		const solidProgram: Program = Program.fromSource(gl, solidVss, solidFss);

		const planePositionBuffer: Buffer = new Buffer(gl, planePositionData);
		const planeTexcoordBuffer: Buffer = new Buffer(gl, planeTexcoordData);
		const cubePositionBuffer: Buffer = new Buffer(gl, cubePositionData);
		const cubeTexcoordBuffer: Buffer = new Buffer(gl, cubeTexcoordData);
		const frustumPositionBuffer: Buffer = new Buffer(gl, frustumPositionData);
		const planeVao: Vao = new Vao(
			program,
			[
				new BufferInfo("a_position", planePositionBuffer, 2),
				new BufferInfo("a_texcoord", planeTexcoordBuffer, 2)
			],
			planeIndices
		);
		const solidPlaneVao: Vao = new Vao(
			solidProgram,
			[new BufferInfo("a_position", planePositionBuffer, 2)],
			planeIndices
		);
		const cubeVao: Vao = new Vao(
			program,
			[
				new BufferInfo("a_position", cubePositionBuffer),
				new BufferInfo("a_texcoord", cubeTexcoordBuffer, 2)
			],
			cubeIndices
		);
		const solidCubeVao: Vao = new Vao(
			solidProgram,
			[new BufferInfo("a_position", cubePositionBuffer)],
			cubeIndices
		);
		const frustumVao: Vao = new Vao(
			solidProgram,
			[new BufferInfo("a_position", frustumPositionBuffer)],
			frustumIndices
		);

		const texture: Texture2d = new Texture2d(
			gl,
			new Mipmap(
				new Texture2dMip(
					new Uint8Array([0x80, 0xc0, 0xc0, 0x80]),
					TextureInternalFormat.LUMINANCE,
					2,
					2
				)
			)
		);
		const projectedTexture: Texture2d = new Texture2d(
			gl,
			new Mipmap(
				new Texture2dMip(
					null,
					TextureInternalFormat.DEPTH_COMPONENT32F,
					projectedTextureDim,
					projectedTextureDim
				)
			)
		);

		const framebuffer: Framebuffer = new Framebuffer(
			gl,
			undefined,
			projectedTexture.face
		);

		const planeMatrix: Matrix4Like = new Float32Array(16) as Matrix4Like;
		identity(planeMatrix);
		rotateX(planeMatrix, (Math.PI * 3) / 2, planeMatrix);

		const cubeMatrix: Matrix4Like = new Float32Array(16) as Matrix4Like;
		identity(cubeMatrix);
		scale(cubeMatrix, [0.1, 0.1, 0.1], cubeMatrix);
		translate(cubeMatrix, [1, 2, 1], cubeMatrix);

		const projectorProjectionMatrix: Matrix4Like = new Float32Array(
			16
		) as Matrix4Like;
		perspective(Math.PI / 10, 1, 1, 3, projectorProjectionMatrix);

		const projectorCameraMatrix: Matrix4Like = new Float32Array(
			16
		) as Matrix4Like;
		identity(projectorCameraMatrix);
		rotateX(projectorCameraMatrix, cameraRotationX, projectorCameraMatrix);
		translate(
			projectorCameraMatrix,
			[0, 0, cameraDistance],
			projectorCameraMatrix
		);

		const projectorViewMatrix: Matrix4Like = new Float32Array(
			16
		) as Matrix4Like;
		invert(projectorCameraMatrix, projectorViewMatrix);

		const projectorViewProjectionMatrix: Matrix4Like = new Float32Array(
			16
		) as Matrix4Like;
		multiply(
			projectorProjectionMatrix,
			projectorViewMatrix,
			projectorViewProjectionMatrix
		);

		const textureMatrix: Matrix4Like = new Float32Array(16) as Matrix4Like;
		identity(textureMatrix);
		translate(textureMatrix, [0.5, 0.5, 0.5], textureMatrix);
		scale(textureMatrix, [0.5, 0.5, 0.5], textureMatrix);
		multiply(textureMatrix, projectorViewProjectionMatrix, textureMatrix);

		const frustumMatrix: Matrix4Like = new Float32Array(16) as Matrix4Like;
		invert(projectorViewProjectionMatrix, frustumMatrix);

		const viewerProjectionMatrix: Matrix4Like = new Float32Array(
			16
		) as Matrix4Like;
		const viewerCameraMatrix: Matrix4Like = new Float32Array(16) as Matrix4Like;
		const viewerViewMatrix: Matrix4Like = new Float32Array(16) as Matrix4Like;
		const viewerViewProjectionMatrix: Matrix4Like = new Float32Array(
			16
		) as Matrix4Like;

		return (now: number): void => {
			perspective(
				Math.PI / 4,
				canvas.width / (canvas.height || 1),
				0.1,
				5,
				viewerProjectionMatrix
			);

			identity(viewerCameraMatrix);
			rotateY(viewerCameraMatrix, now * 0.0003, viewerCameraMatrix);
			rotateX(viewerCameraMatrix, cameraRotationX, viewerCameraMatrix);
			translate(viewerCameraMatrix, [0, 0, cameraDistance], viewerCameraMatrix);

			invert(viewerCameraMatrix, viewerViewMatrix);

			multiply(
				viewerProjectionMatrix,
				viewerViewMatrix,
				viewerViewProjectionMatrix
			);

			framebuffer.with((): void => {
				gl.resize(
					0,
					0,
					projectedTexture.face.top.width as number,
					projectedTexture.face.top.height as number
				);
				gl.clear([0, 0, 0, 0], 1);
				gl.cullFace = FaceDirection.BACK;

				solidPlaneVao.draw({
					u_world: planeMatrix,
					u_viewerViewProjection: projectorViewProjectionMatrix
				});
				solidCubeVao.draw({
					u_world: cubeMatrix,
					u_viewerViewProjection: projectorViewProjectionMatrix
				});
			});

			gl.resize();
			gl.clear([0, 0, 0, 0], 1);
			gl.cullFace = FaceDirection.BACK;

			planeVao.draw({
				u_world: planeMatrix,
				u_viewerViewProjection: viewerViewProjectionMatrix,
				u_textureMatrix: textureMatrix,
				u_color: [1, 0, 0, 1],
				u_texture: texture,
				u_projectedTexture: projectedTexture
			});
			cubeVao.draw({
				u_world: cubeMatrix,
				u_viewerViewProjection: viewerViewProjectionMatrix,
				u_textureMatrix: textureMatrix,
				u_color: [0, 1, 0, 1],
				u_texture: texture,
				u_projectedTexture: projectedTexture
			});
			frustumVao.draw(
				{
					u_world: frustumMatrix,
					u_viewerViewProjection: viewerViewProjectionMatrix
				},
				Primitive.LINES
			);
		};
	}, props);
}
