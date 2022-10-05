import { useEffect, useRef } from "react";

export default function AnimatedCanvas(init: (canvas: HTMLCanvasElement) => (now: number) => void, props) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const render = useRef<(now: number) => void>();

	function tick(now: number) {
		if (!canvasRef.current) { return; }

		requestAnimationFrame(tick);
		render.current(now);
	}

	useEffect(() => {
		if (!canvasRef.current) { return; }

		render.current = init(canvasRef.current);
		requestAnimationFrame(tick);
	});

	return <canvas ref={canvasRef} {...props} />;
}
