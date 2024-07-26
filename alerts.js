// alerts.js

function createAlert(errorMessage) {
  // Create the overlay to blur the background
  const overlay = document.createElement('div');
  overlay.className = 'fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50';

  // Create the alert dialog box
  const alertBox = document.createElement('div');
  alertBox.className = 'fixed inset-0 flex items-center justify-center z-50';

  // Inner box for the alert content
  const alertContent = document.createElement('div');
  alertContent.className = 'bg-gray-800 text-white rounded-lg shadow-lg p-6 w-80 text-center';

  // Create the error message element
  const errorMsg = document.createElement('p');
  errorMsg.textContent = errorMessage;
  errorMsg.className = 'text-red-400';

  // Create the close button
  const closeButton = document.createElement('button');
  closeButton.textContent = 'Close';
  closeButton.className = 'mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none';

  // Add event listener to close the alert
  closeButton.addEventListener('click', () => {
    document.body.removeChild(overlay);
    document.body.removeChild(alertBox);
  });

  // Append elements to the alert content
  alertContent.appendChild(errorMsg);
  alertContent.appendChild(closeButton);

  // Append alert content to the alert box
  alertBox.appendChild(alertContent);

  // Append overlay and alert box to the body
  document.body.appendChild(overlay);
  document.body.appendChild(alertBox);
}

export { createAlert };
