"use client";

import {
	useEffect,
	useRef,
	type DetailedHTMLProps,
	type CanvasHTMLAttributes,
	type MutableRefObject,
	useCallback,
	type JSX,
	type EffectCallback
} from "react";

export default function AnimatedCanvas(
	init: (canvas: HTMLCanvasElement) => FrameRequestCallback,
	props: DetailedHTMLProps<
		CanvasHTMLAttributes<HTMLCanvasElement>,
		HTMLCanvasElement
	>
): JSX.Element {
	const canvasRef: MutableRefObject<HTMLCanvasElement | null> = useRef(null);
	const renderRef: MutableRefObject<((now: number) => void) | null> =
		useRef(null);
	const disableCanvasRef: MutableRefObject<boolean> = useRef(false);

	const tick: FrameRequestCallback = useCallback((now: number): void => {
		if (disableCanvasRef.current) {
			return;
		}

		if (!renderRef.current) {
			return;
		}

		requestAnimationFrame(tick);
		renderRef.current(now);
	}, []);

	const effectCallback: EffectCallback = (): void | (() => void) => {
		if (!canvasRef.current) {
			return;
		}

		renderRef.current = init(canvasRef.current);
		requestAnimationFrame(tick);

		return (): void => {
			disableCanvasRef.current = true;
		};
	};

	useEffect(effectCallback, [init, tick]);

	return <canvas ref={canvasRef} {...props} />;
}
