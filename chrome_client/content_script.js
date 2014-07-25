var toolbarHeight = '40';
var newCssText = "margin-top: " + toolbarHeight + "px !important";
//document.body.style.position = "relative"; 
var newIframe = document.createElement('iframe');
newIframe.width = '100%';
newIframe.height = toolbarHeight + "px"; 
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
//	console.log ('moveFixedElements called on DOM ready');		
	init();
});

function moveElementsByTag(tag, change) {
	var elements = document.getElementsByTagName(tag);
	if (window == window.top)
	   console.log("ELEMENTS: " + elements.length); 
	for (var elNum = 0; elNum < elements.length; elNum++){
		var el = elements[elNum];
		if (el.moved != true && el.id != 'placeHolderDiv') {
			var elStyle = window.getComputedStyle(el);
			if (elStyle.position == "fixed"){
				var top = elStyle.top;
				var newtop = top ? parseInt(top) : 0;
				el.style.top = newtop + change + "px";
			}
			el.moved = true;
		}
	}
}

function moveFixedElements(change) {
	moveElementsByTag("div", change);
	moveElementsByTag("header", change);
	//moveElementsByTag("nav", change);  //this seems to do more harm than good.
}


chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
    	//console.log("received message: " + request.action)
        if (request.action == "removeToolbar")
 			removeToolbar(); 
 		else if(request.action == "loadToolbar") {
 		//    init();    
 		//    console.log('init finished');
 		}else if(request.action == 'resizeToolbar') {
 			newIframe.style.height = request.size + 'px';
 		}
    }
);    

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
	//console.log(this + "calling tab state");
	chrome.runtime.sendMessage({action: "getTabState"}, function(response) {
		//console.log('response: ' + response.state + " " + response.query);
		if (response.state == 'on') {
			if (response.query == '') {
				//no query has been made, so load toolbar without next button
//				newIframe.src = chrome.extension.getURL("toolbarInitial.html");
			}else {
				//load toolbar with next button
				document.body.style.position = "relative"; 
				newIframe.src = chrome.extension.getURL("toolbar.html");
				document.body.style.cssText = document.body.style.cssText + ";" + newCssText;
		//		console.log("moveFixedElements in getTabState");
				moveFixedElements(toolbarHeight);
				document.body.insertBefore(newIframe, document.body.firstChild);
				window.setTimeout(function() {
					var placeHolderDiv = document.getElementById('placeHolderDiv');
				    placeHolderDiv.parentNode.removeChild(placeHolderDiv);
				}, 1000);
				
				if (response.next != "none") {
					var nextPage = document.createElement("link");
					nextPage.rel = "prerender";
					nextPage.href = response.next;
					document.getElementsByTagName("head")[0].appendChild(nextPage);
				}
			}
		
			var headroom = new Headroom(newIframe);
			headroom.init();
	    } 
	});
}

function init() {
	//	getTabState();
	document.body.style.position = "relative"; 
	newIframe.src = chrome.extension.getURL("toolbar.html");
	document.body.style.cssText = document.body.style.cssText + ";" + newCssText;
//		console.log("moveFixedElements in getTabState");
	moveFixedElements(toolbarHeight);
	document.body.insertBefore(newIframe, document.body.firstChild);
	window.setTimeout(function() {
		var placeHolderDiv = document.getElementById('placeHolderDiv');
	    placeHolderDiv.parentNode.removeChild(placeHolderDiv);
	}, 1000);
	
	chrome.runtime.sendMessage({action: "getNext"}, function(response) {
		if (response.next != "none") {
			var nextPage = document.createElement("link");
			nextPage.rel = "prerender";
			nextPage.href = response.next;
			document.getElementsByTagName("head")[0].appendChild(nextPage);
		}
	});
	var headroom = new Headroom(newIframe);
	headroom.init();
	initializeHeadroom('div');
	initializeHeadroom('header');
}




//create space above body before dom ready has fired
function makeSpace(wait) {
	//console.log('MAKESPACE() CALLED');
	if (firstTime) {
		//console.log("INSIDE FIRST TIME");
		window.addEventListener("load", function() {
	//	   console.log("moveFixedElements in window load event");
           moveFixedElements(toolbarHeight);
        }, false);

		var style = document.createElement('style');
	    var text = "body { position:relative; top:0px; margin-top: " + toolbarHeight + "px; }";
	    var textNode = document.createTextNode(text);
	    style.appendChild(textNode);
	    document.documentElement.appendChild(style); 
        
        //make div to give new space toolbar's background color. 
        var div = document.createElement("div");
        div.style.backgroundColor = "#195695";
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

	    firstTime = false;
	}

	if(document.body) {		
        console.log("moveFixedElements in document body if");
		moveFixedElements(toolbarHeight);
	}else {
	    // The body hasn't been created yet, wait for it.
	    console.log("SET TIMOUT");
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


