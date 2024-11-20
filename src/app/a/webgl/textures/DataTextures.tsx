"use client";

import {
	Context,
	ElementBuffer,
	Program,
	Texture2d,
	TextureFilter,
	TextureFormat,
	VertexArray,
	VertexBuffer
} from "@lakuna/ugl";
import { createMatrix4Like, identity, scale } from "@lakuna/umath/Matrix4";
import type { Props } from "#Props";
import ReactCanvas from "@lakuna/react-canvas";

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

const positionData = new Float32Array([-1, 1, -1, -1, 1, -1, 1, 1]);

const texcoordData = new Float32Array([0, 0, 0, 1, 1, 1, 1, 0]);

const indexData = new Uint8Array([0, 1, 2, 0, 2, 3]);

export default function DataTextures(props: Props<HTMLCanvasElement>) {
	return (
		<ReactCanvas
			init={(canvas) => {
				const gl = Context.get(canvas);

				const program = Program.fromSource(gl, vss, fss);

				const positionBuffer = new VertexBuffer(gl, positionData);
				const texcoordBuffer = new VertexBuffer(gl, texcoordData);
				const indexBuffer = new ElementBuffer(gl, indexData);

				const quadVao = new VertexArray(
					program,
					{
						// eslint-disable-next-line camelcase
						a_position: { size: 2, vbo: positionBuffer },
						// eslint-disable-next-line camelcase
						a_texcoord: { size: 2, vbo: texcoordBuffer }
					},
					indexBuffer
				);

				const texture = new Texture2d(gl);
				texture.format = TextureFormat.R8;
				texture.setMip(
					new Uint8Array([0x80, 0x40, 0x80, 0x00, 0xc0, 0x00]),
					0,
					void 0,
					[0, 0, 3, 2]
				);
				texture.minFilter = TextureFilter.NEAREST;
				texture.magFilter = TextureFilter.NEAREST;

				const matrix = createMatrix4Like();

				return () => {
					gl.resize();
					gl.clear();

					identity(matrix);
					const w = canvas.width;
					const h = canvas.height;
					scale(
						matrix,
						w > h ? [h / (w || 1), 1, 1] : [1, w / (h || 1), 1],
						matrix
					);

					// eslint-disable-next-line camelcase
					quadVao.draw({ u_matrix: matrix, u_texture: texture });
				};
			}}
			{...props}
		/>
	);
}
