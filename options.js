const bannedTextarea = document.getElementById('bannedDomains');
const productiveTextarea = document.getElementById('productiveDomains');
const saveButton = document.getElementById('saveButton');
const statusDiv = document.getElementById('status');

function loadOptions() {
  chrome.storage.sync.get(['bannedDomains', 'productiveDomains'], (result) => {
    if (chrome.runtime.lastError) {
      statusDiv.textContent = 'Error loading settings.';
      statusDiv.className = 'error';
    } else {
      const banned = result.bannedDomains || [];
      const productive = result.productiveDomains || [];
      bannedTextarea.value = banned.join('\n');
      productiveTextarea.value = productive.join('\n');
    }
  });
}

function saveOptions() {
  statusDiv.textContent = '';
  statusDiv.className = '';

  const banned = [
    ...new Set(
      bannedTextarea.value
        .split('\n')
        .map(domain => domain.trim().toLowerCase())
        .filter(domain => domain.length > 0 && domain.includes('.'))
    )
  ];

  const productive = [
    ...new Set(
      productiveTextarea.value
        .split('\n')
        .map(domain => domain.trim().toLowerCase())
        .filter(domain => domain.length > 0 && domain.includes('.'))
    )
  ];

  chrome.storage.sync.set({
    bannedDomains: banned,
    productiveDomains: productive
  }, () => {
    if (chrome.runtime.lastError) {
      statusDiv.textContent = 'Error saving settings! ' + chrome.runtime.lastError.message;
      statusDiv.className = 'error';
    } else {
      statusDiv.textContent = 'Settings saved successfully!';
      statusDiv.className = 'success';
      setTimeout(() => {
        statusDiv.textContent = '';
        statusDiv.className = '';
      }, 3000);
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  if (saveButton) {
    saveButton.addEventListener('click', saveOptions);
  }
  loadOptions();
});
