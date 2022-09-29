import AnimatedCanvas from "../AnimatedCanvas";
import { Program, Buffer, VAO, AttributeState, clearContext, Color, resizeContext } from "@lakuna/umbra.js";
import { mat4 } from "gl-matrix";

const vss = `#version 300 es

in vec4 a_position;

uniform mat4 u_matrix;

out vec4 v_color;

void main() {
	gl_Position = u_matrix * a_position;
	v_color = a_position;
}`;

const fss = `#version 300 es

precision highp float;

in vec4 v_color;

out vec4 outColor;

void main() {
	outColor = v_color;
}`;

const bufferData = new Float32Array([
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

const cubeCircleRad = 200;
const cubeSideLen = 50;
const cubeCount = 5;
const cameraCircleRad = 400;

const cubeMats = [];
for (let i = 0; i < cubeCount; i++) {
	const r = i * Math.PI * 2 / cubeCount;
	const mat = mat4.create();
	mat4.translate(mat, mat, [Math.cos(r) * cubeCircleRad, 0, Math.sin(r) * cubeCircleRad]);
	mat4.scale(mat, mat, [cubeSideLen, cubeSideLen, cubeSideLen]);
	cubeMats[i] = mat;
}

const camMat = mat4.create();
const viewMat = mat4.create();
const projMat = mat4.create();
const viewProjMat = mat4.create();
const tempMat = mat4.create();

const transparent = new Color(0, 0, 0, 0);

export default function UmbraCameras({ ...props }) {
	return <AnimatedCanvas {...props} init={(canvas: HTMLCanvasElement) => {
		const gl = canvas.getContext("webgl2");
		if (!gl) { throw new Error("Your browser does not support WebGL2."); }

		const program = Program.fromSource(gl, vss, fss);

		const buffer = new Buffer(gl, bufferData);

		const vao = new VAO(program, [
			new AttributeState("a_position", buffer)
		], indexData);

		return function render(now: number) {
			mat4.perspective(projMat, 45, canvas.clientWidth / canvas.clientHeight, 1, 1000);
			mat4.identity(camMat);
			mat4.rotateY(camMat, camMat, 0.001 * now);
			mat4.translate(camMat, camMat, [0, 0, cameraCircleRad]);
			mat4.invert(viewMat, camMat);
			mat4.multiply(viewProjMat, projMat, viewMat);

			clearContext(gl, transparent, 1);

			resizeContext(gl);

			gl.enable(gl.CULL_FACE);

			for (let i = 0; i < cubeMats.length; i++) {
				mat4.multiply(tempMat, viewProjMat, cubeMats[i]);
				vao.draw({ "u_matrix": tempMat as number[] });
			}
		}
	}} />;
}
