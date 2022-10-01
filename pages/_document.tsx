import { Html, Head, Main, NextScript } from "next/document.js";

export default function MyDocument() {
	return (
		<Html lang="en-US">
			<Head>
				<link href="https://fonts.googleapis.com/css?family=Ubuntu|Ubuntu%20Mono&display=optional" rel="stylesheet" />
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
