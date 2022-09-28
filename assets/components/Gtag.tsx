import Script from "next/script";

const measurementId = "G-HHPHD31E3M";

const scriptText = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag("js",new Date());gtag("config","${measurementId}");`;

export default function Gtag({ ...props }) {
	return (
		<>
			<Script src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`} strategy="lazyOnload" />
			<script dangerouslySetInnerHTML={{ __html: scriptText }} />
		</>
	);
}
