export default function PageNotFound() {
	return (
		<>
			<h1>Error 404</h1>
			<p>Page not found.</p>
		</>
	);
}

export function getStaticProps() {
	return {
		props: {
			title: "Page Not Found",
			description: "No page was found at the given URL."
		}
	};
}
