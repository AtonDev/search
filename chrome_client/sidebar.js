
$(document).ready(function(){
    var toolbarHeight = '40';
    var acHeight = '150';
    var clickedUrl;
    var curUrl;
    var toggleOn;
    var results = document.getElementById('results');

  /*  
    chrome.storage.sync.get('toggleOn', function(items) {
        toggleOn = items['toggleOn'];
        if (toggleOn == 'undefined') {
            toggleOn = true;
        }
        if (!toggleOn) {
            chrome.runtime.sendMessage({action: "sbToggle"});
            document.getElementById('sbToggleBtn').innerHTML = "&raquo";
            toggleHide();
        } else {
            document.getElementById('sbToggleBtn').innerHTML = "&laquo";
        }
    });

   */

    function loadResults(titles, abstracts, dispurls, urls, curUrl) {
        console.log("START LOADRESULTS");
        for (var i = 0; i < titles.length; i++) {
            var section = document.createElement('div');
            var content = document.createElement('div');
            var title = document.createElement('h3');
            var dispurl = document.createElement('span');
            var abstract = document.createElement('p');
            section.className = 'section';
            content.className = 'content';
            title.className = 'title';
            dispurl.className = 'dispurl';
            abstract.className = 'abstract';
            
            content.appendChild(title);
            content.appendChild(dispurl);
            content.appendChild(abstract);
            section.appendChild(content);
            results.appendChild(section);


            var aTag = document.createElement("a");
            aTag.style.textDecoration = 'none';
            aTag.href = urls[i];
            aTag.innerHTML = titles[i];

            title.appendChild(aTag);
            
            dispurl.innerHTML = dispurls[i];
            abstract.innerHTML = abstracts[i];
            section.href = urls[i];
            aTag.style.color = "#1a0dab";
            //console.log('visitedSEctions: ' + visitedSections);
            if (curUrl == urls[i]) {
                section.style.borderTopStyle = "solid";
                section.style.borderRightStyle = "none";
                section.style.borderBottomWidth = "5px";
                section.style.borderLeftWidth = "10px";
                section.style.borderTopWidth = "3px";
                section.style.background = "#FFFFFB"
                aTag.style.color = "#1B5790";
            }//else if (visitedSections && section.id in visitedSections) {
               // section.style.background = "#FFFFF0"
           // }

            section.addEventListener('click', function(event) {
                event.preventDefault();
                var id = this.id;
                curUrl = this.href
                var xPos = document.body.scrollLeft;
                var yPos = document.body.scrollTop;
                chrome.runtime.sendMessage({action: "linkClicked", url: curUrl, id: id, xPos: xPos, yPos: yPos});
             });

        }
        console.log("FINISH LOADRESULTS");
    }

    

    chrome.runtime.sendMessage({action: "loaded"}, function(response) {
        var visitedSections;
        var query = response.query;
        var toggleOn = response.toggleOn
        if (!toggleOn) {
            toggleHide();
        } else {
            toggleShow();
        }    

        document.getElementById('sbToggleBtn').addEventListener('click', function() {
            this.blur();
            toggleOn = !toggleOn;
            var curVal = document.getElementById('sbToggleBtn').innerHTML;
            if (!toggleOn) {
                toggleHide();
            }else {
                toggleShow();
            }
            //chrome.storage.sync.set({'toggleOn': toggleOn}, function() {});
            chrome.runtime.sendMessage({action: "sbToggle"});
        });

        if (query != '') {

            document.getElementById('searchBox').value = response.query;
            visitedSections = response.visitedSections
            var xPos = response.xPos;
            var yPos = response.yPos;
            
            loadResults(response.titles, response.abstracts, response.dispurls, response.urls, response.curUrl);
             $(window).scroll(function () {
                if ($(document).height() <= $(window).scrollTop() + $(window).height()) {
                    loadResults();
                }
            });

            if (xPos != 'undefined' && yPos != 'undefined')
                window.scrollTo(xPos, yPos);

            window.onload = function() {
                if (xPos != 'undefined' && yPos != 'undefined')
                    window.scrollTo(xPos, yPos);
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
        if (toggleOn == true) 
            chrome.runtime.sendMessage({action: "resizeToolbar", size: size});
    }

    function toggleHide() {
        document.getElementById('sbToggleBtn').innerHTML = "&raquo";
        results.style.display = 'none';
        document.getElementById('toolbar').style.display = 'none';
        document.getElementById('logo').style.display = 'none';
        document.getElementById('uiSwitchBtn').style.display = 'none';
        document.getElementById('removeToolbarBtn').style.display = 'none';
    }

    function toggleShow() {
        document.getElementById('sbToggleBtn').innerHTML = "&laquo";
        results.style.display = 'initial';
        document.getElementById('toolbar').style.display = 'initial';
        document.getElementById('logo').style.display = 'initial';
        document.getElementById('uiSwitchBtn').style.display = 'initial';
        document.getElementById('removeToolbarBtn').style.display = 'initial';
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