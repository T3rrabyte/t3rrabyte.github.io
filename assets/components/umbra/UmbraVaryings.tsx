import AnimatedCanvas from "../AnimatedCanvas";
import { Program, Buffer, VAO, AttributeState, clearContext, Color, resizeContext } from "@lakuna/umbra.js";

const vss = `#version 300 es

in vec4 a_position;
in vec4 a_color;

out vec4 v_color;

void main() {
	v_color = a_color;
	gl_Position = a_position;
}`;

const fss = `#version 300 es

precision highp float;

in vec4 v_color;

out vec4 outColor;

void main() {
	outColor = v_color;
}`;

const positionBufferData = new Float32Array([
	0, 0,
	0, 0.5,
	0.7, 0
]);

const colorBufferData = new Float32Array([
	1, 0, 0,
	0, 1, 0,
	0, 0, 1
]);

const transparent = new Color(0, 0, 0, 0);

export default function UmbraVaryings({ ...props }) {
	return <AnimatedCanvas {...props} init={(canvas: HTMLCanvasElement) => {
		const gl = canvas.getContext("webgl2");
		if (!gl) { throw new Error("Your browser does not support WebGL2."); }

		const program = Program.fromSource(gl, vss, fss);

		const positionBuffer = new Buffer(gl, positionBufferData);
		const colorBuffer = new Buffer(gl, colorBufferData);

		const vao = new VAO(program, [
			new AttributeState("a_position", positionBuffer, 2),
			new AttributeState("a_color", colorBuffer)
		]);

		return function render() {
			clearContext(gl, transparent);

			resizeContext(gl);

			vao.draw();
		}
	}} />;
}
