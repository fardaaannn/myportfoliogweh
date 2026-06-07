// Daftar origin yang diizinkan. Bisa di-override lewat env var ALLOWED_ORIGINS
// (dipisah koma), mis: "https://bukankahhini.my.id,https://fardaaannn.github.io"
const DEFAULT_ALLOWED_ORIGINS = [
  "https://bukankahhini.my.id",
  "https://www.bukankahhini.my.id",
  "https://fardaaannn.github.io",
];

function getAllowedOrigins() {
  const fromEnv = (process.env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);
  return fromEnv.length > 0 ? fromEnv : DEFAULT_ALLOWED_ORIGINS;
}

// Rate limiter sederhana berbasis memori (per instance serverless).
// Ini bukan proteksi sempurna, tapi cukup untuk mencegah penyalahgunaan ringan.
const RATE_LIMIT_MAX = 15; // maksimum request
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // per 60 detik
const rateLimitStore = new Map(); // ip -> { count, resetAt }

function isRateLimited(ip) {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  entry.count += 1;
  if (entry.count > RATE_LIMIT_MAX) {
    return true;
  }
  return false;
}

function getClientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.length > 0) {
    return forwarded.split(",")[0].trim();
  }
  return req.socket?.remoteAddress || "unknown";
}

export default async function handler(req, res) {
  const allowedOrigins = getAllowedOrigins();
  const origin = req.headers.origin;
  const isAllowedOrigin = origin && allowedOrigins.includes(origin);

  // Hanya echo origin yang ada di allowlist. Kalau tidak cocok, jangan set
  // header CORS sehingga browser memblokir request dari domain asing.
  if (isAllowedOrigin) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
    res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  }

  if (req.method === "OPTIONS") {
    res.status(isAllowedOrigin ? 204 : 403).end();
    return;
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Tolak request dengan Origin yang tidak diizinkan. Request tanpa Origin
  // (mis. dari server/tools) juga ditolak agar endpoint tidak jadi open proxy.
  if (!isAllowedOrigin) {
    return res.status(403).json({ error: "Origin tidak diizinkan" });
  }

  const ip = getClientIp(req);
  if (isRateLimited(ip)) {
    res.setHeader("Retry-After", "60");
    return res
      .status(429)
      .json({ error: "Terlalu banyak request. Coba lagi sebentar lagi." });
  }

  if (!process.env.SUMOPOD_API_KEY) {
    console.error("SUMOPOD_API_KEY belum di-set di environment variables");
    return res.status(500).json({ error: "Server belum dikonfigurasi" });
  }

  const body = req.body || {};
  const MAX_CHARS = 4000; // batas panjang per pesan
  const MAX_TURNS = 12; // batas jumlah turn yang diteruskan ke model

  // Bangun daftar messages. Mendukung dua format:
  //  - Baru (multi-turn): { system, messages: [{ role, content }, ...] }
  //  - Lama (single)    : { message: "..." }
  let chatMessages;

  if (Array.isArray(body.messages) && body.messages.length > 0) {
    chatMessages = [];

    if (typeof body.system === "string" && body.system.trim()) {
      chatMessages.push({
        role: "system",
        content: body.system.slice(0, 8000),
      });
    }

    // Hanya teruskan turn terbaru supaya biaya & latensi terkendali.
    for (const m of body.messages.slice(-MAX_TURNS)) {
      if (!m || typeof m.content !== "string" || !m.content.trim()) continue;
      const role =
        m.role === "assistant" || m.role === "system" ? m.role : "user";
      chatMessages.push({ role, content: m.content.slice(0, MAX_CHARS) });
    }

    if (chatMessages.filter((m) => m.role !== "system").length === 0) {
      return res.status(400).json({ error: "Message is required" });
    }
  } else if (typeof body.message === "string" && body.message.trim()) {
    if (body.message.length > MAX_CHARS) {
      return res.status(400).json({ error: "Message terlalu panjang" });
    }
    chatMessages = [{ role: "user", content: body.message }];
  } else {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const response = await fetch(
      "https://api.sumopod.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.SUMOPOD_API_KEY}`,
        },
        body: JSON.stringify({
          model: "deepseek-r1",
          messages: chatMessages,
          // deepseek-r1 "berpikir" dulu sebelum menjawab, jadi token harus
          // cukup besar agar jawaban final tidak terpotong.
          max_tokens: 1500,
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Sumopod API Error:", data);
      return res
        .status(response.status)
        .json({ error: data.error?.message || "API error" });
    }

    // deepseek-r1 adalah reasoning model: jawabannya bisa diawali blok
    // <think>...</think>. Buang blok itu supaya user hanya melihat jawaban.
    const raw = data.choices?.[0]?.message?.content || "";
    const cleaned = raw.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();
    const responseText = cleaned || raw.trim() || "No response";

    res.status(200).json({ response: responseText });
  } catch (error) {
    console.error("Sumopod API Error:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
}
