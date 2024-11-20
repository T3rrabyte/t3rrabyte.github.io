"use client";

import {
	Context,
	ElementBuffer,
	Program,
	VertexArray,
	VertexBuffer
} from "@lakuna/ugl";
import { createMatrix3Like, normalFromMatrix4 } from "@lakuna/umath/Matrix3";
import {
	createMatrix4Like,
	getTranslation,
	identity,
	invert,
	multiply,
	perspective,
	rotateX,
	rotateY,
	translate
} from "@lakuna/umath/Matrix4";
import {
	createVector3Like,
	fromValues,
	normalize
} from "@lakuna/umath/Vector3";
import type { Props } from "#Props";
import ReactCanvas from "@lakuna/react-canvas";

const vss = `\
#version 300 es

in vec4 a_position;
in vec3 a_normal;

uniform mat4 u_viewProj;
uniform mat4 u_world;
uniform mat3 u_normalMat;
uniform vec3 u_lightPos;
uniform vec3 u_camPos;

out vec3 v_normal;
out vec3 v_dirToLight;
out vec3 v_dirToCam;

void main() {
	vec4 worldPos = u_world * a_position;
	gl_Position = u_viewProj * worldPos;

	v_normal = u_normalMat * a_normal;

	vec3 surfacePos = worldPos.xyz;
	v_dirToLight = u_lightPos - surfacePos;
	v_dirToCam = u_camPos - surfacePos;
}
`;

const fss = `\
#version 300 es

precision mediump float;

in vec3 v_normal;
in vec3 v_dirToLight;
in vec3 v_dirToCam;

uniform vec3 u_reverseLightDir;
uniform vec4 u_color;
uniform float u_ambientBrightness;
uniform float u_dullness;

out vec4 outColor;

void main() {
	vec3 normal = normalize(v_normal);
	vec3 dirToLight = normalize(v_dirToLight);
	vec3 dirToCam = normalize(v_dirToCam);
	vec3 halfVector = normalize(dirToLight + dirToCam);

	float diffuseBrightness = dot(normal, u_reverseLightDir);
	float specularBrightness = pow(max(dot(normal, halfVector), 0.0), u_dullness);
	float brightness = diffuseBrightness * 0.7 + specularBrightness + u_ambientBrightness;

	outColor = u_color;
	outColor.rgb *= brightness;
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

export default function PhongLighting(props: Props<HTMLCanvasElement>) {
	return (
		<ReactCanvas
			init={(canvas) => {
				const gl = Context.get(canvas);

				const program = Program.fromSource(gl, vss, fss);

				const positionBuffer = new VertexBuffer(gl, positionData);
				const normalBuffer = new VertexBuffer(gl, normalData);
				const indexBuffer = new ElementBuffer(gl, indexData);

				const cubeVao = new VertexArray(
					program,
					{
						// eslint-disable-next-line camelcase
						a_normal: normalBuffer,
						// eslint-disable-next-line camelcase
						a_position: positionBuffer
					},
					indexBuffer
				);

				const camMat = identity(createMatrix4Like());
				rotateX(camMat, -Math.PI / 5, camMat);
				translate(camMat, [0, 0, 5], camMat);
				const camPos = getTranslation(camMat, createVector3Like());
				const viewMat = invert(camMat, createMatrix4Like());
				const lightPos = fromValues(1, 1.4, 2, createVector3Like());
				const reverseLightDir = normalize(lightPos, createVector3Like());
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
					rotateY(worldMat, now * 0.001, worldMat);
					normalFromMatrix4(worldMat, normalMat);

					cubeVao.draw({
						// eslint-disable-next-line camelcase
						u_ambientBrightness: 0.1,
						// eslint-disable-next-line camelcase
						u_camPos: camPos,
						// eslint-disable-next-line camelcase
						u_color: [1, 1, 1, 1],
						// eslint-disable-next-line camelcase
						u_dullness: 8,
						// eslint-disable-next-line camelcase
						u_lightPos: lightPos,
						// eslint-disable-next-line camelcase
						u_normalMat: normalMat,
						// eslint-disable-next-line camelcase
						u_reverseLightDir: reverseLightDir,
						// eslint-disable-next-line camelcase
						u_viewProj: viewProjMat,
						// eslint-disable-next-line camelcase
						u_world: worldMat
					});
				};
			}}
			{...props}
		/>
	);
}
