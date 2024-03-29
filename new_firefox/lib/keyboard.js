/*
alt-S focus and 'activate' address bar for alts searches
alt-Down and alt-Up for scrolling down or up the link list
enter to load the selcted url
*/
var { Hotkey } = require('sdk/hotkeys')
var sidebar = require('sidebar')
var browser = require('browser')


function init() {
  Hotkey({
    combo: "alt-Down",
    onPress: function() {
      sidebar.next()
    }
  });

  Hotkey({
    combo: "alt-Up",
    onPress: function() {
      sidebar.previous()
    }
  })

  Hotkey({
    combo: "alt-s",
    onPress: function() {
      browser.activateURLBar()
    }
  });

  Hotkey({
    combo: "alt-Return",
    onPress: function() {
      sidebar.loadSelected()
    }
  });
}

exports.init = init