"use client";

import { AttributeState, Buffer, clearContext, Color, Framebuffer, FramebufferAttachmentPoint, Program, Renderbuffer, RenderbufferFormat, resizeContext, Texture2D, TextureFilter, TextureFormat, VAO } from "@lakuna/umbra.js";
import { mat4 } from "gl-matrix";
import AnimatedCanvas from "../AnimatedCanvas";

const vss = `#version 300 es
in vec4 a_position;
in vec2 a_texcoord;
uniform mat4 u_matrix;
out vec2 v_texcoord;
void main() {
	v_texcoord = a_texcoord;
	gl_Position = u_matrix * a_position;
}`;

const fss = `#version 300 es
precision highp float;
in vec2 v_texcoord;
uniform sampler2D u_texture;
out vec4 outColor;
void main() {
	outColor = texture(u_texture, v_texcoord);
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

const texcoordBufferData = new Float32Array([
	// Front
	0, 0,
	0, 1,
	1, 1,
	1, 0,

	// Back
	0, 0,
	0, 1,
	1, 1,
	1, 0,

	// Left
	0, 0,
	0, 1,
	1, 1,
	1, 0,

	// Right
	0, 0,
	0, 1,
	1, 1,
	1, 0,

	// Top
	0, 0,
	0, 1,
	1, 1,
	1, 0,

	// Bottom
	0, 0,
	0, 1,
	1, 1,
	1, 0
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

const transparent = new Color(0, 0, 0, 0);
const green = new Color(0, 1, 0, 1);

const camDist = 5;

export default function RenderToTexture(props) {
	return AnimatedCanvas((canvas) => {
		const gl = canvas.getContext("webgl2");
		if (!gl) { throw new Error("Your browser does not support WebGL2."); }

		const program = Program.fromSource(gl, vss, fss);

		const positionBuffer = new Buffer(gl, positionBufferData);
		const texcoordBuffer = new Buffer(gl, texcoordBufferData);

		const vao = new VAO(program, [
			new AttributeState("a_position", positionBuffer),
			new AttributeState("a_texcoord", texcoordBuffer, 2)
		], indexData);

		const redTexture = new Texture2D({
			gl,
			pixels: new Uint8Array([0xFF]),
			width: 1,
			height: 1,
			internalFormat: TextureFormat.R8,
			minFilter: TextureFilter.NEAREST,
			magFilter: TextureFilter.NEAREST
		});

		const blueTexture = new Texture2D({
			gl,
			pixels: new Uint8Array([0x0, 0x0, 0xFF]),
			width: 1,
			height: 1,
			internalFormat: TextureFormat.RGB8,
			minFilter: TextureFilter.NEAREST,
			magFilter: TextureFilter.NEAREST
		});

		const renderTexture = new Texture2D({
			gl,
			width: 256,
			height: 256,
			minFilter: TextureFilter.LINEAR
		});

		const depthRenderbuffer = new Renderbuffer(gl, RenderbufferFormat.DEPTH_COMPONENT24, 256, 256);

		const framebuffer = new Framebuffer(gl);
		framebuffer.attach(renderTexture, FramebufferAttachmentPoint.COLOR_ATTACHMENT0);
		framebuffer.attach(depthRenderbuffer, FramebufferAttachmentPoint.DEPTH_ATTACHMENT);

		const projMat = mat4.create();
		const camMat = mat4.create();
		const viewMat = mat4.create();
		const viewProjMat = mat4.create();
		const outerCubeMat = mat4.create();
		const innerCubeLeftMat = mat4.create();
		const innerCubeRightMat = mat4.create();

		return function render(now) {
			// Global state applies to all buffers.
			gl.enable(gl.CULL_FACE);

			// Render to texture first.
			framebuffer.bind();
			resizeContext(gl, 0, 0, renderTexture.width, renderTexture.height);
			clearContext(gl, green, 1);
			mat4.perspective(projMat, Math.PI / 4, renderTexture.width / renderTexture.height, 1, 1000);
			mat4.identity(camMat);
			mat4.rotateX(camMat, camMat, 0.001 * now);
			mat4.translate(camMat, camMat, [0, 0, camDist]);
			mat4.invert(viewMat, camMat);
			mat4.multiply(viewProjMat, projMat, viewMat);
			mat4.identity(innerCubeLeftMat);
			mat4.rotateX(innerCubeLeftMat, innerCubeLeftMat, 0.001 * now);
			mat4.multiply(innerCubeLeftMat, viewProjMat, innerCubeLeftMat);
			vao.draw({ "u_matrix": innerCubeLeftMat, "u_texture": redTexture });
			mat4.identity(innerCubeRightMat);
			mat4.rotateZ(innerCubeRightMat, innerCubeRightMat, 0.001 * now);
			mat4.multiply(innerCubeRightMat, viewProjMat, innerCubeRightMat);
			vao.draw({ "u_matrix": innerCubeRightMat, "u_texture": blueTexture });

			// Render to the canvas after.
			Framebuffer.unbind(gl);
			resizeContext(gl);
			clearContext(gl, transparent, 1);
			mat4.perspective(projMat, Math.PI / 4, canvas.clientWidth / canvas.clientHeight, 1, 1000);
			mat4.identity(camMat);
			mat4.rotateX(camMat, camMat, 0.001 * now);
			mat4.rotateY(camMat, camMat, 0.0005 * now);
			mat4.rotateZ(camMat, camMat, 0.00025 * now);
			mat4.translate(camMat, camMat, [0, 0, camDist]);
			mat4.invert(viewMat, camMat);
			mat4.multiply(viewProjMat, projMat, viewMat);
			mat4.identity(outerCubeMat);
			mat4.multiply(outerCubeMat, viewProjMat, outerCubeMat);
			vao.draw({ "u_matrix": outerCubeMat, "u_texture": renderTexture });
		}
	}, props);
}
