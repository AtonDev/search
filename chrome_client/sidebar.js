
$(document).ready(function(){
    var toolbarHeight = '40';
    var acHeight = '150';
    var clickedUrl;
    var curUrl;

    chrome.runtime.sendMessage({action: "loaded"}, function(response) {
        var query = response.query;
        var titles = response.titles;
        var abstracts = response.abstracts;
        var dispurls = response.dispurls;
        var urls = response.urls;
        var visitedSections;
        if (query != '') {
            document.getElementById('searchBox').value = response.query;
            visitedSections = response.visitedSections
            var xPos = response.xPos;
            var yPos = response.yPos;

            if (xPos != 'undefined' && yPos != 'undefined') {
                window.scrollTo(xPos, yPos);
                console.log ('SCROLLING');
            }else console.log("NOT SCROLLING");
            console.log('xPos: ' + xPos + ' yPos: ' + yPos);


          //  document.getElementById('next').addEventListener('click', function() {
           //     chrome.runtime.sendMessage({action: "next"});
           // })
            var h3Title = document.getElementsByClassName('title');
            var dUrls = document.getElementsByClassName('dispurl');
            var abs = document.getElementsByClassName('abstract');
            var sections = document.getElementsByClassName('section');
            console.log('abs: ');
            console.log(abstracts[0]);
            for (var i = 0; i < h3Title.length; i++) {
                var aTag = document.createElement("a");
                var section = sections[i];
                var h3 = h3Title[i];
                aTag.style.textDecoration = 'none';
                aTag.href = urls[i];
                aTag.innerHTML = titles[i];

                h3.appendChild(aTag);
                
                dUrls[i].innerHTML = dispurls[i];
                abs[i].innerHTML = abstracts[i];
                sections[i].href = urls[i];
                aTag.style.color = "#1a0dab"
                console.log('visitedSEctions: ' + visitedSections);
                if (response.curUrl == urls[i]) {
                    console.log("URLS MATCH");
                    section.style.borderTopStyle = "solid";
                    section.style.borderRightStyle = "none";
                    section.style.borderBottomWidth = "5px";
                    section.style.borderLeftWidth = "10px";
                    section.style.borderTopWidth = "3px";
                    section.style.background = "#FFFFFB"
                    aTag.style.color = "#1B5790";

//                    aTag.style.
                    //section.focus();
                    
                 //   section.style.border = "0px";
                  //  section.style.border

                    //sections[i].className = sections[i].className + " curSection";
                }else if (visitedSections && section.id in visitedSections) {
                    section.style.background = "#FFFFF0"
                }
                aTag.onmouseover = function() {
                    console.log("MOUSEOVER: " + this.href);
                    
                }

                sections[i].addEventListener('click', function(event) {
                    event.preventDefault();
                    var id = this.id;
                    curUrl = this.href
                    var xPos = document.body.scrollLeft;
                    var yPos = document.body.scrollTop;
                    //console.log('in click listener xPos: ' + xPos + ' yPos: ' + yPos);
                    chrome.runtime.sendMessage({action: "linkClicked", url: curUrl, id: id, xPos: xPos, yPos: yPos});
                 });
            }

        }
    });

    document.getElementById('searchForm').addEventListener('submit', function(event) {
        event.preventDefault();
        var query = document.getElementById('searchBox').value;
        chrome.runtime.sendMessage({action: "search", query: query});
    });

    document.getElementById('removeToolbarBtn').addEventListener('click', function() {
        chrome.runtime.sendMessage({action: "removeToolbar"});
    });

    document.getElementById('uiSwitchBtn').addEventListener('click', function() {
        chrome.runtime.sendMessage({action: "uiTypeChange"});
    });

    function resizeToolbar(size) {
      chrome.runtime.sendMessage({action: "resizeToolbar", size: size});
    }


    $("#searchBox").autocomplete({
        source: function(request, response) {
            var yql_ac = 'https://query.yahooapis.com/v1/public/yql?q=select%20k%20from%20yahoo.search.suggestions%20where%20command%3D%22'+ request.term +'%22&format=json&env=http%3A%2F%2Fdatatables.org%2Falltables.env';
            $.ajax({
                url: yql_ac,
                dataType: "json",              
                success: function(data) {
                    var suggestions = [];
                    var counter = 0;
                    // for each element in the data.gossip.results array ...
                    $.each(data.query.results.s, function(i, val) {
                        // .. push the value of the key inside our array
                        suggestions.push(val.k);
                        // dont display more than 4 results
                        return i < 3;
                    });
                    // call response with our collected values
                    response(suggestions);
                }
            });
        }
    });

    $( "#searchBox" ).on( "autocompleteopen", function( event, ui ) {
          //resizeToolbar(acHeight);
    });

    $( "#searchBox" ).on( "autocompleteclose", function( event, ui ) {
          //resizeToolbar(toolbarHeight);
    });
});