import https from "https";

// Configuration from your sitemap
const API_KEY = "a574a450817f42a183489d2ad98b18ac";
const DOMAIN = "unblocked-games.vercel.app";
const KEY_LOCATION = `https://${DOMAIN}/${API_KEY}.txt`;

// URLs extracted from your sitemap
const URLS = [
  'https://unblocked-games.vercel.app/',
  'https://unblocked-games.vercel.app/dmca/',
  'https://unblocked-games.vercel.app/games/bloonstd5/',
  'https://unblocked-games.vercel.app/games/doom/',
  'https://unblocked-games.vercel.app/games/geography-game/',
  'https://unblocked-games.vercel.app/games/geometry-dash/',
  'https://unblocked-games.vercel.app/games/gun-mayhem2/',
  'https://unblocked-games.vercel.app/games/happywheels/',
  'https://unblocked-games.vercel.app/games/hobo2/',
  'https://unblocked-games.vercel.app/games/hobo7/',
  'https://unblocked-games.vercel.app/games/madness-project-nexus/',
  'https://unblocked-games.vercel.app/games/minesweeper/',
  'https://unblocked-games.vercel.app/games/plants-vs-zombies/',
  'https://unblocked-games.vercel.app/games/riddle-school2/',
  'https://unblocked-games.vercel.app/games/riddle-school3/',
  'https://unblocked-games.vercel.app/games/riddle-school4/',
  'https://unblocked-games.vercel.app/games/riddle-school5/',
  'https://unblocked-games.vercel.app/games/supermarioflash/',
  'https://unblocked-games.vercel.app/games/tetris/',
  'https://unblocked-games.vercel.app/games/theimpossiblequiz2/',
  'https://unblocked-games.vercel.app/games/vex3/'
];

// Function to submit URLs to IndexNow
function submitToIndexNow(urls) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      host: DOMAIN,
      key: API_KEY,
      keyLocation: KEY_LOCATION,
      urlList: urls,
    });

    const options = {
      hostname: "api.indexnow.org",
      port: 443,
      path: "/IndexNow",
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Length": data.length,
      },
    };

    const req = https.request(options, (res) => {
      let responseData = "";

      res.on("data", (chunk) => {
        responseData += chunk;
      });

      res.on("end", () => {
        console.log(`Status Code: ${res.statusCode}`);
        console.log(`Response: ${responseData}`);

        if (res.statusCode === 200 || res.statusCode === 202) {
          const statusText =
            res.statusCode === 200
              ? "submitted successfully"
              : "accepted for processing";
          console.log(`✅ URLs ${statusText}!`);
          resolve({
            success: true,
            statusCode: res.statusCode,
            data: responseData,
          });
        } else {
          console.log("❌ Submission failed");
          reject({
            success: false,
            statusCode: res.statusCode,
            data: responseData,
          });
        }
      });
    });

    req.on("error", (error) => {
      console.error("Request error:", error);
      reject({ success: false, error: error.message });
    });

    req.write(data);
    req.end();
  });
}

// Function to submit URLs in batches (IndexNow recommends max 10,000 URLs per request)
async function submitAllUrls() {
  console.log(`🚀 Starting IndexNow submission for ${URLS.length} URLs...`);
  console.log(`📋 Domain: ${DOMAIN}`);
  console.log(`🔑 API Key: ${API_KEY}`);
  console.log(`📍 Key Location: ${KEY_LOCATION}`);
  console.log("");

  try {
    // Submit all URLs in one batch (you have 21 URLs, well under the limit)
    const result = await submitToIndexNow(URLS);
    console.log("");
    console.log("🎉 All URLs have been submitted to IndexNow!");
    console.log("📊 You can verify the submission using Bing Webmaster Tools");
    console.log(
      "⏱️  Note: 202 status means the request was accepted and will be processed shortly",
    );

    return result;
  } catch (error) {
    console.error("❌ Submission failed:", error);
    process.exit(1);
  }
}

// Function to submit a single URL (for future use)
async function submitSingleUrl(url) {
  console.log(`🚀 Submitting single URL: ${url}`);

  try {
    const result = await submitToIndexNow([url]);
    console.log("✅ URL submitted successfully!");
    return result;
  } catch (error) {
    console.error("❌ URL submission failed:", error);
    throw error;
  }
}

// Command line interface
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    // Submit all URLs
    submitAllUrls();
  } else if (args[0] === "--single" && args[1]) {
    // Submit single URL
    submitSingleUrl(args[1]);
  } else {
    console.log("Usage:");
    console.log("  node submit-urls.js              # Submit all URLs");
    console.log("  node submit-urls.js --single <url>  # Submit single URL");
    process.exit(1);
  }
}

export { submitToIndexNow, submitAllUrls, submitSingleUrl, URLS };
