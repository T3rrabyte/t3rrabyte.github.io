import Link from "next/link";
import Card from "../assets/components/Card";
import CardList from "../assets/components/CardList";

export default function Portfolio() {
	return (
		<>
			<h1>Software Development Portfolio</h1>
			<p>Below is an incomplete collection of software that I've worked on, both professionally and as a hobby.</p>
			<p>You can find more of my code, including smaller projects, on my <Link href={"https://github.com/Lakuna"}><a>GitHub</a></Link> profile. Please keep in mind that the majority of my code is private.</p>
			<h2>Projects</h2>
			<CardList>
				<Card>
					<h3>Umbra</h3>
					<p>A lightweight visual application framework for WebGL2, written in <strong>TypeScript</strong>.</p>
					<p>The source code is available on <Link href={"https://github.com/Lakuna/Umbra"}><a>its GitHub repository</a></Link>, and the documentation is on <Link href={"https://umbra.lakuna.pw/"}><a>its website</a></Link>.</p>
				</Card>
				<Card>
					<h3>My website</h3>
					<p>This website! Written in <strong>TypeScript</strong> with <Link href={"https://nextjs.org/"}><a>Next.js</a></Link> and <Link href={"https://reactjs.org/"}><a>React</a></Link>.</p>
					<p>The source code is available on <Link href={"https://github.com/Lakuna/Lakuna.github.io"}><a>its GitHub repository</a></Link>.</p>
				</Card>
				<Card>
					<h3>EPS</h3>
					<p><Link href={"https://www.changehealthcare.com/"}><a>Change Healthcare's</a></Link> <Link href={"https://www.changehealthcare.com/pharmacy/management/enterprise-pharmacy-system"}><a>Enterprise Pharmacy System</a></Link>.</p>
					<p>I worked on EPS as part of my internship with PDX, Inc. I worked with a large team of developers and got my first experience with <Link href={"https://www.atlassian.com/software/jira"}><a>Jira</a></Link> and the <strong>Agile methodology</strong>. I participated in regular meetings and code reviews. All of my code was written in <strong>Java</strong>.</p>
				</Card>
				{/*
				TODO:
				- Prepare Moderately
				- Alexis' website
				- Capitalism Cataclysm
				- Cosmic Conflict
				- Outpost
				- Diplomat
				- Residuum
				*/}
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
