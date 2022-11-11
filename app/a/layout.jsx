import style from "./layout.module.scss";

/*
// https://github.com/vercel/next.js/issues/42153
import { MDXProvider } from "@mdx-js/react";
import Link from "next/link";

const components = {
	a: () => <Link />
};
*/

export default function Layout({ children }) {
	return (
		<article className={style["base"]}>
			{/*
			<MDXProvider components={components}>
				{children}
			</MDXProvider>
			*/}
			{children}
		</article>
	);
}
