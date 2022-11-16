import style from "./layout.module.scss";

/*
// https://github.com/vercel/next.js/issues/42153
import { MDXProvider } from "@mdx-js/react";
import components from "./components";
*/

export default function Layout({ children }) {
	return (
		<article className={style["base"]}>
			{/*
			// https://github.com/vercel/next.js/issues/42153
			<MDXProvider components={components}>
				{children}
			</MDXProvider>
			*/}
			{children}
		</article>
	);
}
