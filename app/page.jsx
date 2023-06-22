import OneLiner from "./OneLiner";
import Socials from "./Socials/Socials";
import generateMetadata from "../shared/generateMetadata";
import domain from "../shared/domain";

export default async function Page() {
	const rng = await (await fetch(`${domain}rng`, { cache: "no-store" })).json();

	return (
		<>
			<h1 style={{ textAlign: "center" }}>Travis Martin</h1>
			<OneLiner rng={rng} style={{ textAlign: "center" }} />
			<hr />
			<Socials style={{ textAlign: "center" }} />
		</>
	);
}

export const metadata = generateMetadata("Lakuna", "Travis Martin's website.", "/favicon.png", "/");
