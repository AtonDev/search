var Request = require("sdk/request").Request
var ss = require("sdk/simple-storage")
var tabs = require('sdk/tabs')
var window = require('sdk/window/utils').getMostRecentBrowserWindow()

const search_domain = "http://search.alts.io/"
const search_url = search_domain + "scomp?"
const token_url = search_domain + "new_token"

var timeout = 200


function getQueryData(query, callback) {
  query = query.trim()
  var req = Request({
    url: search_url,
    content: {'search': query},
    onComplete: function(response) {
      if (response.status == 200) {
        _data = JSON.parse(response.text)
        _data["index"] = 0
        _data["loadedIdx"] = 0
        ss.storage.tabs_data[tabs.activeTab.id] = _data
        tabs.activeTab.url = _data.urls[0]
        callback()
      } 
    }
  }).get();
}




function getUID() {
  var req = Request({
    url : token_url,
    onComplete: function (response) {
      if (response.status == 200) {
        ss.storage.uid = JSON.parse(response.text).token;
      } else {
        window.setTimeout(function() {
          getUID()
        }, timeout);
        timeout = timeout * 2;
      }
    }
  }).get();
}



exports.getQueryData = getQueryData
exports.getUID = getUID