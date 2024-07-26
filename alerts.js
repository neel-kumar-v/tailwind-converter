
function createAlert(errorMessage) {
  if (document.getElementById('overlay')) return
  const overlay = document.createElement('div')
  overlay.className = 'fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50'
  overlay.id = 'overlay'

  const alertBox = document.createElement('div')
  alertBox.className = 'fixed inset-0 flex items-center justify-center z-50'

  const alertContent = document.createElement('div')
  alertContent.className = 'bg-gray-800 text-white rounded-lg shadow-lg p-6 w-80 text-center'

  const errorMsg = document.createElement('p')
  errorMsg.textContent = errorMessage
  errorMsg.className = 'text-red-400'

  const closeButton = document.createElement('button')
  closeButton.textContent = 'Close'
  closeButton.className = 'mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none'

  closeButton.addEventListener('click', () => {
    document.body.removeChild(overlay)
    document.body.removeChild(alertBox)
  })

  alertContent.appendChild(errorMsg)
  alertContent.appendChild(closeButton)

  alertBox.appendChild(alertContent)

  document.body.appendChild(overlay)
  document.body.appendChild(alertBox)
}

export { createAlert }
