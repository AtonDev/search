var tabStates = {};


function nextPage(id, dir) {
  var tabState = tabStates[id];
  var idx = tabState.idx;
  var newIndex;
  var urls = tabState.urls;
  if (dir == "back") {
     newIndex = (idx > 0) ? idx-1 : 0;
  }else newIndex = idx + 1;
  tabStates[id].idx = newIndex;
  chrome.tabs.update(id, {url: urls[newIndex]}); 
}


function submitToServer(tabId, query) {
  splitQuery = query.split(' ').join('+');
  var url = "http://instantsearch.herokuapp.com/s?search=" + splitQuery;
  console.log(url);
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      if (xhr.status == 200) {
        var urls = JSON.parse(xhr.responseText).urls;
        console.log(urls);
        tabStates[tabId].urls = urls; 
        tabStates[tabId].idx = 0;
        tabStates[tabId].query = query;
        chrome.tabs.update(tabId, {url: urls[0]}); 
      }else console.log("no 200 status");
    }else console.log("readyState not 4 instead: " + xhr.readyState);      
  }
  xhr.send();
}

chrome.tabs.onCreated.addListener(function(tab) {
  var id = tab.id;
  console.log("onCreated: " + id);
  tabStates[id] = {};
  tabStates[id].state = 'on';
  tabStates[id].query = '';
});

chrome.browserAction.onClicked.addListener(function(tab) {
  var id = tab.id;
  var toolbarExists = id in tabStates;
  console.log("browser action detected");
  if(!toolbarExists || tabStates[id].state == 'off') {
    tabStates[id] = {};
    tabStates[id].state = 'on';
    tabStates[id].query = '';
    chrome.tabs.sendMessage(id, {action: "loadToolbar"});
  } 
});

chrome.tabs.onReplaced.addListener (function (newTabId, oldTabId) {
  if (oldTabId in tabStates) {
    console.log ("swapping tabStates");
    tabStates[newTabId] = tabStates[oldTabId];
  }
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    var id = sender.tab.id;
    if (id in tabStates)
    switch (request.action) {
        case 'search':
            submitToServer(id, request.query);           
            break;

        case 'next':
            nextPage(id, "forward"); 
            break;

        case 'loaded': //TODO add timeout if newtab's onCreated hasn't fired yet so tabState can be created first
            console.log('received loaded message');
            tabState = tabStates[id];
            sendResponse({action: "populateSearchBox", query: tabStates[id].query});
            break;

        case 'removeToolbar':
            console.log(id);
            chrome.tabs.sendMessage(id, {action: "removeToolbar"});
            tabStates[id].state = 'off';
            tabStates[id].query = '';
            break;

        case 'getTabState':
            var tabState = tabStates[id];
            console.log("tabState :" + tabState);
            console.log("getTabState id :" + id + "url: " + sender.tab.url);
          
            var next = "urls" in tabState ? tabState.urls[tabState.idx + 1] : "none";
            sendResponse({state: tabState.state, query: tabState.query, next: next});
            break;

        case 'right':
            nextPage(id, "forward");
            break;
        case 'left':
            nextPage(id, "back");
            break;
     }
  }
);