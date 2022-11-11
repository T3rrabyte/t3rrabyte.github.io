import "./global.scss";
import style from "./layout.module.scss";
import Gtag from "./Gtag";
import Topnav from "./Topnav";
import { Arvo, Ubuntu, Ubuntu_Mono } from "@next/font/google";

const arvo = Arvo({
	weight: "400",
	subsets: ["latin"],
	variable: "--font-serif",
	fallback: ["Times New Roman", "serif"]
});

const ubuntu = Ubuntu({
	weight: "400",
	subsets: ["latin"],
	variable: "--font-sans-serif",
	fallback: ["Arial", "sans-serif"]
});

const ubuntuMono = Ubuntu_Mono({
	weight: "400",
	subsets: ["latin"],
	variable: "--font-ubuntu-mono",
	fallback: ["Courier New", "monospace"]
});

export default function Layout({ children }) {
	return (
		<html lang="en-US" className={`${arvo.variable} ${ubuntu.variable} ${ubuntuMono.variable}`}>
			<head>
				<meta charSet="UTF-8" key="charset" />
				<meta name="author" content="Travis Martin" key="author" />
				<meta name="viewport" content="width=device-width,initial-scale=1.0" key="viewport" />
				<meta name="og:type" content="website" key="ogtype" />
				<meta name="og:locale" content="en_US" key="oglocale" />
				<meta name="og:site_name" content="lakuna.pw" key="ogsitename" />
				<meta name="twitter:card" content="summary" key="twittercard" />
				<meta name="twitter:site" content="@T3Lakuna" key="twittersite" />
				<meta name="twitter:creator" content="@T3Lakuna" key="twittercreator" />
				<link rel="icon" type="image/x-icon" href="/favicon.ico" key="favicon" />
			</head>
			<body>
				<div className={style["spacer"]}>
					<header>
						<Topnav />
					</header>
					<main>
						{children}
					</main>
					<footer className={style["footer"]} />
				</div>
			</body>
			<Gtag />
		</html>
	);
}
