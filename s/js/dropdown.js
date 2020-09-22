// onload
const dropdowns = document.querySelectorAll(`div.${DROPDOWN_CLASS}`);
for (let i = 0; i < dropdowns.length; i++) {
	const dropdown = dropdowns[i];

	// Get dropdown content class.
	dropdown.content = dropdown.querySelector(`:scope > div.${DROPDOWN_CONTENT_CLASS}`);
	if (!dropdown.content) {
		console.log('Adding dropdown content container.');
		dropdown.content = document.createElement('div');
		dropdown.content.className = DROPDOWN_CONTENT_CLASS;
		dropdown.append(dropdown.content);
	}

	// Get dropdown button.
	dropdown.button = dropdown.querySelector(`:scope > button.${DROPDOWN_BUTTON_CLASS}`);
	if (!dropdown.button) {
		console.log('Adding default dropdown button.');
		dropdown.button = document.createElement('button');
		dropdown.button.className = DROPDOWN_BUTTON_CLASS;
		dropdown.button.innerHTML = 'DROPDOWN';
		dropdown.prepend(dropdown.button);
	}

	// Move links and buttons in the dropdown into dropdown content.
	const elements = dropdown.querySelectorAll(':scope > a, :scope > button');
	for (let j = 0; j < elements.length; j++) {
		const element = elements[j];
		if (element == dropdown.button) { continue; }
		console.log('Moving element into dropdown content.');
		dropdown.content.append(element);
	}

	// Delete elements within the dropdown that don't fit.
	const nodes = [];
	for (let j = 0; j < dropdown.children.length; j++) {
		const child = dropdown.children[j];
		if (child == dropdown.content || child == dropdown.button) { continue; }
		nodes.push(child);
	}
	nodes.forEach((node) => {
		console.warn('Removing extaneous node from dropdown.');
		dropdown.removeChild(node);
	});
}