export default function Description({ children = "" }) {
	return (
		<>
			<meta name="description" content={children} key="description" />
			<meta name="og:description" content={children} key="ogdescription" />
			<meta name="twitter:description" content={children} key="twitterdescription" />
		</>
	);
}
