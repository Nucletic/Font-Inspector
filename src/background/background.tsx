chrome.action.onClicked.addListener(async (tab) => {
  if (!tab.id) return;
  try {
    await chrome.tabs.sendMessage(tab.id, {
      action: "showOverlay",
    });
  } catch (error) {
    console.error("Failed to send message:", error);
  }
});
