const fs = require("fs");
const path = require("path");
const { minify } = require("terser");

const jsDir = path.join(__dirname, "../js");
const manifestPath = path.join(__dirname, "../manifest.json");
const repoOwner = "jimajimax";
const repoName = "bookmarklets";
const baseUrl = `https://${repoOwner}.github.io/${repoName}/`;

if (!fs.existsSync(jsDir)) {
   fs.mkdirSync(jsDir, { recursive: true });
}

const files = fs.readdirSync(jsDir).filter(file => file.endsWith(".js"));

(async () => {
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

      // 1. 外部読み込みを試行
      // 2. CSP violation / 読み込み失敗 / 例外 発生時にインライン本体を実行
      const minifiedBody = await minify(rawContent, {
         compress: {
            drop_console: false,
            passes: 2
         },
         mangle: true,
         format: {
            comments: false
         }
      });

      const scriptUrl = `${baseUrl}js/${file}`;
      const rawBookmarklet = `
(() => {
const scriptUrl = ${JSON.stringify(scriptUrl)};
const runInline = () => {${minifiedBody.code}};
let handled = false;
const fallbackToInline = () => {
  if (handled) return;
  handled = true;
  cleanup();
  runInline();
};
const handleSuccess = () => {
  if (handled) return;
  handled = true;
  cleanup();
};
const handleSecurityPolicyViolation = (event) => {
  if (event.blockedURI && event.blockedURI.includes(${JSON.stringify(repoOwner + ".github.io")})) {
    fallbackToInline();
  }
};
const cleanup = () => {
  document.removeEventListener("securitypolicyviolation", handleSecurityPolicyViolation  );
};
document.addEventListener("securitypolicyviolation", handleSecurityPolicyViolation);
try {
  const script = document.createElement("script");
  script.src = scriptUrl + "?t=" + Date.now();
  script.onload = handleSuccess;
  script.onerror = fallbackToInline;
  (document.head || document.documentElement).appendChild(script);
} catch (error) {
  fallbackToInline();
}
})();
`;

      const finalMinified = await minify(rawBookmarklet, {
         compress: {
            passes: 2
         },
         mangle: true,
         format: {
            comments: false
         }
      });

      const bookmarkletCode = `javascript:${finalMinified.code}/*(最新vは${scriptUrl}の@versionに記載) このinlineはv${version}*/`;

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
})();
