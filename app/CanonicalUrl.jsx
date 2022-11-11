import defaultDomain from "./domain";

export default function CanonicalUrl({ children = "", domain = defaultDomain }) {
	return <meta name="og:url" content={`${domain}${children}`} key="ogurl" />;
}
