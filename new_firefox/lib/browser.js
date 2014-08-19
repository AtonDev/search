var windowUtils = require('sdk/window/utils')
var search = require('search')
var sidebar = require('sidebar')


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
      search.getQueryData(encodeURI(urlBar.value), function() { sidebar.show() })

      //deactivate urlbar
      urlBar.handleCommand = old_handleCommand
      urlBar.value = ""
      urlBar.placeholder = "Search or enter address"
    } 
    old_handleCommand.call(urlBar, event)
  }

}






//adds a button to the urlbar to indicate alts status
function addButton() {

}

exports.activateURLBar = activateURLBar



