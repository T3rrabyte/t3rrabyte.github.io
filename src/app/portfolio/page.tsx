import DynamicLink from "#DynamicLink";
import Image from "next/image";
import CardList from "#CardList";
import Card from "#Card";
import prepareModeratelyPreview from "./prepare-moderately.png";
import SceneGraph from "#app/a/webgl/scene-graph/SceneGraph.tsx";
import generateMetadata from "#generateMetadata";
import codehsPreview from "./codehs.png";
import type { JSX } from "react";

export default function page(): JSX.Element {
	return (
		<>
			<h1>Portfolio</h1>
			<p>
				You can find more of my code on{" "}
				<DynamicLink href="https://github.com/Lakuna">
					my GitHub account
				</DynamicLink>
				.
			</p>
			<h2>Projects</h2>
			<CardList>
				<Card>
					<h3>μGL</h3>
					<SceneGraph style={{ width: "100%" }} />
					<p>A lightweight visual application framework for WebGL2.</p>
					<p>
						Written in <strong>TypeScript</strong>.
					</p>
					<p>
						The source code is available on{" "}
						<DynamicLink href="https://github.com/Lakuna/ugl">
							its GitHub repository
						</DynamicLink>
						, and the documentation is on{" "}
						<DynamicLink href="https://ugl.lakuna.pw/">its website</DynamicLink>
						.
					</p>
				</Card>
				<Card>
					<h3>μMath</h3>
					<p>A lightweight math library.</p>
					<p>
						Written in <strong>TypeScript</strong>.
					</p>
					<p>
						The source code is available on{" "}
						<DynamicLink href="https://github.com/Lakuna/umath">
							its GitHub repository
						</DynamicLink>
						, and the documentation is on{" "}
						<DynamicLink href="https://umath.lakuna.pw/">
							its website
						</DynamicLink>
						.
					</p>
				</Card>
				<Card>
					<h3>My website</h3>
					<p>
						This website, which has gone through several iterations since it was
						first put online on <time>November 13, 2017</time>.
					</p>
					<p>
						Written in <strong>JavaScript</strong>, <strong>JSX</strong>, and{" "}
						<strong>Sass</strong> with{" "}
						<DynamicLink href={"https://nextjs.org/"}>Next.js 13</DynamicLink>{" "}
						and <DynamicLink href={"https://reactjs.org/"}>React</DynamicLink>.
					</p>
					<p>
						The source code is available on{" "}
						<DynamicLink href="https://github.com/Lakuna/Lakuna.github.io">
							its GitHub repository
						</DynamicLink>
						.
					</p>
				</Card>
				<Card>
					<h3>CodeHS</h3>
					<Image
						src={codehsPreview}
						alt="CodeHS preview."
						style={{ width: "100%", height: "auto" }}
						placeholder="blur"
					/>
					<p>
						I worked at{" "}
						<DynamicLink href="https://codehs.com/">CodeHS</DynamicLink> as an
						intern. The majority of my work was done in <strong>Python</strong>,
						but parts also used <strong>JavaScript</strong> and{" "}
						<strong>TypeScript</strong>.
					</p>
				</Card>
				<Card>
					<h3>EPS</h3>
					<p>
						Change Healthcare{"'"}s{" "}
						<DynamicLink href="https://www.changehealthcare.com/pharmacy/management/enterprise-pharmacy-system">
							Enterprise Pharmacy System
						</DynamicLink>
						.
					</p>
					<p>
						I worked on EPS as part of my internship with PDX, Inc. I worked
						with a large team of developers and got my first experience with{" "}
						<strong>Jira</strong> and the <strong>Agile methodology</strong>. I
						participated in regular meetings and code reviews. All of my code
						was written in <strong>Java</strong>.
					</p>
				</Card>
				<Card>
					<h3>Prepare Moderately</h3>
					<Image
						src={prepareModeratelyPreview}
						alt="Prepare Moderately preview."
						style={{ width: "100%", height: "auto" }}
						placeholder="blur"
					/>
					<p>
						A mod for the real-time strategy game{" "}
						<DynamicLink href="https://rimworldgame.com/">RimWorld</DynamicLink>
						.
					</p>
					<p>
						Written in <strong>C#</strong> with{" "}
						<DynamicLink href="https://github.com/pardeike/Harmony">
							Harmony
						</DynamicLink>
						.
					</p>
					<p>
						The source code is available on{" "}
						<DynamicLink href="https://github.com/Lakuna/RimWorld-Prepare-Moderately">
							its GitHub repository
						</DynamicLink>
						, and it can be downloaded from{" "}
						<DynamicLink
							href={
								"https://steamcommunity.com/sharedfiles/filedetails/?id=2057362949"
							}
						>
							its Steam Workshop page
						</DynamicLink>
						.
					</p>
				</Card>
			</CardList>
		</>
	);
}

export const metadata = generateMetadata(
	"Portfolio | Lakuna",
	"Travis Martin's software development portfolio.",
	"/favicon.png",
	"/portfolio"
);
