chrome.runtime.sendMessage({action: "initializeTab"});
$(document).ready( function() {
	console.log('here');
	document.getElementById('searchForm').addEventListener('submit', function(event) {
		console.log('search initiated');
	    event.preventDefault();
	    var query = document.getElementById('searchBox').value;
	    chrome.runtime.sendMessage({action: "search", query: query});
	});
});