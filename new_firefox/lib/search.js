var Request = require("sdk/request").Request
var ss = require("sdk/simple-storage")

const search_domain = "http://0.0.0.0:3000/"//"http://search.alts.io/"
const search_url = search_domain + "scomp?"
const token_url = search_domain + "new_token"

var timeout = 200


function getQueryData(query, source, responseHandler) {
  query = query.trim()
  var req = Request({
    url: search_url,
    content: {'search': query},
    onComplete: function(response) {
      responseHandler(response, source, query);
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