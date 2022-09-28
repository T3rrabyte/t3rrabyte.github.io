import Head from "next/head";
import TopNav from "../assets/components/TopNav";
import "../assets/styles/global.scss";

export default function MyApp({ Component, pageProps, router }) {
	const title = pageProps.title ?? "Untitled Page";
	const description = pageProps.description ?? "No page description provided.";
	const imageUrl = pageProps.imageUrl ?? "/images/favicon.png";
	const url = pageProps.url ?? `https://www.lakuna.pw/${router.pathname}`;

	return (
		<>
			<Head>
				<title>{title}</title>
				<meta charSet="UTF-8" />
				<meta name="author" content="Travis Martin" />
				<meta name="description" content={description} />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<meta name="og:title" content={title} />
				<meta name="og:type" content="website" />
				<meta name="og:image" content={imageUrl} />
				<meta name="og:url" content={url} />
				<meta name="og:description" content={description} />
				<meta name="og:locale" content="en_US" />
				<meta name="og:site_name" content="lakuna.pw" />
				<meta name="twitter:card" content="summary" />
				<meta name="twitter:site" content="@T3Lakuna" />
				<meta name="twitter:creator" content="@T3Lakuna" />
				<meta name="twitter:description" content={description} />
				<meta name="twitter:title" content={title} />
				<meta name="twitter:image" content={imageUrl} />
			</Head>
			<div id="page-flow">
				<header>
					<TopNav />
				</header>
				<main>
					<Component {...pageProps} />
				</main>
				<footer></footer>
			</div>
		</>
	);
}
