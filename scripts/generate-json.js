const fs = require("fs");
const path = require("path");

const jsDir = path.join(__dirname, "../js");
const manifestPath = path.join(__dirname, "../manifest.json");
const repoOwner = "jimajimax";
const repoName = "bookmarklets";
const baseUrl = `https://${repoOwner}.github.io/${repoName}/`;

if (!fs.existsSync(jsDir)) {
  fs.mkdirSync(jsDir, { recursive: true });
}

const files = fs.readdirSync(jsDir).filter(file => file.endsWith(".js"));
const bookmarklets = [];

for (const file of files) {
  const filePath = path.join(jsDir, file);
  const rawContent = fs.readFileSync(filePath, "utf8");
  const slug = path.basename(file, ".js");

  const getMeta = (key, type = "string") => {
    const regex = new RegExp(`@${key}\\s+(.+)`, "i");
    const match = rawContent.match(regex);
    if (!match) return null;
    let val = match[1].trim();

    if (type === "boolean") return val.toLowerCase() === "true";
    if (type === "array") return val.split(",").map(s => s.trim()).filter(Boolean);
    return val;
  };

  const name = getMeta("name") || slug;
  const description = getMeta("description") || "";
  const category = getMeta("category") || "general";
  const keywords = getMeta("keywords", "array") || [];
  const version = getMeta("version") || "1.0.0";
  const enableMeta = getMeta("enable", "boolean");
  const enable = enableMeta !== null ? enableMeta : true;
  const created_at = getMeta("created_at") || "";
  const updated_at = getMeta("updated_at") || "";
  const inlineBody = rawContent.replace(/\/\*\*[\s\S]*?\*\//, "").trim();

  // 1. 外部読み込みを試行
  // 2. CSP violation / 読み込み失敗 / 例外 発生時にインライン本体を実行
  const scriptUrl = `${baseUrl}js/${file}`;
  const bookmarkletCode = `javascript:/* v${version} */(()=>{const u=${JSON.stringify(scriptUrl)},inline=()=>{${inlineBody}};let r=!1;const f=()=>{if(!r){r=!0;cleanup();inline()}},s=()=>{if(!r){r=!0;cleanup()}},onV=e=>{if(e.blockedURI&&e.blockedURI.includes(${JSON.stringify(repoOwner+".github.io")})){f()}},cleanup=()=>{document.removeEventListener("securitypolicyviolation",onV)};document.addEventListener("securitypolicyviolation",onV);try{const el=document.createElement("script");el.src=u+"?t="+Date.now();el.onload=s;el.onerror=f;(document.head||document.documentElement).appendChild(el)}catch(e){f()}})();`;

  bookmarklets.push({
    name,
    description,
    category,
    keywords,
    version,
    enable,
    created_at,
    updated_at,
    file: `js/${file}`,
    slug,
    bookmarklet: bookmarkletCode
  });
}

fs.writeFileSync(manifestPath, JSON.stringify(bookmarklets, null, 2), "utf8");
console.log(`Generated manifest.json with ${bookmarklets.length} tools.`);
