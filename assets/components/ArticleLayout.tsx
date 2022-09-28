import { MDXProvider } from "@mdx-js/react";
import Image from "next/image";
import "katex/dist/katex.min.css";
import "prism-themes/themes/prism-atom-dark.min.css";
import styles from "../styles/article.module.scss";

const components = {
	img: ({ ...props }: any) => <span style={{ display: "block", textAlign: "center" }}><Image {...props} /></span>
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
