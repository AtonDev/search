var data = require("sdk/self").data;
var ss = require("sdk/simple-storage");

var search = require('search');
var browser = require('browser');
var keyboard = require('keyboard');
var openSearch = require('openSearch');
var dataListener = require('dataListener');




//---------START - test-----------
//var test = require('./test');

//var browser = require('browser');

//console.log(window.gBrowser)

var windows = require("sdk/windows").browserWindows
windows.on('open', function(window) {
  console.log(window.url)
});
windows.on('activate', function(window) {
  console.log("A window was activated.");
});
for each (var window in windows) {
  console.log(window.title);
}
//-----------END - test-----------



function _main() {
  //stable
  search.getUID()
  ss.storage.tabs_data = {}
  keyboard.init()
  openSearch.init()
  dataListener.init()
  browser.startUrlListener()



  //test
  //sidebar.show()
  //var sb = sidebar.get()
  //search.getQueryData('einstein', tabs.activeTab, responseHandler)
  //sb.show()

}

_main();