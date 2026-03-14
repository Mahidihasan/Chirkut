import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const envPath = path.join(root, ".env");

const required = [
  "VITE_FIREBASE_API_KEY",
  "VITE_FIREBASE_AUTH_DOMAIN",
  "VITE_FIREBASE_PROJECT_ID",
  "VITE_FIREBASE_STORAGE_BUCKET",
  "VITE_FIREBASE_MESSAGING_SENDER_ID",
  "VITE_FIREBASE_APP_ID",
];

if (!fs.existsSync(envPath)) {
  console.error("Missing .env file. Create it from .env.example before deployment.");
  process.exit(1);
}

const raw = fs.readFileSync(envPath, "utf8");
const envMap = new Map();

for (const line of raw.split(/\r?\n/)) {
  const clean = line.trim();
  if (!clean || clean.startsWith("#")) continue;
  const idx = clean.indexOf("=");
  if (idx <= 0) continue;
  const key = clean.slice(0, idx).trim();
  const value = clean.slice(idx + 1).trim();
  envMap.set(key, value);
}

const missing = required.filter((k) => !envMap.get(k));
if (missing.length > 0) {
  console.error("Missing required environment variables:");
  for (const key of missing) {
    console.error(`- ${key}`);
  }
  process.exit(1);
}

console.log("Environment validation passed.");
