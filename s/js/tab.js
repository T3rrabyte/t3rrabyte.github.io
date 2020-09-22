const openTab = (allTab, tabContentId) => {
	const tabContent = allTab.content.querySelector(`:scope > div#${tabContentId}`);
	if (tabContent) {
		const tabContents = allTab.content.querySelectorAll(`:scope > div.${TAB_CONTENT_CLASS}`);
		const tabButtons = allTab.buttonContainer.querySelectorAll(`:scope > button.${TAB_BUTTON_CLASS}`);

		for (let i = 0; i < tabContents.length; i++) {
			const tabContent = tabContents[i];
			tabContent.classList.remove(ACTIVE_CLASS);
			if (tabContent.id == tabContentId) { tabContent.classList.add(ACTIVE_CLASS); }
		}

		for (let i = 0; i < tabButtons.length; i++) {
			const tabButton = tabButtons[i];
			tabButton.classList.remove(ACTIVE_CLASS);
			if (tabButton.linkedId == tabContentId) { tabButton.classList.add(ACTIVE_CLASS); }
		}
	} else { console.warn(`Tab content "${tabContentId}" not found.`); }
}

// onload
const allTabs = document.querySelectorAll(`div.${TAB_CLASS}`);
for (let i = 0; i < allTabs.length; i++) {
	const allTab = allTabs[i];

	// Get all tab content.
	allTab.content = allTab.querySelector(`:scope > div.${ALL_TAB_CONTENT_CLASS}`);
	if (!allTab.content) {
		console.log('Adding all tab content container.');
		allTab.content = document.createElement('div');
		allTab.content.className = ALL_TAB_CONTENT_CLASS;
		allTab.append(allTab.content);
	}

	// Get all tab button container.
	allTab.buttonContainer = allTab.querySelector(`:scope > div.${ALL_TAB_BUTTON_CLASS}`);
	if (!allTab.buttonContainer) {
		console.log('Adding tab button container.');
		allTab.buttonContainer = document.createElement('div');
		allTab.buttonContainer.className = ALL_TAB_BUTTON_CLASS;
		allTab.prepend(allTab.buttonContainer);
	}

	// Move divs in the all tab into all tab content.
	const divs = allTab.querySelectorAll(':scope > div');
	for (let j = 0; j < divs.length; j++) {
		const div = divs[j];
		if (div == allTab.buttonContainer || div == allTab.content) { continue; }
		console.log('Moving div into all tab content.');
		allTab.content.append(div);
	};

	// Add tab content class to divs within all tab content.
	const toBeTabContents = allTab.content.querySelectorAll(':scope > div');
	for (let j = 0; j < toBeTabContents.length; j++) {
		const tabContent = toBeTabContents[j];

		if (!tabContent.classList.contains(TAB_CONTENT_CLASS)) {
			console.log('Adding tab content class to tab content.');
			tabContent.classList.add(TAB_CONTENT_CLASS);
		}
	}

	// Create tab button for each tab content.
	const tabContents = allTab.content.querySelectorAll(`:scope > div.${TAB_CONTENT_CLASS}`);
	for (let j = 0; j < tabContents.length; j++) {
		const tabContent = tabContents[j];
		let linkedId = '';
		if (tabContent.id) { linkedId = tabContent.id; } else {
			console.warn('Tab content lacks an ID. Assigning a placeholder.');
			let k = 1;
			linkedId = `Tab_${k}`;
			while (document.getElementById(linkedId)) {
				k++;
				linkedId = `Tab_${k}`;
			}
			tabContent.id = linkedId;
		}

		const tabButton = document.createElement('button');
		tabButton.className = TAB_BUTTON_CLASS;
		tabButton.onclick = () => openTab(allTab, linkedId);
		tabButton.linkedId = linkedId;
		tabButton.innerHTML = linkedId.replace(/_/g, ' ');
		allTab.buttonContainer.append(tabButton);
	}

	// Delete elements within the tab that don't fit.
	const nodes = [];
	for (let j = 0; j < allTab.children.length; j++) {
		const child = allTab.children[j];
		if (child == allTab.content || child == allTab.buttonContainer) { continue; }
		nodes.push(child);
	}
	nodes.forEach((node) => {
		console.warn('Removing extaneous node from all tab.');
		allTab.removeChild(node);
	});

	// Set current tab.
	const tabQueryParam = new URLSearchParams(location.search).get('tab');
	if (tabQueryParam) { openTab(allTab, tabQueryParam); }
}