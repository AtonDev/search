var windowUtils = require('sdk/window/utils')
var search = require('search')
var sidebar = require('sidebar')
var analytics = require('analytics')
var tabs = require('sdk/tabs')
var events = require("sdk/system/events")

const { Cc, Ci, Cr } = require("chrome")


//need a function to activate the url bar for alt-s searches
function activateURLBar() {
  var urlBar = windowUtils.getMostRecentBrowserWindow().gURLBar
  urlBar.placeholder = "Explore and search the web with alt-s"
  urlBar.value = ""
  urlBar.focus()
  var old_handleCommand = urlBar.handleCommand
  urlBar.handleCommand = function(event) {
    //console.log(event.type)
    console.log(event.target)
    if ((event.type == 'keypress' && event.charCode == 0)||
      (event.type == 'click' && event.target.id == "urlbar-go-button")) {
      search.getQueryData(urlBar.value, function() { sidebar.show() })
      analytics.sendEvent('Searched', {'Search Query': '', 'Origin': 'urlbar'})

      //deactivate urlbar
      urlBar.handleCommand = old_handleCommand
      urlBar.value = ""
      urlBar.placeholder = "Search or enter address"
    } 
    old_handleCommand.call(urlBar, event)
  }

}

function listener(event) {
  
  var channel = event.subject.QueryInterface(Ci.nsIHttpChannel)
  var url = event.subject.URI.spec
  var p1 = /.*alts.io\/$/i//new MatchPattern("*.alts.io")
  var p2 = /^http:\/\/alts\.io\/search$/i //new MatchPattern("http://alts.io/search")
  if (p1.test(url) && !p2.test(url)) {

    channel.cancel(Cr.NS_BINDING_ABORTED)


    var gBrowser = windowUtils.getMostRecentBrowserWindow().gBrowser
    var domWin = channel.notificationCallbacks.getInterface(Ci.nsIDOMWindow)
    var browser = gBrowser.getBrowserForDocument(domWin.top.document)

    browser.loadURI("http://alts.io/search")
  } 
}


function startUrlListener() {
  events.on("http-on-modify-request", listener)
}


exports.startUrlListener = startUrlListener
exports.activateURLBar = activateURLBar



