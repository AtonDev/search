var input = window.document.getElementById("input-ac");
var update = new Event('update_hidden_input');

self.port.on('ac', handleMessage);

function handleMessage(message) {
  input.value = message;
  input.dispatchEvent(update);
}

