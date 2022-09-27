import { MDXProvider } from "@mdx-js/react";
import Image from "next/image";
import "katex/dist/katex.min.css";
import "prism-themes/themes/prism-atom-dark.min.css";
import styles from "../styles/article.module.scss";

const components = {
	li: ({ ...props }: any) => <li><p {...props} /></li>,
	img: ({ ...props }: any) => <span style={{ display: "block", textAlign: "center" }}><Image {...props} /></span>,
	hr: ({ ...props }: any) => <hr style={{ width: "100%" }} {...props} />
};

export default function ArticleLayout({ children }: any) {
	return (
		<article className={styles["article"]}>
			<MDXProvider components={components}>
				{children}
			</MDXProvider>
		</article>
	);
}
