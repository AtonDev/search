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

var tab_urls = {};
var tab_indexes = {};
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
var previous = ui.ActionButton({
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
});


var search_frame = ui.Frame({
  url: "./search_frame.html",
  onMessage: (e) => {
    getUrls(e.data, e.source);
  }
});

var toolbar = ui.Toolbar({
  title: "Instant Search",
  items: [previous, next, search_frame]
});

function next_page() {
  //tab_indexes[activeTab()] += 1;
  //load_url(tab_urls[activeTab()][tab_indexes[activeTab()]], activeTab());

  //new
  var tab = activeTab();
  if (tab_properties.hasOwnProperty(tab)) {
    tab_properties[tab]["url_index"] += 1;
    load_url(tab_properties[tab]["urls"][tab_properties[tab].url_index], tab)
  };
  send_event("next");
};

function previous_page() {
  //tab_indexes[activeTab()] -= 1;
  //load_url(tab_urls[activeTab()][tab_indexes[activeTab()]], activeTab());

  //new
  var tab = activeTab();
  if (tab_properties.hasOwnProperty(tab)) {
    tab_properties[tab].url_index -= 1;
    load_url(tab_properties[tab]["urls"][tab_properties[tab].url_index], tab)
  };
  send_event("previous");
};

//launch button
/*var launch = ui.ActionButton({
  id: "launch",
  label: "launch",
  icon: "./icons/forward-20.png",
  onClick: launch_toolbar
});

function launch_toolbar() {
  console.log('Launch toolbar clicked');
};*/


//analytics

function request_token() {

}

function send_event(action_event) {
  tab = activeTab();
  params = {};
  params["user_token"] = "5cQiaC-Tv5qR8tgd_EScvQ";
  params["query"] = tab_properties["query"]
  params["event"] = action_event;
  params["browser"] = "firefox";
  params["nonce"] = Math.floor(Math.random() * Math.pow(2,31));

  //post request to send event
  var req = Request({
    url: "http://localhost:3000/api/v1/is_event",
    content: params,
    onComplete: function(response) {
      console.log(response.text);
    }
  }).post();
}


//main logic




function getUrls(query, source) {
  query = query.split(' ').join('+');
  var url_ = "http://instantsearch.herokuapp.com/s?search=" + query;
  //var url_ = "http://localhost:3000/s?search=" + query;

  var req = Request({
    url: url_,
    content: query,
    onComplete: function(response) {
      handleResponse(response, activeTab(), query)
    }
  }).get();
  //console.log("message source id: " + source.ownerID);
};

function handleResponse(response, source, query) {
  var urls = JSON.parse(response.text).urls;
  //console.log("urls ----------------- : " + urls.length);

  //tab_urls[source] = urls;
  //tab_indexes[source] = 0;
  //load_url(tab_urls[source][0], source);
  //new
  tab_properties[source] = {};
  tab_properties["query"] = query;
  tab_properties[source]["urls"] = urls;
  tab_properties[source]["url_index"] = 0;
  //console.log(tab_properties[source]["urls"])
  //console.log("id of active tab is " + source);
  load_url(tab_properties[source]["urls"][0], source);

  send_event("search");
};

function load_url(url, tabid) {
  var tab = tabs[tabid];
  tab.url = url;
  tab.reload();
}

function activeTab() {
  return tabs.activeTab.id.split("-")[2] - 1;
}






