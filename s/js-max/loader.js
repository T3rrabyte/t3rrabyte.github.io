// # Constants

// Google Analytics
const ANALYTICS_ID = 'UA-145902983-1';

// CDN URLs
const JQUERY_CDN = 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js';
const FONT_AWESOME_CDN = 'https://kit.fontawesome.com/d0b9853910.js';
const GTAG_CDN = 'https://www.googletagmanager.com/gtag/js?id=' + ANALYTICS_ID;

// Metadata
const CHARSET = 'utf-8';
const AUTHOR = 'Travis Martin';
const VIEWPORT = 'width=device-width, initial-scale=1.0';
const FAVICON_URL = '/favicon.ico';

// Navbar
const TOPNAV_ID = 'topnav';
const BOTNAV_ID = 'botnav';
const TOPNAV_HTML = '/s/html/topnav.html';
const BOTNAV_HTML = '/s/html/botnav.html';
const TOPNAV_SCRIPT = '/s/js/topnav.js';
const NAVBAR_STYLE = '/s/css/navbar.css';

// Sidenav
const SIDENAV_ID = 'sidenav';
const SIDENAV_STYLE = '/s/css/sidenav.css';

// Dropdown
const DROPDOWN_CLASS = 'dropdown';
const DROPDOWN_CONTROLLER_CLASS = 'dropdown-button';
const DROPDOWN_CONTENT_CLASS = 'dropdown-content';
const DROPDOWN_SCRIPT = '/s/js/dropdown.js';
const DROPDOWN_STYLE = '/s/css/dropdown.css';

// Themes
const AUTO_THEME = 'auto';
const DEFAULT_THEME = 'dark';
const THEMES = ['auto', 'dark', 'light', 'console', 'old', 'xanycki'];
const THEME_DROPDOWN_ID = 'theme-dropdown';

// Slideshow
const SLIDESHOW_DELAY = 5000;
const SLIDESHOW_CLASS = 'slideshow';
const SLIDESHOW_CONTROLLER_CLASS = 'slideshow-controller';
const SLIDESHOW_CONTENT_CLASS = 'slideshow-content';
const SLIDESHOW_CONTROL_ITEM_CLASS = 'dot';
const SLIDESHOW_ITEM_CLASS = 'slide';
const SLIDESHOW_SCRIPT = '/s/js/slideshow.js';
const SLIDESHOW_STYLE = '/s/css/slideshow.css';

// Tabs
const TAB_CLASS = 'tab';
const TAB_CONTROLLER_CLASS = 'tab-controller';
const TAB_CONTENT_CLASS = 'tab-content';
const TAB_CONTROL_ITEM_CLASS = 'tab-button';
const TAB_ITEM_CLASS = 'tab-panel';
const TAB_SCRIPT = '/s/js/tab.js';
const TAB_STYLE = '/s/css/tab.css';

// Filter
const FILTER_CLASS = 'filter';
const FILTER_CONTROLLER_CLASS = 'filter-controller';
const FILTER_CONTENT_CLASS = 'filter-content';
const FILTER_CONTROL_ITEM_CLASS = 'filter-button'
const FILTER_ITEM_CLASS = 'filter-item';
const FILTER_SCRIPT = '/s/js/filter.js';
const FILTER_STYLE = '/s/css/filter.css';

// Key Codes
const DECREMENT_KEYCODE = 37;
const INCREMENT_KEYCODE = 39;

// Miscellaneous
const MOBILE_BREAKPOINT = 700;
const ACTIVE_CLASS = 'active';
const STANDARD_STYLE = '/s/css/standard.css';

// # Functions

// Credit: Simon Willison.
const addLoadEvent = (event) => {
	const old = window.onload;
	if (typeof old != 'function') {
		window.onload = event;
	} else {
		window.onload = () => {
			old();
			event();
		}
	}
}

// Load a JavaScript file.
const loadScript = (src, onload) => {
	if (!document.querySelector(`script[src='${src}']`)) {
		const script = document.createElement('script');
		script.src = src;
		script.async = true;
		if (onload) { script.onload = onload; }
		document.head.append(script);
	}
}

// Load a CSS file.
const loadStyle = (href, onload) => {
	if (!document.querySelector(`link[rel='stylesheet'][href='${href}']`)) {
		const stylesheet = document.createElement('link');
		stylesheet.rel = 'stylesheet';
		stylesheet.href = href;
		if (onload) { stylesheet.onload = onload; }
		document.head.append(stylesheet);
	}
}

// # Load events.

// Warn user if images aren't lazy-loaded.
addLoadEvent(() => {
	const images = document.querySelectorAll('img');
	for (let i = 0; i < images.length; i++) {
		if (images[i].loading != 'lazy') { console.warn('Image not lazy-loaded.'); }
	}
});

// Load placeholder/standard metadata if it doesn't already exist.
addLoadEvent(() => {
	const pageName = () => location.pathname.split('/').pop().split('.').shift().toUpperCase();

	// Title.
	if (!document.querySelector('title')) {
		console.warn('No title is set. Using placeholder.');
		const title = document.createElement('title');
		title.innerHTML = 'Lakuna - ' + pageName();
		document.head.append(title);
	}

	// Description.
	if (!document.querySelector('meta[name="description"]')) {
		console.warn('No description is set. Using placeholder.');
		const description = document.createElement('meta');
		description.name = 'description';
		description.content = 'Lakuna - ' + pageName();
		document.head.append(description);
	}

	// Character set.
	if (!document.querySelector('meta[charset]')) {
		console.warn('The character set should be set in the head as a best practice.');
		const charset = document.createElement('meta');
		charset.charset = CHARSET;
		document.head.append(charset);
	}

	// Author.
	if (!document.querySelector('meta[name="author"]')) {
		console.log('Setting default author.');
		const author = document.createElement('meta');
		author.name = 'author';
		author.content = AUTHOR;
		document.head.append(author);
	}

	// Viewport.
	if (!document.querySelector('meta[name="viewport"]')) {
		console.log('Setting default viewport.');
		const viewport = document.createElement('meta');
		viewport.name = 'viewport';
		viewport.content = VIEWPORT;
		document.head.append(viewport);
	}

	// Favicon.
	if (!document.querySelector('link[rel="icon"]')) {
		console.log('Setting default favicon.');
		const icon = document.createElement('link');
		icon.rel = 'icon';
		icon.href = FAVICON_URL;
		document.head.append(icon);
	}

	// Standard stylesheet.
	loadStyle(STANDARD_STYLE, () => console.warn('The standard stylesheet should be included in the head to avoid flashing.'));
});

// Check that page content is split into header, main, and footer for flexbox.
addLoadEvent(() => {
	if (!document.querySelector('main')) {
		console.log('Automatically moving all content into main.');
		const main = document.createElement('main');
		document.body.append(main);

		// Move all elements into main.
		const nodes = [];
		for (let i = 0; i < document.body.childNodes.length; i++) {
			const node = document.body.childNodes[i];
			if (node == main) { continue; }
			nodes.push(node);
		}

		nodes.forEach((node) => main.append(node));
	}

	if (!document.querySelector('header')) {
		console.log('Automatically creating header.');
		document.body.prepend(document.createElement('header'));
	}

	if (!document.querySelector('footer')) {
		console.log('Automatically creating footer.');
		document.body.append(document.createElement('footer'));
	}
});

// Check that image elements have alt attributes.
addLoadEvent(() => {
	const images = document.querySelectorAll('img');
	for (let i = 0; i < images.length; i++) {
		const image = images[i];
		if (!image.alt) {
			console.warn('No alt attribute set for image. Using placeholder.');
			image.alt = image.src.split('/').pop().split('.').shift().toUpperCase();
		}
	}
});

// Load dropdown assets if any are present. Also called after loading navbars, in case any are included within.
const loadDropdown = () => {
	if (document.querySelector(`div[class*='${DROPDOWN_CLASS}']`)) {
		loadScript(DROPDOWN_SCRIPT, () => console.log('Loaded dropdown script.'));
		loadStyle(DROPDOWN_STYLE, () => console.warn('The dropdown stylesheet should be included in the head to avoid flashing.'));
	}
}
addLoadEvent(() => loadDropdown());

// Load slideshow assets if any are present.
addLoadEvent(() => {
	if (document.querySelector(`div[class*='${SLIDESHOW_CLASS}']`)) {
		loadScript(SLIDESHOW_SCRIPT, () => console.log('Loaded slideshow script.'));
		loadStyle(SLIDESHOW_STYLE, () => console.warn('The slideshow stylesheet should be included in the head to avoid flashing.'));
	}
});

// Load tab assets if any are present.
addLoadEvent(() => {
	if (document.querySelector(`div[class*='${TAB_CLASS}'`)) {
		loadScript(TAB_SCRIPT, () => console.log('Loaded tab script.'));
		loadStyle(TAB_STYLE, () => console.warn('The tab stylesheet should be included in the head to avoid flashing.'));
	}
});

// Load filter assets if any are present.
addLoadEvent(() => {
	if (document.querySelector(`div[class*='${FILTER_CLASS}'`)) {
		loadScript(FILTER_SCRIPT, () => console.log('Loaded filter script.'));
		loadStyle(FILTER_STYLE, () => console.warn('The filter stylesheet should be included in the head to avoid flashing.'));
	}
});

// Load sidenav if present.
addLoadEvent(() => {
	const sidenav = document.querySelector(`div#${SIDENAV_ID}`);
	if (sidenav) { loadStyle(SIDENAV_STYLE, () => console.warn('The sidenav stylesheet should be included in the head to avoid flashing.')); }
});

// Load jQuery, then load navbars if present.
addLoadEvent(() => loadScript(JQUERY_CDN, () => {
	const topnav = document.querySelector(`div#${TOPNAV_ID}`);
	const botnav = document.querySelector(`div#${BOTNAV_ID}`);

	// Load topnav.
	if (topnav) {
		$('#topnav').load(TOPNAV_HTML, () => {
			console.log('Loaded topnav.');
			if (!botnav) { loadDropdown(); } // In case there are dropdowns in the topnav but not the page body.

			const header = document.querySelector('header');
			if (header && !header.contains(topnav)) {
				console.log('Moving topnav into header.');
				header.append(topnav);
			}

			loadScript(TOPNAV_SCRIPT, () => console.log('Loaded topnav script.'));
			loadStyle(NAVBAR_STYLE, () => console.warn('The navbar stylesheet should be included in the head to avoid flashing.'));
		});
	}

	// Load botnav.
	if (botnav) {
		$('#botnav').load(BOTNAV_HTML, () => {
			console.log('Loaded botnav.');
			loadDropdown(); // In case there are dropdowns in the botnav but not the page body.

			const footer = document.querySelector('footer');
			if (footer && !footer.contains(botnav)) {
				console.log('Moving botnav into footer.');
				footer.append(botnav);
			}

			loadStyle(NAVBAR_STYLE, () => console.warn('The navbar stylesheet should be included in the head to avoid flashing.'));
		});
	}

	if (!botnav && !topnav) { loadDropdown(); }
}));

// Load Font Awesome.
addLoadEvent(() => loadScript(FONT_AWESOME_CDN, () => console.log('Loaded Font Awesome.')));

// Load Google Analytics.
addLoadEvent(() => loadScript(GTAG_CDN, () => {
	dataLayer = dataLayer || [];
	function gtag() { dataLayer.push(arguments); }
	gtag('js', new Date());
	gtag('config', ANALYTICS_ID);

	console.log('Setup Google Analytics.');
}));