export default typeof process?.env?.VERCEL_URL != "undefined"
	? `https://${process.env.VERCEL_URL}`
	: `https://localhost:${process?.env?.PORT || 3000}`;
