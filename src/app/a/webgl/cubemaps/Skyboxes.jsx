"use client";

import { Context, Buffer, BufferInfo, Program, VAO, FaceDirection, Cubemap, TextureMinFilter, TextureMagFilter, TestFunction } from "@lakuna/ugl";
import { identity, invert, multiply, perspective, translate, rotateZ, rotateY, getTranslation, copy } from "@lakuna/umath/Matrix4";
import { normalFromMatrix4 } from "@lakuna/umath/Matrix3";
import AnimatedCanvas from "#app/a/webgl/AnimatedCanvas.jsx";
import domain from "#domain";

const vss = `\
#version 300 es

in vec4 a_position;
in vec3 a_normal;

uniform mat4 u_viewProjection;
uniform mat4 u_world;
uniform mat3 u_normal;

out vec3 v_surfacePosition;
out vec3 v_normal;

void main() {
	gl_Position = u_viewProjection * u_world * a_position;
	v_surfacePosition = (u_world * a_position).xyz;
	v_normal = u_normal * a_normal;
}`;

const fss = `\
#version 300 es

precision highp float;

in vec3 v_surfacePosition;
in vec3 v_normal;

uniform samplerCube u_texture;
uniform vec3 u_cameraPosition;

out vec4 outColor;

void main() {
	vec3 normal = normalize(v_normal);
	vec3 cameraToSurfaceDirection = normalize(v_surfacePosition - u_cameraPosition);
	vec3 reflectionDirection = reflect(cameraToSurfaceDirection, normal);
	outColor = texture(u_texture, reflectionDirection);
}`;

const skyboxVss = `\
#version 300 es

in vec4 a_position;

out vec4 v_position;

void main() {
	gl_Position = a_position;
	gl_Position.z = 1.0;

	v_position = a_position;
}`;

const skyboxFss = `\
#version 300 es

precision highp float;

in vec4 v_position;

uniform samplerCube u_texture;
uniform mat4 u_inverseViewDirectionProjection;

out vec4 outColor;

void main() {
	vec4 t = u_inverseViewDirectionProjection * v_position;
	vec3 skyboxNormal = normalize(t.xyz / t.w);
	outColor = texture(u_texture, skyboxNormal);
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

const normalData = new Float32Array([
	// Front
	0, 0, 1,
	0, 0, 1,
	0, 0, 1,
	0, 0, 1,

	// Back
	0, 0, -1,
	0, 0, -1,
	0, 0, -1,
	0, 0, -1,

	// Left
	-1, 0, 0,
	-1, 0, 0,
	-1, 0, 0,
	-1, 0, 0,

	// Right
	1, 0, 0,
	1, 0, 0,
	1, 0, 0,
	1, 0, 0,

	// Top
	0, 1, 0,
	0, 1, 0,
	0, 1, 0,
	0, 1, 0,

	// Bottom
	0, -1, 0,
	0, -1, 0,
	0, -1, 0,
	0, -1, 0
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

const planePositionData = new Float32Array([
	-1, 1,
	-1, -1,
	1, -1,
	1, 1
]);

const planeIndices = new Uint8Array([
	0, 1, 2,
	0, 2, 3
]);

const pxUrl = `${domain}images/webgl-example-environment-map/px.png`;
const nxUrl = `${domain}images/webgl-example-environment-map/nx.png`;
const pyUrl = `${domain}images/webgl-example-environment-map/py.png`;
const nyUrl = `${domain}images/webgl-example-environment-map/ny.png`;
const pzUrl = `${domain}images/webgl-example-environment-map/pz.png`;
const nzUrl = `${domain}images/webgl-example-environment-map/nz.png`;

export default (props) => {
	return AnimatedCanvas((canvas) => {
		const gl = new Context(canvas);
		const program = Program.fromSource(gl, vss, fss);
		const skyboxProgram = Program.fromSource(gl, skyboxVss, skyboxFss);

		const positionBuffer = new Buffer(gl, positionData);
		const normalBuffer = new Buffer(gl, normalData);
		const planeBuffer = new Buffer(gl, planePositionData);
		const vao = new VAO(program, [
			new BufferInfo("a_position", positionBuffer),
			new BufferInfo("a_normal", normalBuffer)
		], indices);
		const planeVao = new VAO(skyboxProgram, [
			new BufferInfo("a_position", planeBuffer, 2)
		], planeIndices);

		const texture = Cubemap.fromImageUrls(gl, pxUrl, nxUrl, pyUrl, nyUrl, pzUrl, nzUrl);
		texture.minFilter = TextureMinFilter.LINEAR_MIPMAP_LINEAR;
		texture.magFilter = TextureMagFilter.LINEAR;

		const cameraMatrix = new Float32Array(16);
		const viewMatrix = new Float32Array(16);
		const viewDirectionMatrix = new Float32Array(16);
		const cameraPosition = new Float32Array(3);
		const matrix = new Float32Array(16);
		const projectionMatrix = new Float32Array(16);
		const viewProjectionMatrix = new Float32Array(16);
		const viewDirectionProjectionMatrix = new Float32Array(16);
		const inverseViewDirectionProjectionMatrix = new Float32Array(16);
		const normalMatrix = new Float32Array(9);

		return (now) => {
			gl.resize();
			gl.clear([0, 0, 0, 0], 1);
			gl.cullFace = FaceDirection.BACK;
			gl.depthFunction = TestFunction.LEQUAL;

			perspective(Math.PI / 4, canvas.width / canvas.height, 1, 10, projectionMatrix);

			identity(cameraMatrix);
			rotateY(cameraMatrix, now * 0.0001, cameraMatrix);
			translate(cameraMatrix, [0, 0, 5], cameraMatrix);

			getTranslation(cameraMatrix, cameraPosition);

			invert(cameraMatrix, viewMatrix);

			copy(viewMatrix, viewDirectionMatrix);
			viewDirectionMatrix[12] = 0;
			viewDirectionMatrix[13] = 0;
			viewDirectionMatrix[14] = 0;

			multiply(projectionMatrix, viewMatrix, viewProjectionMatrix);

			multiply(projectionMatrix, viewDirectionMatrix, viewDirectionProjectionMatrix);

			invert(viewDirectionProjectionMatrix, inverseViewDirectionProjectionMatrix);

			identity(matrix);
			rotateZ(matrix, now * 0.0002, matrix);

			normalFromMatrix4(matrix, normalMatrix);

			vao.draw({
				"u_viewProjection": viewProjectionMatrix,
				"u_world": matrix,
				"u_normal": normalMatrix,
				"u_texture": texture,
				"u_cameraPosition": cameraPosition
			});
			planeVao.draw({
				"u_texture": texture,
				"u_inverseViewDirectionProjection": inverseViewDirectionProjectionMatrix
			});
		};
	}, props);
};
