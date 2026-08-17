const fs = require("fs");
const path = require("path");

const jsDir = path.join(__dirname, "../js");
const manifestPath = path.join(__dirname, "../manifest.json");

if (!fs.existsSync(jsDir)) {
  fs.mkdirSync(jsDir, { recursive: true });
}

const files = fs.readdirSync(jsDir).filter(file => file.endsWith(".js"));
const bookmarklets = [];

for (const file of files) {
  const filePath = path.join(jsDir, file);
  const content = fs.readFileSync(filePath, "utf8");
  
  const slug = path.basename(file, ".js");

  const getMeta = (key, type = "string") => {
    const regex = new RegExp(`@${key}\\s+(.+)`, "i");
    const match = content.match(regex);
    if (!match) return null;
    let val = match[1].trim();

    if (type === "boolean") {
      return val.toLowerCase() === "true";
    }
    if (type === "array") {
      return val.split(",").map(s => s.trim()).filter(Boolean);
    }
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
    slug
  });
}

fs.writeFileSync(manifestPath, JSON.stringify(bookmarklets, null, 2), "utf8");
console.log(`Generated manifest.json with ${bookmarklets.length} tools.`);
