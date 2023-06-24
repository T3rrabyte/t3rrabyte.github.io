import OneLiner from "./OneLiner";
import Socials from "site/components/Socials/index";
import generateMetadata from "site/generateMetadata";

export default async function Page() {
	return (
		<>
			<h1 style={{ textAlign: "center" }}>Travis Martin</h1>
			<OneLiner style={{ textAlign: "center" }} />
			<hr />
			<Socials style={{ textAlign: "center" }} />
		</>
	);
}

export const metadata = generateMetadata("Lakuna", "Travis Martin's website.", "/favicon.png", "/");
