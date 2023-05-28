/*
In the background.js script, we listen for the command messages from the extension popup and navigate to the next or previous track accordingly. The fetchTrackList function is responsible for fetching the track list based on the current URL and calling the provided callback function with the array of track URLs. Modify the fetchTrackList function to suit your implementation for fetching and parsing the track list.
*/

// background.js
chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
	const currentURL = tabs[0].url; // Get the current URL

	function navigateToNextOrPreviousTrack(direction) {
		// Fetch the track list from the Genius webpage
		fetchTrackList(currentURL, function (trackList) {
			const currentTrackIndex = trackList.indexOf(currentURL);

			if (currentTrackIndex !== -1) {
				let nextTrackIndex;
				if (direction === "next") {
					nextTrackIndex = currentTrackIndex + 1;
					if (nextTrackIndex >= trackList.length) {
						nextTrackIndex = 0; // Wrap around to the first track if reaching the end
					}
				} else if (direction === "previous") {
					nextTrackIndex = currentTrackIndex - 1;
					if (nextTrackIndex < 0) {
						nextTrackIndex = trackList.length - 1; // Wrap around to the last track if reaching the beginning
					}
				}

				const nextTrackURL = trackList[nextTrackIndex];
				// Navigate to the next or previous track URL
				chrome.tabs.update({ url: nextTrackURL });
			} else {
				console.log("Current track not found in the track list.");
			}
		});
	}

	// Function to fetch the track list from the Genius webpage
	function fetchTrackList(url, callback) {
		// Implement the logic to fetch and parse the track list here
		// This function should call the callback with the array of track URLs
		// You can use the parseURLsFromTrackList function you provided earlier
		// Make sure to modify it to fit your specific implementation

		const trackList = parseURLsFromTrackList(url); // Example: calling the parseURLsFromTrackList function
		callback(trackList);
	}

	// Function to parse URLs from the track list
	function parseURLsFromTrackList(url) {
		// Implement the logic to parse the track list and extract the URLs here
		// This function should return an array of track URLs based on the provided URL
		// Modify the parseURLsFromTrackList function you provided earlier to fit your specific implementation

		const containerClass = "[class*=AlbumTracklist__Container]";
		const container = document.querySelector(`ol${containerClass}`);
		if (!container) {
			console.log(`Container with class "${containerClass}" not found.`);
			return [];
		}

		const urls = [];
		const trackElements = container.querySelectorAll("li[class*=AlbumTracklist__Track]");

		trackElements.forEach((trackElement) => {
			const linkElement = trackElement.querySelector("div[class*=AlbumTracklist__TrackName] > a");
			if (linkElement) {
				const url = linkElement.href;
				urls.push(url);
			}
		});

		return urls;
	}

	// Add listeners to handle navigation commands from the extension popup
	chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
		if (request.command === "next") {
			navigateToNextOrPreviousTrack("next");
		} else if (request.command === "previous") {
			navigateToNextOrPreviousTrack("previous");
		}
	});
});