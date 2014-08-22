var data = require('sdk/self').data
var window = require('sdk/window/utils').getMostRecentBrowserWindow()
var { ActionButton } = require("sdk/ui/button/action");


const {Cc, Ci} = require("chrome")
var browserSearchService = Cc["@mozilla.org/browser/search-service;1"].getService(Ci.nsIBrowserSearchService);

var time = 10

function init() {
  //TODO check whether open search was already added
  browserSearchService.init()
  var type = Ci.nsISearchEngine.DATA_XML;
  if (!browserSearchService.getEngineByName('alt-s')) {
    browserSearchService.addEngine(data.url('openSearchPlugin.xml'), type,data.url('engineIcon.ico'), false)
    setCurrentEngine()
  } else if (browserSearchService.currentEngine.name != 'alt-s') {
    setCurrentEngineButton()
  }
}

function setCurrentEngine() {
  if (browserSearchService.getEngineByName('alt-s')) {
    browserSearchService.currentEngine = browserSearchService.getEngineByName('alt-s')
  } else if (time < 3200){
    window.setTimeout(function() {setCurrentEngine()}, time)
    time *= 2
  }
}

function setCurrentEngineButton() {
  if (!browserSearchService.getEngineByName('alt-s')) {
    init()
  }
  var button = ActionButton({
    id: "my-button",
    label: "my button",
    icon: data.url("engineIcon5.jpg"),
    onClick: function(state) {
      button.destroy()
      setCurrentEngine()
    }
  });
}

exports.init = init