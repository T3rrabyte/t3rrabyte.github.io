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

const loadTexture = (gl, texture, url) => new Promise((resolve, reject) => {
	const image = new Image();
	if ((new URL(url, location.href)).origin != location.origin) { image.crossOrigin = ''; } // Request CORS.
	image.addEventListener('load', () => {
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
		gl.generateMipmap(gl.TEXTURE_2D);
		resolve();
	});
	image.src = url;
});

const cubePositions = [
	1, 1, 1, // 0
	1, 1, -1, // 1
	1, -1, 1, // 2
	1, -1, -1, // 3
	-1, 1, 1, // 4
	-1, 1, -1, // 5
	-1, -1, 1, // 6
	-1, -1, -1 // 7
];

const cubeIndices = [
	// Front
	6, 4, 2,
	4, 0, 2,

	// Back
	3, 1, 7,
	1, 5, 7,

	// Left
	7, 5, 6,
	5, 4, 6,

	// Right
	2, 0, 3,
	0, 1, 3,

	// Top
	7, 6, 3,
	6, 2, 3,

	// Bottom
	4, 5, 0,
	5, 1, 0
];

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
}

class UArray extends Array {
	// Creates a new array with values based on a rule.
	static fromRule = (length, rule = (i) => i) => {
		let output = new Vector();
		for (let i = 0; i < length; i++) {
			output[i] = rule(i);
		}
		return output;
	};

	constructor(...data) {
		super();
		this.setValues(...data);
	}

	// Equivalent to "this = []".
	setValues = (...values) => {
		while (this.length > 0) {
			this.pop();
		}
		for (let i = 0; i < values.length; i++) {
			this[i] = values[i];
		}
		return this;
	}
}

class Vector extends UArray {
	// Find the cross product of this and another vector.
	cross = (vector) => UArray.fromRule(this.data.length, (i) => {
		const increment = (num) => num + 1 >= this.length ? 0 : num + 1;
		i = increment(i);
		let j = increment(i);
		return this[i] * vector[j] - this[j] * vector[i];
	});

	// Perform an operation between two vectors.
	operate = (vector, operation = (a, b) => a + b) => {
		for (let i = 0; i < this.length; i++) {
			this[i] = operation(this[i], vector[i]);
		}
		return this;
	};

	// Normalize vector length to point on unit circle.
	normalize = () => this.operate(this, (length) => length / Math.sqrt(UMath.sigma(0, this.length - 1, (i) => this[i] * this[i])));
}

class Matrix extends UArray {
	// Create an identity matrix for the given dimensions.
	static identity = (dim = 4) => UArray.fromRule(dim, (x) => UArray.fromRule(dim, (y) => x == y ? 1 : 0));

	// Defaults to a four-dimensional identity matrix.
	constructor(...data) {
		super(...(data.length ? data : Matrix.identity()));
	}

	// Flatten to a one-dimensional array.
	// WebGL uses column-wise matrices, so columnWise should be set to true for use with WebGL.
	flatten = (columnWise) => {
		const output = [];
		for (let x = 0; x < this.length; x++) {
			for (let y = 0; y < this[x].length; y++) {
				output.push(this[columnWise ? y : x][columnWise ? x : y]);
			}
		}
		return output;
	};

	// Multiply by another matrix via iterative algorithm.
	// If C = AB for an (n * m) matrix A and an (m * p) matrix B, then C is an (n * p) matrix with entries.
	// WebGL uses column-wise matrices, so columnWise should be set to true for use with WebGL.
	multiply = (matrix, columnWise) => {
		// A is this
		// B is matrix
		// C is the return value.

		const n = this.length;
		const m = matrix.length;
		const p = matrix[0].length;

		this.setValues(...UArray.fromRule(n, (i) => UArray.fromRule(p, (j) => UMath.sigma(0, m - 1, (k) =>
			this[columnWise ? k : i][columnWise ? i : k] * matrix[columnWise ? j : k][columnWise ? k : j]))));
		return this;
	}

	// Translate by (x, y, z).
	translate = (x, y, z) => this.multiply(new Matrix(
		[1, 0, 0, 0],
		[0, 1, 0, 0],
		[0, 0, 1, 0],
		[x, y, z, 1]
	), true);

	// Rotate d degrees about the x axis.
	pitch = (d) => {
		const r = UMath.degreesToRadians(d);
		const c = Math.cos(r);
		const s = Math.sin(r);

		return this.multiply(new Matrix(
			[1, 0, 0, 0],
			[0, c, s, 0],
			[0, -s, c, 0],
			[0, 0, 0, 1]
		), true);
	}

	// Rotate d degrees about the y axis.
	yaw = (d) => {
		const r = UMath.degreesToRadians(d);
		const c = Math.cos(r);
		const s = Math.sin(r);

		return this.multiply(new Matrix(
			[c, 0, -s, 0],
			[0, 1, 0, 0],
			[s, 0, c, 0],
			[0, 0, 0, 1]
		), true);
	}

	// Rotate d degrees about the z axis.
	roll = (d) => {
		const r = UMath.degreesToRadians(d);
		const c = Math.cos(r);
		const s = Math.sin(r);

		return this.multiply(new Matrix(
			[c, s, 0, 0],
			[-s, c, 0, 0],
			[0, 0, 1, 0],
			[0, 0, 0, 1]
		), true);
	}

	// Rotate (x, y, z) degrees.
	rotate = (x, y, z) => this.pitch(x).yaw(y).roll(z);

	// Scale by (x, y, z) times.
	scale = (x, y, z) => this.multiply(new Matrix(
		[x, 0, 0, 0],
		[0, y, 0, 0],
		[0, 0, z, 0],
		[0, 0, 0, 1]
	), true);

	// Invert a matrix via Gaussian elimination. Based on work by Andrew Ippoliti. Only possible for square matrices.
	invert = () => {
		/*
		if (this.data.length != this.data[0].length) {
			return; // Not square.
		}
		*/

		const dim = this.length;
		const identity = Matrix.identity(dim);
		const copy = [...this]; // Work with a copy so that failing to execute doesn't ruin the Matrix.

		for (let i = 0; i < dim; i++) {
			let diagonal = copy[i][i]; // Get the element on the diagonal.

			// Swap with a lower row if there is a 0 on the diagonal.
			if (diagonal == 0) {
				// Look through every lower row.
				for (let ii = i + 1; ii < dim; ii++) {
					// If the row has a non-zero on the correct column, we swap them.
					if (copy[ii][i] != 0) {
						for (let j = 0; j < dim; j++) {
							diagonal = copy[i][j];
							copy[i][j] = copy[ii][j];
							copy[ii][j] = diagonal;

							diagonal = identity[i][j];
							identity[i][j] = identity[ii][j];
							identity[ii][j] = diagonal;
						}

						break;
					}
				}

				diagonal = copy[i][i];

				if (diagonal == 0) {
					return; // Matrix is not invertible.
				}
			}

			// Scale the row by the diagonal so that all diagonals are 1.
			for (let j = 0; j < dim; j++) {
				copy[i][j] = copy[i][j] / diagonal;
				identity[i][j] = identity[i][j] / diagonal;
			}

			// Subtract the row from all other rows so that there are 0s in this column in other rows.
			for (let ii = 0; ii < dim; ii++) {
				if (ii == i) {
					continue;
				}

				diagonal = copy[ii][i];

				for (let j = 0; j < dim; j++) {
					copy[ii][j] -= diagonal * copy[i][j];
					identity[ii][j] -= diagonal * identity[i][j];
				}
			}
		}

		// After all operations, copy will be the identity and identity will be the inverse.
		return this.multiply(new Matrix(...identity), true);
	};
}

class Camera extends Matrix {
	constructor() {
		super(); // Always construct a camera using the default identity matrix.
	}

	// Make camera convert screen space directly to clip space.
	orthographic = (left, right, bottom, top, near, far) => this.multiply(new Matrix(
		[2 / (right - left), 0, 0, 0],
		[0, 2 / (top - bottom), 0, 0],
		[0, 0, 2 / (near - far), 0],
		[(left + right) / (left - right), (bottom + top) / (bottom - top), (near + far) / (near - far), 1]
	));

	// Apply perspective to the camera.
	perspective = (fov, aspectRatio, near, far) => {
		const f = Math.tan(Math.PI * 0.5 - 0.5 * UMath.degreesToRadians(fov));
		const range = 1.0 / (near - far);
		return this.multiply(new Matrix(
			[f / aspectRatio, 0, 0, 0],
			[0, f, 0, 0],
			[0, 0, (near + far) * range, -1],
			[0, 0, near * far * range * 2, 0]
		));
	}

	// Position camera and face towards a position.
	lookAt = (position, targetPosition, up = new Vector(0, 1, 0)) => {
		const zAxis = new Vector(...position).operate(targetPosition, (a, b) => a - b).normalize();
		const xAxis = up.cross(zAxis).normalize();
		const yAxis = new Vector(...zAxis).cross(xAxis).normalize();

		return this.multiply(new Matrix(
			[...xAxis, 0],
			[...yAxis, 0],
			[...zAxis, 0],
			[...position, 1]
		));
	};
}
