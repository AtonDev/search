var current_query = "";

var btn = window.document.getElementById("submit-query-btn");
btn.addEventListener("click", submit);
btn.addEventListener("mousedown", btn_mousedown);
btn.addEventListener("mouseup", btn_mouseup);
btn.addEventListener("mouseenter", btn_mouseenter);
btn.addEventListener("mouseleave", btn_mouseleave);

var query_box = window.document.getElementById("query-box");
query_box.addEventListener("focus", searchEnvironment);
query_box.addEventListener("change", searchEnvironment);
query_box.addEventListener("keyup", autocomplete);
query_box.addEventListener("keydown", searchEnvironment);

var form = window.document.getElementById("search-form");
form.addEventListener("blur", loses_focus);

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
  searchEnvironment();
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

function btn_mouseleave () {
  switch(btn.value) {
    case "Search":
      btn.style.background = "#617798"
      break;
    case "Next":
      btn.style.background = "#009933"
      break;
  }
}

function btn_mouseenter () {
  switch(btn.value) {
    case "Search":
      btn.style.background = "#576B89"
      break;
    case "Next":
      btn.style.background = "#008A2E"
      break;
  };
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
      btn.style.background = "#50627D"
      break;
    case "Next":
      btn.style.background = "#007527"
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
      current_query = "";
      searchEnvironment();
      break;
    case "focus":
      query_box.focus();
      break;
    case "ac_value":
      query_box.value = message.data.val;
      autocomplete();
      searchEnvironment();
      query_box.focus();
      break;
  };
}

function searchEnvironment() {
  if (query_box.value == "" && current_query != "") {
    nextEnvironment(current_query);
  } else {
    btn.value = "Search";
    query_box.placeholder = "Explore the web";
    btn.style.background = "#617798";
  };
}

function nextEnvironment(query) {
  current_query = query;
  btn.value = "Next";
  btn.style.background = "#009933";
  query_box.placeholder = "query: " + query;
}





