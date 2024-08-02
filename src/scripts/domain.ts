// This should be equivalent to `window.location.origin`, but it can be used on both the server and the client.

const vercelUrl = process.env["VERCEL_URL"];
const port = process.env["PORT"] ?? "3000";

const domain =
	typeof vercelUrl === "string"
		? `https://${vercelUrl}`
		: process.env.NODE_ENV === "development"
			? `http://localhost:${port}`
			: "https://www.lakuna.pw";

export default domain;
