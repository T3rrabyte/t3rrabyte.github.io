"use client";

import { Context, Ebo, Program, Texture2d, Vao, Vbo } from "@lakuna/ugl";
import { createMatrix4Like, identity, scale } from "@lakuna/umath/Matrix4";
import type { Props } from "#Props";
import ReactCanvas from "@lakuna/react-canvas";
import domain from "#domain";

const vss = `\
#version 300 es

in vec4 a_position;
in vec2 a_texcoord;

uniform mat4 u_world;

out vec2 v_texcoord;

void main() {
	gl_Position = u_world * a_position;
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

export default function Textures(props: Props<HTMLCanvasElement>) {
	return (
		<ReactCanvas
			init={(canvas) => {
				const gl = Context.get(canvas);

				const program = Program.fromSource(gl, vss, fss);

				const positionBuffer = new Vbo(gl, positionData);
				const texcoordBuffer = new Vbo(gl, texcoordData);
				const indexBuffer = new Ebo(gl, indexData);

				const planeVao = new Vao(
					program,
					{
						// eslint-disable-next-line camelcase
						a_position: { size: 2, vbo: positionBuffer },
						// eslint-disable-next-line camelcase
						a_texcoord: { size: 2, vbo: texcoordBuffer }
					},
					indexBuffer
				);

				const texture = Texture2d.fromImageUrl(
					gl,
					`${domain}/images/webgl-example-texture.png`
				);

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
					planeVao.draw({ u_texture: texture, u_world: matrix });
				};
			}}
			{...props}
		/>
	);
}
