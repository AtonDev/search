self.port.on("link", function(url) {
  var nextPage = document.createElement("link");
  nextPage.rel = "prerender";
  nextPage.href = url;
  document.getElementsByTagName("head")[0].appendChild(nextPage);
});

self.port.on("no_results", function(m) {
  alert("No results were found for you query");
})
