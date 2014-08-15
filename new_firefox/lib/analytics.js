var Request = require("sdk/request").Request;
var {Cc, Ci} = require("chrome");
var ss = require("sdk/simple-storage");
var httpHandler = Cc["@mozilla.org/network/protocol;1?name=http"].
  getService(Ci.nsIHttpProtocolHandler);


var timeout = 100;




function sendEvent(alts_event, properties) {
  if (ss.storage.uid) {
    var context = {};
    context['userAgent'] = httpHandler.userAgent
    var params = {};
    params['userId'] = ss.storage.uid;
    params['event'] = alts_event;
    params['properties'] = properties;
    params['context'] = context;

    var req = Request({
      url: "https://api.segment.io/v1/track",
      /* headers: {
        "Authorization": "Basic NnhjamRlNGI1NA=="
      },*/
      // for production MmJpdWs5ZnA1eA==
      
      headers: {
        "Authorization": "Basic MmJpdWs5ZnA1eA=="
      },
      
      content: params,
      onComplete: function(response) {
        console.log("analytics response: " + response.text);
      }
    }).post();
  } else {
    get_uid();
    window.setTimeout(function() {
      sendEvent(alts_event, properties);
    }, timeout);
    timeout = timeout * 2;
  };
};

exports.sendEvent = sendEvent
