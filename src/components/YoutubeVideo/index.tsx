import style from "./style.module.scss";
import type { DetailedHTMLProps, IframeHTMLAttributes } from "react";

export default function YoutubeVideo({
	width,
	height,
	src,
	title,
	allow,
	allowFullScreen,
	...props
}: DetailedHTMLProps<
	IframeHTMLAttributes<HTMLIFrameElement>,
	HTMLIFrameElement
>) {
	// YouTube embed default values.
	width ??= 560;
	height ??= 315;
	title ??= "YouTube video player";
	allow ??=
		"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share;";
	allowFullScreen ??= true;

	// Expect a YouTube video ID as `src`.
	src = `https://www.youtube.com/embed/${src}`;

	return (
		<iframe
			className={style["embed"]}
			width={width}
			height={height}
			src={src}
			title={title}
			allow={allow}
			allowFullScreen={allowFullScreen}
			{...props}
		/>
	);
}
