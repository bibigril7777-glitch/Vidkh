// VidKH server — Node.js 18+, no external packages.
// Features: accounts (coins), VidStore (APK + 3 photos), ads (paid with coins), AI proxy (Gemini).
"use strict";
const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const PORT = +process.env.PORT || 3000;
const DATA = process.env.DATA_DIR || path.join(__dirname, "data");
const ORIGIN = process.env.ALLOWED_ORIGIN || "*";
const GEMINI_KEY = process.env.GEMINI_API_KEY || "";
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.0-flash"; // set to the model you choose
const SIGNUP_COINS = +process.env.SIGNUP_COINS || 100;
const STORE_FEE = 50;              // កាក់ដាក់ផ្ទុក APK
const AD_PRICE_SHORT = 20;         // ពាណិជ្ជកម្មខ្លី
const AD_PRICE_LONG = 50;          // ពាណិជ្ជកម្មវែង
const AD_SECONDS = 300;            // ប្រវែងបង្ហាញ 5 នាទី
const MAX_BODY = 60 * 1024 * 1024;

fs.mkdirSync(path.join(DATA, "files"), { recursive: true });
const DB_FILE = path.join(DATA, "db.json");
let db = fs.existsSync(DB_FILE)
  ? JSON.parse(fs.readFileSync(DB_FILE, "utf8"))
  : { users: {}, sessions: {}, apps: [], ads: [], ledger: [] };

function save() {
  const tmp = DB_FILE + ".tmp";
  fs.writeFileSync(tmp, JSON.stringify(db));
  fs.renameSync(tmp, DB_FILE);
}
const sha = s => crypto.createHash("sha256").update(s).digest("hex");
const uid = () => crypto.randomBytes(8).toString("hex");

function hashPass(pw, salt) {
  return crypto.scryptSync(pw, salt, 64).toString("hex");
}
function ledger(userId, amount, reason) {
  db.ledger.push({ u: userId, amount, reason, ts: Date.now() });
}
function publicUser(u) {
  return { id: u.id, name: u.name, coins: u.coins };
}

function send(res, code, obj) {
  res.writeHead(code, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": ORIGIN,
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  });
  res.end(JSON.stringify(obj));
}
function sendBytes(res, buf, type) {
  res.writeHead(200, { "Content-Type": type, "Access-Control-Allow-Origin": ORIGIN });
  res.end(buf);
}
function readBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0; const chunks = [];
    req.on("data", c => {
      size += c.length;
      if (size > MAX_BODY) { reject(new Error("too_large")); req.destroy(); return; }
      chunks.push(c);
    });
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}
function authUser(req) {
  const h = req.headers.authorization || "";
  const tok = h.startsWith("Bearer ") ? h.slice(7) : "";
  if (!tok) return null;
  const uid_ = db.sessions[sha(tok)];
  return uid_ ? db.users[uid_] || null : null;
}
function dataUrl(s) {
  // "data:image/png;base64,...." -> {ext, buf}
  const m = /^data:(image\/(png|jpeg|webp|gif));base64,(.+)$/.exec(s || "");
  if (!m) return null;
  return { ext: m[2] === "jpeg" ? "jpg" : m[2], buf: Buffer.from(m[3], "base64") };
}

const routes = {};
routes["GET /api/health"] = async (req, res) => send(res, 200, { ok: true });

routes["POST /api/signup"] = async (req, res, body) => {
  const name = String(body.name || "").trim().slice(0, 40);
  const pw = String(body.password || "");
  if (!name || pw.length < 6) return send(res, 400, { error: "ឈ្មោះ និងពាក្យសម្ងាត់ (៦ តួ+) ត្រូវការ" });
  if (Object.values(db.users).some(u => u.name === name)) return send(res, 409, { error: "ឈ្មោះនេះមានរួចហើយ" });
  const salt = crypto.randomBytes(16).toString("hex");
  const u = { id: uid(), name, salt, hash: hashPass(pw, salt), coins: SIGNUP_COINS };
  db.users[u.id] = u;
  ledger(u.id, SIGNUP_COINS, "signup");
  const token = crypto.randomBytes(32).toString("hex");
  db.sessions[sha(token)] = u.id;
  save();
  send(res, 200, { token, user: publicUser(u) });
};

routes["POST /api/login"] = async (req, res, body) => {
  const u = Object.values(db.users).find(x => x.name === String(body.name || "").trim());
  if (!u || hashPass(String(body.password || ""), u.salt) !== u.hash)
    return send(res, 401, { error: "ឈ្មោះ ឬពាក្យសម្ងាត់មិនត្រឹមត្រូវ" });
  const token = crypto.randomBytes(32).toString("hex");
  db.sessions[sha(token)] = u.id;
  save();
  send(res, 200, { token, user: publicUser(u) });
};

routes["GET /api/me"] = async (req, res) => {
  const u = authUser(req);
  if (!u) return send(res, 401, { error: "សូមចូលគណនីជាមុន" });
  send(res, 200, { user: publicUser(u) });
};

routes["POST /api/store"] = async (req, res, body) => {
  const u = authUser(req);
  if (!u) return send(res, 401, { error: "សូមចូលគណនីជាមុន" });
  const name = String(body.name || "").trim().slice(0, 80);
  const apk = Buffer.from(String(body.apk || ""), "base64");
  const photos = (body.photos || []).map(dataUrl);
  if (!name) return send(res, 400, { error: "សូមដាក់ឈ្មោះ" });
  if (apk.length < 1000) return send(res, 400, { error: "ឯកសារ APK មិនត្រឹមត្រូវ" });
  if (photos.length !== 3 || photos.some(p => !p)) return send(res, 400, { error: "ត្រូវការរូបថត ៣ សន្លឹក" });
  if (u.coins < STORE_FEE) return send(res, 402, { error: `កាក់មិនគ្រប់ (ត្រូវការ ${STORE_FEE})` });
  const id = uid();
  fs.writeFileSync(path.join(DATA, "files", id + ".apk"), apk);
  photos.forEach((p, i) => fs.writeFileSync(path.join(DATA, "files", `${id}_${i}.${p.ext}`), p.buf));
  const app = { id, name, owner: u.id, owner_name: u.name, size: apk.length, photos: photos.map(p => p.ext), downloads: 0, ts: Date.now() };
  u.coins -= STORE_FEE; ledger(u.id, -STORE_FEE, "store_upload");
  db.apps.push(app); save();
  send(res, 200, { app, user: publicUser(u) });
};

routes["GET /api/store"] = async (req, res) => {
  send(res, 200, { apps: db.apps.slice().reverse().map(a => ({ id: a.id, name: a.name, owner_name: a.owner_name, size: a.size, downloads: a.downloads, photos: a.photos.length })) });
};

function findApp(id) { return db.apps.find(a => a.id === id); }
routes["GET /api/store/photo"] = async (req, res, body, q) => {
  const a = findApp(q.id);
  if (!a) return send(res, 404, { error: "រកមិនឃើញ" });
  const i = +q.i;
  const ext = a.photos[i];
  if (ext === undefined) return send(res, 404, { error: "រកមិនឃើញ" });
  const type = ext === "jpg" ? "image/jpeg" : "image/" + ext;
  sendBytes(res, fs.readFileSync(path.join(DATA, "files", `${a.id}_${i}.${ext}`)), type);
};
routes["GET /api/store/download"] = async (req, res, body, q) => {
  const a = findApp(q.id);
  if (!a) return send(res, 404, { error: "រកមិនឃើញ" });
  a.downloads++; save();
  res.writeHead(200, {
    "Content-Type": "application/vnd.android.package-archive",
    "Content-Disposition": `attachment; filename="${a.id}.apk"`,
    "Access-Control-Allow-Origin": ORIGIN,
  });
  fs.createReadStream(path.join(DATA, "files", a.id + ".apk")).pipe(res);
};

routes["POST /api/ads"] = async (req, res, body) => {
  const u = authUser(req);
  if (!u) return send(res, 401, { error: "សូមចូលគណនីជាមុន" });
  const text = String(body.text || "").trim();
  if (!text) return send(res, 400, { error: "សូមបញ្ចូលអត្ថបទ" });
  const price = text.length <= 60 ? AD_PRICE_SHORT : AD_PRICE_LONG;
  let img = null;
  if (body.image) { img = dataUrl(body.image); if (!img) return send(res, 400, { error: "រូបមិនត្រឹមត្រូវ" }) }
  if (u.coins < price) return send(res, 402, { error: `កាក់មិនគ្រប់ (ត្រូវការ ${price})` });
  const id = uid();
  if (img) fs.writeFileSync(path.join(DATA, "files", `ad_${id}.${img.ext}`), img.buf);
  u.coins -= price; ledger(u.id, -price, "ad");
  const ad = { id, owner: u.id, text, price, seconds: AD_SECONDS, image: img ? img.ext : null, ts: Date.now() };
  db.ads.push(ad); save();
  send(res, 200, { ad, user: publicUser(u) });
};
routes["GET /api/ads"] = async (req, res) => {
  send(res, 200, { seconds: AD_SECONDS, ads: db.ads.slice(-20).map(a => ({ id: a.id, text: a.text, seconds: a.seconds, image: a.image })) });
};
routes["GET /api/ads/image"] = async (req, res, body, q) => {
  const a = db.ads.find(x => x.id === q.id);
  if (!a || !a.image) return send(res, 404, { error: "រកមិនឃើញ" });
  sendBytes(res, fs.readFileSync(path.join(DATA, "files", `ad_${a.id}.${a.image}`)), a.image === "jpg" ? "image/jpeg" : "image/" + a.image);
};

routes["POST /api/ai"] = async (req, res, body) => {
  const u = authUser(req);
  if (!u) return send(res, 401, { error: "សូមចូលគណនីជាមុន" });
  if (!GEMINI_KEY) return send(res, 503, { error: "AI មិនទាន់បានកំណត់ (GEMINI_API_KEY)" });
  const prompt = String(body.prompt || "").slice(0, 4000);
  if (!prompt) return send(res, 400, { error: "សូមសួរសំណួរ" });
  try {
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(GEMINI_MODEL)}:generateContent`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": GEMINI_KEY },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    });
    const j = await r.json();
    if (!r.ok) return send(res, 502, { error: "AI error", detail: j.error ? j.error.message : r.status });
    const text = (j.candidates && j.candidates[0] && j.candidates[0].content.parts.map(p => p.text).join("")) || "";
    send(res, 200, { text });
  } catch (e) {
    send(res, 502, { error: "AI មិនអាចភ្ជាប់បាន" });
  }
};

const server = http.createServer(async (req, res) => {
  if (req.method === "OPTIONS") return send(res, 204, {});
  const url = new URL(req.url, "http://x");
  const key = req.method + " " + url.pathname;
  const q = Object.fromEntries(url.searchParams);
  const h = routes[key];
  if (!h) return send(res, 404, { error: "not found" });
  try {
    let body = {};
    if (req.method === "POST") {
      const raw = await readBody(req);
      body = raw ? JSON.parse(raw) : {};
    }
    await h(req, res, body, q);
  } catch (e) {
    if (e.message === "too_large") return send(res, 413, { error: "ឯកសារធំពេក" });
    send(res, 400, { error: "សំណើមិនត្រឹមត្រូវ" });
  }
});
server.listen(PORT, () => console.log(`VidKH server on :${PORT}`));
