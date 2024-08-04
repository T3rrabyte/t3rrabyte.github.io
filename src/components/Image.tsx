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
	width?: number | `${number}` | undefined;
	height?: number | `${number}` | undefined;
	fill?: boolean | undefined;
	loader?: ImageLoader | undefined;
	quality?: number | `${number}` | undefined;
	priority?: boolean | undefined;
	loading?: "eager" | "lazy" | undefined;
	placeholder?: PlaceholderValue | undefined;
	blurDataURL?: string | undefined;
	unoptimized?: boolean | undefined;
	overrideSrc?: string | undefined;
	onLoadingComplete?: OnLoadingComplete | undefined;
	layout?: string | undefined;
	objectFit?: string | undefined;
	objectPosition?: string | undefined;
	lazyBoundary?: string | undefined;
	lazyRoot?: string | undefined;
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
	const actualSrc = src ?? "";
	const placeholder =
		"placeholder" in props ? (props.placeholder ?? "blur") : "blur";
	const actualWidth =
		typeof width === "number"
			? width
			: typeof width === "string"
				? parseInt(width, 10)
				: void 0;
	const actualHeight =
		typeof height === "number"
			? height
			: typeof height === "string"
				? parseInt(height, 10)
				: void 0;
	style.display ??= "block";
	style.height ??= "auto";
	style.margin ??= "auto";
	style.width ??= "100%";

	return (
		<NextImage
			alt={alt}
			src={actualSrc}
			style={style}
			width={actualWidth}
			height={actualHeight}
			placeholder={placeholder}
			{...props}
		/>
	);
}
