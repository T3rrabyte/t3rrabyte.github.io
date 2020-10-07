const openTab = (tab, tabContentId) => {
	const tabContent = tab.content.querySelector(`:scope > div#${tabContentId}`);
	if (tabContent) {
		const tabContents = tab.content.querySelectorAll(`:scope > div.${TAB_ITEM_CLASS}`);
		const tabButtons = tab.controller.querySelectorAll(`:scope > button.${TAB_CONTROL_ITEM_CLASS}`);

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
const tabs = document.querySelectorAll(`div.${TAB_CLASS}`);
for (let i = 0; i < tabs.length; i++) {
	const tab = tabs[i];

	// Get tab content.
	tab.content = tab.querySelector(`:scope > div.${TAB_CONTENT_CLASS}`);
	if (!tab.content) {
		console.log('Adding tab content container.');
		tab.content = document.createElement('div');
		tab.content.className = TAB_CONTENT_CLASS;
		tab.append(tab.content);
	}

	// Get tab button container.
	tab.controller = tab.querySelector(`:scope > div.${TAB_CONTROLLER_CLASS}`);
	if (!tab.controller) {
		console.log('Adding tab button container.');
		tab.controller = document.createElement('div');
		tab.controller.className = TAB_CONTROLLER_CLASS;
		tab.prepend(tab.controller);
	}

	// Move divs in the tab into tab content.
	const divs = tab.querySelectorAll(':scope > div');
	for (let j = 0; j < divs.length; j++) {
		const div = divs[j];
		if (div == tab.controller || div == tab.content) { continue; }
		console.log('Moving div into tab content.');
		tab.content.append(div);
	};

	// Add tab item class to divs within tab content.
	const toBeTabContents = tab.content.querySelectorAll(':scope > div');
	for (let j = 0; j < toBeTabContents.length; j++) {
		const tabContent = toBeTabContents[j];

		if (!tabContent.classList.contains(TAB_ITEM_CLASS)) {
			console.log('Adding tab content class to tab content.');
			tabContent.classList.add(TAB_ITEM_CLASS);
		}
	}

	// Create tab button for each tab item.
	const tabContents = tab.content.querySelectorAll(`:scope > div.${TAB_ITEM_CLASS}`);
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
		tabButton.className = TAB_CONTROL_ITEM_CLASS;
		tabButton.onclick = () => openTab(tab, linkedId);
		tabButton.linkedId = linkedId;
		tabButton.innerHTML = linkedId.replace(/_/g, ' ');
		tab.controller.append(tabButton);
	}

	// Delete elements within the tab that don't fit.
	const nodes = [];
	for (let j = 0; j < tab.children.length; j++) {
		const child = tab.children[j];
		if (child == tab.content || child == tab.controller) { continue; }
		nodes.push(child);
	}
	nodes.forEach((node) => {
		console.warn('Removing extaneous node from tab.');
		tab.removeChild(node);
	});

	// Set current tab.
	const tabQueryParam = new URLSearchParams(location.search).get('tab');
	if (tabQueryParam) { openTab(tab, tabQueryParam); }
}