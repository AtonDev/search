var tabStates = {};


chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    id = sender.tab.id;
    switch (request.action) {
        case 'search':
            submitToServer(id, request.query);           
            break;

        case 'next':
            nextPage(id); 
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
            sendResponse({state: tabStates[id].state, query: tabStates[id].query});
            break;

        case 'right':
            nextPage(id);
            break;
        case 'left':
            nextPage(id, "back");
            break;
     }
  }
);

function nextPage(id, dir) {
  var tabState = tabStates[id];
  var idx = tabState.idx;
  var newIndex;
  var urls = tabState.urls;
  if (dir == "back") {
     newIndex = (idx > 0) ? idx-1 : 0
  }else newIndex = idx + 1;
  tabStates[id].idx = newIndex
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
  console.log(id);
  tabStates[id] = {};
  tabStates[id].state = 'on';
  tabStates[id].query = '';
});

chrome.browserAction.onClicked.addListener(function(tab) {
  var id = tab.id
  var toolbarExists = id in tabStates;
  console.log("browser action detected");
  if(!toolbarExists || tabStates[id].state == 'off') {
    tabStates[id] = {};
    tabStates[id].state = 'on';
    tabStates[id].query = '';
    chrome.tabs.sendMessage(id, {action: "loadToolbar"});
  } 
});