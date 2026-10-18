const input = document.getElementById("webhook");
const status = document.getElementById("status");

chrome.storage.sync.get("webhook").then(({ webhook }) => {
  if (webhook) input.value = webhook;
});

document.getElementById("save").addEventListener("click", async () => {
  const value = input.value.trim();
  try {
    const origin = new URL(value).origin + "/*";
    const ok = await chrome.permissions.request({ origins: [origin] });
    if (!ok) {
      status.textContent = "Toestemming geweigerd.";
      return;
    }
    await chrome.storage.sync.set({ webhook: value });
    status.textContent = "Opgeslagen ✓";
  } catch {
    status.textContent = "Ongeldige URL.";
  }
});
