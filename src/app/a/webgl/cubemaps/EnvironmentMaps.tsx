"use client";

import {
	Context,
	Ebo,
	Program,
	TextureCubemap,
	TextureFilter,
	Vao,
	Vbo
} from "@lakuna/ugl";
import { createMatrix3Like, normalFromMatrix4 } from "@lakuna/umath/Matrix3";
import {
	createMatrix4Like,
	getTranslation,
	identity,
	invert,
	multiply,
	perspective,
	rotateY,
	rotateZ,
	translate
} from "@lakuna/umath/Matrix4";
import type { Props } from "#Props";
import ReactCanvas from "@lakuna/react-canvas";
import { createVector3Like } from "@lakuna/umath/Vector3";
import domain from "#domain";

const vss = `\
#version 300 es

in vec4 a_position;
in vec3 a_normal;

uniform mat4 u_viewProjMat;
uniform mat4 u_worldMat;
uniform mat3 u_normalMat;

out vec3 v_worldPos;
out vec3 v_normal;

void main() {
	vec4 worldPos = u_worldMat * a_position;
	gl_Position = u_viewProjMat * worldPos;
	v_worldPos = worldPos.xyz;
	v_normal = u_normalMat * a_normal;
}
`;

const fss = `\
#version 300 es

precision mediump float;

in vec3 v_worldPos;
in vec3 v_normal;

uniform samplerCube u_texture;
uniform vec3 u_camPos;

out vec4 outColor;

void main() {
	vec3 normal = normalize(v_normal);
	vec3 camToSurfaceDir = normalize(v_worldPos - u_camPos);
	vec3 reflectDir = reflect(camToSurfaceDir, normal);
	outColor = texture(u_texture, reflectDir);
}
`;

const positionData = new Float32Array([
	-1, 1, 1, -1, -1, 1, 1, -1, 1, 1, 1, 1, 1, 1, -1, 1, -1, -1, -1, -1, -1, -1,
	1, -1, -1, 1, -1, -1, -1, -1, -1, -1, 1, -1, 1, 1, 1, 1, 1, 1, -1, 1, 1, -1,
	-1, 1, 1, -1, -1, 1, -1, -1, 1, 1, 1, 1, 1, 1, 1, -1, -1, -1, 1, -1, -1, -1,
	1, -1, -1, 1, -1, 1
]);
const normalData = new Float32Array([
	0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1,
	-1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0,
	1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0
]);
const indexData = new Uint8Array([
	0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9, 10, 8, 10, 11, 12, 13, 14, 12, 14,
	15, 16, 17, 18, 16, 18, 19, 20, 21, 22, 20, 22, 23
]);

export default function EnvironmentMaps(props: Props<HTMLCanvasElement>) {
	return (
		<ReactCanvas
			init={(canvas) => {
				const gl = Context.get(canvas);

				const program = Program.fromSource(gl, vss, fss);

				const positionBuffer = new Vbo(gl, positionData);
				const normalBuffer = new Vbo(gl, normalData);
				const indexBuffer = new Ebo(gl, indexData);

				const vao = new Vao(
					program,
					{
						// eslint-disable-next-line camelcase
						a_normal: normalBuffer,
						// eslint-disable-next-line camelcase
						a_position: positionBuffer
					},
					indexBuffer
				);

				const texture = TextureCubemap.fromImageUrls(
					gl,
					`${domain}/images/webgl-example-environment-map/px.png`,
					`${domain}/images/webgl-example-environment-map/nx.png`,
					`${domain}/images/webgl-example-environment-map/py.png`,
					`${domain}/images/webgl-example-environment-map/ny.png`,
					`${domain}/images/webgl-example-environment-map/pz.png`,
					`${domain}/images/webgl-example-environment-map/nz.png`
				);
				texture.minFilter = TextureFilter.LINEAR_MIPMAP_LINEAR;
				texture.magFilter = TextureFilter.LINEAR;

				const camMat = identity(createMatrix4Like());
				translate(camMat, [0, 0, 5], camMat);
				const camPos = getTranslation(camMat, createVector3Like());
				const viewMat = invert(camMat, createMatrix4Like());
				const worldMat = createMatrix4Like();
				const projMat = createMatrix4Like();
				const viewProjMat = createMatrix4Like();
				const normalMat = createMatrix3Like();

				return (now) => {
					gl.resize();
					gl.doCullFace = true;
					gl.doDepthTest = true;
					gl.clear();

					const w = canvas.width;
					const h = canvas.height;
					perspective(Math.PI / 4, w / (h || 1), 1, 10, projMat);
					multiply(projMat, viewMat, viewProjMat);
					identity(worldMat);
					rotateY(worldMat, now * 0.0001, worldMat);
					rotateZ(worldMat, now * 0.0002, worldMat);
					normalFromMatrix4(worldMat, normalMat);

					vao.draw({
						// eslint-disable-next-line camelcase
						u_camPos: camPos,
						// eslint-disable-next-line camelcase
						u_normalMat: normalMat,
						// eslint-disable-next-line camelcase
						u_texture: texture,
						// eslint-disable-next-line camelcase
						u_viewProjMat: viewProjMat,
						// eslint-disable-next-line camelcase
						u_worldMat: worldMat
					});
				};
			}}
			{...props}
		/>
	);
}
