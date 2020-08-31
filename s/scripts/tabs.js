function openTab(event, tabName) {
	// console.log(`Attempting to open tab: ${tabName}`);
	const tabcontent = document.getElementsByClassName("tabcontent");
	for (let i = 0; i < tabcontent.length; i++) {
		tabcontent[i].style.display = "none";
	}
	const tablinks = document.getElementsByClassName("tablinks");
	for (let i = 0; i < tablinks.length; i++) {
		tablinks[i].className = tablinks[i].className.replace(" active", "");
	}
	const tab = document.getElementById(tabName);
	if (tab) { tab.style.display = "block"; }
	if (event) { event.currentTarget.className += " active"; }
}

addLoadEvent(() => openTab(null, location.hash.substring(1)));