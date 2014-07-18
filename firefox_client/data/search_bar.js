var current_query = "";


var btn = window.document.getElementById("submit-query-btn");
btn.addEventListener("click", submit);

var query_box = window.document.getElementById("query-box");
query_box.addEventListener("focus", searchEnvironment);
query_box.addEventListener("blur", loses_focus);
query_box.addEventListener("change", searchEnvironment);

window.addEventListener("message", handleResponse, false);



function submit() {
  switch(btn.value) {
    case "Search":
      current_query = query_box.value;
      window.parent.postMessage({
        "type" : "search",
        "query" : query_box.value
      }, "*");
      query_box.value = "";
      break;
    case "Next":
      window.parent.postMessage({
        "type" : "next"
      }, "*");
      query_box.value = "";
  };
}


function loses_focus() {
  if (current_query != "") {
    nextEnvironment(current_query);
  };
}

function handleResponse (message) {
  switch(message.data.type) {
    case "btn-change-next":
      nextEnvironment(message.data.query);
      break;
    case "btn-change-search":
      searchEnvironment();
      current_query = "";
      break;
  };
}

function searchEnvironment() {
  btn.value = "Search";
  query_box.placeholder = "Explore the web";
  btn.style.background = "#617798";
}

function nextEnvironment(query) {
  btn.value = "Next";
  btn.style.background = "#009933";
  query_box.placeholder = "query: " + query;
  current_query = query;
}





