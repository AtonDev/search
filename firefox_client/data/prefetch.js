self.port.on("link", function(url) {
  var nextPage = document.createElement("link");
  nextPage.rel = "next";
  nextPage.href = url;
  document.getElementsByTagName("head")[0].appendChild(nextPage);
});

