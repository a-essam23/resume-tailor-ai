const logToServer = (message, type = "debug") => {
  fetch("http://localhost:3100/log", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      process: "extension-content-script",
      message: message,
      type,
    }),
  }).catch((error) => console.log("Error sending log from content:", error));
};
function extractJobDescription(node) {
  let result = "";

  node.childNodes.forEach((child) => {
    if (child.nodeType === Node.ELEMENT_NODE) {
      // Check if this element is a title element (<strong>)
      if (child.tagName.toLowerCase() === "strong") {
        const content = child.textContent
          .replace(/\n/g, " ")
          .replace(/\s+/g, " ")
          .trim();
        result += `${content}${content.includes(":") ? "" : ":"} `;
      } else {
        // Recursively process child nodes
        result += extractJobDescription(child);
      }
    } else if (child.nodeType === Node.TEXT_NODE) {
      const content = child.textContent
        .replace(/\n/g, " ")
        .replace(/\s+/g, " ")
        .trim();
      if (content) {
        result += content + " ";
      }
    }
  });

  return result.replace("About the job", "").trim();
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "scrapeJobData") {
    alert("Received message to scrape job data.");
    logToServer("Received message to scrape job data.");
    const jobTitleElement = document.querySelector(
      ".job-details-jobs-unified-top-card__job-title h1 a"
    );
    const jobTitle = jobTitleElement?.textContent.trim();
    const jobUrl = `https://linkedin.com${jobTitleElement?.getAttribute(
      "href"
    )}`;

    const jobDescriptionElement = document.getElementById("job-details");
    const jobDescription = jobDescriptionElement
      ? extractJobDescription(jobDescriptionElement)
      : null;

    const companyName = document
      .querySelector(".job-details-jobs-unified-top-card__company-name a")
      ?.textContent.trim();

    if (jobDescription) {
      fetch("http://localhost:3100/api/process-job", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: jobTitle,
          company: companyName,
          description: jobDescription,
          href: jobUrl,
        }),
      });
    } else {
      sendResponse({ success: false, error: "Job data not found." });
    }

    // Optionally send a response back to the background script
    sendResponse({ success: true });
  }
});
