var ui = require('sdk/ui')
var data = require('sdk/self').data
var mySidebar

function initSidebar() {
  mySidebar = ui.Sidebar({
    id: 'didebar',
    title: 'alt-S',
    url: data.url("sidebar.html"),
    onReady: function(worker) {
      //worker.port.on('load_data', loadData(worker))
    }
  });
}

function get() {
  if (!mySidebar) {
    initSidebar()
  }
  return mySidebar
}


function show(data) {
  //TODO show sidebar with the passed data
}


exports.show = show
exports.get = get