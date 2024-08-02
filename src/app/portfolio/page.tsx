import Card from "#Card";
import CardList from "#CardList";
import Image from "#Image";
import Link from "#Link";
import PhongLighting from "../a/webgl/lighting/PhongLighting";
import codehsLogo from "./codehs.png";

export default function Page() {
	return (
		<>
			<h1>{"Portfolio"}</h1>
			<p>
				{"You can find more of my code on "}
				<Link href="https://github.com/Lakuna">{"my GitHub account"}</Link>
				{" and my work history on "}
				<Link href="https://www.linkedin.com/in/t-j-m/">
					{"my LinkedIn account"}
				</Link>
				{"."}
			</p>
			<h2>{"Projects"}</h2>
			<CardList>
				<Card href="https://ugl.lakuna.pw/">
					<h3>{"μGL"}</h3>
					<PhongLighting style={{ width: "100%" }} />
					<p>
						{
							"A low-level WebGL2 library that is designed to simplify the developer experience and reduce unnecessary calls to the GPU."
						}
					</p>
					<ul>
						<li>{"Automatically disregards redundant API calls."}</li>
						<li>
							{"Completely abstracts away the management of binding points."}
						</li>
						<li>
							{
								"Provides sensible default parameters to simplify common operations."
							}
						</li>
						<li>{"Hides vestigial parameters."}</li>
						<li>{"More completely documented than the WebGL2 API."}</li>
					</ul>
				</Card>
				<Card href="https://umath.lakuna.pw/">
					<h3>{"μMath"}</h3>
					<p>{"A math library that includes a variety of common functions."}</p>
					<ul>
						<li>
							{
								"Includes a fast linear algebra API that is optimized for physics- and graphics-related operations."
							}
						</li>
						<li>
							{
								"Includes a slow linear algebra API that is optimized for developer experience."
							}
						</li>
					</ul>
				</Card>
				<Card href="https://codehs.com/">
					<h3>{"CodeHS"}</h3>
					<Image src={codehsLogo} alt="The CodeHS logo." />
					<p>
						{
							"I worked as an intern at CodeHS where, among other things, I implemented the Scratch sandbox, which is used to start teaching children how to code."
						}
					</p>
					<p>
						{
							"Other projects that I made significant contributions to include the new sidebar, user settings page, and course completion certificates."
						}
					</p>
					<p>
						{
							"Fun fact: I chose the line that is displayed on the header of the CodeHS landing page."
						}
					</p>
				</Card>
			</CardList>
		</>
	);
}

export const metadata = {
	description: "Travis Martin's portfolio.",
	openGraph: { url: "/portfolio" },
	title: "Portfolio"
};
