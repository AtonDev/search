
$(document).ready(function(){
    var toolbarHeight = '40';
    var acHeight = '150';
    chrome.runtime.sendMessage({action: "loaded"}, function(response) {
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
          resizeToolbar(acHeight);
    });

    $( "#searchBox" ).on( "autocompleteclose", function( event, ui ) {
          resizeToolbar(toolbarHeight);
    });
});