"use client";

import { AttributeState, Buffer, Color, Program, Context, VAO, FaceDirection, Cubemap, Mipmap, CubemapMip } from "@lakuna/ugl";
import { mat4, vec3 } from "gl-matrix";
import AnimatedCanvas from "../AnimatedCanvas";

const vss = `#version 300 es
in vec4 a_position;
uniform mat4 u_viewProjMat;
uniform mat4 u_worldMat;
out vec3 v_normal;
void main() {
	mat4 mat = u_viewProjMat * u_worldMat;
	gl_Position = mat * a_position;
	v_normal = normalize(a_position.xyz);
}`;

const fss = `#version 300 es
precision highp float;
in vec3 v_normal;
uniform samplerCube u_texture;
out vec4 outColor;
void main() {
	outColor = texture(u_texture, normalize(v_normal));
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

const transparent = new Color(0, 0, 0, 0);

const camPos = vec3.set(vec3.create(), 0, 0, 5);

export default function SolidColorCubemap(props) {
	return AnimatedCanvas((canvas) => {
		const gl = new Context(canvas);

		const program = Program.fromSource(gl, vss, fss);

		const positionBuffer = new Buffer(gl, positionBufferData);

		const vao = new VAO(program, [
			new AttributeState("a_position", positionBuffer)
		], indexData);

		const cubemap = new Cubemap(
			gl,
			new Mipmap(new Map([
				[0, new CubemapMip(
					new Uint8Array([0xFF, 0x00, 0x00, 0xFF]),
					undefined,
					1
				)]
			])),
			new Mipmap(new Map([
				[0, new CubemapMip(
					new Uint8Array([0x00, 0xFF, 0x00, 0xFF]),
					undefined,
					1
				)]
			])),
			new Mipmap(new Map([
				[0, new CubemapMip(
					new Uint8Array([0x00, 0x00, 0xFF, 0xFF]),
					undefined,
					1
				)]
			])),
			new Mipmap(new Map([
				[0, new CubemapMip(
					new Uint8Array([0xFF, 0xFF, 0x00, 0xFF]),
					undefined,
					1
				)]
			])),
			new Mipmap(new Map([
				[0, new CubemapMip(
					new Uint8Array([0xFF, 0x00, 0xFF, 0xFF]),
					undefined,
					1
				)]
			])),
			new Mipmap(new Map([
				[0, new CubemapMip(
					new Uint8Array([0x00, 0xFF, 0xFF, 0xFF]),
					undefined,
					1
				)]
			]))
		)

		const projMat = mat4.create();
		const camMat = mat4.create();
		const viewMat = mat4.create();
		const viewProjMat = mat4.create();
		const mat = mat4.create();
		const invTransMat = mat4.create();

		return function render(now) {
			gl.clear(transparent, 1);
			gl.resize();
			gl.cullFace = FaceDirection.BACK;

			mat4.perspective(projMat, Math.PI / 4, canvas.clientWidth / canvas.clientHeight, 1, 1000);

			mat4.identity(camMat);
			mat4.translate(camMat, camMat, camPos);

			mat4.invert(viewMat, camMat);

			mat4.multiply(viewProjMat, projMat, viewMat);

			mat4.identity(mat);
			mat4.rotateX(mat, mat, Math.PI / 4);
			mat4.rotateY(mat, mat, 0.001 * now);

			mat4.invert(invTransMat, mat);
			mat4.transpose(invTransMat, invTransMat);

			vao.draw({
				"u_viewProjMat": viewProjMat,
				"u_worldMat": mat,
				"u_invTransWorldMat": invTransMat,
				"u_texture": cubemap
			});
		}
	}, props);
}
