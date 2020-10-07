const toggleFilter = (filter, filterClassName, allClassNames) => {
	if (filter.activeClasses.includes(filterClassName)) {
		filter.activeClasses.splice(filter.activeClasses.indexOf(filterClassName), 1);
	} else { filter.activeClasses.push(filterClassName); }

	const filterButtons = filter.controller.querySelectorAll(`button.${FILTER_CONTROL_ITEM_CLASS}`);
	const filterItems = filter.content.querySelectorAll(`div.${FILTER_ITEM_CLASS}`);

	for (let i = 0; i < filterButtons.length; i++) {
		const filterButton = filterButtons[i];
		filterButton.classList.remove(ACTIVE_CLASS);
		if (filter.activeClasses.includes(filterButton.linkedClassName)) { filterButton.classList.add(ACTIVE_CLASS); }
	}

	for (let i = 0; i < filterItems.length; i++) {
		const filterItem = filterItems[i];
		filterItem.classList.remove(ACTIVE_CLASS);
		if (filter.activeClasses.every((className) => filterItem.classList.contains(className) || className == FILTER_ITEM_CLASS)) {
			filterItem.classList.add(ACTIVE_CLASS);
		}
	}
}

// onload
const filters = document.querySelectorAll(`div.${FILTER_CLASS}`);
for (let i = 0; i < filters.length; i++) {
	const filter = filters[i];

	// Make property for active filter classes.
	filter.activeClasses = [];

	// Get filter content.
	filter.content = filter.querySelector(`:scope > div.${FILTER_CONTENT_CLASS}`);
	if (!filter.content) {
		console.log('Adding filter content.');
		filter.content = document.createElement('div');
		filter.content.className = FILTER_CONTENT_CLASS;
		filter.append(filter.content);
	}

	// Get filter controller.
	filter.controller = filter.querySelector(`:scope > div.${FILTER_CONTROLLER_CLASS}`);
	if (!filter.controller) {
		console.log('Adding filter controller.');
		filter.controller = document.createElement('div');
		filter.controller.className = FILTER_CONTROLLER_CLASS;
		filter.prepend(filter.controller);
	}

	// Move all divs in filter to filter content.
	const divs = filter.querySelectorAll(':scope > div');
	for (let j = 0; j < divs.length; j++) {
		const div = divs[j];
		if (div == filter.controller || div == filter.content) { continue; }
		console.log('Moving div into filter content.');
		filter.content.append(div);
	};

	// Add filter content class to each div in filter content.
	const items = filter.content.querySelectorAll(':scope > div');
	for (let j = 0; j < items.length; j++) {
		const item = items[j];

		if (!item.classList.contains(FILTER_ITEM_CLASS)) {
			console.log('Adding item class to filter div.');
			item.classList.add(FILTER_ITEM_CLASS);
		}
	}

	// Get filter classes.
	const filterClassNames = [];
	const filterContents = filter.content.querySelectorAll(`:scope > div.${FILTER_ITEM_CLASS}`);
	for (let j = 0; j < filterContents.length; j++) {
		filterContents[j].classList.forEach((className) => {
			if (className == FILTER_ITEM_CLASS) { return; } // Skip filter item class.
			if (!filterClassNames.includes(className)) { filterClassNames.push(className); }
		});
	}
	console.log(`Found filter class names: ${filterClassNames}`);

	// Create a button in filter controller for each filter content class.
	for (let j = 0; j < filterClassNames.length; j++) {
		const linkedClassName = filterClassNames[j];
		const button = document.createElement('button');
		button.className = FILTER_CONTROL_ITEM_CLASS;
		button.onclick = () => toggleFilter(filter, linkedClassName, filterClassNames);
		button.linkedClassName = linkedClassName;
		button.innerHTML = linkedClassName.replace(/_/g, ' ');
		filter.controller.append(button);
	}

	// Delete extraneous nodes.
	const nodes = [];
	for (let j = 0; j < filter.children.length; j++) {
		const child = filter.children[j];
		if (child == filter.content || child == filter.controller) { continue; }
		nodes.push(child);
	}
	nodes.forEach((node) => {
		console.warn('Removing extaneous node from filter.');
		filter.removeChild(node);
	});

	// Set current filter.
	const filterQueryParam = new URLSearchParams(location.search).get('filter');
	if (filterQueryParam) { toggleFilter(filter, filterQueryParam, filterClassNames); } else {
		// Toggle filter twice to show all results.
		toggleFilter(filter);
		toggleFilter(filter);
	}
}