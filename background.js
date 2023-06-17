function isCloudflareHTML(headers) {
  if (!headers) return false;

  const server = headers.find((header) => header.name === "server")?.value;
  const contentType = headers.find(
    (header) => header.name === "content-type"
  )?.value;

  return server === "cloudflare" && contentType?.includes("text/html");
}

function getCloudflareData(headers) {
  if (!headers) return {};

  const age = headers.find((header) => header.name === "age")?.value;
  const cacheStatus = headers.find(
    (header) => header.name === "cf-cache-status"
  )?.value;

  const cfData = { age, cacheStatus };

  return cfData;
}

chrome.webRequest.onHeadersReceived.addListener(
  (details) => {
    const responseHeaders = details?.responseHeaders;
    if (!isCloudflareHTML(responseHeaders)) return;

    const data = getCloudflareData(responseHeaders);

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
        if (tabs[0].id === tabId && changeInfo.status == "complete") {
          chrome.tabs.onUpdated.removeListener(listener);

          chrome.tabs.sendMessage(tabs[0].id, { data });
        }
      });
    });
  },
  { urls: ["<all_urls>"] },
  ["responseHeaders"]
);
