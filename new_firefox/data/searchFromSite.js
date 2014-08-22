var searchBox = document.getElementById('searchBox')
document.getElementById('searchForm').addEventListener('submit', function(event) {
  event.preventDefault()
  self.port.emit('search', searchBox.value)
})