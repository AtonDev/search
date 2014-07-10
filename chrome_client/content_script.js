document.onkeydown = checkKeyPress;
function checkKeyPress(e) {
  e = e || window.event;

  if (e.keyCode == 39) {
  //right arrow pressed
    chrome.runtime.sendMessage({action: "right"});
  }else if (e.keyCode == 37) {
  //left arrow pressed
    chrome.runtime.sendMessage({action: "left"});
  }
}
