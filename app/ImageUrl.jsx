import defaultDomain from "./domain";

export default function ImageUrl({ children = "", domain = defaultDomain }) {
	return (
		<>
			<meta name="og:image" content={`${domain}${children}`} key="ogimage" />
			<meta name="twitter:image" content={`${domain}${children}`} key="twitterimage" />
		</>
	);
}
