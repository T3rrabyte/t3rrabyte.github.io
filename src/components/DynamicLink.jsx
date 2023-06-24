import Link from "next/link";
import defaultDomain from "site/domain";

export default function DynamicLink({ href, ...props }) {
	return href.startsWith("/") || href.startsWith(defaultDomain)
		? <Link href={href} {...props} />
		: <a href={href} {...props} target="_blank" rel="noreferrer noopener" />;
}
