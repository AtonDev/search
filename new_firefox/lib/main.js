var data = require("sdk/self").data;
var ss = require("sdk/simple-storage");

var search = require('search');
var keyboard = require('keyboard');
var openSearch = require('openSearch');
var dataListener = require('dataListener');




//---------START - test-----------
//var test = require('./test');

//var browser = require('browser');

//console.log(window.gBrowser)


//-----------END - test-----------



function _main() {
  //stable
  search.getUID()
  ss.storage.tabs_data = {}
  keyboard.init()
  openSearch.init()
  dataListener.init()



  //test
  //sidebar.show()
  //var sb = sidebar.get()
  //search.getQueryData('einstein', tabs.activeTab, responseHandler)
  //sb.show()

}

_main();