const AUTO_THEME = 'auto';
const DEFAULT_THEME = 'dark';
const THEMES = ['auto', 'dark', 'light', 'console', 'old', 'xanycki'];

const html = document.querySelector('html');
let pageDefaultTheme;

const setTheme = (themeName, themeDropdownButton) => {
	if (!THEMES.includes(themeName)) { console.warn('Theme list doesn\'t contain the theme you tried to set.'); }

	const themeClasses = [];
	THEMES.forEach((theme) => themeClasses.push(`theme-${theme}`));

	// Find the theme that will actually be used.
	let setTheme = DEFAULT_THEME;
	if (themeName == AUTO_THEME) {
		if (pageDefaultTheme) { setTheme = pageDefaultTheme; } else {
			console.warn('Page has no special default theme. Using global default. Page default themes are recommended to reduce flashing.');
			setTheme = DEFAULT_THEME;
		}
	} else { setTheme = themeName; }

	if (!THEMES.includes(setTheme)) { return console.error('Theme list doesn\'t contain the theme that is being set.'); }

	// Change the html class.
	themeClasses.forEach((themeClass) => html.classList.remove(themeClass));
	html.classList.add(`theme-${setTheme}`);

	// Update dropdown button text.
	themeDropdownButton.innerHTML = titleCase(`Theme: ${themeName}`);
}

const titleCase = (s) => {
	s = s.toLowerCase().split(' ');
	for (let i = 0; i < s.length; i++) { s[i] = s[i].charAt(0).toUpperCase() + s[i].slice(1); }
	return s.join(' ');
}

// onload

// Change display on theme dropdown. Put in a function so that return can be used.
const changeDropdownDisplay = () => {
	// Ensure that html exists.
	if (!html) { return console.error('Your document doesn\'t have an html tag!'); }

	// Find page default theme.
	for (let i = 0; i < html.classList.length; i++) {
		const className = html.classList[i];
		if (className.startsWith('theme-')) {
			pageDefaultTheme = className.substring('theme-'.length);
			console.log(`Found page default theme: ${pageDefaultTheme}`);
			break;
		}
	}

	// Get necessary elements.
	const botnav = document.querySelector(`div#${BOTNAV_ID}`);
	if (!botnav) { return console.error('Botnav script loaded without botnav element.'); }
	const themeDropdown = botnav.querySelector(`:scope > div#${THEME_DROPDOWN_ID}`);
	if (!themeDropdown) { return console.warn('Theme dropdown not found in botnav.'); }
	if (!themeDropdown.button) {
		console.log('Setting theme dropdown button.');
		themeDropdown.button = themeDropdown.querySelector(`:scope > button.${DROPDOWN_BUTTON_CLASS}`);
		if (!themeDropdown.button) { return console.warn('Theme dropdown button not found in theme dropdown.'); }
	}
	if (!themeDropdown.content) {
		console.log('Setting theme dropdown content.');
		themeDropdown.content = themeDropdown.querySelector(`:scope > div.${DROPDOWN_CONTENT_CLASS}`);
		if (!themeDropdown.content) { return console.warn('Theme dropdown content not found in theme dropdown.'); }
	}

	// Delete all nodes that are already in the dropdown content.
	const nodes = [];
	for (let j = 0; j < themeDropdown.content.children.length; j++) { nodes.push(themeDropdown.content.children[j]); }
	nodes.forEach((node) => {
		console.warn('Removing extaneous node from theme dropdown content.');
		themeDropdown.content.removeChild(node);
	});
	
	// Add a button to the dropdown content for each theme.
	THEMES.forEach((theme) => {
		const button = document.createElement('button');
		button.onclick = () => {
			localStorage.setItem('theme', theme);
			setTheme(localStorage.getItem('theme'), themeDropdown.button);
		}
		button.innerHTML = titleCase(`Theme: ${theme}`);
		themeDropdown.content.append(button);
	});

	// Set theme to auto if none is selected.
	if (!localStorage.getItem('theme')) { localStorage.setItem('theme', AUTO_THEME); }

	// Load initial theme.
	setTheme(localStorage.getItem('theme'), themeDropdown.button);
}
changeDropdownDisplay();