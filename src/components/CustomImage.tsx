import Image from "next/image";
import type { ImageProps } from "next/image.js";

// vercel/next.js#56153
export default function CustomImage(props: ImageProps) {
	// eslint-disable-next-line jsx-a11y/alt-text
	return <Image {...props} />;
}
