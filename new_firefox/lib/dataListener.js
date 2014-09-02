var ss = require('sdk/simple-storage');
var pageMod = require("sdk/page-mod");
var data = require("sdk/self").data;
var tabs = require('sdk/tabs')
var sidebar = require('sidebar')
var search = require('search')
var analytics = require('analytics')



function init() {
  pageMod.PageMod({
    include: "http://search.alts.io/shcomp*",
    contentScriptFile: data.url("fetcher.js"),
    //contentScriptWhen: "start",
    onAttach: function(worker) {
      worker.port.on("data", function(_data) {
        _data["index"] = 0
        _data["loadedIdx"] = 0
        ss.storage.tabs_data[tabs.activeTab.id] = _data
        sidebar.show()
        tabs.activeTab.url = _data.urls[0]
        analytics.sendEvent('Searched', {'Search Query': '', 'Origin': 'urlbar'})
      })
    }
  })

  pageMod.PageMod({
    include: "http://alts.io/search",
    contentScriptFile: data.url("searchFromSite.js"),
    //contentScriptWhen: "start",
    onAttach: function(worker) {
      worker.port.on("search", function(query) {
        search.getQueryData(query, function() { sidebar.show() })
        console.log('searched')
      })
    }
  })

  
}

exports.init = init