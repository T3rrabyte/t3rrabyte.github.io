/*
<div class='tab'>
	<div class='tab-controller'>
		<button class='tab-button active'>Tab 1</button>
		<button class='tab-button'>Tab 2</button>
	</div>
	<div class='tab-content'>
		<div id='Tab_1' class='tab-panel active'></div>
		<div id='Tab_2' class='tab-panel'></div>
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
	// Find selected tab in URL query parameters.
	const query = new URLSearchParams(location.search).get('tab');

	// Add tab buttons.
	document.querySelectorAll('div.tab').forEach((tab) => {
		const tabController = tab.querySelector(':scope > div.tab-controller');
		tab.querySelectorAll(':scope > div.tab-content > div.tab-panel').forEach((panel) => {
			const button = document.createElement('button');
			button.className = 'tab-button';
			button.innerHTML = panel.id.replace(/_/g, ' ');
			button.onclick = () => {
				tab.querySelectorAll(':scope > div.tab-controller > button.tab-button').forEach((button) => button.classList.remove('active'));
				tab.querySelectorAll(':scope > div.tab-content > div.tab-panel').forEach((panel) => panel.classList.remove('active'));

				panel.classList.add('active');
				button.classList.add('active');
			};
			tabController.append(button);

			if (query == panel.id) { button.onclick(); }
		});
	});
});
