$(document).ready(function(){
    var BGPage = chrome.extension.getBackgroundPage();
	var searchFormDiv = document.getElementById('searchFormDiv');
	var searchBox = document.getElementById('searchBox');
    searchBox.focus();
    BGPage.togglePopup(window); 
    
    searchFormDiv.addEventListener('submit', function(event) {
    	event.preventDefault();
    	var query = document.getElementById('searchBox').value;
        BGPage.executeSearch(-1, query);
        window.close();
    });
    
    function enlargePopupSize() {
      searchFormDiv.style.height = '138px';
    }

    function reducePopupSize() {
	  searchFormDiv.style.height = '40px';
    }

	$("#searchBox").autocomplete({
		source: function(request, response) {
			var yql_ac = 'https://query.yahooapis.com/v1/public/yql?q=select%20k%20from%20yahoo.search.suggestions%20where%20command%3D%22'+ request.term +'%22&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys';         // env=http%3A%2F%2Fdatatables.org%2Falltables.env';
			$.ajax({
				url: yql_ac,
				dataType: "json",              
				success: function(data) {
					var suggestions = [];
					// for each element in the data.gossip.results array ...
					if (data.query.results == null) { //when query is unusual - no results
						reducePopupSize();
						return;
					} 
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
		  enlargePopupSize();
	});

	$( "#searchBox" ).on( "autocompleteclose", function( event, ui ) {
		  reducePopupSize();
	});

});