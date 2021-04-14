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

// Resize the drawing buffer to match the physical canvas size.
const resizeCanvas = (gl) => {
	const displayWidth = gl.canvas.clientWidth;
	const displayHeight = gl.canvas.clientHeight;

	if (gl.canvas.width != displayWidth || gl.canvas.height != displayHeight) {
		gl.canvas.width = displayWidth;
		gl.canvas.height = displayHeight;
	}
};

class Shader {
	constructor(gl, src, type) {
		this.gl = gl;

		this.shader = this.gl.createShader(type);
		this.gl.shaderSource(this.shader, src);
		this.gl.compileShader(this.shader);

		/*
		if (this.gl.getShaderParameter(this.shader, this.gl.COMPILE_STATUS)) {
			console.error(this.gl.getShaderInfoLog(this.shader));
			this.gl.deleteShader(shader);
		}
		*/
	}
}

class ShaderProgram {
	constructor(gl, vertexSrc, fragmentSrc) {
		this.gl = gl;
		this.program = this.gl.createProgram();
		[
			{ src: vertexSrc, type: this.gl.VERTEX_SHADER },
			{ src: fragmentSrc, type: this.gl.FRAGMENT_SHADER }
		].forEach((info) => this.gl.attachShader(this.program, new Shader(this.gl, info.src, info.type).shader));
		this.gl.linkProgram(this.program);

		/*
		if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
			console.error(this.gl.getProgramInfoLog(this.program));
			this.gl.deleteProgram(this.program);
		}
		*/
	}
}

class UMath {
	// Summation notation.
	static sigma = (min, max, equation, output = 0) => output += equation(min) + (min < max ? UMath.sigma(min + 1, max, equation, output) : 0);

	// Convert value in degrees to equivalent value in radians.
	static degreesToRadians = (d) => d * Math.PI / 180;

	// Create a new array with values based on a rule.
	static arrayFromRule = (length, rule = (i) => i) => {
		let output = [];
		for (let i = 0; i < length; i++) {
			output[i] = rule(i);
		}
		return output;
	};
}

class Matrix {
	// Create an identity matrix for the given dimensions.
	static identity = (dim = 4) => UMath.arrayFromRule(dim, (x) => UMath.arrayFromRule(dim, (y) => x == y ? 1 : 0));

	// Defaults to a four-dimensional identity matrix.
	constructor(data = Matrix.identity()) {
		this.data = data;
	}

	// Flatten to a one-dimensional array.
	flatten = () => [].concat(...this.data);

	// Multiply by another matrix via iterative algorithm.
	// If C = AB for an (n * m) matrix A and an (m * p) matrix B, then C is an (n * p) matrix with entries.
	multiply = (b) => {
		// A is this
		// B is b
		// C is the return value.

		const n = this.data.length;
		const m = b.data.length;
		const p = b.data[0].length;

		this.data = UMath.arrayFromRule(n, (i) => UMath.arrayFromRule(p, (j) => UMath.sigma(0, m - 1, (k) => this.data[i][k] * b.data[k][j])));
		return this;
	}

	// Translate by (x, y, z).
	translate = (x, y, z) => this.multiply(new Matrix([
		[1, 0, 0, 0],
		[0, 1, 0, 0],
		[0, 0, 1, 0],
		[x, y, z, 1]
	]));

	// Rotate d degrees about the x axis.
	pitch = (d) => {
		const r = UMath.degreesToRadians(d);
		const c = Math.cos(r);
		const s = Math.sin(r);

		return this.multiply(new Matrix([
			[1, 0, 0, 0],
			[0, c, s, 0],
			[0, -s, c, 0],
			[0, 0, 0, 1]
		]));
	}

	// Rotate d degrees about the y axis.
	yaw = (d) => {
		const r = UMath.degreesToRadians(d);
		const c = Math.cos(r);
		const s = Math.sin(r);

		return this.multiply(new Matrix([
			[c, 0, -s, 0],
			[0, 1, 0, 0],
			[s, 0, c, 0],
			[0, 0, 0, 1]
		]));
	}

	// Rotate d degrees about the z axis.
	roll = (d) => {
		const r = UMath.degreesToRadians(d);
		const c = Math.cos(r);
		const s = Math.sin(r);

		return this.multiply(new Matrix([
			[c, s, 0, 0],
			[-s, c, 0, 0],
			[0, 0, 1, 0],
			[0, 0, 0, 1]
		]));
	}

	// Rotate (x, y, z) degrees.
	rotate = (x, y, z) => this.pitch(x).yaw(y).roll(z);

	// Scale by (x, y, z) times.
	scale = (x, y, z) => this.multiply(new Matrix([
		[x, 0, 0, 0],
		[0, y, 0, 0],
		[0, 0, z, 0],
		[0, 0, 0, 1]
	]));
}

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
	m = [...m]; // Duplicate to avoid modifying original.

	for (let y = 0; y < dim; y++) {
		let d = m[y * dim + y]; // Get the element on the diagonal.

		// If there is a 0 on the diagonal, need to swap with a lower row.
		if (d == 0) {
			for (let y2 = y + 1; y2 < dim; y2++) {
				if (m[y2 * dim + y] != 0) {
					for (let x = 0; x < dim; x++) {
						d = m[y * dim + x];
						m[y * dim + x] = m[y2 * dim + x];
						m[y2 * dim + x] = d;

						d = identity[y * dim + x];
						identity[y * dim + x] = identity[y2 * dim + x];
						identity[y2 * dim + x] = d;
					}

					break;
				}
			}

			d = m[y * dim + y];

			if (d == 0) {
				return; // Matrix is not invertible.
			}
		}

		// Scale the row down so that there is a 1 on the diagonal.
		for (let x = 0; x < dim; x++) {
			m[y * dim + x] /= d;
			identity[y * dim + x] /= d;
		}

		// Subtract this row from all of the others.
		for (let y2 = 0; y2 < dim; y2++) {
			if (y2 == y) {
				continue; // Skip current row.
			}

			d = m[y2 * dim + y];

			for (let x = 0; x < dim; x++) {
				m[y2 * dim + x] -= d * m[y * dim + x];
				identity[y2 * dim + x] -= d * identity[y * dim + x];
			}
		}
	}

	return identity;
};

