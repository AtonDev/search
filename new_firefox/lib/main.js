var data = require("sdk/self").data
var tabs = require("sdk/tabs");

var search = require('./search');
var sidebar = require('./sidebar');

var test = require('./test');


var tab_properties = {};

//---------START - test-----------

const {Cc, Ci} = require("chrome")
var browserSearchService = Cc["@mozilla.org/browser/search-service;1"].
  getService(Ci.nsIBrowserSearchService);
browserSearchService.init()
var type = Ci.nsISearchEngine.DATA_XML;
browserSearchService.addEngine(data.url('openSearchPlugin.xml'), type,
 data.url('searchIcon1.png'), true, callback)
function callback() {
  console.log('engine added')
}

//console.log(browserSearchService.currentEngine)
//-----------END - test-----------



function loadData(worker) {
  worker.port.emit('data', tab_properties[tabs.activeTab.id])
}


function responseHandler(response, activeTab, query) {
  tab_properties[tabs.activeTab.id] = response.json;
  if (response.status == 200) {
    //sidebar.show();
  } else {
    //TODO handle failure case
  }

};

function _main() {
  //stable
  search.getUID()


  //test
  //var sb = sidebar.get()
  //search.getQueryData('einstein', tabs.activeTab, responseHandler)
  //sb.show()

}

_main();