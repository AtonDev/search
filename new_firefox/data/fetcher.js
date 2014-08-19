console.log(window.document.getElementById('data').innerHTML)
self.port.emit('data', JSON.parse(window.document.getElementById('data').innerHTML))