// Credit: Simon Willison.
addLoadEvent = (event) => {
	const old = window.onload;
	if (typeof old != 'function') {
		// console.log("Added first load event.");
		window.onload = event;
	} else {
		// console.log("Added subsequent load event.");
		window.onload = () => {
			old();
			event();
		}
	}
}