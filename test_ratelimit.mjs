const buckets = new Map();
const WINDOW_MS = 60 * 60 * 1000;
const MAX_ATTEMPTS = 5;

function checkRateLimit(key) {
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || now > bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, remaining: MAX_ATTEMPTS - 1 };
  }
  if (bucket.count >= MAX_ATTEMPTS) return { allowed: false, remaining: 0 };
  bucket.count += 1;
  return { allowed: true, remaining: MAX_ATTEMPTS - bucket.count };
}

// Simulate 7 attempts from same IP
const results = [];
for (let i = 0; i < 7; i++) results.push(checkRateLimit("1.2.3.4"));
console.log("7 attempts, same key:", results.map(r => r.allowed));
console.log("Expect first 5 true, last 2 false:",
  JSON.stringify(results.map(r => r.allowed)) === JSON.stringify([true,true,true,true,true,false,false]) ? "PASS" : "FAIL");

// Different IP unaffected
const other = checkRateLimit("9.9.9.9");
console.log("Different IP allowed after other IP maxed:", other.allowed ? "PASS" : "FAIL");

// getClientIp parsing
function getClientIp(headers) {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return headers.get("x-real-ip") || "unknown";
}
const h1 = new Map([["x-forwarded-for", "203.0.113.5, 10.0.0.1"]]);
h1.get = Map.prototype.get.bind(h1);
console.log("IP parse from x-forwarded-for chain:", getClientIp({get:(k)=>h1.get(k)}) === "203.0.113.5" ? "PASS" : "FAIL");
