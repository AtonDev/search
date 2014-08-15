var ss = require('sdk/simple-storage');
var pageMod = require("sdk/page-mod");
var data = require("sdk/self").data;
var tabs = require('sdk/tabs')
var sidebar = require('sidebar');



function init() {
  pageMod.PageMod({
    include: "http://search.alts.io/scomp*",
    contentScriptFile: data.url("fetcher.js"),
    //contentScriptWhen: "start",
    onAttach: function(worker) {
      worker.port.on("data", function(_data) {
        _data["index"] = 0
        ss.storage.tabs_data[tabs.activeTab.id] = _data
        sidebar.show()
        tabs.activeTab.url = _data.urls[0]
      });
    }
  });
}

exports.init = init