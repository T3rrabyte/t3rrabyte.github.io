import Card from "../../assets/components/Card";
import CardList from "../../assets/components/CardList";

export default function Articles({ pageDatas }: any) {
	return (
		<>
			<h1>Articles</h1>
			<CardList>
				<Card href="/articles/umbra">
					<h2>WebGL Tutorial</h2>
					<p>An entrypoint to my WebGL tutorial.</p>
				</Card>
			</CardList>
		</>
	);
}

export async function getStaticProps() {
	return {
		props: {
			title: "Articles",
			description: "A list of articles that I've written."
		}
	};
}
