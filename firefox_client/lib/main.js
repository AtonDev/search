// sdk modules
var Request = require("sdk/request").Request;
var tabs = require("sdk/tabs");
var { Hotkey } = require("sdk/hotkeys");
var data = require("sdk/self").data;
//var formData = require("sdk/FormData");

var ui = require("sdk/ui");
var { ActionButton } = require("sdk/ui/button/action");
var { Toolbar } = require("sdk/ui/toolbar");
var { Frame } = require("sdk/ui/frame");
var panels = require("sdk/panel");
// global variables
var tab_properties = {};

// main

//hotkey

var nextHotKey = Hotkey({
  combo: "alt-Right",
  onPress: function() {
    next_page();
  }
});
var previousHotKey = Hotkey({
  combo: "alt-Left",
  onPress: function() {
    previous_page();
  }
});
var altsKey = Hotkey({
  combo: "alt-s",
  onPress: function() {
    search_frame.postMessage({
      "type": "focus"
    }, search_frame.url);
  }
});

var alert_panel = new panels.Panel({
  position : {
    top:0
  },
  width: 400,
  height: 40,
  contentURL: data.url("alert.html" ),
  focus: false
});

var autocomplete_panel = new panels.Panel({
  position : {
    top:0
  },
  width: 400,
  height: 120,
  contentScriptFile: data.url('autocomplete.js'),
  contentURL: data.url("./autocomplete_box.html" ),
  focus: false
});

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
    var idx = tab_properties[tab.id].url_index;
    load_url(idx, tab);
  };
  send_event("next");
};

function previous_page() {
  var tab = tabs.activeTab;
  if (tab_properties.hasOwnProperty(tab.id)) {
    tab_properties[tab.id]["url_index"] -= 1;
    var idx = tab_properties[tab.id].url_index;
    load_url(idx, tab)
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

autocomplete_panel.port.on("select_value", update_query_box);
autocomplete_panel.port.on("no_ac_results", function() {
  autocomplete_panel.hide();
});

function update_query_box(message) {
  search_frame.postMessage({
      "type": "ac_value",
      "val": message
    }, search_frame.url);
};

function handleFrameEvent(message) {
  switch(message.data.type){
    case "search":
      autocomplete_panel.hide();
      getUrls(message.data.query, message.source);
      message.source.postMessage({
        "type" : "btn-change-next",
        "query": message.data.query
      }, message.origin);
      break;
    case "next":
      next_page();
      break;
    case "autocomplete":
      var q = message.data.query;
      if (q != "") {
        autocomplete_panel.width = parseInt(message.data.pwidth);
        autocomplete_panel.position.left = parseInt(message.data.pleft);
        autocomplete_panel.show();
      } else {
        autocomplete_panel.hide();
      };
      autocomplete_panel.port.emit('ac', q);
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
  if (urls.length > 0) {
    load_url(0, tab);
  } else {
    alert_panel.show();
  };
  send_event("search");
};

function load_url(idx, tab) {
  tab.url = tab_properties[tab.id]["urls"][idx];
  tab.reload();
};

tabs.on('ready', function(tab) {
  worker = tab.attach({
      contentScriptFile: data.url("prefetch.js")
    });
  var idx = tab_properties[tab.id].url_index;
  worker.port.emit("link", tab_properties[tab.id]["urls"][idx+1]);
});


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
tabs.on('ready', onOpen);

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








