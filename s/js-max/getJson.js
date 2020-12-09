const getJson = (url) => new Promise((resolve, reject) => {
	const req = new XMLHttpRequest();
	req.addEventListener('load', (res) => {
		try {
			resolve(JSON.parse(res.target.response));
		} catch (error) {
			reject(error);
		}
	});
	req.addEventListener('error', (err) => reject(err));
	req.addEventListener('abort', (err) => reject(err));
	req.open('GET', url);
	req.send();
});