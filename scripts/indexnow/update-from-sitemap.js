import https from "https";
import fs from "fs";
import path from "path";

// Configuration
const SITEMAP_INDEX_URL =
  "https://unblocked-games.vercel.app/sitemap-index.xml";
const SCRIPT_PATH = "scripts/indexnow/submit-urls.js";

// Function to fetch sitemap index
function fetchSitemapIndex() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "unblocked-games.vercel.app",
      port: 443,
      path: "/sitemap-index.xml",
      method: "GET",
      headers: {
        "User-Agent": "IndexNow-Sitemap-Extractor/1.0",
      },
    };

    const req = https.request(options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        if (res.statusCode === 200) {
          resolve(data);
        } else {
          reject(
            new Error(
              `Failed to fetch sitemap index: ${res.statusCode} ${res.statusMessage}`,
            ),
          );
        }
      });
    });

    req.on("error", (error) => {
      reject(error);
    });

    req.end();
  });
}

// Function to extract sitemap URLs from sitemap index
function extractSitemapUrls(sitemapIndexXml) {
  const urlRegex = /<loc>(.*?)<\/loc>/g;
  const urls = [];
  let match;

  while ((match = urlRegex.exec(sitemapIndexXml)) !== null) {
    urls.push(match[1]);
  }

  return urls;
}

// Function to fetch individual sitemap
function fetchSitemap(sitemapUrl) {
  return new Promise((resolve, reject) => {
    const url = new URL(sitemapUrl);
    const options = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname,
      method: "GET",
      headers: {
        "User-Agent": "IndexNow-Sitemap-Extractor/1.0",
      },
    };

    const req = https.request(options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        if (res.statusCode === 200) {
          resolve(data);
        } else {
          reject(
            new Error(
              `Failed to fetch sitemap ${sitemapUrl}: ${res.statusCode} ${res.statusMessage}`,
            ),
          );
        }
      });
    });

    req.on("error", (error) => {
      reject(error);
    });

    req.end();
  });
}

// Function to extract URLs from sitemap XML
function extractUrlsFromSitemap(sitemapXml) {
  const urlRegex = /<loc>(.*?)<\/loc>/g;
  const urls = [];
  let match;

  while ((match = urlRegex.exec(sitemapXml)) !== null) {
    urls.push(match[1]);
  }

  return urls;
}

// Function to update the submit-urls.js script with new URLs
function updateScriptWithUrls(urls) {
  const scriptPath = path.resolve(SCRIPT_PATH);

  if (!fs.existsSync(scriptPath)) {
    throw new Error(`Script file not found: ${scriptPath}`);
  }

  let scriptContent = fs.readFileSync(scriptPath, "utf8");

  // Create the new URLS array
  const newUrlsArray = `// URLs extracted from your sitemap
const URLS = [
${urls.map((url) => `  '${url}'`).join(",\n")}
];`;

  // Replace the URLS array in the script
  const urlsArrayRegex = /\/\/ URLs extracted from your sitemap[\s\S]*?^\];/m;

  if (!urlsArrayRegex.test(scriptContent)) {
    throw new Error(
      "Could not find URLS array in script. Please check the script format.",
    );
  }

  scriptContent = scriptContent.replace(urlsArrayRegex, newUrlsArray);

  // Write the updated script
  fs.writeFileSync(scriptPath, scriptContent, "utf8");

  return scriptPath;
}

// Main function
async function updateFromSitemap() {
  console.log("🔍 Fetching sitemap index from:", SITEMAP_INDEX_URL);

  try {
    // Fetch sitemap index
    const sitemapIndexXml = await fetchSitemapIndex();
    console.log("✅ Sitemap index fetched successfully");

    // Extract sitemap URLs from index
    const sitemapUrls = extractSitemapUrls(sitemapIndexXml);
    console.log(`📋 Found ${sitemapUrls.length} sitemaps in index`);

    // Fetch all sitemaps and extract URLs
    const allUrls = [];
    for (const sitemapUrl of sitemapUrls) {
      console.log(`🔍 Fetching sitemap: ${sitemapUrl}`);
      const sitemapXml = await fetchSitemap(sitemapUrl);
      const urls = extractUrlsFromSitemap(sitemapXml);
      allUrls.push(...urls);
      console.log(`✅ Found ${urls.length} URLs in ${sitemapUrl}`);
    }

    console.log(`📋 Found ${allUrls.length} total URLs across all sitemaps`);

    // Display found URLs
    console.log("\n📍 URLs found:");
    allUrls.forEach((url, index) => {
      console.log(`  ${index + 1}. ${url}`);
    });

    // Update script
    const updatedScript = updateScriptWithUrls(allUrls);
    console.log(`\n✅ Updated script: ${updatedScript}`);
    console.log(
      `📝 The URLS array has been updated with ${allUrls.length} URLs`,
    );

    console.log("\n🚀 You can now run:");
    console.log("  pnpm run indexnow");
  } catch (error) {
    console.error("❌ Error updating from sitemap:", error.message);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  updateFromSitemap();
}

export {
  fetchSitemapIndex,
  fetchSitemap,
  extractSitemapUrls,
  extractUrlsFromSitemap,
  updateScriptWithUrls,
};
