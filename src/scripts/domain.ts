// This should be equivalent to `window.location.origin`, but it can be used on both the server and the client.

const domain =
	process.env["VERCEL_ENV"] === "development" ||
	process.env["NODE_ENV"] === "development"
		? `http://localhost:${process.env["PORT"] ?? "3000"}`
		: "https://www.lakuna.pw";

export default domain;
