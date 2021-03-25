const vertexShaderSource = `#version 300 es
// Version must be declared before anything else; even comments and newlines.

// Attributes (inputs) are used where data is different for each vertex.
in vec4 a_position; // Vertex data.
in vec2 a_texcoord; // Texture coordinates.

// Varyings pass data from the vertex shader to the fragment shader.
out vec2 v_texcoord; // Pass texture coordinates to fragment shader.

// Uniforms are used where data is the same for each vertex.
uniform mat4 u_matrix; // Transforms.

void main() {
	// gl_Position is a special variable that the vertex shader is responsible for setting.
	// It determines the position of the vertex.
	gl_Position = u_matrix * a_position;

	// Output texture coordinates from attribute to varying.
	v_texcoord = a_texcoord;
}
`;

const fragmentShaderSource = `#version 300 es
// Version must be declared before anything else; even comments and newlines.

// Declare precision.
precision highp float;

// Take in varying from vertex shader.
in vec2 v_texcoord; // Texture coordinates.

// A sampler2D allows us to reference a texture.
uniform sampler2D u_texture;

// Output color for each pixel.
out vec4 outColor;

void main() {
	// Set the output color. texture() looks up a color in a texture.
	outColor = texture(u_texture, v_texcoord);
}
`;

// Summation notation.
const sigma = (min, max, equation, output = 0) => output += equation(min) + (min < max ? sigma(min + 1, max, equation, output) : 0);

// Add/subtract/multiply/divide (etc.) vectors. Add by default.
const operateVectors = (a, b, operation = (a, b) => a + b) => {
	let c = [];
	sigma(0, a.length - 1, (i) => c[i] = operation(a[i], b[i]));
	return c;
};

// Scale a set of vertices by x dimensions.
const scaleVertices = (shape, scale) => {
	shape = [...shape]; // Duplicate to avoid modifying original.
	for (let i = 0; i < shape.length; i++) {
		shape[i] *= scale[i % scale.length];
	}
	return shape;
};

// Normalized vertices of a cube.
const cubeVertices = [
	// Front
	0, 0, 1,
	0, 1, 1,
	1, 0, 1,

	0, 1, 1,
	1, 1, 1,
	1, 0, 1,

	// Back
	1, 0, 0,
	1, 1, 0,
	0, 0, 0,

	1, 1, 0,
	0, 1, 0,
	0, 0, 0,

	// Left
	0, 0, 0,
	0, 1, 0,
	0, 0, 1,

	0, 1, 0,
	0, 1, 1,
	0, 0, 1,

	// Right
	1, 0, 1,
	1, 1, 1,
	1, 0, 0,

	1, 1, 1,
	1, 1, 0,
	1, 0, 0,

	// Top
	0, 0, 0,
	0, 0, 1,
	1, 0, 0,

	0, 0, 1,
	1, 0, 1,
	1, 0, 0,

	// Bottom
	0, 1, 1,
	0, 1, 0,
	1, 1, 1,

	0, 1, 0,
	1, 1, 0,
	1, 1, 1
];

// Texture coordinates to put one full copy of the texture on one rectangle.
// Assumes the rectangle's coordinates are top left triangle-first.
// Assumes that points are declared counter-clockwise, but they should be anyways for CULL_FACE.
const fullRectangleTextureCoordinates = [
	0, 0,
	0, 1,
	1, 0,
	0, 1,
	1, 1,
	1, 0
];

const fullCubeTextureCoordinates = [].concat(
	fullRectangleTextureCoordinates,
	fullRectangleTextureCoordinates,
	fullRectangleTextureCoordinates,
	fullRectangleTextureCoordinates,
	fullRectangleTextureCoordinates,
	fullRectangleTextureCoordinates
);

const CANVAS_DEPTH = 2000;

// Create variables to hold shape properties.
// Do this in the global scope to allow modification via browser console.
const size = [10, 10, 10];
let translation = [0, 0, 0];
let initialTranslation = [0, 0, 0];
let velocity = [0, 0, 0];
let rotation = [0, 0, 0];
let rotationalVelocity = [0, 0, 0];
let scale = [1, 1, 1];
let shapes = 1;

// Create variables to hold camera properties.
// Do this in the global scope to allow modification via browser console.
let fov = 60;
let near = 1;
let far = CANVAS_DEPTH;
let cameraTranslation = [0, 0, 100];
let cameraVelocity = [0, 0, 0];
let cameraRotation = [0, 0, 0];
let cameraRotationalVelocity = [0, 0, 0];
let cameraLookAt = operateVectors(operateVectors(initialTranslation, translation), size, (a, b) => a - b / 2);