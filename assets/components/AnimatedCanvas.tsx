import { useEffect, useRef } from "react";

export default function AnimatedCanvas({ init, ...props }) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	let forceStopLoop = false;
	let render: () => void;

	function tick() {
		if (forceStopLoop || !canvasRef.current) { return; }

		requestAnimationFrame(tick);
		render();
	}

	useEffect(() => {
		if (!canvasRef.current) { return; }

		forceStopLoop = false;
		render = init(canvasRef.current);
		requestAnimationFrame(tick);

		return function cleanup() {
			forceStopLoop = true;
		}
	}, []);

	return <canvas ref={canvasRef} {...props} />;
}
