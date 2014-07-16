var toolbarHeight = '40';
var newCssText = "margin-top: " + toolbarHeight + "px !important";
document.body.style.position = "relative"; 
var newIframe = document.createElement('iframe');
newIframe.width = '100%';
newIframe.height = toolbarHeight + "px";
newIframe.id = "searchToolbar"
newIframe.style.border = 'none';
newIframe.style.position = "fixed";
newIframe.style.top = "0px";
newIframe.style.left = "0px";
newIframe.style.margin = "0px";
newIframe.style.zIndex = "999999";
//newIframe.src = chrome.extension.getURL("toolbar.html");
window.onload = init();



function getTabState() {
	chrome.runtime.sendMessage({action: "getTabState"}, function(response) {
		console.log(response.state)
	});
}

document.onkeydown = checkKeyPress;
function checkKeyPress(e) {
  e = e || window.event;

  if (e.keyCode == 39) {
  //right arrow pressed
    chrome.runtime.sendMessage({action: "right"});
  }else if (e.keyCode == 37) {
  //left arrow pressed
    chrome.runtime.sendMessage({action: "left"});
  }
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
    	console.log("received message: " + request.action)
        if (request.action == "removeToolbar")
 			removeToolbar(); 
 		else if(request.action == "loadToolbar")
 		    init();    
});

function moveElementsByTag(tag, change) {
	var elements = document.getElementsByTagName(tag); //might need to add "header" tag
	for (var elNum = 0; elNum < elements.length; elNum++){
		var el = elements[elNum];
		var elStyle = window.getComputedStyle(el);
		if (elStyle.position == "fixed"){
			var top = elStyle.top;
			var newtop = top ? parseInt(top) : 0;
			el.style.top = newtop + change + "px";
		}
	}
}

function moveFixedElements(change) {
	moveElementsByTag("div", change);
	moveElementsByTag("header", change)
}

function removeToolbar() {
	var toolbar = document.getElementById(newIframe.id);
	if (toolbar) {
	    toolbar.parentNode.removeChild(toolbar);
	    moveFixedElements(toolbarHeight * -1);
	}
	cssText = document.body.style.cssText;
	cssText = cssText.replace(newCssText, "margin-top: 0px");
	document.body.style.cssText = cssText;
}

function getTabState() {
	chrome.runtime.sendMessage({action: "getTabState"}, function(response) {
		if (response.state == 'on') {
			if (response.query == '') {
				//no query has been made, so load toolbar without next button
				newIframe.src = chrome.extension.getURL("toolbarInitial.html");
			}else {
				//load toolbar with next button
				newIframe.src = chrome.extension.getURL("toolbar.html");
			}
			document.body.style.cssText = document.body.style.cssText + ";" + newCssText;
			moveFixedElements(toolbarHeight);
			document.body.insertBefore(newIframe, document.body.firstChild);
	    } 
	});
}

function init() {
	getTabState();
}
