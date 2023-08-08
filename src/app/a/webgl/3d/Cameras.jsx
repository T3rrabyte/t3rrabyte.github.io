"use client";

import { Context, Buffer, BufferInfo, FaceDirection, Program, VAO } from "@lakuna/ugl";
import AnimatedCanvas from "#app/a/webgl/AnimatedCanvas.jsx";
import { perspective, translate, rotateX, rotateY, identity, invert, multiply, fromTranslation } from "@lakuna/umath/Matrix4";
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

const speed = 0.001;
const objectCount = 5;
const radius = 200;
const cameraRadius = 500;

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

        const worldMatrices = [];
        for (let i = 0; i < objectCount; i++) {
            const r = i * Math.PI * 2 / objectCount;
            worldMatrices[i] = fromTranslation([
                Math.cos(r) * radius,
                0,
                Math.sin(r) * radius
            ], new Float32Array(16));
        }

        const projectionMatrix = new Float32Array(16);
        const cameraMatrix = new Float32Array(16);
        const viewMatrix = new Float32Array(16);
        const viewProjectionMatrix = new Float32Array(16);

        return (now) => {
            gl.resize();
            gl.clear([0, 0, 0, 0], 1);
            gl.cullFace = FaceDirection.BACK;

            perspective(Math.PI / 4, canvas.width / canvas.height, 1, 1000, projectionMatrix);
            identity(cameraMatrix);
            rotateY(cameraMatrix, now * speed, cameraMatrix);
            rotateX(cameraMatrix, Math.PI * 9 / 10, cameraMatrix);
            translate(cameraMatrix, [0, 0, cameraRadius], cameraMatrix);
            invert(cameraMatrix, viewMatrix);
            multiply(projectionMatrix, viewMatrix, viewProjectionMatrix);

            for (let i = 0; i < objectCount; i++) {
                multiply(viewProjectionMatrix, worldMatrices[i], cameraMatrix);
                vao.draw({ "u_matrix": cameraMatrix });
            }
        };
    }, props);
};
