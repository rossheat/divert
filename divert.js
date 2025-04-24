const productiveListUl = document.getElementById('productiveList');
const statusMessageLi = productiveListUl?.querySelector('.status-message');
const optionsLink = document.getElementById('optionsLink');

function displayProductiveSites() {
  if (!productiveListUl || !statusMessageLi) {
    console.error("Required elements not found in divert.html");
    return;
  }

  chrome.storage.sync.get(['productiveDomains'], (result) => {
    if (chrome.runtime.lastError) {
      statusMessageLi.textContent = 'Error loading suggestions.';
      statusMessageLi.style.display = 'list-item';
      productiveListUl.innerHTML = '';
      productiveListUl.appendChild(statusMessageLi);
      return;
    }

    const productiveDomains = result.productiveDomains || [];

    productiveListUl.innerHTML = '';
    productiveListUl.appendChild(statusMessageLi);

    if (productiveDomains.length === 0) {
      statusMessageLi.textContent = 'No productive sites configured.';
      statusMessageLi.style.display = 'list-item';
    } else {
      statusMessageLi.style.display = 'none';

      productiveDomains.forEach(domain => {
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        let url = domain.trim();
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
          url = 'https://' + url;
        }

        try {
          new URL(url);
          link.href = url;
          link.textContent = domain.trim();
          link.target = "_self";
          listItem.appendChild(link);
          productiveListUl.appendChild(listItem);
        } catch (e) {
          // Silently ignore invalid URLs in the list
        }
      });
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  if (optionsLink) {
    optionsLink.addEventListener('click', (event) => {
      event.preventDefault();
      if (chrome.runtime && chrome.runtime.openOptionsPage) {
        chrome.runtime.openOptionsPage();
      } else {
        alert("Please open the extension options manually via the Chrome Extensions page (chrome://extensions).");
      }
    });
  }

  displayProductiveSites();
});
