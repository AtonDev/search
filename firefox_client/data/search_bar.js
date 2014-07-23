var current_query = "";


var btn = window.document.getElementById("submit-query-btn");
btn.addEventListener("click", submit);
btn.addEventListener("mousedown", btn_mousedown);
btn.addEventListener("mouseup", btn_mouseup);

var query_box = window.document.getElementById("query-box");
query_box.addEventListener("focus", searchEnvironment);
query_box.addEventListener("blur", loses_focus);
query_box.addEventListener("change", searchEnvironment);
query_box.addEventListener("keyup", autocomplete);

window.addEventListener("message", handleResponse, false);



function submit() {
  switch(btn.value) {
    case "Search":
      if (query_box.value != "") {
        current_query = query_box.value;
        window.parent.postMessage({
          "type" : "search",
          "query" : query_box.value
        }, "*");
        query_box.value = "";
      }
      break;
    case "Next":
      window.parent.postMessage({
        "type" : "next"
      }, "*");
      query_box.value = "";
  };
}

function autocomplete() {
  var a = parseInt(window.document.getElementById("body-id").clientWidth);
  var b = parseInt(window.document.getElementById("search-form").offsetWidth);
  var q = query_box.value;
  var width = parseInt(query_box.offsetWidth);
  var pleft = (a - b)/2 + 8;
  window.parent.postMessage({
        "type" : "autocomplete",
        "query": q,
        "pwidth": width,
        "pleft": pleft
      }, "*");
}

function btn_mouseup () {
  switch(btn.value) {
    case "Search":
      btn.style.background = "#617798"
      break;
    case "Next":
      btn.style.background = "#009933"
      break;
  }
}

function btn_mousedown () {
  switch(btn.value) {
    case "Search":
      btn.style.background = "#576B89"
      break;
    case "Next":
      btn.style.background = "#008A2E"
      break;
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





