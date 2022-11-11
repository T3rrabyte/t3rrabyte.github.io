export default function Title({ children = "" }) {
	return (
		<>
			<title key="title">{children}</title>
			<meta name="og:title" content={children} key="ogtitle" />
			<meta name="twitter:title" content={children} key="twittertitle" />
		</>
	);
}
