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
  tab_indexes[activeTab()] += 1;
  load_url(tab_urls[activeTab()][tab_indexes[activeTab()]], activeTab());
};

function previous_page() {
  tab_indexes[activeTab()] -= 1;
  load_url(tab_urls[activeTab()][tab_indexes[activeTab()]], activeTab());
};

//launch button
var launch = ui.ActionButton({
  id: "launch",
  label: "launch",
  icon: "./icons/forward-20.png",
  onClick: launch_toolbar
});

function launch_toolbar() {
  console.log('Launch toolbar clicked');
};

//main logic




function getUrls(query, source) {
  query = query.split(' ').join('+');
  var url_ = "http://instantsearch.herokuapp.com/s?search=" + query;
  //var url_ = "http://localhost:3000/s?search=" + query;

  var req = Request({
    url: url_,
    content: query,
    onComplete: function(response) {
      handleResponse(response, activeTab())
    }
  }).get();

  //console.log("message source id: " + source.ownerID);
};

function handleResponse(response, source) {
  var urls = JSON.parse(response.text).urls;
  console.log("urls ----------------- : " + urls.length);
  tab_urls[source] = urls;
  tab_indexes[source] = 0;
  //console.log("id of active tab is " + source);
  load_url(tab_urls[source][0], source);
};

function load_url(url, tabid) {
  var tab = tabs[tabid];
  tab.url = url;
  tab.reload();
}

function activeTab() {
  return tabs.activeTab.id.split("-")[2] - 1;
}






