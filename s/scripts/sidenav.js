function openDropdown(event, boxName) {
	// console.log(`Attempting to open tab: ${tabName}`);
	const dropdownBoxes = document.getElementsByClassName("dropdown-box");
	for (let i = 0; i < dropdownBoxes.length; i++) {
		dropdownBoxes[i].style.display = "none";
	}
	const dropdownButtons = document.getElementsByClassName("dropdown");
	for (let i = 0; i < dropdownButtons.length; i++) {
		dropdownButtons[i].className = dropdownButtons[i].className.replace(" active", "");
	}
	const box = document.getElementById(boxName);
	if (box) { box.style.display = "block"; }
	if (event) { event.currentTarget.className += " active"; }
}