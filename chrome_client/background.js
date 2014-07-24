var tabStates = {};


function resizeToolbar(size) {
  chrome.tabs.sendMessage(id, {action: "resizeToolbar", size: size});
}

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
        chrome.tabs.update(tabId, {active: true, url: urls[0]}); 

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

function executeSearch(id, query) {
  console.log ("executeSearch query: " + query);
  if (id == '-1') { //search from browser action
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
      id = tabs[0].id;
      initializeTab(id); 
      tabStates[id].query = query;
      submitToServer(id, query);   
      submitAnalytics(id, 'search', query);
    });
  }else {
    tabStates[id].query = query;
    submitToServer(id, query);   
    submitAnalytics(id, 'search', query);
  }
  
}

function initializeTab(id) {
  tabStates[id] = {};
  tabStates[id].state = 'on';
  tabStates[id].query = '';
}


//var details = new Object();
//details.popup = 'noShow.html';
//chrome.browserAction.setPopup(details);

function togglePopup(wndw) {
   chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
      id = tabs[0].id;
      if (id in tabStates) {
        if ('popup' in tabStates[id]) {
          if (!tabStates[id].popup.closed) { //window hasn't been closed
            console.log('window in tabStates[id]');
            wndw.close();
            delete tabStates[id].popup;
          }
        }else {
          console.log('window not in tabStates[id]');
          tabStates[id].popup = wndw;  //popup hasnt been loaded already so store window object
        } 
      }else {
        initializeTab(id);
        tabStates[id].popup == wndw; //popup hasnt been loaded already so store window object
      }
    });
   console.log('browser action disabled');
}

/*
 * Event Listeners
 */

//chrome.omnibox.onInputStarted.addListener(function () {
//});

//var suggestion = new Object();
//suggestion.description = "test test test";
//chrome.omnibox.setDefaultSuggestion(suggestion);

chrome.omnibox.onInputEntered.addListener(function (text, disposition) {
  chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
    var id = tabs[0].id;
    initializeTab(id);
    executeSearch(id, text);
  });
});

chrome.tabs.onCreated.addListener(function(tab) {
  var id = tab.id;
  tabStates[id] = {};
  tabStates[id].state = 'on';
  tabStates[id].query = '';
  console.log('tab created');
});

chrome.browserAction.onClicked.addListener(function(tab) {  // does not fire since we have a popup that opens on browser action click
  var id = tab.id;
  var idExists = id in tabStates;
  console.log("browser action detected");
  if(!idExists || tabStates[id].state == 'off') {
    initializeTab;
    chrome.tabs.sendMessage(id, {action: "loadToolbar"});
    console.log('loadToolbar message sent');
  } 
  chrome.tabs.sendMessage(id, {action: "removePopup"});
  console.log('removePopup message sent');
});

chrome.tabs.onReplaced.addListener (function (newTabId, oldTabId) {
  console.log("ONREPLACED");
  if (oldTabId in tabStates) {
    console.log ("swapping tabStates");
    tabStates[newTabId] = tabStates[oldTabId];
  }
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    var tab = sender.tab;
    var id;
    if (tab) 
      id = sender.tab.id;
    if (id in tabStates) {
      var tabState = tabStates[id];
 //     var query = request.query; 
 //     if (query) {
 //       tabStates[id].query = query;
 //     }else query = tabStates[id].query;
      switch (request.action) {
          case 'search':
              //console.log ('query: ' + query);
              executeSearch(id, request.query);        
              break;

          case 'next':
              //console.log("next, query: " + query);
              nextPage(id, "forward"); 
              submitAnalytics(id, 'next', tabState.query);
              break;

          case 'loaded': //TODO add timeout if newtab's onCreated hasn't fired yet so tabState can be created first
              sendResponse({action: "populateSearchBox", query: tabState.query});
              break;

          case 'removeToolbar':
              chrome.tabs.sendMessage(id, {action: "removeToolbar"});
              submitAnalytics(id, 'remove', tabState.query);
              tabStates[id].state = 'off';
              tabStates[id].query = '';
              break;

          case 'getTabState':            
              var next = "urls" in tabState ? tabState.urls[tabState.idx + 1] : "none";
              sendResponse({state: tabState.state, query: tabState.query, next: next});
              console.log('in getTabState tab id = ' + id);
              break;

          case 'right':
              nextPage(id, "forward");
              submitAnalytics(id, 'next', tabState.query);
              break;

          case 'left':
              nextPage(id, "back");
              submitAnalytics(id, 'previous', tabState.query);
              break;

          case 'resizeToolbar':
              resizeToolbar(request.size);
              break;

       }
     }
  }
);
