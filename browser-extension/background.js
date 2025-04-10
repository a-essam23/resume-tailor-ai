const logToServer = (message, type = "debug") => {
  fetch("http://localhost:3100/log", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      process: "extension-background-script",
      message: message,
      type,
    }),
  }).catch((error) => console.error("Error sending log from content:", error));
};

chrome.runtime.onInstalled.addListener(() => {
  logToServer("Extension installed or reloaded.", "info");
  chrome.contextMenus.create({
    id: "tailorResume",
    title: "Tailor Resume for this Job",
    contexts: ["page"],
    documentUrlPatterns: ["https://www.linkedin.com/jobs/*"],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "tailorResume") {
    // Get the tab ID where the context menu was clicked
    const tabId = tab.id;
    chrome.tabs.sendMessage(tabId, { action: "scrapeJobData" }, (response) => {
      if (chrome.runtime.lastError) {
        logToServer(
          `Error sending message to tab ${tabId}: ${chrome.runtime.lastError.message}`,
          "error"
        );
        return;
      }
      if (response) {
        if (response.success) {
          logToServer("Successfully scraped job data.", "info");
        } else {
          logToServer(`Failed to scrape job data: ${response.error}`, "error");
        }
      } else {
        logToServer("No response from content script.", "warning");
      }
    });
  }
});
