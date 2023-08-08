import Link from "next/link";
import domain from "#domain";

export default ({ href, ...props }) => href.startsWith("/") || href.startsWith(domain)
	? <Link href={href} {...props} />
	: <a href={href} {...props} target="_blank" rel="noreferrer noopener" />;
