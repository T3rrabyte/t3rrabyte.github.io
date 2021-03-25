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

// Resize the drawing buffer to its actual canvas size.
const resizeCanvas = (gl) => {
	const displayWidth = gl.canvas.clientWidth;
	const displayHeight = gl.canvas.clientHeight;

	if (gl.canvas.width != displayWidth || gl.canvas.height != displayHeight) {
		gl.canvas.width = displayWidth;
		gl.canvas.height = displayHeight;
	}
};

// Get a random integer value between the minimum and maximum (inclusive).
const randomInt = (min, max) => Math.floor(Math.random() * (Math.abs(max - min) + 1)) + min;

// Restrict a number between the minimum and maximum values (inclusive).
const clamp = (min, number, max) => Math.max(min, Math.min(number, max));

// Multiply matrices.
// https://wikipedia.org/wiki/Matrix_multiplication_algorithm#Iterative_algorithm
// Column-wise traversal.
const multiplyMatrices = (a, b, m = 4) => {
	const n = a.length / m;
	const p = b.length / m;

	// a[i][k] = a[k * n + i]
	// b[k][j] = b[j * m + k]
	// c[i][j] = c[j * n + i]

	let c = [];
	sigma(0, n - 1, (i) => sigma(0, p - 1, (j) => c[j * n + i] = sigma(0, m - 1, (k) => a[k * n + i] * b[j * m + k])));

	return c;
};

// Row-wise traversal.
const multiplyMatricesRowWise = (a, b, m = 4) => {
	const n = a.length / m;
	const p = b.length / m;

	let c = [];
	sigma(0, n - 1, (i) => sigma(0, p - 1, (j) => c[i * p + j] = sigma(0, m - 1, (k) => a[i * m + k] * b[k * p + j])));

	return c;
};

// Identity matrix.
const identityMatrix = (dim = 4) => {
	let output = [];
	sigma(0, dim - 1, (x) => sigma(0, dim - 1, (y) => output[y * dim + x] = x == y ? 1 : 0));
	return output;
};

// Create a matrix to translate by (x, y).
const translationMatrix = (x = 0, y = 0, z = 0) => [
	1, 0, 0, 0,
	0, 1, 0, 0,
	0, 0, 1, 0,
	x, y, z, 1
];

const degreesToRadians = (d) => d * Math.PI / 180;

// Create a matrix to rotate by degrees (x axis).
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

// Create a matrix to rotate by degrees (y axis).
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

// Create a matrix to rotate by degrees (z axis).
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

// Combine the rotation matrix calculations.
const rotationMatrix = (pitch = 0, yaw = 0, roll = 0) => multiplyMatrices(multiplyMatrices(pitchMatrix(pitch), yawMatrix(yaw)), rollMatrix(roll));

// Create a matrix to scale by (x, y) times.
const scaleMatrix = (x = 1, y = 1, z = 1) =>  [
	x, 0, 0, 0,
	0, y, 0, 0,
	0, 0, z, 0,
	0, 0, 0, 1
];

// Create a matrix to convert screen to clip space.
// Equivalent to scale(1 / resolution) * scale(2) * translate(-1) * scale(0, -1)
const orthographicMatrix = (left, right, bottom, top, near, far) => [
	2 / (right - left), 0, 0, 0,
	0, 2 / (top - bottom), 0, 0,
	0, 0, 2 / (near - far), 0,
	(left + right) / (left - right), (bottom + top) / (bottom - top), (near + far) / (near - far), 1
];

// Apply perspective to the camera.
const perspectiveMatrix = (fieldOfView = 45, aspectRatio, near, far) => {
	const f = Math.tan(Math.PI * 0.5 - 0.5 * degreesToRadians(fieldOfView));
	const range = 1.0 / (near - far);

	return [
		f / aspectRatio, 0, 0, 0,
		0, f, 0, 0,
		0, 0, (near + far) * range, -1,
		0, 0, near * far * range * 2, 0
	];
};

// Invert a matrix.
// Based on Gaussian elimination: https://en.wikipedia.org/wiki/Gaussian_elimination
// Based on work by Andrew Ippoliti: http://blog.acipo.com/matrix-inversion-in-javascript/
// Only possible for (n * n) (square) matrices.
const invertMatrix = (m) => {
	const dim = Math.sqrt(m.length);

	const identity = identityMatrix(dim);
	m = [...m]; // Duplicate to avoid modifying original.

	for (let y = 0; y < dim; y++) {
		// Get the element on the diagonal.
		let d = m[y * dim + y];

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

// Find the cross product of two vectors. Only possible for three-dimensional vectors.
// Technically also possible for seven-dimensional vectors, but this doesn't cover that.
const crossVectors = (a, b) => [
	a[1] * b[2] - a[2] * b[1],
	a[2] * b[0] - a[0] * b[2],
	a[0] * b[1] - a[1] * b[0]
];

// Normalize vector length to point on unit circle/sphere (et cetera).
// Warning: might cause division by 0 error.
const normalizeVector = (v) => operateVectors(v, v, (length) => length / Math.sqrt(sigma(0, v.length - 1, (i) => v[i] * v[i])));

// Camera angle matrix.
const lookAtMatrix = (cameraPosition, target, up = [0, 1, 0]) => {
	const zAxis = normalizeVector(operateVectors(cameraPosition, target, (a, b) => a - b));
	const xAxis = normalizeVector(crossVectors(up, zAxis));
	const yAxis = normalizeVector(crossVectors(zAxis, xAxis));

	return [
		xAxis[0], xAxis[1], xAxis[2], 0,
		yAxis[0], yAxis[1], yAxis[2], 0,
		zAxis[0], zAxis[1], zAxis[2], 0,
		cameraPosition[0], cameraPosition[1], cameraPosition[2], 1
	];
};

// Normalized vertices of a triangular pyramid.
const pyramidVertices = [
	0.5, 0, 0,
	0, 0, 1,
	1, 0, 1,

	0.5, 1, 0.5,
	0, 0, 1,
	0.5, 0, 0,

	0.5, 1, 0.5,
	0.5, 0, 0,
	1, 0, 1,

	0.5, 1, 0.5,
	1, 0, 1,
	0, 0, 1
];