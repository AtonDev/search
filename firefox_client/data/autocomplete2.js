$(document).ready(function(){
  $("#input-ac").autocomplete({
    source: function(request, response) {
      var yql_ac = 'https://query.yahooapis.com/v1/public/yql?q=select%20k%20from%20yahoo.search.suggestions%20where%20command%3D%22'+ request.term +'%22&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys';
      $.ajax({
        url: yql_ac,
        dataType: "json",              
        success: function(data) {
          var suggestions = [];
          if (data.query.results == null) {
            var elem = document.getElementById('input-ac');
            elem.dispatchEvent(new Event('no_results'));
          };
          // for each element in the data.gossip.results array ...
          $.each(data.query.results.s, function(i, val) {
            // .. push the value of the key inside our array
            suggestions.push(val.k);
            // dont display more than 5 results
            return i < 4;
          });
          // call response with our collected values
          response(suggestions);
        }
      });
    }
  });

  $("#input-ac").bind('update_hidden_input', function (e) {
    $("#input-ac").autocomplete("search", $("#input-ac").value);
  });

  $( "#input-ac" ).autocomplete({
    select: function( event, ui ) {
      $("#select_value").val(ui.item.value);
      var elem = document.getElementById('select_value');
      elem.dispatchEvent(new Event('value_changed'));
    }
  });

});