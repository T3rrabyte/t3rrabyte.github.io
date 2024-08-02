"use client";

import {
	Context,
	Ebo,
	Face,
	Framebuffer,
	FramebufferAttachment,
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

const vss = `\
#version 300 es

in vec4 a_position;
in vec2 a_texcoord;

uniform mat4 u_viewProjMat;
uniform mat4 u_worldMat;
uniform mat4 u_texMat;

out vec2 v_texcoord;
out vec4 v_projTexcoord;

void main() {
	vec4 worldPos = u_worldMat * a_position;
	gl_Position = u_viewProjMat * worldPos;
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
uniform sampler2D u_projTexture;
uniform float u_bias;

out vec4 outColor;

void main() {
	vec3 projTexcoord = v_projTexcoord.xyz / v_projTexcoord.w;
	float depth = projTexcoord.z + u_bias;

	bool inShadow = projTexcoord.x >= 0.0
		&& projTexcoord.x <= 1.0
		&& projTexcoord.y >= 0.0
		&& projTexcoord.y <= 1.0;

	float projDepth = texture(u_projTexture, projTexcoord.xy).r;
	float shadowLight = inShadow && projDepth <= depth ? 0.0 : 1.0;

	outColor = texture(u_texture, v_texcoord) * u_color;
	outColor.rgb *= shadowLight;
}
`;

const solidVss = `\
#version 300 es

in vec4 a_position;

uniform mat4 u_worldMat;
uniform mat4 u_viewProjMat;

void main() {
	gl_Position = u_viewProjMat * u_worldMat * a_position;
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
const planePositionData = new Float32Array([-1, 1, -1, -1, 1, -1, 1, 1]);
const planeTexcoordData = new Float32Array([0, 0, 0, 10, 10, 10, 10, 0]);
const planeIndexData = new Uint8Array([0, 1, 2, 0, 2, 3]);
const frustumPositionData = new Float32Array([
	-1, -1, -1, 1, -1, -1, -1, 1, -1, 1, 1, -1, -1, -1, 1, 1, -1, 1, -1, 1, 1, 1,
	1, 1
]);
const frustumIndexData = new Uint8Array([
	0, 1, 1, 3, 3, 2, 2, 0, 4, 5, 5, 7, 7, 6, 6, 4, 0, 4, 1, 5, 3, 7, 2, 6
]);

export default function ShadowAcne(props: Props<HTMLCanvasElement>) {
	return (
		<ReactCanvas
			init={(canvas) => {
				const gl = new Context(canvas);

				const program = Program.fromSource(gl, vss, fss);
				const solidProgram = Program.fromSource(gl, solidVss, solidFss);

				const cubePositionBuffer = new Vbo(gl, cubePositionData);
				const cubeTexcoordBuffer = new Vbo(gl, cubeTexcoordData);
				const cubeIndexBuffer = new Ebo(gl, cubeIndexData);
				const planePositionBuffer = new Vbo(gl, planePositionData);
				const planeTexcoordBuffer = new Vbo(gl, planeTexcoordData);
				const planeIndexBuffer = new Ebo(gl, planeIndexData);
				const frustumPositionBuffer = new Vbo(gl, frustumPositionData);
				const frustumIndexBuffer = new Ebo(gl, frustumIndexData);

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

				const solidCubeVao = new Vao(
					solidProgram,
					// eslint-disable-next-line camelcase
					{ a_position: cubePositionBuffer },
					cubeIndexBuffer
				);

				const solidPlaneVao = new Vao(
					solidProgram,
					// eslint-disable-next-line camelcase
					{ a_position: { size: 2, vbo: planePositionBuffer } },
					planeIndexBuffer
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
					0,
					void 0,
					[0, 0, 2, 2]
				);
				texture.minFilter = TextureFilter.NEAREST;
				texture.magFilter = TextureFilter.NEAREST;

				const projTexture = new Texture2d(gl);
				projTexture.format = TextureFormat.DEPTH_COMPONENT32F;
				projTexture.setMip(void 0, 0, void 0, [0, 0, 0x400, 0x400]);
				projTexture.minFilter = TextureFilter.NEAREST;
				projTexture.magFilter = TextureFilter.NEAREST;

				const framebuffer = new Framebuffer(gl);
				framebuffer.attach(FramebufferAttachment.Depth, projTexture);

				const planeMat = identity(createMatrix4Like());
				rotateX(planeMat, (Math.PI * 3) / 2, planeMat);
				const cubeMat = identity(createMatrix4Like());
				scale(cubeMat, [0.1, 0.1, 0.1], cubeMat);
				translate(cubeMat, [1, 2, 1], cubeMat);
				const lightProjMat = perspective(
					Math.PI / 10,
					1,
					1,
					3,
					createMatrix4Like()
				);
				const lightCamMat = identity(createMatrix4Like());
				rotateX(lightCamMat, -Math.PI / 5, lightCamMat);
				translate(lightCamMat, [0, 0, 2], lightCamMat);
				const lightViewMat = invert(lightCamMat, createMatrix4Like());
				const lightViewProjMat = multiply(
					lightProjMat,
					lightViewMat,
					createMatrix4Like()
				);
				const texMat = identity(createMatrix4Like());
				translate(texMat, [0.5, 0.5, 0.5], texMat);
				scale(texMat, [0.5, 0.5, 0.5], texMat);
				multiply(texMat, lightViewProjMat, texMat);
				const frustumMat = invert(lightViewProjMat, createMatrix4Like());
				const projMat = createMatrix4Like();
				const camMat = createMatrix4Like();
				const viewMat = createMatrix4Like();
				const viewProjMat = createMatrix4Like();

				return (now) => {
					gl.fitDrawingBuffer();

					const w = canvas.width;
					const h = canvas.height;
					perspective(Math.PI / 4, w / (h || 1), 0.1, 5, projMat);
					identity(camMat);
					rotateY(camMat, now * 0.0003, camMat);
					rotateX(camMat, -Math.PI / 5, camMat);
					translate(camMat, [0, 0, 2], camMat);
					invert(camMat, viewMat);
					multiply(projMat, viewMat, viewProjMat);

					gl.fitViewport(framebuffer);
					gl.doCullFace = true;
					gl.cullFace = Face.FRONT;
					gl.doDepthTest = true;
					gl.clear(true, true, false, framebuffer);

					solidPlaneVao.draw(
						// eslint-disable-next-line camelcase
						{ u_viewProjMat: lightViewProjMat, u_worldMat: planeMat },
						void 0,
						void 0,
						framebuffer
					);

					solidCubeVao.draw(
						// eslint-disable-next-line camelcase
						{ u_viewProjMat: lightViewProjMat, u_worldMat: cubeMat },
						void 0,
						void 0,
						framebuffer
					);

					gl.fitViewport();
					gl.doCullFace = true;
					gl.cullFace = Face.BACK;
					gl.doDepthTest = true;
					gl.clear();

					planeVao.draw({
						// eslint-disable-next-line camelcase
						u_bias: 0.001,
						// eslint-disable-next-line camelcase
						u_color: [1, 0, 0, 1],
						// eslint-disable-next-line camelcase
						u_projTexture: projTexture,
						// eslint-disable-next-line camelcase
						u_texMat: texMat,
						// eslint-disable-next-line camelcase
						u_texture: texture,
						// eslint-disable-next-line camelcase
						u_viewProjMat: viewProjMat,
						// eslint-disable-next-line camelcase
						u_worldMat: planeMat
					});

					cubeVao.draw({
						// eslint-disable-next-line camelcase
						u_bias: 0.002,
						// eslint-disable-next-line camelcase
						u_color: [0, 1, 0, 1],
						// eslint-disable-next-line camelcase
						u_projTexture: projTexture,
						// eslint-disable-next-line camelcase
						u_texMat: texMat,
						// eslint-disable-next-line camelcase
						u_texture: texture,
						// eslint-disable-next-line camelcase
						u_viewProjMat: viewProjMat,
						// eslint-disable-next-line camelcase
						u_worldMat: cubeMat
					});

					frustumVao.draw(
						{
							// eslint-disable-next-line camelcase
							u_viewProjMat: viewProjMat,
							// eslint-disable-next-line camelcase
							u_worldMat: frustumMat
						},
						Primitive.LINES
					);
				};
			}}
			{...props}
		/>
	);
}
