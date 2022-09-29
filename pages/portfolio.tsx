import Link from "next/link";
import Card from "../assets/components/Card";
import CardList from "../assets/components/CardList";
import Image from "next/image";
import UmbraCameras from "../assets/components/umbra/UmbraCameras";
import residuumPreview from "../public/images/residuum-preview.png";
import statecraftPreview from "../public/images/statecraft-preview.png";
import prepareModeratelyPreview from "../public/images/prepare-moderately-preview.png";
import mobaPreview from "../public/images/moba-preview.png";
import outpostPreview from "../public/images/outpost-preview.png";

export default function Portfolio() {
	return (
		<>
			<h1>Software Development Portfolio</h1>
			<p>Below is an incomplete collection of software that I{"'"}ve worked on, both professionally and as a hobby.</p>
			<p>You can find more of my code, including smaller projects, on my <Link href={"https://github.com/Lakuna"}><a>GitHub</a></Link> profile. Please keep in mind that the majority of my code is private.</p>
			<h2>Projects</h2>
			<CardList>
				<Card>
					<h3>Umbra</h3>
					<UmbraCameras style={{ width: "100%" }} />
					<p>A lightweight visual application framework for WebGL2.</p>
					<p>Written in <strong>TypeScript</strong>.</p>
					<p>The source code is available on <Link href={"https://github.com/Lakuna/Umbra"}><a>its GitHub repository</a></Link>, and the documentation is on <Link href={"https://umbra.lakuna.pw/"}><a>its website</a></Link>.</p>
				</Card>
				<Card>
					<h3>My website</h3>
					<p>This website, which has gone through several iterations since it was first put online on <time>November 13, 2017</time>.</p>
					<p>Written in <strong>TypeScript</strong>, <strong>JSX</strong>, and <strong>Sass</strong> with <Link href={"https://nextjs.org/"}><a>Next.js</a></Link> and <Link href={"https://reactjs.org/"}><a>React</a></Link>.</p>
					<p>The source code is available on <Link href={"https://github.com/Lakuna/Lakuna.github.io"}><a>its GitHub repository</a></Link>.</p>
				</Card>
				<Card>
					<h3>EPS</h3>
					<p><Link href={"https://www.changehealthcare.com/"}><a>Change Healthcare{"'"}s</a></Link> <Link href={"https://www.changehealthcare.com/pharmacy/management/enterprise-pharmacy-system"}><a>Enterprise Pharmacy System</a></Link>.</p>
					<p>I worked on EPS as part of my internship with PDX, Inc. I worked with a large team of developers and got my first experience with <Link href={"https://www.atlassian.com/software/jira"}><a>Jira</a></Link> and the <strong>Agile methodology</strong>. I participated in regular meetings and code reviews. All of my code was written in <strong>Java</strong>.</p>
				</Card>
				<Card>
					<h3>Residuum</h3>
					<Image src={residuumPreview} alt="Residuum preview." />
					<p>A cross-platform (desktop and mobile), augmented reality-optional real-time strategy game. Co-developed with <Link href="https://ty.business/portfolio/"><a>Ty Morrow</a></Link> and <Link href="https://griff.pw/"><a>Griffon Hanson</a></Link> at Edikt Studios.</p>
					<p>This project was my introduction to augmented reality, advanced pathfinding techniques, and data-oriented programming.</p>
					<p>Written in <strong>C#</strong> with <Link href="https://unity.com/"><a>Unity</a></Link>.</p>
				</Card>
				<Card>
					<h3>Prepare Moderately</h3>
					<Image src={prepareModeratelyPreview} alt="Prepare Moderately preview." />
					<p>A mod for the real-time strategy game <Link href="https://rimworldgame.com/"><a>RimWorld</a></Link>.</p>
					<p>Written in <strong>C#</strong> with <Link href="https://github.com/pardeike/Harmony"><a>Harmony</a></Link>.</p>
					<p>The source code is available on <Link href={"https://github.com/Lakuna/RimWorld-Prepare-Moderately"}><a>its GitHub repository</a></Link>, and it can be downloaded from <Link href={"https://steamcommunity.com/sharedfiles/filedetails/?id=2057362949"}><a>its Steam Workshop page</a></Link>.</p>
				</Card>
				<Card>
					<h3>Statecraft</h3>
					<Image src={statecraftPreview} alt="Statecraft preview." />
					<p>A turn-based multiplayer historical strategy game. Developed at Edikt Studios.</p>
					<p>Features peer-to-peer connections and a procedurally-generated, serializable map.</p>
					<p>Written in <strong>C#</strong> with <Link href="https://unity.com/"><a>Unity</a></Link>.</p>
				</Card>
				<Card>
					<h3>Untitled MOBA</h3>
					<Image src={mobaPreview} alt="Untitled MOBA preview." />
					<p>A multiplayer online battle arena game. Co-developed with Alex Ho and Fernando Rivera at Edikt Studios.</p>
					<p>Features a diagonally symmetrical map model generated by a <strong>Python</strong> script of my own design.</p>
					<p>Written in <strong>C#</strong> with <Link href="https://unity.com/"><a>Unity</a></Link>.</p>
				</Card>
				<Card>
					<h3>Outpost</h3>
					<Image src={outpostPreview} alt="Outpost preview." />
					<p>A real-time strategy game based around automated pawns with a task queue.</p>
					<p>Written in <strong>C#</strong> with <Link href="https://unity.com/"><a>Unity</a></Link>.</p>
				</Card>
				<Card>
					<h3>Diplomat</h3>
					<p>A console program that uses brute force to determine the best move in a game of <Link href="https://en.wikipedia.org/wiki/Diplomacy_(game)"><a>Diplomacy</a></Link>.</p>
					<p>The source code is available on <Link href={"https://github.com/Lakuna/Diplomat"}><a>its GitHub repository</a></Link>.</p>
				</Card>
			</CardList>
		</>
	);
}

export async function getStaticProps() {
	return {
		props: {
			title: "Portfolio",
			description: "Travis Martin's software development portfolio."
		}
	};
}
