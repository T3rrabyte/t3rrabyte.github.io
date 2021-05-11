const generateDownload = (filename, ...data) => {
	const blob = new Blob(data, { type: 'text/plain' });
	const downloadLink = document.createElement('a');
	downloadLink.href = URL.createObjectURL(blob);
	downloadLink.download = filename;
	document.documentElement.append(downloadLink);
	downloadLink.click();
	downloadLink.remove();
	URL.revokeObjectURL(blob);
};

const generateUriDownload = (filename, uri) => {
	const downloadLink = document.createElement('a');
	downloadLink.href = uri;
	downloadLink.download = filename;
	document.documentElement.append(downloadLink);
	downloadLink.click();
	downloadLink.remove();
};