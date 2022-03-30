import Head from "next/head";
import { AppProps } from "next/app";
import "../styles/global.scss";
import "../styles/css-variables.scss";

export default function MyApp({ Component, pageProps }: AppProps): JSX.Element {
	const title: string = pageProps.title ?? "Missing page title.";
	const description: string = pageProps.description ?? "Missing page description.";
	const imageUrl: string = pageProps.imageUrl ?? "/images/favicon.png";
	const url: string = pageProps.url ?? "https://lakuna.pw";

	return (
		<>
			<Head>
				{/* Standard metadata. */}
				<title>{title}</title>
				<meta charSet="UTF-8" />
				<meta name="author" content="Travis Martin" />
				<meta name="description" content={description} />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />

				{/* OGP markup tags. */}
				<meta name="og:title" content={title} />
				<meta name="og:type" content="website" />
				<meta name="og:image" content={imageUrl} />
				<meta name="og:url" content={url} />
				<meta name="og:description" content={description} />
				<meta name="og:locale" content="en_US" />
				<meta name="og:site_name" content="lakuna.pw" />

				{/* Twitter cards markup tags. */}
				<meta name="twitter:card" content="summary" />
				<meta name="twitter:site" content="@T3Lakuna" />
				<meta name="twitter:creator" content="@T3Lakuna" />
				<meta name="twitter:description" content={description} />
				<meta name="twitter:title" content={title} />
				<meta name="twitter:image" content={imageUrl} />
			</Head>

			<Component {...pageProps} />
		</>
	);
}
