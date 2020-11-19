/*
<div class='filter'>
	<div class='filter-controller'>
		<button class='filter-button active'>Filter 1</button>
		<button class='filter-button active'>Filter 2</button>
		<button class='filter-button'>Filter 3</button>
	</div>
	<div class='filter-content'>
		<div class='filter-item Filter_1'></div>
		<div class='filter-item Filter_1 Filter_2 active'></div>
		<div class='filter-item Filter_2 Filter_3'></div>
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
	// Find selected filters in URL query parameters.
	let query = new URLSearchParams(location.search).get('filter');
	query = query ? query.split(',') : [];

	document.querySelectorAll('div.filter').forEach((filter) => {
		const activeClasses = [];
		const filterClasses = [];
		const filterController = filter.querySelector(':scope > div.filter-controller');
		filter.querySelectorAll(':scope > div.filter-content > div.filter-item').forEach((item) => {
			item.classList.forEach((className) => {
				if (className != 'filter-item' && className != 'active' && !filterClasses.includes(className)) { filterClasses.push(className); }
			});
		});
		filterClasses.forEach((className) => {
			const button = document.createElement('button');
			button.className = 'filter-button';
			button.innerHTML = className.replace(/_/g, ' ');
			button.onclick = () => {
				if (activeClasses.includes(className)) {
					activeClasses.splice(activeClasses.indexOf(className), 1);
					button.classList.remove('active');
				} else {
					activeClasses.push(className);
					button.classList.add('active');
				}
				
				filter.querySelectorAll(':scope > div.filter-content > div.filter-item').forEach((item) => {
					item.classList.remove('active');
					if (activeClasses.every((className) => item.classList.contains(className))) { item.classList.add('active'); }
				});
			};
			filterController.append(button);

			if (query.includes(className)) { button.onclick(); }
		});
	});
});
