const download = (filename, text) => {
	const blob = new Blob([text], { type: 'text/plain' });
	const downloadLink = document.createElement('a');
	downloadLink.href = URL.createObjectURL(blob);
	downloadLink.download = filename;
	document.body.append(downloadLink);
	downloadLink.click();
	downloadLink.remove();
	URL.revokeObjectURL(blob);
};