"use client";

import {
	Context,
	Ebo,
	Primitive,
	Program,
	Texture2d,
	TextureFilter,
	TextureFormat,
	Vao,
	Vbo
} from "@lakuna/ugl";
import {
	createMatrix4Like,
	identity,
	invert,
	multiply,
	perspective,
	rotateX,
	rotateY,
	scale,
	translate
} from "@lakuna/umath/Matrix4";
import type { Props } from "#Props";
import ReactCanvas from "@lakuna/react-canvas";
import domain from "#domain";

const vss = `\
#version 300 es

in vec4 a_position;
in vec2 a_texcoord;

uniform mat4 u_world;
uniform mat4 u_viewProj;
uniform mat4 u_texMat;

out vec2 v_texcoord;
out vec4 v_projTexcoord;

void main() {
	vec4 worldPos = u_world * a_position;
	gl_Position = u_viewProj * worldPos;
	v_texcoord = a_texcoord;
	v_projTexcoord = u_texMat * worldPos;
}
`;

const fss = `\
#version 300 es

precision mediump float;

in vec2 v_texcoord;
in vec4 v_projTexcoord;

uniform vec4 u_color;
uniform sampler2D u_texture;
uniform sampler2D u_projTex;

out vec4 outColor;

void main() {
	vec2 projTexcoord = (v_projTexcoord.xyz / v_projTexcoord.w).xy;

	bool inProj = projTexcoord.x >= 0.0
		&& projTexcoord.x <= 1.0
		&& projTexcoord.y >= 0.0
		&& projTexcoord.y <= 1.0;
	
	vec4 projTexColor = texture(u_projTex, projTexcoord);
	vec4 texColor = texture(u_texture, v_texcoord) * u_color;
	outColor = inProj ? projTexColor : texColor;
}
`;

const solidVss = `\
#version 300 es

in vec4 a_position;

uniform mat4 u_world;
uniform mat4 u_viewProj;

void main() {
	gl_Position = u_viewProj * u_world * a_position;
}
`;

const solidFss = `\
#version 300 es

precision mediump float;

out vec4 outColor;

void main() {
	outColor = vec4(0, 0, 0, 1);
}
`;

const planePositionData = new Float32Array([-1, 1, -1, -1, 1, -1, 1, 1]);
const planeTexcoordData = new Float32Array([0, 0, 0, 10, 10, 10, 10, 0]);
const planeIndexData = new Uint8Array([0, 1, 2, 0, 2, 3]);
const cubePositionData = new Float32Array([
	-1, 1, 1, -1, -1, 1, 1, -1, 1, 1, 1, 1, 1, 1, -1, 1, -1, -1, -1, -1, -1, -1,
	1, -1, -1, 1, -1, -1, -1, -1, -1, -1, 1, -1, 1, 1, 1, 1, 1, 1, -1, 1, 1, -1,
	-1, 1, 1, -1, -1, 1, -1, -1, 1, 1, 1, 1, 1, 1, 1, -1, -1, -1, 1, -1, -1, -1,
	1, -1, -1, 1, -1, 1
]);
const cubeTexcoordData = new Float32Array([
	0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0,
	0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0
]);
const cubeIndexData = new Uint8Array([
	0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9, 10, 8, 10, 11, 12, 13, 14, 12, 14,
	15, 16, 17, 18, 16, 18, 19, 20, 21, 22, 20, 22, 23
]);
const frustumPositionData = new Float32Array([
	-1, -1, -1, 1, -1, -1, -1, 1, -1, 1, 1, -1, -1, -1, 1, 1, -1, 1, -1, 1, 1, 1,
	1, 1
]);
const frustumIndexData = new Uint8Array([
	0, 1, 1, 3, 3, 2, 2, 0, 4, 5, 5, 7, 7, 6, 6, 4, 0, 4, 1, 5, 3, 7, 2, 6
]);

export default function ProjectionMapping(props: Props<HTMLCanvasElement>) {
	return (
		<ReactCanvas
			init={(canvas) => {
				const gl = new Context(canvas);

				const program = Program.fromSource(gl, vss, fss);
				const solidProgram = Program.fromSource(gl, solidVss, solidFss);

				const planePositionBuffer = new Vbo(gl, planePositionData);
				const planeTexcoordBuffer = new Vbo(gl, planeTexcoordData);
				const planeIndexBuffer = new Ebo(gl, planeIndexData);
				const cubePositionBuffer = new Vbo(gl, cubePositionData);
				const cubeTexcoordBuffer = new Vbo(gl, cubeTexcoordData);
				const cubeIndexBuffer = new Ebo(gl, cubeIndexData);
				const frustumPositionBuffer = new Vbo(gl, frustumPositionData);
				const frustumIndexBuffer = new Ebo(gl, frustumIndexData);

				const planeVao = new Vao(
					program,
					{
						// eslint-disable-next-line camelcase
						a_position: { size: 2, vbo: planePositionBuffer },
						// eslint-disable-next-line camelcase
						a_texcoord: { size: 2, vbo: planeTexcoordBuffer }
					},
					planeIndexBuffer
				);
				const cubeVao = new Vao(
					program,
					{
						// eslint-disable-next-line camelcase
						a_position: cubePositionBuffer,
						// eslint-disable-next-line camelcase
						a_texcoord: { size: 2, vbo: cubeTexcoordBuffer }
					},
					cubeIndexBuffer
				);
				const frustumVao = new Vao(
					solidProgram,
					// eslint-disable-next-line camelcase
					{ a_position: frustumPositionBuffer },
					frustumIndexBuffer
				);

				const texture = new Texture2d(gl);
				texture.format = TextureFormat.LUMINANCE;
				texture.setMip(
					new Uint8Array([0x80, 0xc0, 0xc0, 0x80]),
					void 0,
					void 0,
					[0, 0, 2, 2]
				);
				texture.minFilter = TextureFilter.NEAREST;
				texture.magFilter = TextureFilter.NEAREST;
				const projTex = Texture2d.fromImageUrl(
					gl,
					`${domain}/images/webgl-example-texture.png`
				);

				const planeMat = createMatrix4Like();
				identity(planeMat);
				rotateX(planeMat, (Math.PI * 3) / 2, planeMat);
				const cubeMat = createMatrix4Like();
				identity(cubeMat);
				scale(cubeMat, [0.1, 0.1, 0.1], cubeMat);
				translate(cubeMat, [1, 2, 1], cubeMat);
				const projProjMat = createMatrix4Like();
				perspective(Math.PI / 10, 1, 1, 3, projProjMat);
				const projCamMat = createMatrix4Like();
				identity(projCamMat);
				rotateX(projCamMat, -Math.PI / 5, projCamMat);
				translate(projCamMat, [0, 0, 2], projCamMat);
				const projViewMat = createMatrix4Like();
				invert(projCamMat, projViewMat);
				const projViewProjMat = createMatrix4Like();
				multiply(projProjMat, projViewMat, projViewProjMat);
				const texMat = createMatrix4Like();
				identity(texMat);
				translate(texMat, [0.5, 0.5, 0.5], texMat);
				scale(texMat, [0.5, 0.5, 0.5], texMat);
				multiply(texMat, projViewProjMat, texMat);
				const frustumMat = createMatrix4Like();
				invert(projViewProjMat, frustumMat);
				const camProjMat = createMatrix4Like();
				const camCamMat = createMatrix4Like();
				const camViewMat = createMatrix4Like();
				const camViewProjMat = createMatrix4Like();

				return (now) => {
					gl.resize();
					gl.doCullFace = true;
					gl.doDepthTest = true;
					gl.clear();

					const w = canvas.width;
					const h = canvas.height;
					perspective(Math.PI / 4, w / (h || 1), 0.1, 5, camProjMat);
					identity(camCamMat);
					rotateY(camCamMat, now * 0.0003, camCamMat);
					rotateX(camCamMat, -Math.PI / 5, camCamMat);
					translate(camCamMat, [0, 0, 2], camCamMat);
					invert(camCamMat, camViewMat);
					multiply(camProjMat, camViewMat, camViewProjMat);

					planeVao.draw({
						// eslint-disable-next-line camelcase
						u_color: [1, 0, 0, 1],
						// eslint-disable-next-line camelcase
						u_projTex: projTex,
						// eslint-disable-next-line camelcase
						u_texMat: texMat,
						// eslint-disable-next-line camelcase
						u_texture: texture,
						// eslint-disable-next-line camelcase
						u_viewProj: camViewProjMat,
						// eslint-disable-next-line camelcase
						u_world: planeMat
					});

					cubeVao.draw({
						// eslint-disable-next-line camelcase
						u_color: [0, 1, 0, 1],
						// eslint-disable-next-line camelcase
						u_projTex: projTex,
						// eslint-disable-next-line camelcase
						u_texMat: texMat,
						// eslint-disable-next-line camelcase
						u_texture: texture,
						// eslint-disable-next-line camelcase
						u_viewProj: camViewProjMat,
						// eslint-disable-next-line camelcase
						u_world: cubeMat
					});

					frustumVao.draw(
						// eslint-disable-next-line camelcase
						{ u_viewProj: camViewProjMat, u_world: frustumMat },
						Primitive.LINES
					);
				};
			}}
			{...props}
		/>
	);
}
