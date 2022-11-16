import Content from "./content.mdx";
import components from "../components"; // https://github.com/vercel/next.js/issues/42153

export default function Page() {
	return <Content components={components} />;
}
