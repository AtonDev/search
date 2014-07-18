var btn = window.document.getElementById("submit-query-btn");
btn.addEventListener("click", submit);

var query_box = window.document.getElementById("query-box");
query_box.addEventListener("focus", typing);

window.addEventListener("message", handleResponse, false);

function submit() {
  switch(btn.value) {
    case "Search":
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

function typing() {
  query_box.value = "";
  query_box.placeholder = "Explore the web";
  btn.value = "Search";
  btn.style.background = "#617798";

}

function handleResponse (message) {
  switch(message.data.type) {
    case "btn-change-next":
      btn.value = "Next";
      btn.style.background = "#009933";
      query_box.placeholder = "query: " + message.data.query;
      break;
    case "btn-change-search":
      btn.value = "search";
      btn.style.background = "#617798";
      break;
  };
}