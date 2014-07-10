var btn = window.document.getElementById("submit-query-btn");
btn.addEventListener("click", submit);

function submit() {
  var query = window.document.getElementById("query-box")
  window.parent.postMessage(query.value, "*");
}