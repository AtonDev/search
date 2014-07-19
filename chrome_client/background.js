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
  var url = "http://instantsearch.herokuapp.com/s?search=" + query;
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      if (xhr.status == 200) {
        var urls = JSON.parse(xhr.responseText).urls;
        tabStates[tabId].urls = urls; 
        tabStates[tabId].idx = 0;      
        chrome.tabs.update(tabId, {url: urls[0]}); 
      }else console.log("no 200 status");
    }else console.log("readyState not 4 instead: " + xhr.readyState);      
  }
  xhr.send();
}

function submitAnalytics(tabId, evt, query) {
  var url = "http://custom-analytics.herokuapp.com/api/v1/is_event";
  var xhr = new XMLHttpRequest();
  var nonce = Math.floor(Math.random() * Math.pow(2,31));
  var params = 'query=' + query + "&event=" + evt + "&browser=chrome" + "&nonce=" + nonce;
  xhr.open('POST', url, true);
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      if (xhr.status == 200) {
        //success
        console.log("RESPONSE: " + xhr.responseText);
      }else console.log("no 200 status");
    }else console.log("readyState not 4 instead: " + xhr.readyState);      
  }
  xhr.send(params);
}

/*
 * Event Listeners
 */

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
    if (id in tabStates) {
      var query = request.query; 
      if (query) {
        tabStates[id].query = query;
      }
      switch (request.action) {
          case 'search':
              console.log ('query: ' + query);
              submitToServer(id, query);   
              submitAnalytics(id, 'search', query);        
              break;

          case 'next':
              nextPage(id, "forward"); 
              submitAnalytics(id, 'next', query);
              break;

          case 'loaded': //TODO add timeout if newtab's onCreated hasn't fired yet so tabState can be created first
              console.log('received loaded message');
              tabState = tabStates[id];
              sendResponse({action: "populateSearchBox", query: tabStates[id].query});
              break;

          case 'removeToolbar':
              console.log(id);
              chrome.tabs.sendMessage(id, {action: "removeToolbar"});
              submitAnalytics(id, 'remove', query);
              tabStates[id].state = 'off';
              tabStates[id].query = '';
              break;

          case 'getTabState':
              var tabState = tabStates[id];            
              var next = "urls" in tabState ? tabState.urls[tabState.idx + 1] : "none";
              sendResponse({state: tabState.state, query: tabState.query, next: next});
              break;

          case 'right':
              nextPage(id, "forward");
              submitAnalytics(id, 'next', query);
              break;

          case 'left':
              nextPage(id, "back");
              submitAnalytics(id, 'previous', query);
              break;
       }
     }
  }
);