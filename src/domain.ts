// This should be equivalent to `window.location.origin`, but can be used on both server and client.
export default process.env.NODE_ENV == "development"
	? `http://localhost:${process.env["PORT"] ?? 3000}/`
	: "https://www.lakuna.pw/";
