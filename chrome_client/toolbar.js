//window.jQuery || document.write('<script src="js/vendor/jquery-1.10.2.min.js"><\/script>')
window.addEventListener('load', function(evt) {
	chrome.runtime.sendMessage({action: "loaded"}, function(response) {
	//	var nextPage = document.createElement('iframe');
    //    nextPage.width = '0px';
    //    nextPage.height = "0px";
    //    nextPage.src = response.next;
    //    document.body.insertBefore(nextPage, document.body.firstChild);
		var query = response.query;
		if (query != '') {
            document.getElementById('searchBox').value = response.query;
            document.getElementById('next').addEventListener('click', function() {
	            chrome.runtime.sendMessage({action: "next"});
            })
        }
    });

    document.getElementById('searchForm').addEventListener('submit', function(event) {
    	event.preventDefault();
    	var query = document.getElementById('searchBox').value;
        chrome.runtime.sendMessage({action: "search", query: query});
    });

    document.getElementById('removeToolbarBtn').addEventListener('click', function() {
	    chrome.runtime.sendMessage({action: "removeToolbar"});
    })
});


chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
    	console.log("received message: " + request.action)
        if (request.action == "populateSearchBox") {
        	console.log("populating search box");
        	console.log("data: " + request.data);
        	console.log("ele: " + document.getElementById('searchBox'));
        	console.log("value: " + document.getElementById('searchBox').value);
        }	
  });




//document.getElementById('searchBox').addEventListener("submit", submitToBackground(), false);


//Google Analytics: change UA-XXXXX-X to be your site's ID. 
(function(b,o,i,l,e,r){b.GoogleAnalyticsObject=l;b[l]||(b[l]=
    function(){(b[l].q=b[l].q||[]).push(arguments)});b[l].l=+new Date;
    e=o.createElement(i);r=o.getElementsByTagName(i)[0];
    e.src='//www.google-analytics.com/analytics.js';
    r.parentNode.insertBefore(e,r)}(window,document,'script','ga'));
    ga('create','UA-XXXXX-X');ga('send','pageview');