const DELAY = 5000;
const MOBILE_WIDTH = 750;

let currentSlideIndex = 1;
let slideshowInterval;

function setupSlideshow(slides) {
	const slideshowContainer = document.getElementById("slideshow");
	const slideshowControllerContainer = document.getElementById("slideshowController");

	const slideCount = slides.length;
	let currentSlideNumber = 1;

	slides.forEach(slideData => {
		if (typeof slideData == "string") { slideData = { url: slideData }; }

		const slide = document.createElement("DIV");
		slide.className = "slide fade";

		// Slide image.
		const slideImage = document.createElement("IMG");
		slideImage.src = slideData.url || "";
		slide.appendChild(slideImage);

		if (screen.width >= MOBILE_WIDTH) {
			// Slide number.
			const slideNumber = document.createElement("DIV");
			slideNumber.className = "slideNumber";
			slideNumber.innerHTML = currentSlideNumber + " / " + slideCount;
			slide.appendChild(slideNumber);

			// Slide caption.
			const slideCaption = document.createElement("DIV");
			slideCaption.className = "slideCaption";
			slideCaption.innerHTML = slideData.caption || "";
			slide.appendChild(slideCaption);
		}

		// Add slide to slideshow.
		slideshowContainer.appendChild(slide);

		// Add control dots for large screens.
		if (screen.width >= MOBILE_WIDTH) {
			const controllerDot = document.createElement("SPAN");
			controllerDot.className = "slideshowControllerDot";
			const controllerDotIndex = currentSlideNumber; // Must be separate variable.
			controllerDot.onclick = () => setSlide(controllerDotIndex, true);

			// Add dots to screen.
			slideshowControllerContainer.appendChild(controllerDot);
		}

		currentSlideNumber++;
	});

	// Add control arrows for large screens.
	if (screen.width >= MOBILE_WIDTH) {
		const previousSlideButton = document.createElement("A");
		previousSlideButton.id = "previousSlideButton";
		previousSlideButton.onclick = () => incrementSlide(-1, true);
		previousSlideButton.innerHTML = "&#10094;";
		slideshowContainer.appendChild(previousSlideButton);

		const nextSlideButton = document.createElement("A");
		nextSlideButton.id = "nextSlideButton";
		nextSlideButton.onclick = () => incrementSlide(1, true);
		nextSlideButton.innerHTML = "&#10095;";
		slideshowContainer.appendChild(nextSlideButton);
	}

	// Start automatic slideshow.
	setSlide(currentSlideIndex, false);
	slideshowInterval = setInterval(incrementSlide, DELAY, 1, false);
}

function setSlide(index, stopAuto) {
	if (stopAuto) { clearInterval(slideshowInterval); }
	currentSlideIndex = index;
	updateDisplay();
}

function incrementSlide(amount, stopAuto) {
	if (stopAuto) { clearInterval(slideshowInterval); }
	currentSlideIndex += amount;
	updateDisplay();
}

function updateDisplay() {
	const slides = document.getElementsByClassName("slide");
	const dots = document.getElementsByClassName("slideshowControllerDot");

	if (currentSlideIndex > slides.length) { currentSlideIndex = 1; }
	if (currentSlideIndex < 1) { currentSlideIndex = slides.length; }

	for (let i = 0; i < slides.length; i++) { slides[i].style.display = "none"; }
	for (let i = 0; i < dots.length; i++) { dots[i].className = dots[i].className.replace(" activeDot", ""); }
	if (slides.length >= currentSlideIndex) { slides[currentSlideIndex - 1].style.display = "block"; }
	if (dots.length >= currentSlideIndex) { dots[currentSlideIndex - 1].className += " activeDot"; }
}

function slideshowKeyboardInput(event) {
	switch(event.keyCode) {
		case 37:
			// Left arrow key.
			incrementSlide(-1, true);
			break;
		case 39:
			// Right arrow key.
			incrementSlide(1, true);
			break;
	}
}
