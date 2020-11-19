/*
<div class='slideshow'>
	<div class='slideshow-content'>
		<img class='slide' />
	</div>
	<div class='slideshow-controller'>
		<span class='dot'></span>
	</div>
</div>
*/

// Credit: Simon Willison.
addLoadEvent = (event) => {
	const old = onload;
	if (typeof old != 'function') {
		onload = event;
	} else {
		onload = () => {
			old();
			event();
		}
	}
}

addLoadEvent(() => {
	document.querySelectorAll('div.slideshow').forEach((slideshow) => {
		const slideshowController = slideshow.querySelector(':scope > div.slideshow-controller');
		let currentSlide = 0, slideCount, interval;

		const updateDisplay = () => {
			let i = 0;
			slideshowController.querySelectorAll(':scope > span.dot').forEach((dot) => {
				dot.classList.remove('active');
				dot.slide.classList.remove('active');
				if (i == currentSlide) {
					dot.classList.add('active');
					dot.slide.classList.add('active');
				}

				i++; // Increment.
			});
		};

		let i = 0;
		slideshow.querySelectorAll(':scope > div.slideshow-content > img.slide').forEach((slide) => {
			const dot = document.createElement('span');
			dot.className = 'dot';
			dot.slide = slide;
			dot.index = i;
			dot.onclick = () => {
				clearInterval(interval);
				currentSlide = dot.index;
				updateDisplay();
			};
			slideshowController.append(dot);

			i++; // Increment
		});
		slideCount = i;

		// Start the slideshow.
		updateDisplay();
		interval = setInterval(() => {
			currentSlide++;
			currentSlide = currentSlide >= slideCount ? currentSlide - slideCount : (currentSlide < 0 ? slideCount + currentSlide : currentSlide);
			updateDisplay();
		}, 5000);
	});
});