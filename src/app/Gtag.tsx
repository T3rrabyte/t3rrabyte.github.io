"use client";

import Script from "next/script";
import type { JSX } from "react";

export default function Gtag({ id }: { id: string }): JSX.Element {
	return (
		<>
			<Script
				src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
				strategy="afterInteractive"
			/>
			<Script id="google-analytics" strategy="afterInteractive">
				{"window.dataLayer = window.dataLayer || [];"}
				{"function gtag() { dataLayer.push(arguments); }"}
				{'gtag("js", new Date());'}
				{`gtag("config", "${id}");`}
			</Script>
		</>
	);
}
