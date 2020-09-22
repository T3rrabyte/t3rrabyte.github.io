// Key codes.
const DECREMENT_KEYCODE = 37;
const INCREMENT_KEYCODE = 39;

// Miscellaneous.
const DELAY = 5000;
const MOBILE_BREAKPOINT = 700;

const setSlide = (slideshow, index, stopAuto) => {
	if (stopAuto) { clearInterval(slideshow.interval); }
	slideshow.index = index;
	updateSlideshowDisplay(slideshow);
}

const incrementSlide = (slideshow, amount, stopAuto) => {
	if (stopAuto) { clearInterval(slideshow.interval); }
	slideshow.index += amount;
	updateSlideshowDisplay(slideshow);
}

const updateSlideshowDisplay = (slideshow) => {
	const slides = slideshow.content.querySelectorAll(`:scope > img.${SLIDE_CLASS}`);
	const dots = slideshow.controller.querySelectorAll(`:scope > span.${SLIDESHOW_CONTROLLER_DOT_CLASS}`);

	if (slideshow.index > slides.length) { slideshow.index = 1; }
	if (slideshow.index < 1) { slideshow.index = slides.length; }

	for (let i = 0; i < slides.length; i++) { slides[i].classList.remove(ACTIVE_CLASS); }
	for (let i = 0; i < dots.length; i++) { dots[i].classList.remove(ACTIVE_CLASS); }

	if (slides.length >= slideshow.index) { slides[slideshow.index - 1].classList.add(ACTIVE_CLASS); }
	if (dots.length >= slideshow.index) { dots[slideshow.index - 1].classList.add(ACTIVE_CLASS); }
}

const slideshowKeyboardInput = (event) => {
	for (let i = 0; i < slideshows.length; i++) {
		const slideshow = slideshows[i];

		switch(event.keyCode) {
			case DECREMENT_KEYCODE: {
				incrementSlide(slideshow, -1, true);
				break;
			}
			case INCREMENT_KEYCODE: {
				incrementSlide(slideshow, 1, true);
				break;
			}
		}
	}
}

// onload
const slideshows = document.querySelectorAll(`div.${SLIDESHOW_CLASS}`);
for (let i = 0; i < slideshows.length; i++) {
	const slideshow = slideshows[i];

	// Get slideshow content.
	slideshow.content = slideshow.querySelector(`:scope > div.${SLIDESHOW_CONTENT_CLASS}`);
	if (!slideshow.content) {
		console.log('Creating empty slideshow content div.');
		slideshow.content = document.createElement('div');
		slideshow.content.className = SLIDESHOW_CONTENT_CLASS;
		slideshow.append(slideshow.content);
	}

	// Move all images in the slideshow div into the slideshow content.
	const images = slideshow.querySelectorAll(':scope > img');
	for (let j = 0; j < images.length; j++) {
		console.log('Moving slideshow image into slideshow content.');
		slideshow.content.append(images[j]);
	}
	if (slideshow.content.children.length <= 0) { console.warn('Slideshow content is empty.'); }

	// Add slide class to images within slideshow content.
	const toBeSlides = slideshow.content.querySelectorAll(`:scope > img`);
	for (let j = 0; j < toBeSlides.length; j++) {
		const slide = toBeSlides[j];

		if (!slide.classList.contains(SLIDE_CLASS)) {
			console.log('Adding slide class to slide.');
			slide.classList.add(SLIDE_CLASS);
		}
	}

	// Get slideshow controller.
	slideshow.controller = slideshow.querySelector(`:scope > div.${SLIDESHOW_CONTROLLER_CLASS}`);
	if (!slideshow.controller) {
		console.log('Adding slideshow controller.');
		slideshow.controller = document.createElement('div');
		slideshow.controller.className = SLIDESHOW_CONTROLLER_CLASS;
		slideshow.append(slideshow.controller);
	}

	// Create a control dot for each slide.
	const slides = slideshow.content.querySelectorAll(`:scope > img.${SLIDE_CLASS}`);
	for (let j = 1; j < images.length + 1; j++) {
		const dot = document.createElement('span');
		dot.className = SLIDESHOW_CONTROLLER_DOT_CLASS;
		dot.onclick = () => setSlide(slideshow, j, true);
		slideshow.controller.append(dot);
	}

	// Delete elements within the slideshow that don't fit.
	const nodes = [];
	for (let j = 0; j < slideshow.children.length; j++) {
		const child = slideshow.children[j];
		if (child == slideshow.content || child == slideshow.controller) { continue; }
		nodes.push(child);
	}
	nodes.forEach((node) => {
		console.warn('Removing extraneous node from slideshow.');
		slideshow.removeChild(node);
	});

	// Start the automatic slideshow.
	slideshow.index = 1;
	setSlide(slideshow, slideshow.index, false);
	slideshow.interval = setInterval(incrementSlide, DELAY, slideshow, 1, false);
}

document.onkeydown = (event) => slideshowKeyboardInput(event);