import { Color, Program, Buffer, VAO, AttributeState, clearContext, resizeContext, UniformValue } from "@lakuna/umbra.js";
import { mat4 } from "gl-matrix";
import AnimatedCanvas from "../AnimatedCanvas";

const vss = `#version 300 es

in vec4 a_position;

uniform mat4 u_matrix;

void main() {
	gl_Position = u_matrix * a_position;
}`;

const fss = `#version 300 es

precision highp float;

uniform vec4 u_color;

out vec4 outColor;

void main() {
	outColor = u_color;
}`;

const bufferData = new Float32Array([
	-500, 500,
	-500, -500,
	500, -500,
	500, 500
]);

const indexData = new Uint8Array([
	0, 1, 2,
	0, 2, 3
]);

const squareCount = 50;
const parentScaling = new Float32Array([0.1, 0.1, 1]);
const childScaling = new Float32Array([0.9, 0.9, 1]);
const childTranslation = new Float32Array([500, 0, 0]);

const transparent = new Color(0, 0, 0, 0);

export default function UmbraSceneGraph({ ...props }) {
	return <AnimatedCanvas {...props} init={(canvas: HTMLCanvasElement) => {
		const gl = canvas.getContext("webgl2");
		if (!gl) { throw new Error("Your browser does not support WebGL2."); }

		const program = Program.fromSource(gl, vss, fss);

		const buffer = new Buffer(gl, bufferData);

		const vao = new VAO(program, [
			new AttributeState("a_position", buffer, 2)
		], indexData);

		const squares = [];
		squares[0] = {
			mat: mat4.scale(mat4.create(), mat4.create(), parentScaling),
			color: new Color(Math.random(), Math.random(), Math.random(), 1)
		};
		for (let i = 1; i < squareCount; i++) {
			const mat = mat4.create();
			mat4.scale(mat, mat, childScaling);
			mat4.translate(mat, mat, childTranslation);

			squares[i] = {
				mat,
				color: new Color(Math.random(), Math.random(), Math.random(), 1)
			};
		}

		let then = 0;

		const tempMat = mat4.create();

		return function render(now: number) {
			clearContext(gl, transparent);

			resizeContext(gl);

			const deltaTime = now - then;
			then = now;

			mat4.ortho(tempMat, 0, canvas.clientWidth, 0, canvas.clientHeight, 0, 1);
			mat4.translate(tempMat, tempMat, [canvas.clientWidth / 2, canvas.clientHeight / 2, 0]);

			for (let i = 0; i < squares.length; i++) {
				const square = squares[i];
				mat4.rotateZ(square.mat, square.mat, 0.001 * deltaTime);
				mat4.multiply(tempMat, tempMat, square.mat);
				vao.draw({ "u_color": square.color, "u_matrix": tempMat as UniformValue });
			}
		}
	}} />
}
