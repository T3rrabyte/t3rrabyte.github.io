import Card from "#Card";
import CardList from "#CardList";
import Image from "#Image";
import type { Metadata } from "next";
import PhongLighting from "../a/webgl/lighting/PhongLighting";
import contourDetection from "../a/cccv/opengraph-image.png";
import victoryScreen from "../a/pedit5/opengraph-image.png";

export default function Page() {
	return (
		<>
			<h1>{"Blog"}</h1>
			<CardList>
				<Card href="/a/cccv">
					<h2>{"Crash Course: Computer Vision"}</h2>
					<p>
						{
							"The companion article for my presentation about computer vision and Lunabotics."
						}
					</p>
					<Image
						src={contourDetection}
						alt="An example of contour detection."
					/>
				</Card>
				<Card href="/a/pedit5">
					<h2>
						<code>{"pedit5"}</code>
					</h2>
					<p>{"A guide to beating the world's first CRPG."}</p>
					<Image
						src={victoryScreen}
						alt="The victory cutscene in The Dungeon."
						style={{ width: "75%" }}
					/>
				</Card>
				<Card href="/a/q_rsqrt">
					<h2>{"Fast Inverse Square Root"}</h2>
					<p>
						{
							"An analysis of the famous fast multiplicative inverse square root algorithm as it is implemented in Quake III Arena."
						}
					</p>
				</Card>
				<Card href="/a/esojs">
					<h2>{"Esoteric JavaScript"}</h2>
					<p>
						{
							"A guide on how to write any JavaScript program with just six unique characters."
						}
					</p>
				</Card>
				<Card href="/a/webgl">
					<h2>{"WebGL2 Tutorial"}</h2>
					<p>{"The table of contents for my WebGL2 tutorial series."}</p>
					<PhongLighting style={{ width: "100%" }} />
				</Card>
			</CardList>
		</>
	);
}

export const metadata: Metadata = {
	description: "Travis Martin's blog.",
	openGraph: { url: "/blog" },
	title: "Blog"
};
