export default function ServerSideError() {
	return (
		<>
			<h1>Error 500</h1>
			<p>Server-side error.</p>
		</>
	);
}

export function getStaticProps() {
	return {
		props: {
			title: "Server-side Error",
			description: "A server-side error occurred."
		}
	};
}
