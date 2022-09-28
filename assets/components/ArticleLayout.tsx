import { MDXProvider } from "@mdx-js/react";
import Image from "next/image";
import "katex/dist/katex.min.css";
import "prism-themes/themes/prism-atom-dark.min.css";
import styles from "../styles/article.module.scss";
import Link from "next/link";

const components = {
	img: ({ alt, src, ...props }) => <span style={{ display: "block", textAlign: "center" }}><Image alt={alt} src={src} {...props} /></span>,
	a: ({ href, ...props }) => <Link href={href}><a {...props} /></Link>
};

export default function ArticleLayout({ children }) {
	return (
		<article className={styles["article"]}>
			<MDXProvider components={components}>
				{children}
			</MDXProvider>
		</article>
	);
}
