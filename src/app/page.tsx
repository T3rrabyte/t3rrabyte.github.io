import OneLiner from "#OneLiner";
import Socials from "#Socials";

export default function Page() {
	return (
		<>
			<h1 style={{ textAlign: "center" }}>Travis Martin</h1>
			<OneLiner style={{ textAlign: "center" }} />
			<hr />
			<Socials style={{ textAlign: "center" }} />
		</>
	);
}

export const metadata = {
	description: "Travis Martin's website.",
	openGraph: { url: "/" },
	title: "Lakuna"
};
