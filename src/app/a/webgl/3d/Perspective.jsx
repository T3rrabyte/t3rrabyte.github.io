"use client";

import { Context, Buffer, BufferInfo, FaceDirection, Program, VAO } from "@lakuna/ugl";
import AnimatedCanvas from "#app/a/webgl/AnimatedCanvas.jsx";
import { perspective, translate, rotateZ, rotateX } from "@lakuna/umath/Matrix4";
import { positions, colors } from "./f.js";

const vss = `\
#version 300 es

in vec4 a_position;
in vec4 a_color;

uniform mat4 u_matrix;

out vec4 v_color;

void main() {
	gl_Position = u_matrix * a_position;
    v_color = a_color;
}`;

const fss = `\
#version 300 es

precision highp float;

in vec4 v_color;

out vec4 outColor;

void main() {
	outColor = v_color;
}`;

const rotationSpeedX = 0.0007;
const rotationSpeedZ = 0.001;

export default (props) => {
    return AnimatedCanvas((canvas) => {
        const gl = new Context(canvas);
        const program = Program.fromSource(gl, vss, fss);

        const positionBuffer = new Buffer(gl, positions);
        const colorBuffer = new Buffer(gl, colors);
        const vao = new VAO(program, [
            new BufferInfo("a_position", positionBuffer),
            new BufferInfo("a_color", colorBuffer, 3, true)
        ]);

        const matrix = new Float32Array(16);

        return (now) => {
            gl.resize();
            gl.clear([0, 0, 0, 0], 1);
            gl.cullFace = FaceDirection.BACK;

            perspective(Math.PI / 4, canvas.width / canvas.height, 1, 1000, matrix);
            translate(matrix, [0, 0, -500], matrix);
            rotateZ(matrix, now * rotationSpeedZ, matrix);
            rotateX(matrix, now * rotationSpeedX, matrix);

            vao.draw({ "u_matrix": matrix });
        };
    }, props);
};
