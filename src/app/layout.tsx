import "./global.scss";
import style from "./style.module.scss";
import Gtag from "./Gtag.tsx";
import Topnav from "./Topnav/index.tsx";
import { Noto_Serif, Ubuntu, Ubuntu_Mono } from "next/font/google";
import type { NextFontWithVariable } from "next/dist/compiled/@next/font";
import type { DetailedHTMLProps, HTMLAttributes, JSX } from "react";

const arvo: NextFontWithVariable = Noto_Serif({
	subsets: ["latin"],
	variable: "--font-serif",
	fallback: ["Times New Roman", "serif"]
});

const ubuntu: NextFontWithVariable = Ubuntu({
	weight: "400", // google/fonts#6592
	subsets: ["latin"],
	variable: "--font-sans-serif",
	fallback: ["Arial", "sans-serif"]
});

const ubuntuMono: NextFontWithVariable = Ubuntu_Mono({
	weight: "400", // google/fonts#6593
	subsets: ["latin"],
	variable: "--font-monospace",
	fallback: ["Courier New", "monospace"]
});

export default function layout({
	children
}: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>): JSX.Element {
	return (
		<html
			lang="en-US"
			className={`${arvo.variable} ${ubuntu.variable} ${ubuntuMono.variable}`}
		>
			<body>
				<div className={style["spacer"]}>
					<header>
						<Topnav />
					</header>
					<main>{children}</main>
					<footer className={style["footer"]} />
				</div>
			</body>
			<Gtag id="G-HHPHD31E3M" />
		</html>
	);
}
