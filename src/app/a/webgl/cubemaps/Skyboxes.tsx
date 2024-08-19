"use client";

import {
	Context,
	Ebo,
	Program,
	TestFunction,
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
	setTranslation,
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

const skyboxVss = `\
#version 300 es

in vec4 a_position;

out vec4 v_position;

void main() {
	gl_Position = a_position;
	gl_Position.z = 1.0;

	v_position = a_position;
}
`;

const skyboxFss = `\
#version 300 es

precision mediump float;

in vec4 v_position;

uniform samplerCube u_texture;
uniform mat4 u_inverseViewDirProjMat;

out vec4 outColor;

void main() {
	vec4 t = u_inverseViewDirProjMat * v_position;
	vec3 skyboxNormal = normalize(t.xyz / t.w);
	outColor = texture(u_texture, skyboxNormal);
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
const planePositionData = new Float32Array([-1, 1, -1, -1, 1, -1, 1, 1]);
const planeIndexData = new Uint8Array([0, 1, 2, 0, 2, 3]);

export default function Skyboxes(props: Props<HTMLCanvasElement>) {
	return (
		<ReactCanvas
			init={(canvas) => {
				const gl = Context.get(canvas);

				const program = Program.fromSource(gl, vss, fss);
				const skyboxProgram = Program.fromSource(gl, skyboxVss, skyboxFss);

				const positionBuffer = new Vbo(gl, positionData);
				const normalBuffer = new Vbo(gl, normalData);
				const indexBuffer = new Ebo(gl, indexData);
				const planePositionBuffer = new Vbo(gl, planePositionData);
				const planeIndexBuffer = new Ebo(gl, planeIndexData);

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

				const skyboxVao = new Vao(
					skyboxProgram,
					// eslint-disable-next-line camelcase
					{ a_position: { size: 2, vbo: planePositionBuffer } },
					planeIndexBuffer
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

				const camMat = createMatrix4Like();
				const camPos = createVector3Like();
				const viewMat = createMatrix4Like();
				const viewDirMat = createMatrix4Like();
				const worldMat = createMatrix4Like();
				const projMat = createMatrix4Like();
				const viewProjMat = createMatrix4Like();
				const viewDirProjMat = createMatrix4Like();
				const inverseViewDirProjMat = createMatrix4Like();
				const normalMat = createMatrix3Like();

				return (now) => {
					gl.resize();
					gl.doCullFace = true;
					gl.doDepthTest = true;
					gl.depthFunction = TestFunction.LEQUAL;
					gl.clear();

					const w = canvas.width;
					const h = canvas.height;
					perspective(Math.PI / 4, w / (h || 1), 1, 10, projMat);
					identity(camMat);
					rotateY(camMat, now * 0.0001, camMat);
					translate(camMat, [0, 0, 5], camMat);
					getTranslation(camMat, camPos);
					invert(camMat, viewMat);
					setTranslation(viewMat, [0, 0, 0], viewDirMat);
					multiply(projMat, viewMat, viewProjMat);
					multiply(projMat, viewDirMat, viewDirProjMat);
					invert(viewDirProjMat, inverseViewDirProjMat);
					identity(worldMat);
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

					skyboxVao.draw({
						// eslint-disable-next-line camelcase
						u_inverseViewDirProjMat: inverseViewDirProjMat,
						// eslint-disable-next-line camelcase
						u_texture: texture
					});
				};
			}}
			{...props}
		/>
	);
}
