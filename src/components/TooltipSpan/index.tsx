"use client";

import style from "./style.module.scss";
import {
	type DetailedHTMLProps,
	type HTMLAttributes,
	type JSX,
	type ReactNode,
	useRef,
	type MutableRefObject,
	type MouseEventHandler,
	type MouseEvent
} from "react";

export default function HoverDialog({
	className = "",
	children,
	tooltip,
	onMouseEnter,
	onMouseLeave,
	...props
}: DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement> & {
	tooltip: ReactNode;
}): JSX.Element {
	const dialogReference: MutableRefObject<HTMLSpanElement | null> =
		useRef(null);

	const onMouseEnterHandler: MouseEventHandler<HTMLSpanElement> = (
		event: MouseEvent<HTMLSpanElement, globalThis.MouseEvent>
	): void => {
		console.log("Enter!");
		dialogReference.current?.style.setProperty("display", "inline");
		onMouseEnter?.(event);
	};

	const onMouseLeaveHandler: MouseEventHandler<HTMLSpanElement> = (
		event: MouseEvent<HTMLSpanElement, globalThis.MouseEvent>
	): void => {
		console.log("Leave!");
		dialogReference.current?.style.setProperty("display", "none");
		onMouseLeave?.(event);
	};

	return (
		<span
			className={`${style["parent"]} ${className}`}
			onMouseEnter={onMouseEnterHandler}
			onMouseLeave={onMouseLeaveHandler}
			{...props}
		>
			{children}
			<span className={style["child"]} ref={dialogReference}>
				{tooltip}
			</span>
		</span>
	);
}
