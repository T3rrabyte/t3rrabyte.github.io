import type {
	DetailedHTMLProps,
	ImgHTMLAttributes,
	RefAttributes
} from "react";
import type {
	ImageLoader,
	OnLoadingComplete,
	PlaceholderValue,
	StaticImport
} from "next/dist/shared/lib/get-img-props";
import { default as NextImage } from "next/image";

// Equivalent to the props that can be passed to a Next.js image.
export type ImageProps = Omit<
	DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>,
	"height" | "width" | "loading" | "ref" | "alt" | "src" | "srcSet"
> & {
	src: string | StaticImport;
	alt: string;
	width?: number | `${number}`;
	height?: number | `${number}`;
	fill?: boolean;
	loader?: ImageLoader;
	quality?: number | `${number}`;
	priority?: boolean;
	loading?: "eager" | "lazy" | undefined;
	placeholder?: PlaceholderValue;
	blurDataURL?: string;
	unoptimized?: boolean;
	overrideSrc?: string;
	onLoadingComplete?: OnLoadingComplete;
	layout?: string;
	objectFit?: string;
	objectPosition?: string;
	lazyBoundary?: string;
	lazyRoot?: string;
} & RefAttributes<HTMLImageElement | null>;

export type PlainImageProps = DetailedHTMLProps<
	ImgHTMLAttributes<HTMLImageElement>,
	HTMLImageElement
>;

export default function Image({
	alt = "",
	src,
	style = {},
	width,
	height,
	...props
}: ImageProps | PlainImageProps) {
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
	} else if (typeof width === "string") {
		actualProps.width = parseInt(width, 10);
	}

	// Apply height if present.
	if (typeof height === "number") {
		actualProps.height = height;
	} else if (typeof height === "string") {
		actualProps.height = parseInt(height, 10);
	}

	// Apply default placeholder type unless specified.
	actualProps.placeholder =
		"placeholder" in props ? (props.placeholder ?? "blur") : "blur";

	return <NextImage {...actualProps} />;
}
