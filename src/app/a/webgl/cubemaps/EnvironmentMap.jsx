"use client";

import { AttributeState, Buffer, Color, Program, Context, VAO, FaceDirection, Cubemap, TextureMinFilter, TextureMagFilter } from "@lakuna/ugl";
import { mat4, vec3 } from "gl-matrix";
import AnimatedCanvas from "../AnimatedCanvas";
import domain from "site/domain";

const vss = `#version 300 es
in vec4 a_position;
in vec3 a_normal;
uniform mat4 u_viewProjMat;
uniform mat4 u_worldMat;
out vec3 v_worldPos;
out vec3 v_worldNormal;
void main() {
	gl_Position = u_viewProjMat * u_worldMat * a_position;
	v_worldPos = (u_worldMat * a_position).xyz;
	v_worldNormal = mat3(u_worldMat) * a_normal;
}`;

const fss = `#version 300 es
precision highp float;
in vec3 v_worldPos;
in vec3 v_worldNormal;
uniform samplerCube u_texture;
uniform vec3 u_worldCamPos;
out vec4 outColor;
void main() {
	vec3 worldNormal = normalize(v_worldNormal);
	vec3 eyeToSurfaceDir = normalize(v_worldPos - u_worldCamPos);
	vec3 dir = reflect(eyeToSurfaceDir, worldNormal);
	outColor = texture(u_texture, dir);
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

const normalBufferData = new Float32Array([
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

const pxUrl = `${domain}images/webgl-example-environment-map/px.png`;
const nxUrl = `${domain}images/webgl-example-environment-map/nx.png`;
const pyUrl = `${domain}images/webgl-example-environment-map/py.png`;
const nyUrl = `${domain}images/webgl-example-environment-map/ny.png`;
const pzUrl = `${domain}images/webgl-example-environment-map/pz.png`;
const nzUrl = `${domain}images/webgl-example-environment-map/nz.png`;

const transparent = new Color(0, 0, 0, 0);

export default function EnvironmentMap(props) {
	return AnimatedCanvas((canvas) => {
		const gl = new Context(canvas);

		const program = Program.fromSource(gl, vss, fss);

		const positionBuffer = new Buffer(gl, positionBufferData);
		const normalBuffer = new Buffer(gl, normalBufferData);

		const vao = new VAO(program, [
			new AttributeState("a_position", positionBuffer),
			new AttributeState("a_normal", normalBuffer)
		], indexData);

		const cubemap = Cubemap.fromImageUrls(gl, pxUrl, nxUrl, pyUrl, nyUrl, pzUrl, nzUrl);
		cubemap.minFilter = TextureMinFilter.LINEAR_MIPMAP_LINEAR;
		cubemap.magFilter = TextureMagFilter.LINEAR;

		const camPos = vec3.create();

		const projMat = mat4.create();
		const camMat = mat4.create();
		const viewMat = mat4.create();
		const viewProjMat = mat4.create();
		const mat = mat4.create();

		return function render(now) {
			gl.clear(transparent, 1);
			gl.resize();
			gl.cullFace = FaceDirection.BACK;

			mat4.perspective(projMat, Math.PI / 4, canvas.clientWidth / canvas.clientHeight, 1, 1000);

			vec3.zero(camPos);
			mat4.identity(camMat);
			mat4.rotateY(camMat, camMat, 0.0002 * now);
			mat4.translate(camMat, camMat, [0, 0, 5]);
			vec3.transformMat4(camPos, camPos, camMat);
			mat4.targetTo(camMat, camPos, [0, 0, 0], [0, 1, 0]);

			mat4.invert(viewMat, camMat);

			mat4.multiply(viewProjMat, projMat, viewMat);

			mat4.identity(mat);
			mat4.rotateZ(mat, mat, 0.0001 * now);

			vao.draw({
				"u_viewProjMat": viewProjMat,
				"u_worldMat": mat,
				"u_texture": cubemap,
				"u_worldCamPos": camPos
			});
		}
	}, props);
}
