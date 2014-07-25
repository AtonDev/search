self.port.on("link", function(url) {
  var nextPage1 = document.createElement("link");
  nextPage1.rel = "prefetch";
  nextPage1.href = url;
  document.getElementsByTagName("head")[0].appendChild(nextPage1);

  var nextPage2 = document.createElement("link");
  nextPage2.rel = "next";
  nextPage2.href = url;
  document.getElementsByTagName("head")[0].appendChild(nextPage2);

  var meta = document.createElement('meta');
  meta.httpEquiv = "Link";
  meta.content = "<" + url + ">; rel=prefetch";
  document.getElementsByTagName("head")[0].appendChild(meta);
});

