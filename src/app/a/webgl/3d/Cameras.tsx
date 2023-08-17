"use client";

import {
	Context,
	Buffer,
	BufferInfo,
	FaceDirection,
	Program,
	Vao
} from "@lakuna/ugl";
import AnimatedCanvas from "#app/a/webgl/AnimatedCanvas.tsx";
import {
	perspective,
	translate,
	rotateX,
	rotateY,
	identity,
	invert,
	multiply,
	fromTranslation,
	type Matrix4Like
} from "@lakuna/umath/Matrix4";
import { positions, colors } from "./f.ts";
import type { CanvasHTMLAttributes, DetailedHTMLProps, JSX } from "react";

const vss: string = `\
#version 300 es

in vec4 a_position;
in vec4 a_color;

uniform mat4 u_matrix;

out vec4 v_color;

void main() {
	gl_Position = u_matrix * a_position;
    v_color = a_color;
}`;

const fss: string = `\
#version 300 es

precision highp float;

in vec4 v_color;

out vec4 outColor;

void main() {
	outColor = v_color;
}`;

const objectCount = 5;
const radius = 200;

export default function Cameras(
	props: DetailedHTMLProps<
		CanvasHTMLAttributes<HTMLCanvasElement>,
		HTMLCanvasElement
	>
): JSX.Element {
	return AnimatedCanvas((canvas: HTMLCanvasElement): FrameRequestCallback => {
		const gl: Context = new Context(canvas);
		const program: Program = Program.fromSource(gl, vss, fss);

		const positionBuffer: Buffer = new Buffer(gl, positions);
		const colorBuffer: Buffer = new Buffer(gl, colors);
		const vao: Vao = new Vao(program, [
			new BufferInfo("a_position", positionBuffer),
			new BufferInfo("a_color", colorBuffer, 3, true)
		]);

		const worldMatrices: Array<Matrix4Like> = [];
		for (let i = 0; i < objectCount; i++) {
			const r: number = (i * Math.PI * 2) / objectCount;
			worldMatrices[i] = fromTranslation(
				[Math.cos(r) * radius, 0, Math.sin(r) * radius],
				new Float32Array(16) as Matrix4Like
			);
		}

		const projectionMatrix: Matrix4Like = new Float32Array(16) as Matrix4Like;
		const cameraMatrix: Matrix4Like = new Float32Array(16) as Matrix4Like;
		const viewMatrix: Matrix4Like = new Float32Array(16) as Matrix4Like;
		const viewProjectionMatrix: Matrix4Like = new Float32Array(
			16
		) as Matrix4Like;

		return (now: number): void => {
			gl.resize();
			gl.clear([0, 0, 0, 0], 1);
			gl.cullFace = FaceDirection.BACK;

			perspective(
				Math.PI / 4,
				canvas.width / (canvas.height || 1),
				1,
				1000,
				projectionMatrix
			);
			identity(cameraMatrix);
			rotateY(cameraMatrix, now * 0.001, cameraMatrix);
			rotateX(cameraMatrix, (Math.PI * 9) / 10, cameraMatrix);
			translate(cameraMatrix, [0, 0, 500], cameraMatrix);
			invert(cameraMatrix, viewMatrix);
			multiply(projectionMatrix, viewMatrix, viewProjectionMatrix);

			for (let i = 0; i < objectCount; i++) {
				multiply(
					viewProjectionMatrix,
					worldMatrices[i] as Matrix4Like,
					cameraMatrix
				);
				vao.draw({ u_matrix: cameraMatrix });
			}
		};
	}, props);
}
