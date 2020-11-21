const setTheme = (theme) => {
	document.documentElement.classList.forEach((className) => {
		if (className.startsWith('theme-')) { document.documentElement.classList.remove(className); }
	});

	if (theme) {
		document.documentElement.classList.add(`theme-${theme}`);
		localStorage.setItem('theme', theme);
	} else {
		document.documentElement.classList.add(pageDefaultTheme);
		localStorage.removeItem('theme');
	}
};

const pageDefaultTheme = Array.from(document.documentElement.classList).find((className) => className.startsWith('theme-'));
const selectedTheme = localStorage.getItem('theme');
if (selectedTheme) {
	if (selectedTheme == 'auto') { localStorage.removeItem('theme'); } else { setTheme(selectedTheme); }
}
