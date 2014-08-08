var tabStates = {};
var segToken;
var getTokenTimeout = 10;

chrome.storage.sync.get('segToken', function(items) {
    segToken = items['segToken'];
    console.log('from storage token = ' + segToken);
    if (!segToken) {
        get_uid();
    }
});

function get_uid() {
  console.log('getting new token');
  //var url = "https://search.alts.io/new_token"
  var url = "http://search.alts.io/new_token"
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      if (xhr.status == 200) {
        segToken = JSON.parse(xhr.responseText).token;
        send_analytics_event('Token Created', {});
        console.log('new token received, token: ' + segToken);
        store_token(segToken);
      }else console.log("no 200 status");
    }else console.log("readyState not 4 instead: " + xhr.readyState);      
  }
  xhr.send();
}

function store_token(token) {
  chrome.storage.sync.set({'segToken': token}, function() {
            // Notify that we saved.
    console.log('Settings saved segToken now: ' + token);
  });
}

function send_analytics_event(alts_event, properties) {
  if (!segToken) {
    get_uid();
    window.setTimeout(function() {
      send_analytics_event(alts_event, properties);
    }, getTokenTimeout);
    getTokenTimeout = getTokenTimeout * 2;
    return;
  }
  console.log('sending analytics event for: ' + alts_event + "with properties: " + properties.Origin);
  var url = "https://api.segment.io/v1/track"
    var xhr = new XMLHttpRequest();
    var context = {};
    context['userAgent'] = navigator.userAgent;

    var params = {};
    console.log('inside xhr request, userId: ' + segToken);
    params['userId'] = segToken;
    params['event'] = alts_event;
    params['properties'] = properties;
    params['context'] = context;
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Authorization', 'Basic MmJpdWs5ZnA1eA==');//     NnhjamRlNGI1NA==
    xhr.setRequestHeader('Content-Type', 'application/json');
    var paramsJson = JSON.stringify(params);
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        if (xhr.status == 200) {
          console.log('analytics event sent');
        }else console.log("no 200 status");
      }else console.log("readyState not 4 instead: " + xhr.readyState);      
    }
  xhr.send(paramsJson);
}

function resizeToolbar(size) {
  chrome.tabs.sendMessage(id, {action: "resizeToolbar", size: size});
}

function movePage(id, dir, type) {
  var tabState = tabStates[id];
  var idx = tabState.idx;
  var newIndex;
  var urls = tabState.urls;
  if (dir == "previous") {
     newIndex = (idx > 0) ? idx-1 : 0;
  }else newIndex = idx + 1;
  var url = urls[newIndex];
  tabStates[id].idx = newIndex;
  chrome.tabs.update(id, {url: url}); 
  send_analytics_event('Loaded URL', {'URL': url, 'Trigger': type});
  console.log('title: ' + tabStates[id].titles[newIndex]);
  console.log('abstract: ' + tabStates[id].abstracts[newIndex]);
  console.log('dispurl: ' + tabStates[id].dispurl[newIndex]);
}

function loadUrl(id, url) {
  console.log("load url with : " + url);
  tabStates[id].curUrl = url;
  chrome.tabs.update(id, {url: url});
  send_analytics_event('Loaded URL', {'URL': url, 'Trigger': 'link'})
}


function submitToServer(tabId, query, origin) {
  var url = "http://instantsearch.herokuapp.com/scomp?search=" + query;
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      if (xhr.status == 200) {
        var urls = JSON.parse(xhr.responseText).urls;
        var firstURL = urls[0];
        tabStates[tabId].urls = urls; 
        tabStates[tabId].idx = 0;   
        tabStates[id].curUrl = firstURL;
        chrome.tabs.update(tabId, {active: true, url: firstURL}); 
        var titles = JSON.parse(xhr.responseText).titles;
        var abstracts = JSON.parse(xhr.responseText).abstracts;
        var dispurls = JSON.parse(xhr.responseText).dispurls;
        tabStates[tabId].titles = titles;
        tabStates[tabId].abstracts = abstracts;
        tabStates[tabId].dispurls = dispurls;
        tabStates[tabId].xPos = 0;
        tabStates[tabId].yPos = 0;
        
      }else console.log("no 200 status");
    }else console.log("readyState not 4 instead: " + xhr.readyState);      
  }
  xhr.send();
  send_analytics_event('Searched', {'Search Query': query, 'Origin': origin});
}

/*
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
*/

function executeSearch(id, query) {
  console.log ("executeSearch query: " + query);
  if (id == '-1') { //search from browser action
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
      id = tabs[0].id;
      initializeTab(id); 
      searchHelper(id, query, 'popup'); //inside callback so we know the id before calling searchHelper()
    });
  }else 
    searchHelper(id, query, tabStates[id].uiType);
}

function searchHelper(id, query, origin) {
  tabStates[id].query = query;
  tabStates[id].toggleOn = true;
  submitToServer(id, query, origin);   
  //submitAnalytics(id, 'search', query);
}

function initializeTab(id) {
  var tabState = {};
  tabState.state = 'on';
  tabState.query = '';
  tabState.uiType = 'sidebar';
  tabState.popupOpen = false;
  tabState.toggleOn = true;
  tabStates[id] = tabState;
}

function togglePopup(wndw) {
   chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
      id = tabs[0].id;
      if (id in tabStates) {
        var tabState = tabStates[id];
        if (tabState.popupOpen) { //popup is currently open
          console.log('popup in tabState hasnt been closed, closing now');
          wndw.close();
          tabStates[id].popupOpen = false;
         // send_analytics_event('Hid UI', {'Element': 'popup search'});
        } else {
          console.log('popup was previous closed. reopening');
          initializePopup(wndw);
        }
      }else {
        console.log('tab not in tabstates. initializing tab and setting popup variable');
        initializeTab(id);
        initializePopup(wndw);
      }
    });
}

function initializePopup(wndw) {
  tabStates[id].popupOpen = true; //popup hasnt been loaded already so store window object
  //send_analytics_event('Showed UI', {'Element': 'popup search'});
  wndw.onunload = function() {
    window.setTimeout(function() {
      tabStates[id].popupOpen = false;
      console.log('query: ' + tabStates[id].query);
    }, 1000);
  };
}

/*
 * Event Listeners
 */

//chrome.omnibox.onInputStarted.addListener(function () {
//});

//var suggestion = new Object();
//suggestion.description = "test test test";
//chrome.omnibox.setDefaultSuggestion(suggestion);

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  console.log('inside onUpdated ' + changeInfo.status);
  if (tabId in tabStates && changeInfo.status == 'loading')
    if (tabStates[tabId].injecting != true && tabStates[tabId].query != '') {
     // tabStates[tabId].injecting = true;
      var injectDetails = new Object();
      var tabState = tabStates[tabId];
      injectDetails.runAt = "document_start";

      injectDetails.file = 'headroom.js';
      chrome.tabs.executeScript(tabId, injectDetails);

      injectDetails.file = 'jquery-1.11.1.min.js';
      chrome.tabs.executeScript(tabId, injectDetails);

      var injectCode = {runAt: "document_start"};
      if (tabState.toggleOn)
        injectCode.code = "var toggleOn = true";      
      else 
        injectCode.code = "var toggleOn = false";
      chrome.tabs.executeScript(tabId, injectCode);

      if (tabState.uiType == "sidebar") {
        injectDetails.file = 'content_script_sb.js';
      } else injectDetails.file = 'content_script_nb.js';
      console.log("INJECTING CONTENT SCRIPT");
      chrome.tabs.executeScript(tabId, injectDetails);
      window.setTimeout(function() {
        injecting = false;
       }, 10);
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
      movePage(id, "next", 'nextHotKey'); 
      //submitAnalytics(id, 'next', tabStates[id].query);
    }else if (command == "prevPage") {
      var id = tabs[0].id;
      movePage(id, "previous", 'previousHotkey'); 
      //submitAnalytics(id, 'previous', tabStates[id].query);
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
              movePage(id, "next", 'nextBtn'); 
             // submitAnalytics(id, 'next', tabState.query);
              break;

          case 'loaded': //TODO add timeout if newtab's onCreated hasn't fired yet so tabState can be created first
              sendResponse({toggleOn: tabState.toggleOn, query: tabState.query, urls: tabState.urls, abstracts: tabState.abstracts,
                           titles: tabState.titles, dispurls: tabState.dispurls, curUrl: tabState.curUrl,
                           xPos: tabState.xPos, yPos: tabState.yPos, visitedSections: tabState.visitedSections});
              //send_analytics_event('Showed UI', {'Element': tabState.uiType});
              break;

          case 'removeToolbar':
              chrome.tabs.sendMessage(id, {action: "removeToolbar"});
              send_analytics_event('Hid UI', {'Element': tabState.uiType});
           //   submitAnalytics(id, 'remove', tabState.query);
              delete tabStates[id];
              break;

          case 'getNext':            
              var next = "urls" in tabState ? tabState.urls[tabState.idx + 1] : "none";
              sendResponse({next: next});
          //    console.log('in getTabState tab id = ' + id);
              break;

          case 'right':
              movePage(id, "next", 'nextBtn');
             // submitAnalytics(id, 'next', tabState.query);
              break;

          case 'left':
              movePage(id, "previous", 'previousBtn');//Should not happen
              //submitAnalytics(id, 'previous', tabState.query);
              break;

          case 'resizeToolbar':
              resizeToolbar(request.size);
              break;

          case 'uiTypeChange':
              if (tabStates[id].uiType == 'sidebar')
                tabStates[id].uiType = 'navbar';
              else tabStates[id].uiType = 'sidebar';
              chrome.tabs.reload(id);
              //send_analytics_event('Showed UI', {'Element': tabState.uiType});
              break;

          case 'sbToggle':
              chrome.tabs.sendMessage(id, {action: "toggleSidebar"});
              console.log("BACKGROUDN INSIDE TOGGLE TOOLBAR");
              tabStates[id].toggleOn = !(tabStates[id].toggleOn)
              break;

          case 'getToggle':
              sendResponse({toggleOn: tabState.toggleOn});


       }
     }
  }
);
