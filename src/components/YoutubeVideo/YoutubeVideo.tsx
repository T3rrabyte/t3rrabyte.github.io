import type { IframeProps } from "#Props";
import style from "./youtube-video.module.scss";

export default function YoutubeVideo({
	// Default values taken from YouTube.
	width = 560,
	height = 315,
	title = "YouTube video player",
	allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share;",
	referrerPolicy = "strict-origin-when-cross-origin",
	allowFullScreen = true,

	src,
	className,
	...props
}: IframeProps) {
	const youtubeVideoClassName = style["youtube-video"];

	const fullClassName = youtubeVideoClassName
		? className
			? `${youtubeVideoClassName} ${className}`
			: youtubeVideoClassName
		: className;

	const actualSrc = src
		? /^https?:\/\//iu.test(src)
			? src
			: `https://www.youtube-nocookie.com/embed/${src}`
		: "";

	return (
		<iframe
			className={fullClassName}
			width={width}
			height={height}
			src={actualSrc}
			title={title}
			allow={allow}
			referrerPolicy={referrerPolicy}
			allowFullScreen={allowFullScreen}
			{...props}
		/>
	);
}
