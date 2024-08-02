"use client";

import Script from "next/script";

export interface GtagProps {
	id: string;
}

export default function Gtag({ id }: GtagProps) {
	return (
		<>
			<Script
				src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
				strategy="afterInteractive"
				async
			/>
			<Script id="google-analytics" strategy="afterInteractive">
				{"window.dataLayer ||= [];"}
				{"function gtag() { window.dataLayer.push(arguments); }"}
				{'gtag("js", new Date());'}
				{`gtag("config", "${id}");`}
			</Script>
		</>
	);
}
