const DEFAULT_BANNED_DOMAINS = [
  "youtube.com",
  "facebook.com",
  "twitter.com",
  "reddit.com",
  "instagram.com",
  "netflix.com",
  "tiktok.com"
];
const DEFAULT_PRODUCTIVE_DOMAINS = [
  "news.ycombinator.com",
  "github.com",
  "stackoverflow.com",
  "developer.mozilla.org",
  "wikipedia.org"
];

chrome.runtime.onInstalled.addListener(details => {
  if (details.reason === "install") {
    chrome.storage.sync.set({
      bannedDomains: DEFAULT_BANNED_DOMAINS,
      productiveDomains: DEFAULT_PRODUCTIVE_DOMAINS
    });
  }
});


chrome.webNavigation.onBeforeNavigate.addListener(
  (details) => {
    if (details.frameId !== 0) {
      return;
    }

    const url = new URL(details.url);
    const hostname = url.hostname;

    chrome.storage.sync.get(['bannedDomains'], (result) => {
      if (chrome.runtime.lastError) {
        console.error("Divert: Error retrieving banned domains:", chrome.runtime.lastError);
        return;
      }

      const bannedDomains = result.bannedDomains || [];

      const isBanned = bannedDomains.some(bannedDomain =>
        hostname === bannedDomain || hostname.endsWith('.' + bannedDomain)
      );

      if (isBanned) {
        const divertPageUrl = chrome.runtime.getURL("divert.html");

        chrome.tabs.update(details.tabId, { url: divertPageUrl }, () => {
          if (chrome.runtime.lastError) {
            // Silently ignore errors like tab closed during redirect
          }
        });
      }
    });
  },
  { url: [{ schemes: ["http", "https"] }] }
);

chrome.action.onClicked.addListener((tab) => {
  chrome.runtime.openOptionsPage();
});
