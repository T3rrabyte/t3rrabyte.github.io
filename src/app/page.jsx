import OneLiner from "./OneLiner.jsx";
import Socials from "./Socials/index.jsx";
import generateMetadata from "#generateMetadata";

export default () => <>
	<h1 style={{ textAlign: "center" }}>Travis Martin</h1>
	<OneLiner style={{ textAlign: "center" }} />
	<hr />
	<Socials style={{ textAlign: "center" }} />
</>;

export const metadata = generateMetadata("Lakuna", "Travis Martin's website.", "/favicon.png", "/");
