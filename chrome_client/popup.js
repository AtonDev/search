//wait for popup.html to load
window.addEventListener('load', function(evt) {
  document.getElementById('search-form').addEventListener('submit', submitToServer);
});

function submitToServer() {
  event.preventDefault();
  var query = document.getElementById('search-box').value;
  query = query.split(' ').join('+');
  console.log(query);
  var url = "http://localhost:3000/s?search=" + query;
  console.log(url);
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      if (xhr.status == 200) {
	var urls = JSON.parse(xhr.responseText).urls;
	var newTabId;
	bkg = chrome.extension.getBackgroundPage();
	chrome.tabs.create({ url: urls[0]}, function(tab) {
          newTabId = tab.id;
	  bkg.tabId = newTabId;
        });
	bkg.urls = urls;
//	chrome.tabs.executeScript(newTabId, {file: "content_script.js"});
      }else console.log("no 200 status");
    }else console.log("readyState not 4 instead: " + xhr.readyState);      
  }
  
  xhr.send();
}
