"use client";

import AnimatedCanvas from "../AnimatedCanvas";
import { Color, Program, Buffer, VAO, AttributeState, clearContext, resizeContext, Primitive } from "@lakuna/ugl";
import { mat4 } from "gl-matrix";

const vss = `#version 300 es
in vec4 a_position;
in vec2 a_texcoord;
uniform mat4 u_matrix;
void main() {
	gl_Position = u_matrix * a_position;
}`;

const fss = `#version 300 es
precision highp float;
in vec2 v_texcoord;
uniform vec4 u_color;
out vec4 outColor;
void main() {
	outColor = u_color;
}`;

const wireframeVss = `#version 300 es
in vec4 a_position;
uniform mat4 u_matrix;
void main() {
	gl_Position = u_matrix * a_position;
}`;

const wireframeFss = `#version 300 es
precision highp float;
out vec4 outColor;
void main() {
	outColor = vec4(0, 0, 0, 1);
}`;

const fPositionBufferData = new Float32Array([
	0, 0, 0,
	0, 150, 0,
	30, 0, 0,
	0, 150, 0,
	30, 150, 0,
	30, 0, 0,
	30, 0, 0,
	30, 30, 0,
	100, 0, 0,
	30, 30, 0,
	100, 30, 0,
	100, 0, 0,
	30, 60, 0,
	30, 90, 0,
	67, 60, 0,
	30, 90, 0,
	67, 90, 0,
	67, 60, 0,
	0, 0, 30,
	30, 0, 30,
	0, 150, 30,
	0, 150, 30,
	30, 0, 30,
	30, 150, 30,
	30, 0, 30,
	100, 0, 30,
	30, 30, 30,
	30, 30, 30,
	100, 0, 30,
	100, 30, 30,
	30, 60, 30,
	67, 60, 30,
	30, 90, 30,
	30, 90, 30,
	67, 60, 30,
	67, 90, 30,
	0, 0, 0,
	100, 0, 0,
	100, 0, 30,
	0, 0, 0,
	100, 0, 30,
	0, 0, 30,
	100, 0, 0,
	100, 30, 0,
	100, 30, 30,
	100, 0, 0,
	100, 30, 30,
	100, 0, 30,
	30, 30, 0,
	30, 30, 30,
	100, 30, 30,
	30, 30, 0,
	100, 30, 30,
	100, 30, 0,
	30, 30, 0,
	30, 60, 30,
	30, 30, 30,
	30, 30, 0,
	30, 60, 0,
	30, 60, 30,
	30, 60, 0,
	67, 60, 30,
	30, 60, 30,
	30, 60, 0,
	67, 60, 0,
	67, 60, 30,
	67, 60, 0,
	67, 90, 30,
	67, 60, 30,
	67, 60, 0,
	67, 90, 0,
	67, 90, 30,
	30, 90, 0,
	30, 90, 30,
	67, 90, 30,
	30, 90, 0,
	67, 90, 30,
	67, 90, 0,
	30, 90, 0,
	30, 150, 30,
	30, 90, 30,
	30, 90, 0,
	30, 150, 0,
	30, 150, 30,
	0, 150, 0,
	0, 150, 30,
	30, 150, 30,
	0, 150, 0,
	30, 150, 30,
	30, 150, 0,
	0, 0, 0,
	0, 0, 30,
	0, 150, 30,
	0, 0, 0,
	0, 150, 30,
	0, 150, 0
]);

const wireframeCamConeRes = 6;

const wireframeCamPositionBufferData = (() => {
	const out = [
		-1, -1, 1,
		1, -1, 1,
		-1, 1, 1,
		1, 1, 1,
		-1, -1, 3,
		1, -1, 3,
		-1, 1, 3,
		1, 1, 3,
		0, 0, 1
	];

	for (let i = 0; i < wireframeCamConeRes; i++) {
		const angle = i / wireframeCamConeRes * Math.PI * 2;
		out.push(Math.cos(angle), Math.sin(angle), 0);
	}

	return new Float32Array(out);
})();

const wireframeCamIndexData = (() => {
	const out = [
		0, 1,
		1, 3,
		3, 2,
		2, 0,

		4, 5,
		5, 7,
		7, 6,
		6, 4,

		0, 4,
		1, 5,
		3, 7,
		2, 6
	];

	const coneBaseIndex = 9;
	for (let i = 0; i < wireframeCamConeRes; i++) {
		out.push(
			coneBaseIndex - 1, // Cone tip
			coneBaseIndex + i,

			coneBaseIndex + i,
			coneBaseIndex + (i + 1) % wireframeCamConeRes
		);
	}

	return new Uint8Array(out);
})();

const wireframeCubePositionBufferData = new Float32Array([
	-1, -1, -1,
	1, -1, -1,
	-1, 1, -1,
	1, 1, -1,
	-1, -1, 1,
	1, -1, 1,
	-1, 1, 1,
	1, 1, 1
]);

const wireframeCubeIndexData = new Uint8Array([
	0, 1,
	1, 3,
	3, 2,
	2, 0,

	4, 5,
	5, 7,
	7, 6,
	6, 4,

	0, 4,
	1, 5,
	3, 7,
	2, 6
]);

const paleYellow = new Color(0xEEE8AA);
const paleBlue = new Color(0xAFEEEE);
const green = new Color(0x008000);

const fPosition = new Float32Array([0, 0, 0]);
const fScale = new Float32Array([1, -1, 1]);
const leftCamFov = Math.PI / 4;
const leftCamNear = 1;
const leftCamFar = 25;
const leftCamScale = new Float32Array([20, 20, 20]);
const rightCamFov = Math.PI / 4;
const rightCamNear = 1;
const rightCamFar = 1100;
const up = new Float32Array([0, 1, 0]);
const rightEye = new Float32Array([500, 100, 500]);

export default function MultipleViews(props) {
	return AnimatedCanvas((canvas) => {
		const gl = canvas.getContext("webgl2");
		if (!gl) { throw new Error("Your browser does not support WebGL2."); }

		const program = Program.fromSource(gl, vss, fss);
		const wireframeProgram = Program.fromSource(gl, wireframeVss, wireframeFss);

		const fPositionBuffer = new Buffer(gl, fPositionBufferData);
		const wireframeCamPositionBuffer = new Buffer(gl, wireframeCamPositionBufferData);
		const wireframeCubePositionBuffer = new Buffer(gl, wireframeCubePositionBufferData);

		const fVao = new VAO(program, [
			new AttributeState("a_position", fPositionBuffer)
		]);

		const wireframeCamVao = new VAO(wireframeProgram, [
			new AttributeState("a_position", wireframeCamPositionBuffer)
		], wireframeCamIndexData);

		const wireframeCubeVao = new VAO(wireframeProgram, [
			new AttributeState("a_position", wireframeCubePositionBuffer)
		], wireframeCubeIndexData);

		const fMat = mat4.create();
		const wireframeCubeMat = mat4.create();
		const leftCamMat = mat4.create();
		const rightCamMat = mat4.create();
		const projMat = mat4.create();
		const viewMat = mat4.create();
		const viewProjMat = mat4.create();
		const tempMat = mat4.create();

		return function render(now) {
			gl.enable(gl.CULL_FACE);

			resizeContext(gl, 0, 0, canvas.clientWidth / 2, canvas.clientHeight);
			clearContext(gl, paleBlue, 1);

			mat4.identity(fMat);
			mat4.translate(fMat, fMat, fPosition);
			mat4.scale(fMat, fMat, fScale);

			mat4.perspective(projMat, leftCamFov, (canvas.clientWidth / 2) / canvas.clientHeight, leftCamNear, leftCamFar);
			mat4.targetTo(leftCamMat, [Math.cos(now * 0.001) * 300, 0, Math.sin(now * 0.001) * 300], fPosition, up);
			mat4.scale(leftCamMat, leftCamMat, leftCamScale);
			mat4.invert(viewMat, leftCamMat);
			mat4.multiply(viewProjMat, projMat, viewMat);

			mat4.invert(wireframeCubeMat, projMat);

			mat4.multiply(tempMat, viewProjMat, fMat);

			fVao.draw({ "u_color": green, "u_matrix": tempMat });

			resizeContext(gl, canvas.clientWidth / 2, 0, canvas.clientWidth / 2, canvas.clientHeight);
			clearContext(gl, paleYellow, 1);

			mat4.perspective(projMat, rightCamFov, (canvas.clientWidth / 2) / canvas.clientHeight, rightCamNear, rightCamFar);
			mat4.identity(rightCamMat);
			mat4.targetTo(rightCamMat, rightEye, fPosition, up);
			mat4.invert(viewMat, rightCamMat);
			mat4.multiply(viewProjMat, projMat, viewMat);

			mat4.multiply(tempMat, viewProjMat, fMat);

			fVao.draw({ "u_color": green, "u_matrix": tempMat });

			mat4.multiply(tempMat, viewProjMat, leftCamMat);

			wireframeCamVao.draw({ "u_matrix": tempMat }, Primitive.LINES);

			mat4.multiply(tempMat, tempMat, wireframeCubeMat);

			wireframeCubeVao.draw({ "u_matrix": tempMat }, Primitive.LINES);
		}
	}, props);
}
