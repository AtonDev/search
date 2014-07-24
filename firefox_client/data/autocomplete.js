var input = window.document.getElementById("input-ac");
var update = new Event('update_hidden_input');

var select_value = window.document.getElementById("select_value");
select_value.addEventListener('value_changed', selectValue);

self.port.on('ac', handleMessage);

function handleMessage(message) {
  input.value = message;
  input.dispatchEvent(update);
};

function selectValue() {
  self.port.emit('select_value', select_value.value);
}

