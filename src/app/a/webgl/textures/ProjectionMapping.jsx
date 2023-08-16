"use client";

import { Context, Buffer, BufferInfo, Program, Texture2d, Vao, Mipmap, Texture2dMip, FaceDirection, TextureInternalFormat, Primitive, TextureMinFilter, TextureMagFilter } from "@lakuna/ugl";
import { identity, invert, multiply, perspective, translate, rotateX, rotateY, scale } from "@lakuna/umath/Matrix4";
import AnimatedCanvas from "#app/a/webgl/AnimatedCanvas.jsx";
import domain from "#domain";

const vss = `\
#version 300 es

in vec4 a_position;
in vec2 a_texcoord;

uniform mat4 u_world;
uniform mat4 u_viewerViewProjection;
uniform mat4 u_projectorViewProjection;

out vec2 v_texcoord;
out vec4 v_projectedTexcoord;

void main() {
	gl_Position = u_viewerViewProjection * u_world * a_position;
	v_texcoord = a_texcoord;
	v_projectedTexcoord =
		u_projectorViewProjection * u_world * a_position;
}`;

const fss = `\
#version 300 es

precision highp float;

in vec2 v_texcoord;
in vec4 v_projectedTexcoord;

uniform vec4 u_color;
uniform sampler2D u_texture;
uniform sampler2D u_projectedTexture;

out vec4 outColor;

void main() {
	vec2 projectedTexcoord =
		(v_projectedTexcoord.xyz / v_projectedTexcoord.w).xy;

	bool inRange = projectedTexcoord.x >= 0.0
		&& projectedTexcoord.x <= 1.0
		&& projectedTexcoord.y >= 0.0
		&& projectedTexcoord.y <= 1.0;

	vec4 projectedTextureColor =
		texture(u_projectedTexture, projectedTexcoord);

	vec4 textureColor = texture(u_texture, v_texcoord) * u_color;

	outColor = inRange ? projectedTextureColor : textureColor;
}`;

const frustumVss = `\
#version 300 es

in vec4 a_position;

uniform mat4 u_world;
uniform mat4 u_viewerViewProjection;

void main() {
	gl_Position = u_viewerViewProjection * u_world * a_position;
}`;

const frustumFss = `\
#version 300 es

precision highp float;

out vec4 outColor;

void main() {
	outColor = vec4(0, 0, 0, 1);
}`;

const planePositionData = new Float32Array([
	-1, 1,
	-1, -1,
	1, -1,
	1, 1
]);

const planeTexcoordData = new Float32Array([
	0, 0,
	0, 10,
	10, 10,
	10, 0
]);

const planeIndices = new Uint8Array([
	0, 1, 2,
	0, 2, 3
]);

const cubePositionData = new Float32Array([
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

const cubeTexcoordData = new Float32Array([
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

const cubeIndices = new Uint8Array([
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

const frustumPositionData = new Float32Array([
	0, 0, 0,
	1, 0, 0,
	0, 1, 0,
	1, 1, 0,
	0, 0, 1,
	1, 0, 1,
	0, 1, 1,
	1, 1, 1
]);

const frustumIndices = new Uint8Array([
	0, 1,
	1, 3,
	3, 2,
	2, 0,

	4, 5,
	5, 7,
	7, 6,
	6, 4,

	0, 4,
	1, 5,
	3, 7,
	2, 6
]);

const projectedTextureUrl = `${domain}images/webgl-example-texture.png`;
const cameraDistance = 2;
const cameraRotationX = -Math.PI / 5;
const speed = 0.0003;
const projectorFov = Math.PI / 10;
const viewerFov = Math.PI / 4;
const cubeScale = [0.1, 0.1, 0.1];
const cubeTranslation = [1, 2, 1];

export default (props) => {
	return AnimatedCanvas((canvas) => {
		const gl = new Context(canvas);
		const program = Program.fromSource(gl, vss, fss);
		const frustumProgram = Program.fromSource(gl, frustumVss, frustumFss);

		const planePositionBuffer = new Buffer(gl, planePositionData);
		const planeTexcoordBuffer = new Buffer(gl, planeTexcoordData);
		const cubePositionBuffer = new Buffer(gl, cubePositionData);
		const cubeTexcoordBuffer = new Buffer(gl, cubeTexcoordData);
		const frustumPositionBuffer = new Buffer(gl, frustumPositionData);
		const planeVao = new Vao(program, [
			new BufferInfo("a_position", planePositionBuffer, 2),
			new BufferInfo("a_texcoord", planeTexcoordBuffer, 2)
		], planeIndices);
		const cubeVao = new Vao(program, [
			new BufferInfo("a_position", cubePositionBuffer),
			new BufferInfo("a_texcoord", cubeTexcoordBuffer, 2)
		], cubeIndices);
		const frustumVao = new Vao(frustumProgram, [
			new BufferInfo("a_position", frustumPositionBuffer)
		], frustumIndices);

		const texture = new Texture2d(gl, new Mipmap(new Texture2dMip(
			new Uint8Array([
				0x80, 0xC0,
				0xC0, 0x80
			]),
			TextureInternalFormat.LUMINANCE,
			2,
			2
		)));
		const projectedTexture = Texture2d.fromImageUrl(gl, projectedTextureUrl);
		projectedTexture.magFilter = TextureMagFilter.LINEAR;
		projectedTexture.minFilter = TextureMinFilter.LINEAR_MIPMAP_LINEAR;

		const planeMatrix = new Float32Array(16);
		identity(planeMatrix);
		rotateX(planeMatrix, Math.PI * 3 / 2, planeMatrix);

		const cubeMatrix = new Float32Array(16);
		identity(cubeMatrix);
		scale(cubeMatrix, cubeScale, cubeMatrix);
		translate(cubeMatrix, cubeTranslation, cubeMatrix);

		const projectorProjectionMatrix = new Float32Array(16);
		perspective(projectorFov, 1, 1, 3, projectorProjectionMatrix);

		const projectorCameraMatrix = new Float32Array(16);
		identity(projectorCameraMatrix);
		rotateX(projectorCameraMatrix, cameraRotationX, projectorCameraMatrix);
		translate(projectorCameraMatrix, [0, 0, cameraDistance], projectorCameraMatrix);

		const projectorViewMatrix = new Float32Array(16);
		invert(projectorCameraMatrix, projectorViewMatrix);

		const projectorViewProjectionMatrix = new Float32Array(16);
		multiply(projectorProjectionMatrix, projectorViewMatrix, projectorViewProjectionMatrix);

		const frustumMatrix = new Float32Array(16);
		invert(projectorViewProjectionMatrix, frustumMatrix);

		const viewerProjectionMatrix = new Float32Array(16);
		const viewerCameraMatrix = new Float32Array(16);
		const viewerViewMatrix = new Float32Array(16);
		const viewerViewProjectionMatrix = new Float32Array(16);

		return (now) => {
			gl.resize();
			gl.clear([0, 0, 0, 0], 1);
			gl.cullFace = FaceDirection.BACK;

			perspective(viewerFov, canvas.width / canvas.height, 1, 5, viewerProjectionMatrix);

			identity(viewerCameraMatrix);
			rotateY(viewerCameraMatrix, now * speed, viewerCameraMatrix);
			rotateX(viewerCameraMatrix, cameraRotationX, viewerCameraMatrix);
			translate(viewerCameraMatrix, [0, 0, cameraDistance], viewerCameraMatrix)

			invert(viewerCameraMatrix, viewerViewMatrix);

			multiply(viewerProjectionMatrix, viewerViewMatrix, viewerViewProjectionMatrix);

			planeVao.draw({
				"u_world": planeMatrix,
				"u_viewerViewProjection": viewerViewProjectionMatrix,
				"u_projectorViewProjection": projectorViewProjectionMatrix,
				"u_color": [1, 0, 0, 1],
				"u_texture": texture,
				"u_projectedTexture": projectedTexture
			});
			cubeVao.draw({
				"u_world": cubeMatrix,
				"u_viewerViewProjection": viewerViewProjectionMatrix,
				"u_projectorViewProjection": projectorViewProjectionMatrix,
				"u_color": [0, 1, 0, 1],
				"u_texture": texture,
				"u_projectedTexture": projectedTexture
			});
			frustumVao.draw({
				"u_world": frustumMatrix,
				"u_viewerViewProjection": viewerViewProjectionMatrix
			}, Primitive.LINES);
		};
	}, props);
};
