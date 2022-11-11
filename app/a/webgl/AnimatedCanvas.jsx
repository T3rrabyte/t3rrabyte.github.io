"use client";

import { useEffect, useRef } from "react";

export default function AnimatedCanvas(init, props) {
	const canvasRef = useRef();
	let render;

	function tick(now) {
		if (!canvasRef.current) { return; }

		requestAnimationFrame(tick);
		render?.(now);
	}

	useEffect(() => {
		if (!canvasRef.current) { return; }

		render = init(canvasRef.current);
		requestAnimationFrame(tick);
	}, []);

	return <canvas ref={canvasRef} {...props} />;
}
