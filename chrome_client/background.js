var tabStates = {};

function resizeToolbar(size) {
  chrome.tabs.sendMessage(id, {action: "resizeToolbar", size: size});
}

function movePage(id, dir) {
  var tabState = tabStates[id];
  var idx = tabState.idx;
  var newIndex;
  var urls = tabState.urls;
  if (dir == "back") {
     newIndex = (idx > 0) ? idx-1 : 0;
  }else newIndex = idx + 1;
  tabStates[id].idx = newIndex;
  chrome.tabs.update(id, {url: urls[newIndex]}); 
  console.log('title: ' + tabStates[id].titles[newIndex]);
  console.log('abstract: ' + tabStates[id].abstracts[newIndex]);
  console.log('dispurl: ' + tabStates[id].dispurl[newIndex]);
}

function loadUrl(id, url) {
  console.log("load url with : " + url);
  tabStates[id].curUrl = url;
  chrome.tabs.update(id, {url: url});
}


function submitToServer(tabId, query) {
  var url = "http://instantsearch.herokuapp.com/scomp?search=" + query;
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      if (xhr.status == 200) {
        var urls = JSON.parse(xhr.responseText).urls;
        tabStates[tabId].urls = urls; 
        tabStates[tabId].idx = 0;   
        chrome.tabs.update(tabId, {active: true, url: urls[0]}); 
        var titles = JSON.parse(xhr.responseText).titles;
        var abstracts = JSON.parse(xhr.responseText).abstracts;
        var dispurls = JSON.parse(xhr.responseText).dispurls;
        tabStates[tabId].titles = titles;
        tabStates[tabId].abstracts = abstracts;
        tabStates[tabId].dispurls = dispurls;
        console.log('title: ' + titles[0]);
        console.log('abstract: ' + abstracts[0]);
        console.log('dispurl: ' + dispurls[0]);


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
  console.log('submitting analytics with params = ' + params);
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
      searchHelper(id, query); //inside callback so we know the id before calling searchHelper()
    });
  }else 
    searchHelper(id, query);
}

function searchHelper(id, query) {
  tabStates[id].query = query;
  submitToServer(id, query);   
  submitAnalytics(id, 'search', query);
}

function initializeTab(id) {
  var tabState = {};
  tabState.state = 'on';
  tabState.query = '';
  tabState.uiType = 'sidebar';
  tabStates[id] = tabState;
}

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
        tabStates[id].popup = wndw; //popup hasnt been loaded already so store window object
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

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (tabId in tabStates && changeInfo.status == 'loading' && tabStates[id].query != '') {
    var injectDetails = new Object();
    var tabState = tabStates[tabId];
    injectDetails.runAt = "document_start";

    injectDetails.file = 'headroom.js';
    chrome.tabs.executeScript(tabId, injectDetails);

    injectDetails.file = 'jquery-1.11.1.min.js';
    chrome.tabs.executeScript(tabId, injectDetails);

    if (tabState.uiType == "sidebar") {
      injectDetails.file = 'content_script_sb.js';
    } else injectDetails.file = 'content_script_nb.js';
    chrome.tabs.executeScript(tabId, injectDetails);
  }
});

chrome.tabs.onReplaced.addListener (function (newTabId, oldTabId) {
  console.log("ONREPLACED");
  if (oldTabId in tabStates) {
    console.log ("swapping tabStates");
    tabStates[newTabId] = tabStates[oldTabId];
    delete tabStates[oldTabId];
  }
});

chrome.commands.onCommand.addListener(function(command) {
  chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
    if (command == "nextPage") {
      var id = tabs[0].id;
      movePage(id, "forward"); 
      submitAnalytics(id, 'next', tabStates[id].query);
    }else if (command == "prevPage") {
      var id = tabs[0].id;
      movePage(id, "back"); 
      submitAnalytics(id, 'previous', tabStates[id].query);
    }
  });
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    var tab = sender.tab;
    var id;
    if (tab) 
      id = sender.tab.id;
    if (id in tabStates) {
      var tabState = tabStates[id];
      switch (request.action) {
          case 'search':
              //console.log ('query: ' + query);
              executeSearch(id, request.query);        
              break;

           case 'linkClicked':
              tabState.xPos = request.xPos;
              tabState.yPos = request.yPos;
           //   if (tabState.visitedSections) {
                 // tabState.visitedSections.insert(request.id);
            //  }else {
            //    tabState.visitedSections = [id];
            //  }
              console.log('in background.js xPos, yPos = ' + tabState.xPos + ', ' + tabState.yPos);
              loadUrl(id, request.url);
              
              break;

          case 'next':
              //console.log("next, query: " + query);
              movePage(id, "forward"); 
              submitAnalytics(id, 'next', tabState.query);
              break;

          case 'loaded': //TODO add timeout if newtab's onCreated hasn't fired yet so tabState can be created first
              sendResponse({query: tabState.query, urls: tabState.urls, abstracts: tabState.abstracts,
                           titles: tabState.titles, dispurls: tabState.dispurls, curUrl: tabState.curUrl,
                           xPos: tabState.xPos, yPos: tabState.yPos, visitedSections: tabState.visitedSections});
              break;

          case 'removeToolbar':
              chrome.tabs.sendMessage(id, {action: "removeToolbar"});
              submitAnalytics(id, 'remove', tabState.query);
              delete tabStates[id];
              break;

          case 'getNext':            
              var next = "urls" in tabState ? tabState.urls[tabState.idx + 1] : "none";
              sendResponse({next: next});
          //    console.log('in getTabState tab id = ' + id);
              break;

          case 'right':
              movePage(id, "forward");
              submitAnalytics(id, 'next', tabState.query);
              break;

          case 'left':
              movePage(id, "back");
              submitAnalytics(id, 'previous', tabState.query);
              break;

          case 'resizeToolbar':
              resizeToolbar(request.size);
              break;

          case 'uiTypeChange':
              if (tabStates[id].uiType == 'sidebar')
                tabStates[id].uiType = 'navbar';
              else tabStates[id].uiType = 'sidebar';
              chrome.tabs.reload(id);
              break;

       }
     }
  }
);
