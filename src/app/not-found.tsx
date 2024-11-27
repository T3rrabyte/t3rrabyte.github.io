import type { Metadata } from "next";

export default function NotFound() {
	return (
		<>
			<h1 style={{ textAlign: "center" }}>{"404 Not Found"}</h1>
			<p style={{ textAlign: "center" }}>
				{"This isn't the page you're looking for."}
			</p>
		</>
	);
}

export const metadata: Metadata = {
	description: "Page not found.",
	title: "404 Not Found"
};
