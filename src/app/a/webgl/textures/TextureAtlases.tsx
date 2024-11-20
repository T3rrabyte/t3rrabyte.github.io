"use client";

import {
	Context,
	ElementBuffer,
	Program,
	Texture2d,
	TextureFilter,
	VertexArray,
	VertexBuffer
} from "@lakuna/ugl";
import {
	createMatrix4Like,
	identity,
	invert,
	multiply,
	perspective,
	rotateX,
	rotateY,
	translate
} from "@lakuna/umath/Matrix4";
import type { Props } from "#Props";
import ReactCanvas from "@lakuna/react-canvas";
import domain from "#domain";

const vss = `\
#version 300 es

in vec4 a_position;
in vec2 a_texcoord;

uniform mat4 u_matrix;

out vec2 v_texcoord;

void main() {
	gl_Position = u_matrix * a_position;
	v_texcoord = a_texcoord;
}
`;

const fss = `\
#version 300 es

precision mediump float;

in vec2 v_texcoord;

uniform sampler2D u_texture;

out vec4 outColor;

void main() {
	outColor = texture(u_texture, v_texcoord);
}
`;

const positionData = new Float32Array([
	-1, 1, 1, -1, -1, 1, 1, -1, 1, 1, 1, 1, 1, 1, -1, 1, -1, -1, -1, -1, -1, -1,
	1, -1, -1, 1, -1, -1, -1, -1, -1, -1, 1, -1, 1, 1, 1, 1, 1, 1, -1, 1, 1, -1,
	-1, 1, 1, -1, -1, 1, -1, -1, 1, 1, 1, 1, 1, 1, 1, -1, -1, -1, 1, -1, -1, -1,
	1, -1, -1, 1, -1, 1
]);

const texcoordData = new Float32Array([
	0, 0, 0, 0.5, 0.333, 0.5, 0.333, 0, 0.333, 0, 0.333, 0.5, 0.666, 0.5, 0.666,
	0, 0.666, 0, 0.666, 0.5, 1, 0.5, 1, 0, 0, 0.5, 0, 1, 0.333, 1, 0.333, 0.5,
	0.333, 0.5, 0.333, 1, 0.666, 1, 0.666, 0.5, 0.666, 0.5, 0.666, 1, 1, 1, 1, 0.5
]);

const indexData = new Uint8Array([
	0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9, 10, 8, 10, 11, 12, 13, 14, 12, 14,
	15, 16, 17, 18, 16, 18, 19, 20, 21, 22, 20, 22, 23
]);

export default function TextureAtlases(props: Props<HTMLCanvasElement>) {
	return (
		<ReactCanvas
			init={(canvas) => {
				const gl = Context.get(canvas);

				const program = Program.fromSource(gl, vss, fss);

				const positionBuffer = new VertexBuffer(gl, positionData);
				const texcoordBuffer = new VertexBuffer(gl, texcoordData);
				const indexBuffer = new ElementBuffer(gl, indexData);

				const cubeVao = new VertexArray(
					program,
					{
						// eslint-disable-next-line camelcase
						a_position: positionBuffer,
						// eslint-disable-next-line camelcase
						a_texcoord: { size: 2, vbo: texcoordBuffer }
					},
					indexBuffer
				);

				const texture = Texture2d.fromImageUrl(
					gl,
					`${domain}/images/webgl-example-texture-atlas.png`
				);
				texture.minFilter = TextureFilter.NEAREST;
				texture.magFilter = TextureFilter.NEAREST;

				const proj = createMatrix4Like();
				const cam = createMatrix4Like();
				const view = createMatrix4Like();
				const viewProj = createMatrix4Like();
				const matrix = createMatrix4Like();
				identity(cam);
				translate(cam, [0, 0, 5], cam);
				invert(cam, view);

				return (now) => {
					gl.resize();
					gl.doCullFace = true;
					gl.doDepthTest = true;
					gl.clear();

					const w = canvas.width;
					const h = canvas.height;
					perspective(Math.PI / 4, w / (h || 1), 1, 10, proj);
					multiply(proj, view, viewProj);
					identity(matrix);
					rotateX(matrix, now * 0.0005, matrix);
					rotateY(matrix, now * 0.001, matrix);
					multiply(viewProj, matrix, matrix);

					// eslint-disable-next-line camelcase
					cubeVao.draw({ u_matrix: matrix, u_texture: texture });
				};
			}}
			{...props}
		/>
	);
}
