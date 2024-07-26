function createNotification(message, time) {
  if (document.getElementById('notification')) {
    document.body.removeChild(document.getElementById('notification'))
  }
  const notification = document.createElement('div')
  notification.className = 'fixed top-2 left-1/2 transform -translate-x-1/2 bg-white/[0.1] text-sm transition-all duration-200 text-white rounded-full shadow-lg px-6 py-2 z-50 flex items-center justify-center'
  notification.id = 'notification'

  const messageEl = document.createElement('span')
  messageEl.textContent = message
  messageEl.className = 'text-white'

  const closeButton = document.createElement('button')
  closeButton.textContent = '×'
  closeButton.className = 'ml-4 text-white focus:outline-none'

  closeButton.addEventListener('click', () => {
    document.body.removeChild(notification)
  })
  
  notification.appendChild(messageEl)
  notification.appendChild(closeButton)

  document.body.appendChild(notification)

  setTimeout(() => {
    if (document.body.contains(notification)) {
      document.body.removeChild(notification)
    }
  }, time * 1000)
}


export { createNotification }
