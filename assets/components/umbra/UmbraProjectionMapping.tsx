import { Program, Buffer, VAO, AttributeState, Color, Texture2D, TextureFormat, TextureFilter, clearContext, resizeContext, UniformValue, Primitive } from "@lakuna/umbra.js";
import { mat4 } from "gl-matrix";
import AnimatedCanvas from "../AnimatedCanvas";

const vss = `#version 300 es

in vec4 a_position;
in vec2 a_texcoord;

uniform mat4 u_matrix;

out vec2 v_texcoord;

void main() {
	gl_Position = u_matrix * a_position;
	v_texcoord = a_texcoord;
}`;

const fss = `#version 300 es

precision highp float;

in vec2 v_texcoord;

uniform sampler2D u_texture;
uniform vec4 u_color;

out vec4 outColor;

void main() {
	outColor = texture(u_texture, v_texcoord) * u_color;
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

const planePositionBufferData = new Float32Array([
	-1, 1,
	-1, -1,
	1, -1,
	1, 1
]);

const planeTexcoordBufferData = new Float32Array([
	0, 0,
	0, 10,
	10, 10,
	10, 0
]);

const planeIndexData = new Uint8Array([
	0, 1, 2,
	0, 2, 3
]);

const icoPositionBufferData = (() => {
	const t = (1 + Math.sqrt(5)) / 2; // The golden ratio (tau).

	return new Float32Array([
		1, t, 0,
		0, 1, t,
		t, 0, 1,
		t, 0, -1,

		t, 0, -1,
		t, 0, 1,
		1, -t, 0,
		0, -1, -t,

		t, 0, 1,
		0, 1, t,
		0, -1, t,
		1, -t, 0,

		1, -t, 0,
		0, -1, t,
		-1, -t, 0,
		0, -1, -t,

		0, -1, t,
		0, 1, t,
		-t, 0, 1,
		-1, -t, 0,

		-1, -t, 0,
		-t, 0, 1,
		-t, 0, -1,
		0, -1, -t,

		-t, 0, 1,
		0, 1, t,
		-1, t, 0,
		-t, 0, -1,

		-t, 0, -1,
		-1, t, 0,
		0, 1, -t,
		0, -1, -t,

		-1, t, 0,
		0, 1, t,
		1, t, 0,
		0, 1, -t,

		0, 1, -t,
		1, t, 0,
		t, 0, -1,
		0, -1, -t
	]).map((n) => n / t);
})();

const icoTexcoordBufferData = new Float32Array([
	0, 0,
	0, 5,
	5, 5,
	5, 0,

	0, 0,
	0, 5,
	5, 5,
	5, 0,

	0, 0,
	0, 5,
	5, 5,
	5, 0,

	0, 0,
	0, 5,
	5, 5,
	5, 0,

	0, 0,
	0, 5,
	5, 5,
	5, 0,

	0, 0,
	0, 5,
	5, 5,
	5, 0,

	0, 0,
	0, 5,
	5, 5,
	5, 0,

	0, 0,
	0, 5,
	5, 5,
	5, 0,

	0, 0,
	0, 5,
	5, 5,
	5, 0,

	0, 0,
	0, 5,
	5, 5,
	5, 0
]);

const icoIndexData = new Uint8Array([
	0, 1, 2,
	0, 2, 3,

	4, 5, 6,
	4, 6, 7,

	8, 9, 10,
	8, 10, 11,

	12, 13, 14,
	12, 14, 15,

	16, 17, 18,
	16, 18, 19,

	20, 21, 22,
	20, 22, 23,

	24, 25, 26,
	24, 26, 27,

	28, 29, 30,
	28, 30, 31,

	32, 33, 34,
	32, 34, 35,

	36, 37, 38,
	36, 38, 39
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

const transparent = new Color(0, 0, 0, 0);
const red = new Color(0xFF0000);
const green = new Color(0x00FF00);

const fov = 45;
const camNear = 1;
const camFar = 1000;
const camTheta = Math.PI / 4;
const camVz = 0.001;
const camDist = 500;
const planeScale = 500;
const icoScale = 50;
const icoPos = new Float32Array([100, 100, 200]);
const wireframeCamScale = 25;
const wireframeCamPos = new Float32Array([50, 50, 100]);

export default function UmbraProjectionMapping({ ...props }) {
	return AnimatedCanvas((canvas: HTMLCanvasElement) => {
		const gl = canvas.getContext("webgl2");
		if (!gl) { throw new Error("Your browser does not support WebGL2."); }

		const program = Program.fromSource(gl, vss, fss);
		const wireframeProgram = Program.fromSource(gl, wireframeVss, wireframeFss);

		const planePositionBuffer = new Buffer(gl, planePositionBufferData);
		const planeTexcoordBuffer = new Buffer(gl, planeTexcoordBufferData);
		const icoPositionBuffer = new Buffer(gl, icoPositionBufferData);
		const icoTexcoordBuffer = new Buffer(gl, icoTexcoordBufferData);
		const wireframeCamPositionBuffer = new Buffer(gl, wireframeCamPositionBufferData);

		const planeVao = new VAO(program, [
			new AttributeState("a_position", planePositionBuffer, 2),
			new AttributeState("a_texcoord", planeTexcoordBuffer, 2)
		], planeIndexData);

		const icoVao = new VAO(program, [
			new AttributeState("a_position", icoPositionBuffer),
			new AttributeState("a_texcoord", icoTexcoordBuffer, 2)
		], icoIndexData);

		const wireframeCamVao = new VAO(wireframeProgram, [
			new AttributeState("a_position", wireframeCamPositionBuffer)
		], wireframeCamIndexData);

		const tileTexture = new Texture2D({
			gl,
			pixels: new Uint8Array([
				0x80, 0xC0,
				0xC0, 0x80
			]),
			width: 2,
			height: 2,
			internalFormat: TextureFormat.LUMINANCE,
			minFilter: TextureFilter.NEAREST,
			magFilter: TextureFilter.NEAREST
		});

		const projectedTexture = new Texture2D({
			gl,
			pixels: new Uint8Array([0xFF, 0x00, 0xFF, 0xFF]),
			width: 1,
			height: 1
		});

		const projectedImage = new Image();
		projectedImage.addEventListener("load", () => {
			projectedTexture.pixels = projectedImage;
			projectedTexture.width = undefined;
			projectedTexture.height = undefined;
			projectedTexture.update();
		});
		projectedImage.crossOrigin = "";
		projectedImage.src = "https://www.lakuna.pw/images/webgl-example-texture.png";

		const planeMat = mat4.create();
		const icoMat = mat4.create();
		const wireframeCamMat = mat4.create();
		const projMat = mat4.create();
		const camMat = mat4.create();
		const viewMat = mat4.create();
		const viewProjMat = mat4.create();

		return function render(now: number) {
			clearContext(gl, transparent, 1);

			resizeContext(gl);

			gl.enable(gl.CULL_FACE);

			mat4.perspective(projMat, fov, canvas.clientWidth / canvas.clientHeight, camNear, camFar);
			mat4.identity(camMat);
			mat4.rotateZ(camMat, camMat, camVz * now);
			mat4.rotateX(camMat, camMat, camTheta);
			mat4.translate(camMat, camMat, [0, 0, camDist]);
			mat4.invert(viewMat, camMat);
			mat4.multiply(viewProjMat, projMat, viewMat);

			mat4.identity(planeMat);
			mat4.scale(planeMat, planeMat, [planeScale, planeScale, 1]);
			mat4.multiply(planeMat, viewProjMat, planeMat);

			mat4.identity(icoMat);
			mat4.translate(icoMat, icoMat, icoPos);
			mat4.scale(icoMat, icoMat, [icoScale, icoScale, icoScale]);
			mat4.multiply(icoMat, viewProjMat, icoMat);

			mat4.identity(wireframeCamMat);
			mat4.translate(wireframeCamMat, wireframeCamMat, wireframeCamPos);
			mat4.scale(wireframeCamMat, wireframeCamMat, [wireframeCamScale, wireframeCamScale, wireframeCamScale]);
			mat4.multiply(wireframeCamMat, viewProjMat, wireframeCamMat);

			planeVao.draw({ "u_color": red, "u_matrix": planeMat as UniformValue, "u_texture": tileTexture });
			icoVao.draw({ "u_color": green, "u_matrix": icoMat as UniformValue, "u_texture": tileTexture });
			wireframeCamVao.draw({ "u_matrix": wireframeCamMat as UniformValue }, Primitive.LINES);
		}
	}, props);
}
