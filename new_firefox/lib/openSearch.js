var data = require('sdk/self').data
const {Cc, Ci} = require("chrome")
var browserSearchService = Cc["@mozilla.org/browser/search-service;1"].getService(Ci.nsIBrowserSearchService);

function init() {
  //TODO check whether open search was already added
  browserSearchService.init()
  var type = Ci.nsISearchEngine.DATA_XML;
  console.log(browserSearchService.getEngines())
  if (!browserSearchService.getEngineByName('alt-s')) {
    browserSearchService.addEngine(data.url('openSearchPlugin.xml'), type,data.url('searchIcon1.png'), true)
  }
}

exports.init = init