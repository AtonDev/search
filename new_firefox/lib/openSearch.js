var data = require('sdk/self').data
var window = require('sdk/window/utils').getMostRecentBrowserWindow()


const {Cc, Ci} = require("chrome")
var browserSearchService = Cc["@mozilla.org/browser/search-service;1"].getService(Ci.nsIBrowserSearchService);

var time = 10
function init() {
  //TODO check whether open search was already added
  browserSearchService.init()
  var type = Ci.nsISearchEngine.DATA_XML;
  if (!browserSearchService.getEngineByName('alt-s')) {
    browserSearchService.addEngine(data.url('openSearchPlugin.xml'), type,data.url('searchIcon1.png'), false)
    setCurrentEngine()
  }
}

function setCurrentEngine() {
  if (browserSearchService.getEngineByName('alt-s')) {
    browserSearchService.currentEngine = browserSearchService.getEngineByName('alt-s')
  } else {
    window.setTimeout(function() {setCurrentEngine()}, time)
    time *= 2
  }
}

exports.init = init