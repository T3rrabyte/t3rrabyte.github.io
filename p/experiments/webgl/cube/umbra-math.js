// Umbra Math version 1.0
// Copyright (c) Travis Martin 2021
// MIT License

// Generic useful math functions.
class UMath {
	// Summation notation.
	static sigma = (min, max, equation, output = 0) => output += equation(min) + (min < max ? UMath.sigma(min + 1, max, equation, output) : 0);

	// Convert value in degrees to equivalent value in radians.
	static degreesToRadians = (d) => d * Math.PI / 180;
}

// Custom array class with methods that are useful for both Vectors and Matrices.
class UArray extends Array {
	// Create a new UArray with values based on a rule.
	static fromRule(length, rule = (i) => i) {
		let data = [];
		for (let i = 0; i < length; i++) {
			data[i] = rule(i);
		}
		return new UArray(...data);
	}

	constructor(...data) {
		super();
		this.setData(...data);
	}

	// Returns a copy of this UArray.
	copy = () => new UArray(...this);

	// "this.setData(...data);" = "this = [...data];"
	setData(...data) {
		while (this.length > 0) {
			this.pop();
		}
		for (let i = 0; i < data.length; i++) {
			this[i] = data[i];
		}
		return this;
	}

	// Remove the first instance of an element from this UArray.
	remove(element) {
		this.splice(this.indexOf(element), 1);
	}
};

// Represents a point in space.
class Vector extends UArray {
	// Find the cross product of this and another Vector.
	cross = (vector) => this.setData(...UArray.fromRule(this.length, (i) => {
		const loopingIncrement = (i) => i + 1 >= this.length ? 0 : i + 1;
		i = loopingIncrement(i);
		let j = loopingIncrement(i);
		return this[i] * vector[j] - this[j] * vector[i];
	}));

	// Returns a copy of this Vector.
	copy = () => new Vector(...this);

	// Perform an operation between two Vectors. Defaults to addition.
	operate = (vector, operation = (a, b) => a + b) => this.setData(...UArray.fromRule(this.length, (i) => operation(this[i], vector[i])));

	// Normalize Vector length to a point on a unit circle (etc.)
	normalize = () => this.setData(...UArray.fromRule(this.length, (i) => this[i] / this.magnitude));

	// Multiply the Vector by a Matrix to apply transforms.
	transform = (matrix) => this.setData(...new Matrix(...matrix).multiply(this));

	// Find the magnitude (length) of the Vector.
	get magnitude() {
		return Math.sqrt(UMath.sigma(0, this.length - 1, (i) => this[i] ** 2));
	}
}

// Used primarily to transform Vectors in WebGL.
class Matrix extends UArray {
	static fromRule(width, height, rule) {
		let data = [];
		for (let x = 0; x < width; x++) {
			for (let y = 0; y < height; y++) {
				data[y * width + x] = rule(x, y);
			}
		}
		return new Matrix(...data);
	}

	// Create an identity Matrix with the given number of dimensions. Defaults to 4 dimensions.
	static identity = (dim = 4) => Matrix.fromRule(dim, dim, (x, y) => x == y ? 1 : 0);

	// Creates a new Matrix. Defaults to a 4D identity Matrix.
	constructor(...data) {
		super(...(data.length ? data : Matrix.identity()));
	}

	// Creates a copy of this Matrix.
	copy = () => new Matrix(...this);

	// "array.getPoint(x, y);" = "matrix[y][x];", where "array" contains the same data as "matrix" when flattened in row-major order.
	getPoint = (x, y, width = Math.sqrt(this.length)) => this[y * width + x];

	// "array.setPoint(x, y, value);" = "matrix[y][x] = value;", where "array" contains the same data as "matrix" when flattened in row-major order.
	setPoint = (x, y, value, width = Math.sqrt(this.length)) => (this[y * width + x] = value) ? this : this;

	// Multiply by another Matrix via iterative algorithm.
	// If C = AB for an (n * m) Matrix A and an (m * p) Matrix B, then C is an (n * p) Matrix with entries.
	multiply(matrix, m = Math.sqrt(this.length)) {
		matrix = new Matrix(...matrix); // Allow matrix to be any iterable type.

		// A is this.
		// B is matrix.
		// C is the return value.

		const n = this.length / m;
		const p = matrix.length / m;

		return this.setData(...Matrix.fromRule(n, p, (i, j) => UMath.sigma(0, m - 1, (k) => this.getPoint(i, k) * matrix.getPoint(k, j))));
	}

	// Translate by (x, y, z).
	translate = (x, y, z) => this.multiply([
		1, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 1, 0,
		x, y, z, 1
	]);

	// Rotate d degrees about the x axis.
	pitch(d) {
		const r = UMath.degreesToRadians(d);
		const c = Math.cos(r);
		const s = Math.sin(r);

		return this.multiply([
			1, 0, 0, 0,
			0, c, s, 0,
			0, -s, c, 0,
			0, 0, 0, 1
		]);
	}

	// Rotate d degrees about the y axis.
	yaw(d) {
		const r = UMath.degreesToRadians(d);
		const c = Math.cos(r);
		const s = Math.sin(r);

		return this.multiply([
			c, 0, -s, 0,
			0, 1, 0, 0,
			s, 0, c, 0,
			0, 0, 0, 1
		]);
	}

	// Rotate d degrees about the z axis.
	roll(d) {
		const r = UMath.degreesToRadians(d);
		const c = Math.cos(r);
		const s = Math.sin(r);

		return this.multiply([
			c, s, 0, 0,
			-s, c, 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1
		]);
	}

	// Perform pitch(x), yaw(y), and roll(z).
	rotate = (x, y, z) => this.pitch(x).yaw(y).roll(z);

	// Scale by (x, y, z) times.
	scale = (x, y, z) => this.multiply([
		x, 0, 0, 0,
		0, y, 0, 0,
		0, 0, z, 0,
		0, 0, 0, 1
	]);

	// Invert a matrix via Gaussian elimination.
	// Based on work by Andrew Ippoliti.
	invert(dim = Math.sqrt(this.length)) {
		if (dim ** 2 != this.length) {
			throw 'Cannot invert a non-square Matrix.';
		}

		const identity = Matrix.identity(dim);
		const copy = this.copy(); // Make duplicate to avoid modifying the Matrix in case of failure.

		// Perform elementary row operations.
		for (let i = 0; i < dim; i++) {
			let diagonal = copy.getPoint(i, i); // Get the element on the diagonal.

			// If there is a 0 on the diagonal, swap this row with a lower row.
			if (diagonal == 0) {
				for (let ii = i + 1; ii < dim; ii++) {
					if (copy.getPoint(ii, i) != 0) {
						for (let j = 0; j < dim; j++) {
							// Swap the rows in each Matrix.
							[copy, identity].forEach((matrix) => {
								let temp = matrix.getPoint(i, j);
								matrix.setPoint(i, j, matrix.getPoint(ii, j));
								matrix.setPoint(ii, j, temp);
							});
						}

						break;
					}
				}

				diagonal = copy.getPoint(i, i); // Get the new diagonal after swaps.

				// If the diagonal is still 0, the Matrix is not invertible.
				if (diagonal == 0) {
					throw 'Matrix is not invertible.';
				}
			}

			// Scale this row down by the diagonal so that there is a 1 on the diagonal.
			for (let j = 0; j < dim; j++) {
				[copy, identity].forEach((matrix) => matrix.setPoint(i, j, matrix.getPoint(i, j) / diagonal));
			}

			// Subtract this row from all of the other rows so that there are 0s in this column in the rows above and below this one.
			for (let ii = 0; ii < dim; ii++) {
				if (ii == i) {
					continue;
				}

				let temp = copy.getPoint(ii, i);

				for (let j = 0; j < dim; j++) {
					[copy, identity].forEach((matrix) => matrix.setPoint(ii, j, matrix.getPoint(ii, j) - temp * matrix.getPoint(i, j)));
				}
			}
		}

		// Copy should now match the identity, and identity should now be the inverse.
		return this.setData(...identity);
	}

	// Convert clip space to screen space.
	orthographic = (left, right, top, bottom, near, far) => this.multiply([
		2 / (right - left), 0, 0, 0,
		0, 2 / (top - bottom), 0, 0,
		0, 0, 2 / (near - far), 0,
		(left + right) / (left - right), (bottom + top) / (bottom - top), (near + far) / (near - far), 1
	]);
	
	// Apply perspective to a camera Matrix.
	perspective(fov, aspectRatio, near, far) {
		const f = Math.tan(Math.PI * 0.5 - 0.5 * UMath.degreesToRadians(fov));
		const range = 1.0 / (near - far);

		return this.multiply([
			f / aspectRatio, 0, 0, 0,
			0, f, 0, 0,
			0, 0, (near + far) * range, -1,
			0, 0, near * far * range * 2, 0
		]);
	}

	// Rotate towards target. Also effectively applies "this.translate(...position);"
	lookAt(position, target, up = [0, 1, 0]) {
		const zAxis = new Vector(...position).operate(target, (a, b) => a - b).normalize();
		const xAxis = new Vector(...up).cross(zAxis).normalize();
		const yAxis = zAxis.copy().cross(xAxis).normalize();

		return this.multiply([
			...xAxis, 0,
			...yAxis, 0,
			...zAxis, 0,
			...position, 1
		]);
	}
}

// Export CommonJS package.
if (typeof module == 'object') {
	module.exports = {
		UMath,
		UArray,
		Vector,
		Matrix
	};
}