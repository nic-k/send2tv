function badge(text, color) {
  chrome.action.setBadgeBackgroundColor({ color });
  chrome.action.setBadgeText({ text });
  setTimeout(() => chrome.action.setBadgeText({ text: "" }), 2500);
}

async function sendToTv(url) {
  const { webhook } = await chrome.storage.sync.get("webhook");
  if (!webhook) {
    chrome.runtime.openOptionsPage();
    return;
  }
  try {
    const res = await fetch(webhook, {
      method: "POST",
      body: new URLSearchParams({ url })
    });
    res.ok ? badge("✓", "#2e7d32") : badge("✗", "#c62828");
  } catch (e) {
    console.error(e);
    badge("✗", "#c62828");
  }
}

chrome.action.onClicked.addListener((tab) => {
  if (tab.url) sendToTv(tab.url);
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "send-to-tv",
    title: "Stuur naar tv",
    contexts: ["page", "link"]
  });
  chrome.storage.sync.get("webhook").then(({ webhook }) => {
    if (!webhook) chrome.runtime.openOptionsPage();
  });
});

chrome.contextMenus.onClicked.addListener((info) => {
  sendToTv(info.linkUrl || info.pageUrl);
});
