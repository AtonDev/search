// sdk modules
var Request = require("sdk/request").Request;
var tabs = require("sdk/tabs");
var { Hotkey } = require("sdk/hotkeys");
var data = require("sdk/self").data;
var ss = require("sdk/simple-storage");

var ui = require("sdk/ui");
var { ActionButton } = require("sdk/ui/button/action");
var { Toolbar } = require("sdk/ui/toolbar");
var { Frame } = require("sdk/ui/frame");
var panels = require("sdk/panel");

var {Cc, Ci} = require("chrome");
var httpHandler = Cc["@mozilla.org/network/protocol;1?name=http"].
  getService(Ci.nsIHttpProtocolHandler);



// global variables
var tab_properties = {};
var timeout = 10;
// main


//hotkey

var nextHotKey = Hotkey({
  combo: "alt-Right",
  onPress: function() {
    next_page("nextHotkey");
  }
});
var previousHotKey = Hotkey({
  combo: "alt-Left",
  onPress: function() {
    previous_page("previousHotkey");
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
  height: 112,
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

function next_page(type) {
  var tab = tabs.activeTab;
  if (tab_properties.hasOwnProperty(tab.id)) {
    tab_properties[tab.id]["url_index"] += 1;
    var idx = tab_properties[tab.id].url_index;
    load_url(idx, tab);
  };
  //send_event("next");
  send_analytics_event("Loaded URL", {
    "Origin": "alt-s",
    "URL": tab_properties[tab.id]["urls"][idx+1],
    "Trigger": type
  });
};

function previous_page(type) {
  var tab = tabs.activeTab;
  if (tab_properties.hasOwnProperty(tab.id)) {
    tab_properties[tab.id]["url_index"] -= 1;
    var idx = tab_properties[tab.id].url_index;
    load_url(idx, tab)
  };
  //send_event("previous");
  send_analytics_event("Loaded URL", {
    "Origin": "alt-s",
    "URL": tab_properties[tab.id]["urls"][idx-1],
    "Trigger": type
  });
};



//analytics

/*function send_event(action_event) {
  var tab = tabs.activeTab;
  var params = {};
  params["query"] = tab_properties[tab.id]["query"]
  params["event"] = action_event;
  params["browser"] = "firefox";
  params["nonce"] = Math.floor(Math.random() * Math.pow(2,31));
  //post request to send event
  var req = Request({
    url: "http://analytics.alts.io/api/v1/is_event",
    //url: "http://localhost:3000/api/v1/is_event",
    content: params,
    onComplete: function(response) {
      console.log(response.text);
    }
  }).post();
}*/

function get_uid() {
  var req = Request({
    url : "http://0.0.0.0:3000/new_token",
    onComplete: function (response) {
      ss.storage.uid = JSON.parse(response.text).token;
    }
  }).get();
}


function send_analytics_event(alts_event, properties) {
  if (ss.storage.uid != null) {
    var context = {};
    context['userAgent'] = httpHandler.userAgent
    var params = {};
    params['userId'] = ss.storage.uid;
    params['event'] = alts_event;
    params['properties'] = properties;
    params['context'] = context;

    var req = Request({
      url: "https://api.segment.io/v1/track",
      headers: {
        "Authorization": "Basic NnhjamRlNGI1NA=="
      },
      // for production MmJpdWs5ZnA1eA==
      /*
      headers: {
        "Authorization": "Basic MmJpdWs5ZnA1eA=="
      },
      */
      content: params,
      onComplete: function(response) {
        console.log("analytics response: " + response.text);
      }
    }).post();
  } else {
    get_uid();
    window.setTimeout(function() {
      send_analytics_event(alts_event, properties);
    }, timeout);
    timeout = timeout * 2;
  };
};


//main logic

function update_query_box(message) {
  search_frame.postMessage({
      "type": "ac_value",
      "val": message
    }, search_frame.url);
};

function handleFrameEvent(message) {
  switch(message.data.type){
    case "search":
      var q = message.data.query;
      autocomplete_panel.hide();
      getUrls(q, message.source);
      message.source.postMessage({
        "type" : "btn-change-next",
        "query": q
      }, message.origin);
      break;
    case "next":
      next_page("nextBtn");
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
  var query = query_.trim();
  var url_ = "http://search.alts.io/s?search=" + query;
  //send_event("search");
  send_analytics_event("Searched", {
    "Search Query" : query
  });

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
    send_analytics_event("Loaded URL", {
      "Origin": "alt-s",
      "URL": tab_properties[tab.id]["urls"][idx],
      "Trigger": "search"
    });
  } else {
    alert_panel.show();
  };
  
};

function load_url(idx, tab) {
  tab.url = tab_properties[tab.id]["urls"][idx];
  tab.reload();
};

//prefetching (load in i frame)
/*tabs.on('ready', function(tab) {
  worker = tab.attach({
      contentScriptFile: data.url("prefetch.js")
    });
  var idx = tab_properties[tab.id]["url_index"];
  worker.port.emit("link", tab_properties[tab.id]["urls"][idx+1]);
});*/



function return_tab(tab_id) {
  for (tab_idx in tabs) {
    var tab = tabs[tab_idx]
    if (tab.id== tab_id) {
      return tab;
    }
  };
  return null;
};

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

function toolbar_showing(e) {
  send_analytics_event("Showed UI", {
    "Element": "navbar"
  });
}

function toolbar_hiding(e) {
  send_analytics_event("Hid UI", {
    "Element": "navbar"
  });
}


//Main----------------------------------------
function _main() {
  if (ss.storage.uid == null) {
    get_uid();
  };
  autocomplete_panel.port.on("select_value", update_query_box);
  autocomplete_panel.port.on("no_ac_results", function() {
    autocomplete_panel.hide();
  });
  tabs.on('open', onOpen);
  tabs.on('ready', onOpen);

  toolbar.on("show", toolbar_showing);
  toolbar.on("hide", toolbar_hiding);

  console.log("main is running");

};
_main();
//----------------------------------------------


