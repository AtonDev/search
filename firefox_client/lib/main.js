// sdk modules
var Request = require("sdk/request").Request;
var tabs = require("sdk/tabs");
var { Hotkey } = require("sdk/hotkeys");



//var formData = require("sdk/FormData");

var ui = require("sdk/ui");
var { ActionButton } = require("sdk/ui/button/action");
var { Toolbar } = require("sdk/ui/toolbar");
var { Frame } = require("sdk/ui/frame");


// global variables
var tab_properties = {};

// main

//hotkey

var nextHotKey = Hotkey({
  combo: "shift-Right",
  onPress: function() {
    next_page();
  }
});
var previousHotKey = Hotkey({
  combo: "shift-Left",
  onPress: function() {
    previous_page();
  }
});

//tool bar
/*var previous = ui.ActionButton({
  id: "previous",
  label: "previous",
  icon: "./icons/back-20.png",
  onClick: previous_page
});

var next = ui.ActionButton({
  id: "next",
  label: "next",
  icon: "./icons/forward-20.png",
  onClick: next_page
});*/


var search_frame = new ui.Frame({
  url: "./search_frame.html",
  onMessage: (e) => {
    handleFrameEvent(e);
  }
});

var toolbar = ui.Toolbar({
  title: "Alt-S",
  items: [search_frame]
});

function next_page() {
  var tab = tabs.activeTab;
  if (tab_properties.hasOwnProperty(tab.id)) {
    tab_properties[tab.id]["url_index"] += 1;
    load_url(tab_properties[tab.id]["urls"][tab_properties[tab.id].url_index], tab)
  };
  send_event("next");
};

function previous_page() {
  var tab = tabs.activeTab;
  if (tab_properties.hasOwnProperty(tab.id)) {
    tab_properties[tab.id]["url_index"] -= 1;
    load_url(tab_properties[tab.id]["urls"][tab_properties[tab.id].url_index], tab)
  };
  send_event("previous");
};

//launch button
/*var launch = ui.ActionButton({
  id: "launch",
  label: "launch",
  icon: "./icons/search-128.png",
  onClick: launch_toolbar
});

function launch_toolbar() {
  if (toolbar.hidden) {
    toolbar.hidden = false;
  } else {
    toolbar.hidden = true;
  };
};*/


//analytics

function send_event(action_event) {
  var tab = tabs.activeTab;
  var params = {};
  params["query"] = tab_properties[tab.id]["query"]
  params["event"] = action_event;
  params["browser"] = "firefox";
  params["nonce"] = Math.floor(Math.random() * Math.pow(2,31));
  //post request to send event
  var req = Request({
    url: "http://custom-analytics.herokuapp.com/api/v1/is_event",
    //url: "http://localhost:3000/api/v1/is_event",
    content: params,
    onComplete: function(response) {
      console.log(response.text);
    }
  }).post();
}


//main logic

function handleFrameEvent(message) {
  switch(message.data.type){
    case "search":
      getUrls(message.data.query, message.source);
      message.source.postMessage({
        "type" : "btn-change-next",
        "query": message.data.query
      }, message.origin);
      break;
    case "next":
      next_page();
      break;
  };
};


function getUrls(query_, source) {
  var query = query_.trim().split(' ').join('+');
  var url_ = "http://instantsearch.herokuapp.com/s?search=" + query;

  var req = Request({
    url: url_,
    content: query,
    onComplete: function(response) {
      console.log(response.text);
      handleResponse(response, tabs.activeTab, query);
    }
  }).get();
};

function handleResponse(response, tab, query) {
  var urls = JSON.parse(response.text).urls;
  tab_properties[tab.id] = {};
  tab_properties[tab.id]["query"] = query;
  tab_properties[tab.id]["urls"] = urls;
  tab_properties[tab.id]["url_index"] = 0;
  
  load_url(tab_properties[tab.id]["urls"][0], tab);

  send_event("search");
};

function load_url(url, tab) {
  tab.url = url;
  tab.reload();
};

function return_tab(tab_id) {
  for (tab_idx in tabs) {
    var tab = tabs[tab_idx]
    if (tab.id== tab_id) {
      return tab;
    }
  };
  return null;
};



tabs.on('open', onOpen);

function onOpen(tab) {
  tab.on("activate", tabActivate);
  tab.on("close", tabClose);
}

function tabClose(tab) {
  if (tab_properties.hasOwnProperty(tab.id)) {
    delete tab_properties[tab.id];
  };
}

function tabActivate(tab) {
  if (tab_properties.hasOwnProperty(tab.id)) {
    search_frame.postMessage({
      "type": "btn-change-next",
      "query": tab_properties[tab.id]["query"]
    }, search_frame.url);
  } else {
    search_frame.postMessage({
      "type": "btn-change-search"
    }, search_frame.url);
  };
}








