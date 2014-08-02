var toolbarHeight = '400';
var minHeight = '33';
var newCssText = "margin-left: " + toolbarHeight + "px !important";
var minCssText = "margin-left: " + minHeight + "px !important";
//document.body.style.position = "relative"; 
var newIframe = document.createElement('iframe');
newIframe.width = toolbarHeight + 'px';
newIframe.height = '100%'; 
newIframe.id = "searchToolbar"
newIframe.style.border = 'none';
newIframe.style.position = "fixed";
newIframe.style.top = "0px";
newIframe.style.left = "0px";
newIframe.style.margin = "0px";
newIframe.style.zIndex = "99999999999999999";

var preFrameZIndex = "999999999999";
var cntrl = false;
var s = false;
timeout = 5;
var firstTime = true;

makeSpace(timeout);
$(document).ready(function() { 
	init();
});

function moveElementsByTag(tag, change, force) {
	var elements = document.getElementsByTagName(tag);
	for (var elNum = 0; elNum < elements.length; elNum++){
		var el = elements[elNum];
		if ((force == true || el.moved != true) && el.id != 'placeHolderDiv') {
			var elStyle = window.getComputedStyle(el);
			if (elStyle.position == "fixed"){
				var left = elStyle.left;
				var newleft = left ? parseInt(left) : 0;
				el.style.left = newleft + change + "px";
			}
			el.moved = true;
		}
	}
}

function moveFixedElements(change, force) {
	 moveElementsByTag("div", change, force);
	 moveElementsByTag("header", change, force);
	//moveElementsByTag("nav", change);  //this seems to do more harm than good.
}




function initializeHeadroom(tag) {
	var elements = document.getElementsByTagName(tag); //might need to add "header" tag
	for (var elNum = 0; elNum < elements.length; elNum++){
		var el = elements[elNum];
		var elStyle = window.getComputedStyle(el);
		if (elStyle.position == "fixed"){
			var headroom = new Headroom(el);
			headroom.init();
		}
	}
}		

function moveSidebar(size) {
	var sidebar = document.getElementById(newIframe.id);
	var newText, oldText, cssText;
	if (size == 'small'){
		moveFixedElements((toolbarHeight - minHeight) *-1, true);
		cssText = document.body.style.cssText;
	    cssText = cssText.replace(newCssText, minCssText);
	    sidebar.width = minHeight + 'px';
	}else if (size == 'large'){
		moveFixedElements((toolbarHeight - minHeight), true);
		cssText = document.body.style.cssText;
	    cssText = cssText.replace(minCssText, newCssText);
	    sidebar.width = toolbarHeight + 'px';
	}
	document.body.style.cssText = cssText;
}

function removeToolbar() {
	var toolbar = document.getElementById(newIframe.id);
	if (toolbar) {
	    toolbar.parentNode.removeChild(toolbar);
	    moveFixedElements(toolbarHeight * -1, true);
	}
	var cssText = document.body.style.cssText;
	cssText = cssText.replace(newCssText, "margin-left: 0px");
	document.body.style.cssText = cssText;
}

function init() {
	if (!document.getElementById('searchToolbar')) {  //if iframe doesnt already exist
		document.body.style.position = "relative"; 
		newIframe.src = chrome.extension.getURL("sidebar.html");
		document.body.style.cssText = document.body.style.cssText + ";" + newCssText;
		moveFixedElements(toolbarHeight);
		document.body.insertBefore(newIframe, document.body.firstChild);
	//	window.setTimeout(function() {
		//	var placeHolderDiv = document.getElementById('placeHolderDiv');
		   // placeHolderDiv.parentNode.removeChild(placeHolderDiv);
	//	}, 1000);

		chrome.runtime.onMessage.addListener(
		    function(request, sender, sendResponse) {
		        if (request.action == "removeToolbar") {
		 			removeToolbar(); 
		 		}
		 		else if(request.action == "resizeToolbar") {
		 			var size = request.size;
		 			var sidebar = document.getElementById(newIframe.id);
		 			if ((size == 'large') && sidebar.width == minHeight + 'px') { //sidebar small so make it large
		 				sidebar.width = toolbarHeight + 'px';
		 			}else if ((size == 'small') && sidebar.width == toolbarHeight + 'px') {//sidebar large so make it small
		 				sidebar.width = minHeight + 'px';
		 			}
		 		}else if(request.action == 'toggleSidebar') {
		 			var sidebar = document.getElementById(newIframe.id);
		 			if (sidebar.width == toolbarHeight + 'px') {
		 				moveSidebar('small');
		 			}else moveSidebar('large');
		 		}
		    }
		);    
		
		chrome.runtime.sendMessage({action: "getNext"}, function(response) {
			if (response.next != "none") {
				var nextPage = document.createElement("link");
				nextPage.rel = "prerender";
				nextPage.href = response.next;
				document.getElementsByTagName("head")[0].appendChild(nextPage);
			}
		});
    }
}




//create space above body before dom ready has fired
function makeSpace(wait) {
	if (firstTime) {
		window.addEventListener("load", function() {
           moveFixedElements(toolbarHeight);
        }, false);

		var style = document.createElement('style');
	    var text = "body { position:relative; left:0px; margin-left: " + toolbarHeight + "px; }";
	    var textNode = document.createTextNode(text);
	    style.appendChild(textNode);
	    document.documentElement.appendChild(style); 
    /*    
        //make div to give new space toolbar's background color. 
        var div = document.createElement("div");
        div.style.backgroundColor = "#e5e5e5";
        div.style.height = toolbarHeight + "px";
        div.style.width = "100%";
        div.id = "placeHolderDiv"
        div.style.position = "fixed";
        div.style.top = "0px";
        div.style.left = "0px";
        div.style.margin = "0px";
        div.style.zIndex = preFrameZIndex;
        div.style.display = "block";
        div.style.visibility = "visible";
        document.documentElement.appendChild(div);
*/
	    firstTime = false;
	}

	if(document.body) {		
		moveFixedElements(toolbarHeight);
	}else {
	    // The body hasn't been created yet, wait for it.
	    window.setTimeout(function() {
	        makeSpace(timeout);
	    }, wait);
	    timeout = timeout * 2;
	}
}



//document.onkeydown = checkKeyPress;
//function checkKeyPress(e) {
//  e = e || window.event;
//  if (e.keyCode == 16) {
//  	cntrl = true;
//  } 
//  if (e.keyCode == 32) {
//  	s = true;
//  }
//  if (cntrl && s) {
//  	newIframe.width = '500px';
//  	newIframe.style.display = "block";
//  	newIframe.contentWindow.focus();
//  }
//  if (e.keyCode == 39) {
  //right arrow pressed
//    chrome.runtime.sendMessage({action: "right"});
//  }else if (e.keyCode == 37) {
  //left arrow pressed
//    chrome.runtime.sendMessage({action: "left"});
//  }
//}

//document.onkeyup = upKeyPress;
//function upKeyPress(e) {
// e = e || window.event;
//  if (cntrl && s) {
//  	newIframe.style.display = "block";
  	//document.getElementById('searchBox').focus();
//  }
//  if (e.keyCode == 17) {
//  	cntrl = false;
//  } 
//  if (e.keyCode == 83) {
//  	s = false;
//  }
//}


