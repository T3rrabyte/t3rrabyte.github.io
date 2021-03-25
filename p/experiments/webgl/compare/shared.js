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
uniform sampler2D u_texture0;
uniform sampler2D u_texture1;

// Output color for each pixel.
out vec4 outColor;

void main() {
	// Set the output color. texture() looks up a color in a texture.
	outColor = texture(u_texture0, v_texcoord) * texture(u_texture1, v_texcoord);
}
`;