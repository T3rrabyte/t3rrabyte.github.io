import OneLiner from "./OneLiner";
import Socials from "site/components/Socials/index";
import generateMetadata from "site/generateMetadata";
import domain from "site/domain";

export default async function Page() {
	const rng = parseFloat(await (await fetch(`${domain}api/rng/${new Date().getTime()}`, { cache: "no-store" })).text());
	
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
