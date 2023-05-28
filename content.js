function parseURLsFromTrackList(containerClass) {
	const container = document.querySelector(`ol.${containerClass}`);
	if (!container) {
		console.log(`Container with class "${containerClass}" not found.`);
		return [];
	}

	const urls = [];
	const trackElements = container.querySelectorAll("li[class*=albumtracklist__track]");

	trackElements.forEach((trackElement) => {
		const linkElement = trackElement.querySelector("div[class*=albumtracklist__trackname] > a");
		if (linkElement) {
			const url = linkElement.href;
			urls.push(url);
		}
	});

	return urls;
}

// Inject the content script into the page
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	if (request.command === "injectContentScript") {
		const script = document.createElement("script");
		script.src = chrome.runtime.getURL("content.js");
		document.head.appendChild(script);
	}
});

// Send a message to the background script to request injecting the content script
chrome.runtime.sendMessage({ command: "injectContentScript" });
