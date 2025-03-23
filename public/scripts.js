document.addEventListener("DOMContentLoaded", function () {
  const tabs = document.querySelectorAll(".tab");
  const tabContents = document.querySelectorAll(".tab-content");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tabContents.forEach((tc) => tc.classList.remove("active"));

      tab.classList.add("active");
      document
        .getElementById(tab.getAttribute("data-tab") + "-tab")
        .classList.add("active");
    });
  });

  document.getElementById("shorten-btn").addEventListener("click", async () => {
    const longUrl = document.getElementById("long-url").value.trim();
    const urlError = document.getElementById("url-error");
    const shortenLoader = document.getElementById("shorten-loader");
    const shortenResult = document.getElementById("shorten-result");
    const shortUrlText = document.getElementById("short-url-text");

    urlError.style.display = "none";

    if (!longUrl) {
      urlError.style.display = "block";
      return;
    }

    shortenLoader.style.display = "block";
    shortenResult.style.display = "none";

    try {
      const response = await fetch("/url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ longUrl }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to shorten URL");
      }

      shortUrlText.textContent = data.shortUrl;
      shortenResult.style.display = "block";
    } catch (error) {
      urlError.textContent = error.message;
      urlError.style.display = "block";
    } finally {
      shortenLoader.style.display = "none";
    }
  });

  document.getElementById("copy-btn").addEventListener("click", () => {
    navigator.clipboard
      .writeText(document.getElementById("short-url-text").textContent)
      .then(() => alert("Copied to clipboard!"))
      .catch((err) => console.error("Copy failed:", err));
  });
});
