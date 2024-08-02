import type { MetadataRoute } from "next";
import domain from "#domain";

export default function sitemap(): MetadataRoute.Sitemap {
	return [
		{ url: `${domain}/a/cccv` },
		{ url: `${domain}/a/esojs` },
		{ url: `${domain}/a/mc` },
		{ url: `${domain}/a/mtg` },
		{ url: `${domain}/a/pedit5` },
		{ url: `${domain}/a/q_rsqrt` },
		{ url: `${domain}/a/webgl/3d` },
		{ url: `${domain}/a/webgl/attributes` },
		{ url: `${domain}/a/webgl/cubemaps` },
		{ url: `${domain}/a/webgl/fog` },
		{ url: `${domain}/a/webgl/framebuffers` },
		{ url: `${domain}/a/webgl/glossary` },
		{ url: `${domain}/a/webgl/gpgpu` },
		{ url: `${domain}/a/webgl/image-processing` },
		{ url: `${domain}/a/webgl/intro` },
		{ url: `${domain}/a/webgl/lighting` },
		{ url: `${domain}/a/webgl/loss-of-context` },
		{ url: `${domain}/a/webgl/picking` },
		{ url: `${domain}/a/webgl/program-structure` },
		{ url: `${domain}/a/webgl/scene-graph` },
		{ url: `${domain}/a/webgl/shaders` },
		{ url: `${domain}/a/webgl/shadows` },
		{ url: `${domain}/a/webgl/skinning` },
		{ url: `${domain}/a/webgl/text` },
		{ url: `${domain}/a/webgl/textures` },
		{ url: `${domain}/a/webgl/transformation` },
		{ url: `${domain}/a/webgl/transparency` },
		{ url: `${domain}/a/webgl/uniforms` },
		{ url: `${domain}/a/webgl/varyings` },
		{ url: `${domain}/a/webgl` },
		{ url: `${domain}/blog` },
		{ url: `${domain}/portfolio` },
		{ url: `${domain}/` }
	];
}
