import Script from "next/script";
import { googleAnalyticsMeasurementId } from "../scripts/constants";

export default function Gtag() {
	return (
		<>
			<Script src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsMeasurementId}`} strategy="afterInteractive" />
			<Script id="google-analytics" strategy="afterInteractive">
				{`
					window.dataLayer = window.dataLayer || [];
					function gtag(){dataLayer.push(arguments);}
					gtag('js', new Date());
					gtag('config', '${googleAnalyticsMeasurementId}');
				`}
			</Script>
		</>
	);
}
