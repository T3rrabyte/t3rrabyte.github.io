// Vertex shader source code written in GLSL ES 3.00.
const vertexShaderSource = `#version 300 es
// Version must be declared before anything else - including comments and newlines.

// Attributes (inputs) are used where data is different for each vertex.
in vec4 a_position; // Vertex positions.
in vec2 a_texcoord; // Texture coordinates.
in vec4 a_hue; // Color.

// Varyings (outputs) pass data from the vertex shader to the fragment shader.
out vec2 v_texcoord; // Texture coordinates.
out vec4 v_hue; // Color.

// Uniforms are used where data is the same for each vertex.
uniform mat4 u_matrix; // Transforms.

void main() {
	// gl_Position is a special variable that the vertex shader is responsible for setting. It determines the position of the vertex.
	gl_Position = u_matrix * a_position;

	v_texcoord = a_texcoord;
	v_hue = a_hue;
}`;

// Fragment shader source code written in GLSL ES 3.00.
const fragmentShaderSource = `#version 300 es
// Version must be declared before anything else - including comments and newlines.

// Declare default precision.
precision highp float;

// Accept varyings (inputs) from the vertex shader.
in vec2 v_texcoord;
in vec4 v_hue;

// A sampler2D allows us to reference a texture.
uniform sampler2D u_texture;
uniform sampler2D u_textureMask;

// Output the color of each pixel.
out vec4 outColor;

void main() {
	// Set the output color. texture() looks up a color in a texture.
	outColor = texture(u_texture, v_texcoord) * texture(u_textureMask, v_texcoord) * v_hue;
}`;

// Create a shader from source code.
const createShader = (gl, type, src) => {
	const shader = gl.createShader(type);
	gl.shaderSource(shader, src);
	gl.compileShader(shader);

	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		console.error(gl.getShaderInfoLog(shader));
		gl.deleteShader(shader);
		return;
	}

	return shader;
};

// Create a shader program from shaders.
const createProgram = (gl, ...shaders) => {
	const program = gl.createProgram();
	shaders.forEach((shader) => gl.attachShader(program, shader));
	gl.linkProgram(program);

	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		console.error(gl.getProgramInfoLog(program));
		gl.deleteProgram(program);
		return;
	}

	return program;
};

// Resize the drawing buffer to match the physical canvas size.
const resizeCanvas = (gl) => {
	const displayWidth = gl.canvas.clientWidth;
	const displayHeight = gl.canvas.clientHeight;

	if (gl.canvas.width != displayWidth || gl.canvas.height != displayHeight) {
		gl.canvas.width = displayWidth;
		gl.canvas.height = displayHeight;
	}
};

// Summation notation.
const sigma = (min, max, equation, output = 0) => output += equation(min) + (min < max ? sigma(min + 1, max, equation, output) : 0);

// Create a new array with values based on a rule.
const arrayFromRule = (length = 1, rule = (i) => i) => {
	let output = [];
	for (let i = 0; i < length; i++) {
		output[i] = rule(i);
	}
	return output;
};
// TODO: Rewrite some methods to use arrayFromRule instead of sigma.

// Convert degrees to radians.
const degreesToRadians = (d = 0) => d * Math.PI / 180;

// Multiply matrices via iterative algorithm. Column-wise traversal.
const multiplyMatrices = (a, b, m = 4) => {
	const n = a.length / m;
	const p = b.length / m;

	let c = [];
	sigma(0, n - 1, (i) => sigma(0, p - 1, (j) => c[j * n + i] = sigma(0, m - 1, (k) => a[k * n + i] * b[j * m + k])));
	return c;
};

// Make an identity matrix for a given dimension.
const identityMatrix = (dim = 4) => {
	let output = [];
	sigma(0, dim - 1, (x) => sigma(0, dim - 1, (y) => output[y * dim + x] = x == y ? 1 : 0));
	return output;
};

// Make a matrix which translates by (x, y, z).
const translationMatrix = (x = 0, y = 0, z = 0) => [
	1, 0, 0, 0,
	0, 1, 0, 0,
	0, 0, 1, 0,
	x, y, z, 1
];

// Create a matrix which rotates by d degrees about the x axis.
const pitchMatrix = (d = 0) => {
	const r = degreesToRadians(d);
	const c = Math.cos(r);
	const s = Math.sin(r);
	return [
		1, 0, 0, 0,
		0, c, s, 0,
		0, -s, c, 0,
		0, 0, 0, 1
	];
};

// Create a matrix which rotates by d degrees about the y axis.
const yawMatrix = (d = 0) => {
	const r = degreesToRadians(d);
	const c = Math.cos(r);
	const s = Math.sin(r);
	return [
		c, 0, -s, 0,
		0, 1, 0, 0,
		s, 0, c, 0,
		0, 0, 0, 1
	];
};

// Create a matrix which rotates by d degrees about the z axis.
const rollMatrix = (d = 0) => {
	const r = degreesToRadians(d);
	const c = Math.cos(r);
	const s = Math.sin(r);
	return [
		c, s, 0, 0,
		-s, c, 0, 0,
		0, 0, 1, 0,
		0, 0, 0, 1
	];
};

// Create a matrix which rotates by x degrees about the x axis, y degrees about the y axis, and z degrees about the z axis.
const rotationMatrix = (x = 0, y = 0, z = 0) => multiplyMatrices(multiplyMatrices(pitchMatrix(x), yawMatrix(y)), rollMatrix(z));

// Create a matrix which scales by (x, y, z) times.
const scaleMatrix = (x = 1, y = 1, z = 1) => [
	x, 0, 0, 0,
	0, y, 0, 0,
	0, 0, z, 0,
	0, 0, 0, 1
];

// Create a matrix which converts screen space to clip space.
const orthographicMatrix = (left, right, bottom, top, near, far) => [
	2 / (right - left), 0, 0, 0,
	0, 2 / (top - bottom), 0, 0,
	0, 0, 2 / (near - far), 0,
	(left + right) / (left - right), (bottom + top) / (bottom - top), (near + far) / (near - far), 1
];

// Create a matrix which applies perspective to a camera.
const perspectiveMatrix = (fov = 60, aspectRatio, near = 1, far = 2000) => {
	const f = Math.tan(Math.PI * 0.5 - 0.5 * degreesToRadians(fov));
	const range = 1.0 / (near - far);
	return [
		f / aspectRatio, 0, 0, 0,
		0, f, 0, 0,
		0, 0, (near + far) * range, -1,
		0, 0, near * far * range * 2, 0
	];
};

// Invert a matrix via Gaussian elimination. Based on work by Andrew Ippoliti. Only possible for square matrices.
const invertMatrix = (m) => {
	const dim = Math.sqrt(m.length);
	const identity = identityMatrix(dim);
	m = [...m];

	sigma(0, dim - 1, (y) => {
		let d = m[y * dim + y];

		if (d == 0) {
			sigma(y + 1, dim - 1, (y2) => {
				if ()
			})
		}
	})
};