var ss = require("sdk/simple-storage")
var data = require('sdk/self').data
var tabs = require('sdk/tabs')
var ui = require('sdk/ui')
var windowUtils = require('sdk/window/utils')

var mySidebar

function loadURL(info) {
  tabs.activeTab.url = info.url
  ss.storage.tabs_data[tabs.activeTab.id].index = info.idx
  ss.storage.tabs_data[tabs.activeTab.id].loadedIdx = info.idx
}


function init() {
  console.log("init called")
  if (mySidebar) { mySidebar.destroy() }  
  mySidebar = ui.Sidebar({
    id: 'sidebar',
    title: 'alt-S',
    url: data.url("sidebar/sidebar.html"),
    onReady: function(worker) {
      ss.storage.worker = worker
      //mySidebar.show()
      show()
      console.log('weird guy called')
    }
  });
  windowUtils.getMostRecentBrowserWindow().top.document.getElementById("sidebar-box").width=320;
  mySidebar.show()
}

function show() {
  if (!mySidebar) {
      init()
  }
  var tabId = tabs.activeTab.id
  if (ss.storage.tabs_data.hasOwnProperty(tabId)) {
    _data = ss.storage.tabs_data[tabId]
    mySidebar.show()
    worker = ss.storage.worker
    worker.port.emit('update_content', _data)
    worker.port.on('load_url', function(info) { loadURL(info) })
  } else {
    mySidebar.hide()
  }
}

function next() {
  var tab = tabs.activeTab
  if (ss.storage.tabs_data[tab.id]["index"] < ss.storage.tabs_data[tab.id].urls.length-1) {
    ss.storage.tabs_data[tab.id]["index"] += 1
    ss.storage.worker.port.emit('select_box', ss.storage.tabs_data[tab.id]["index"])
  }
}

function previous() {
  var tab = tabs.activeTab
  if (ss.storage.tabs_data[tab.id]["index"] > 0) {
    ss.storage.tabs_data[tab.id]["index"] -= 1
    ss.storage.worker.port.emit('select_box', ss.storage.tabs_data[tab.id]["index"])
  }
}

function loadSelected() {
  ss.storage.worker.port.emit('get_selected', '')
}



tabs.on('open', onOpen);
tabs.on('ready', onOpen);

function onOpen(tab) {
  tab.on("activate", tabActivate);
  tab.on("close", tabClose);
}

function tabClose(tab) {
  if (ss.storage.tabs_data.hasOwnProperty(tab.id)) {
    delete ss.storage.tabs_data[tab.id];
  };
}

function tabActivate(tab) {
  if (ss.storage.tabs_data.hasOwnProperty(tab.id)) {
    show(ss.storage.tabs_data[tab.id])
  } else {
    mySidebar.hide()
  };
}

exports.show = show
exports.next = next
exports.previous = previous
exports.loadSelected = loadSelected























/*
var workers = [];

function detachWorker(worker, workerArray) {
  var index = workerArray.indexOf(worker);
  if(index != -1) {
    workerArray.splice(index, 1);
  }
}

function init() {
  console.log('initSidebar')
  mySidebar = ui.Sidebar({
    id: 'sidebar',
    title: 'alt-S',
    url: data.url("sidebar/sidebar.html"),
    onAttach: function(worker) {
      workers.push(worker);
      worker.on('detach', function () {
        detachWorker(this, workers);
      });
    }
  });
}

exports.init = init
*/