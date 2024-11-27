import NextImage, { type ImageProps as NextImageProps } from "next/image";
import type { JSX } from "react";

export type ImageProps = NextImageProps | JSX.IntrinsicElements["img"];

export default function Image({
	alt = "",
	src,
	style = {},
	width,
	height,
	...props
}: ImageProps) {
	// Apply default styling.
	style.display ??= "block";
	style.height ??= "auto";
	style.margin ??= "auto";
	style.width ??= "100%";

	// Recombine arguments into one object (so that default arguments can be applied).
	const actualProps: ImageProps = {
		alt,
		src: src ?? "",
		style,
		...props
	};

	// Apply width if present.
	if (typeof width === "number") {
		actualProps.width = width;
	} else if (width) {
		actualProps.width = parseInt(width, 10);
	}

	// Apply height if present.
	if (typeof height === "number") {
		actualProps.height = height;
	} else if (height) {
		actualProps.height = parseInt(height, 10);
	}

	// Apply default placeholder type unless specified.
	actualProps.placeholder =
		"placeholder" in props ? (props.placeholder ?? "blur") : "blur";

	return <NextImage {...actualProps} />;
}
