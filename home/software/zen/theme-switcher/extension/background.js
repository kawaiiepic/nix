let port = browser.runtime.connectNative("themeswitch");

function setWebsiteAppearance(mode) {
  let value;
  if (mode === "dark") value = "dark";
  else if (mode === "light") value = "light";
  else value = "system"; // default/follow system

  browser.browserSettings.overrideContentColorScheme.set({ value });
}

port.onMessage.addListener((response) => {
  console.log("Received:", response);

  if (response.command === "dark") setWebsiteAppearance("dark");
  if (response.command === "light") setWebsiteAppearance("light");
});

port.onDisconnect.addListener((port) => {
  if (port.error) {
    console.log(`Disconnected due to an error: ${port.error.message}`);
  } else {
    console.log(`Disconnected`, port);
  }
});
