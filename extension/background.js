var urls, tabId, curIndex = 0;

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (tabId == sender.tab.id) {
      if (request.action == "right") {
        curIndex+=1;
      }else if (request.action == "left") {
        curIndex -= 1;
      }
      chrome.tabs.update(sender.tab.id, {url: urls[curIndex]}); 
    }
  }
);
