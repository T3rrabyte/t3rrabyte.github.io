"use client";

import {
	BlendFunction,
	BufferUsage,
	Context,
	ElementBuffer,
	Program,
	type Rectangle,
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
	rotateY,
	scale,
	translate
} from "@lakuna/umath/Matrix4";
import type { JSX } from "react";
import ReactCanvas from "@lakuna/react-canvas";
import domain from "#domain";

const vss = `\
#version 300 es

in vec4 a_position;
in vec2 a_texcoord;

uniform mat4 u_worldViewProjMat;

out vec2 v_texcoord;

void main() {
	gl_Position = u_worldViewProjMat * a_position;
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

const quadPosData = new Float32Array([-1, 1, -1, -1, 1, -1, 1, 1]);
const quadTexcoordData = new Float32Array([0, 0, 0, 1, 1, 1, 1, 0]);
const quadIndexData = new Uint8Array([0, 1, 2, 0, 2, 3]);

const glyphs = new Map<string, Rectangle>([
	["A", [0, 0, 8, 8]],
	["B", [8, 0, 8, 8]],
	["C", [16, 0, 8, 8]],
	["D", [24, 0, 8, 8]],
	["E", [32, 0, 8, 8]],
	["F", [40, 0, 8, 8]],
	["G", [48, 0, 8, 8]],
	["H", [56, 0, 8, 8]],
	["I", [0, 8, 8, 8]],
	["J", [8, 8, 8, 8]],
	["K", [16, 8, 8, 8]],
	["L", [24, 8, 8, 8]],
	["M", [32, 8, 8, 8]],
	["N", [40, 8, 8, 8]],
	["O", [48, 8, 8, 8]],
	["P", [56, 8, 8, 8]],
	["Q", [0, 16, 8, 8]],
	["R", [8, 16, 8, 8]],
	["S", [16, 16, 8, 8]],
	["T", [24, 16, 8, 8]],
	["U", [32, 16, 8, 8]],
	["V", [40, 16, 8, 8]],
	["W", [48, 16, 8, 8]],
	["X", [56, 16, 8, 8]],
	["Y", [0, 24, 8, 8]],
	["Z", [8, 24, 8, 8]],
	["0", [16, 24, 8, 8]],
	["1", [24, 24, 8, 8]],
	["2", [32, 24, 8, 8]],
	["3", [40, 24, 8, 8]],
	["4", [48, 24, 8, 8]],
	["5", [56, 24, 8, 8]],
	["6", [0, 32, 8, 8]],
	["7", [8, 32, 8, 8]],
	["8", [16, 32, 8, 8]],
	["9", [24, 32, 8, 8]],
	["-", [32, 32, 8, 8]],
	["×", [40, 32, 8, 8]],
	["!", [48, 32, 8, 8]],
	["©", [56, 32, 8, 8]]
]);

/** A texture atlas containing glyphs. */
interface GlyphTexture {
	/** The texture atlas. */
	texture: Texture2d;

	/** The list of glyphs in the texture atlas mapped to their locations within the texture atlas in pixel space. */
	glyphs: Map<string, Rectangle>;
}

/**
 * A quad that displays text. Width is always `1`, height is adjusted to maintain aspect ratio.
 * @public
 */
class TextQuad extends VertexArray {
	/**
	 * Create a text quad.
	 * @param texture - The glyph texture to use with the text quad.
	 */
	constructor(texture: GlyphTexture) {
		// Create shader program.
		const program = Program.fromSource(texture.texture.context, vss, fss);

		// Create VBOs.
		const posBuffer = new VertexBuffer(
			texture.texture.context,
			0,
			BufferUsage.DYNAMIC_DRAW
		);
		const texcoordBuffer = new VertexBuffer(
			texture.texture.context,
			0,
			BufferUsage.DYNAMIC_DRAW
		);

		// Create VAO.
		super(
			program,
			{
				// eslint-disable-next-line camelcase
				a_position: { size: 2, vbo: posBuffer },
				// eslint-disable-next-line camelcase
				a_texcoord: { size: 2, vbo: texcoordBuffer }
			},
			new ElementBuffer(texture.texture.context, 0, BufferUsage.DYNAMIC_DRAW)
		);

		this.texture = texture;
		this.widthCache = 0;
		this.heightCache = 0;
	}

	/** The glyph texture to use with this text quad. */
	private texture: GlyphTexture;

	/**
	 * The width of the text on this quad.
	 * @internal
	 */
	private widthCache: number;

	/** The width of the text on this quad. */
	public get width() {
		return this.widthCache;
	}

	/**
	 * The height of the text on this quad.
	 * @internal
	 */
	private heightCache: number;

	/** The height of the text on this quad. */
	public get height() {
		return this.heightCache;
	}

	/**
	 * Change the maximum length of the string that this text quad can display.
	 * @param length - The length of the string to display in characters.
	 * @throws `Error` if this vertex array's element buffer or either of this vertex array's expected vertex buffers is not defined.
	 * @returns The arrays to fill with indices, positions, and texture coordinates, respectively.
	 * @internal
	 */
	private resize(length: number): [Uint32Array, Float32Array, Float32Array] {
		if (!this.ebo) {
			throw new Error("Text quad element buffer not defined.");
		}

		const currentLength = this.ebo.data.byteLength / 4 / 6; // `Uint32Array` has 4 bytes per element. Letters each require 6 indices.
		if (currentLength < length) {
			// Current arrays are not large enough; return new ones.

			// Each letter requires 4 vertices.
			const vertexCount = length * 4;

			// Each letter requires 6 indices. Each vertex requires 2 positions and 2 texture coordinates.
			return [
				new Uint32Array(length * 6),
				new Float32Array(vertexCount * 2),
				new Float32Array(vertexCount * 2)
			];
		}

		const posBuffer = this.getAttribute("a_position");
		if (!posBuffer) {
			throw new Error("Text quad position vertex buffer not defined.");
		}

		const texcoordBuffer = this.getAttribute("a_texcoord");
		if (!texcoordBuffer) {
			throw new Error(
				"Text quad texture coordinate vertex buffer not defined."
			);
		}

		return [
			this.ebo.data as Uint32Array,
			posBuffer.data as Float32Array,
			texcoordBuffer.data as Float32Array
		];
	}

	/**
	 * The string displayed by this text quad.
	 * @internal
	 */
	private textCache?: string;

	/** The string displayed by this text quad. */
	public get text(): string {
		return this.textCache ?? "";
	}

	public set text(value: string) {
		// Ensure that the necessary attributes are present.
		const posAttr = this.getAttribute("a_position");
		if (!posAttr) {
			throw new Error("Position attribute is missing.");
		}

		const texcoordAttr = this.getAttribute("a_texcoord");
		if (!texcoordAttr) {
			throw new Error("Texture coordinate attribute is missing.");
		}

		if (!this.ebo) {
			throw new Error("Element buffer is missing.");
		}

		// Count the number of actual displayable characters in the string.
		let length = 0;
		for (const c of value) {
			if (this.texture.glyphs.has(c)) {
				length++;
			}
		}

		// Get buffer data, resizing buffers if necessary.
		const [indexData, posData, texData] = this.resize(length);

		// Fill buffers.
		let x = 0;
		let y = 0;
		let currentLineHeight = 0;
		let width = 0; // The maximum width of the texture.
		let j = 0; // Only increments for visible glyphs.
		for (const c of value) {
			// Skip if there is no character.
			if (!c) {
				continue;
			}

			// Get the character's glyph.
			const glyph = this.texture.glyphs.get(c);

			// Skip unknown characters.
			if (!glyph && c !== "\n") {
				continue;
			}

			// Add the character's glyph to the data. This configuration allows for visible newline characters.
			if (glyph) {
				// Positions.
				// eslint-disable-next-line prefer-destructuring
				posData[j * 4 * 2 + 0] = x;
				// eslint-disable-next-line prefer-destructuring
				posData[j * 4 * 2 + 1] = y + glyph[3];
				// eslint-disable-next-line prefer-destructuring
				posData[j * 4 * 2 + 2] = x;
				// eslint-disable-next-line prefer-destructuring
				posData[j * 4 * 2 + 3] = y;
				// eslint-disable-next-line prefer-destructuring
				posData[j * 4 * 2 + 4] = x + glyph[2];
				// eslint-disable-next-line prefer-destructuring
				posData[j * 4 * 2 + 5] = y;
				// eslint-disable-next-line prefer-destructuring
				posData[j * 4 * 2 + 6] = x + glyph[2];
				// eslint-disable-next-line prefer-destructuring
				posData[j * 4 * 2 + 7] = y + glyph[3];

				// Texture coordinates.
				// eslint-disable-next-line prefer-destructuring
				texData[j * 4 * 2 + 0] = glyph[0];
				// eslint-disable-next-line prefer-destructuring
				texData[j * 4 * 2 + 1] = glyph[1];
				// eslint-disable-next-line prefer-destructuring
				texData[j * 4 * 2 + 2] = glyph[0];
				// eslint-disable-next-line prefer-destructuring
				texData[j * 4 * 2 + 3] = glyph[1] + glyph[3];
				// eslint-disable-next-line prefer-destructuring
				texData[j * 4 * 2 + 4] = glyph[0] + glyph[2];
				// eslint-disable-next-line prefer-destructuring
				texData[j * 4 * 2 + 5] = glyph[1] + glyph[3];
				// eslint-disable-next-line prefer-destructuring
				texData[j * 4 * 2 + 6] = glyph[0] + glyph[2];
				// eslint-disable-next-line prefer-destructuring
				texData[j * 4 * 2 + 7] = glyph[1];

				// Indices.
				// eslint-disable-next-line prefer-destructuring
				indexData[j * 6 + 0] = j * 4 + 0;
				// eslint-disable-next-line prefer-destructuring
				indexData[j * 6 + 1] = j * 4 + 1;
				// eslint-disable-next-line prefer-destructuring
				indexData[j * 6 + 2] = j * 4 + 2;
				// eslint-disable-next-line prefer-destructuring
				indexData[j * 6 + 3] = j * 4 + 0;
				// eslint-disable-next-line prefer-destructuring
				indexData[j * 6 + 4] = j * 4 + 2;
				// eslint-disable-next-line prefer-destructuring
				indexData[j * 6 + 5] = j * 4 + 3;

				// Update cursor.
				j++;
				x += glyph[2];
				if (glyph[3] > currentLineHeight) {
					// eslint-disable-next-line prefer-destructuring
					currentLineHeight = glyph[3];
				}
			}

			// If the character is a newline, go to the next line.
			if (c === "\n") {
				width = Math.max(width, x);
				x = 0;
				y -= currentLineHeight;
				currentLineHeight = 0;
			}
		}

		width = Math.max(width, x);
		const height = Math.abs(y - currentLineHeight);

		// Scale data.
		for (let i = 0; i < j * 4 * 2; i += 2) {
			// Scale down so that texture coordinates are represented in texture space.
			const u = texData[i + 0];
			if (u) {
				texData[i + 0] = u / this.texture.texture.width;
			}

			const v = texData[i + 1];
			if (v) {
				texData[i + 1] = v / this.texture.texture.height;
			}
		}

		// Update the buffer data on the GPU.
		posAttr.data = posData;
		texcoordAttr.data = texData;
		this.ebo.data = indexData;

		// Update dimension information.
		this.widthCache = width;
		this.heightCache = height;
		this.textCache = value;
	}
}

export default function GlyphTextures(props: JSX.IntrinsicElements["canvas"]) {
	return (
		<ReactCanvas
			init={(canvas) => {
				const gl = Context.get(canvas);

				const program = Program.fromSource(gl, vss, fss);

				const quadPosBuffer = new VertexBuffer(gl, quadPosData);
				const quadTexcoordBuffer = new VertexBuffer(gl, quadTexcoordData);
				const quadIndexBuffer = new ElementBuffer(gl, quadIndexData);

				const quadVao = new VertexArray(
					program,
					{
						// eslint-disable-next-line camelcase
						a_position: { size: 2, vbo: quadPosBuffer },
						// eslint-disable-next-line camelcase
						a_texcoord: { size: 2, vbo: quadTexcoordBuffer }
					},
					quadIndexBuffer
				);

				const texture = Texture2d.fromImageUrl(
					gl,
					`${domain}/images/webgl-example-texture.png`
				);

				// Public domain texture originally from https://opengameart.org/content/8x8-font-chomps-wacky-worlds-beta.
				const glyphTexture = Texture2d.fromImageUrl(
					gl,
					`${domain}/images/webgl-example-glyph-texture.png`
				);
				glyphTexture.minFilter = TextureFilter.NEAREST;
				glyphTexture.magFilter = TextureFilter.NEAREST;

				const textQuad = new TextQuad({ glyphs, texture: glyphTexture });

				const projMat = createMatrix4Like();
				const camMat = createMatrix4Like();
				const viewMat = createMatrix4Like();
				const viewProjMat = createMatrix4Like();
				const quadMat = createMatrix4Like();
				const textMat = createMatrix4Like();
				identity(camMat);
				translate(camMat, [0, 0, 5], camMat);
				invert(camMat, viewMat);

				return (now) => {
					gl.resize();
					gl.doCullFace = true;
					gl.doDepthTest = true;
					gl.doBlend = true;
					gl.blendFunction = [
						BlendFunction.SRC_ALPHA,
						BlendFunction.ONE_MINUS_SRC_ALPHA
					];
					gl.clear();

					// Update text.
					textQuad.text = Math.floor(now).toString();

					// Update matrices.
					const w = canvas.width;
					const h = canvas.height;
					perspective(Math.PI / 4, w / (h || 1), 1, 10, projMat);
					multiply(projMat, viewMat, viewProjMat);
					identity(quadMat);
					multiply(viewProjMat, quadMat, quadMat);
					identity(textMat);
					rotateY(textMat, now * 0.001, textMat);
					translate(textMat, [0, 0, 3], textMat);
					rotateY(textMat, now * -0.001, textMat);
					scale(textMat, [1 / 40, 1 / 40, 0], textMat);
					translate(textMat, [-textQuad.width / 2, 0, 1], textMat);
					multiply(viewProjMat, textMat, textMat);

					// eslint-disable-next-line camelcase
					quadVao.draw({ u_texture: texture, u_worldViewProjMat: quadMat });

					textQuad.draw({
						// eslint-disable-next-line camelcase
						u_texture: glyphTexture,
						// eslint-disable-next-line camelcase
						u_worldViewProjMat: textMat
					});
				};
			}}
			{...props}
		/>
	);
}
