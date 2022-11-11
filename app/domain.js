export default process.env.NODE_ENV == "development"
	? `http://localhost:${process.env.PORT ?? 3000}`
	: "https://www.lakuna.pw";
