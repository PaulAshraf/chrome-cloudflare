function getColor(cacheStatus) {
  if (cacheStatus === "HIT") return "green";
  if (cacheStatus === "MISS") return "red";
  if (cacheStatus === "EXPIRED") return "orange";
  return "grey";
}

chrome.runtime.onMessage.addListener((message) => {
  if (message.data) {
    console.info(`[Cloudflare] CACHE STATUS: ${message.data.cacheStatus}`);

    const element = document.getElementById("cf-data");
    if (element) element.remove();

    const div = document.createElement("div");
    div.id = "cf-data";
    div.style.backgroundColor = getColor(message.data.cacheStatus);
    div.style.height = "25px";
    div.style.position = "fixed";
    div.style.borderRadius = "25px";
    div.style.padding = "15px";
    div.style.gap = "15px";
    div.style.top = "10px";
    div.style.right = "10px";
    div.style.fontFamily = "monospace";
    div.style.zIndex = "10000";
    div.style.display = "flex";
    div.style.justifyContent = "center";
    div.style.alignItems = "center";

    const image = document.createElement("img");
    image.src =
      "https://static-00.iconduck.com/assets.00/cloudflare-icon-512x512-i8vn5bsz.png";
    image.style.height = "25px";
    image.alt = "cloudflare";

    const span = document.createElement("span");
    span.innerText = message.data.cacheStatus;

    div.appendChild(image);
    div.appendChild(span);

    document.body.appendChild(div);
  }
});
