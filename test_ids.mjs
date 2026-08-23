import crypto from "crypto";
import bcrypt from "bcryptjs";

const ID_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function generatePublicReportId() {
  let code = "";
  for (let i = 0; i < 6; i++) code += ID_CHARS[crypto.randomInt(0, ID_CHARS.length)];
  return `AR-${code}`;
}
function generateSecretCode() {
  return crypto.randomBytes(8).toString("hex").slice(0, 10).toUpperCase();
}

// Test 1: format correctness
let idOk = true, secretOk = true;
for (let i = 0; i < 10000; i++) {
  const id = generatePublicReportId();
  if (!/^AR-[A-HJ-NP-Z2-9]{6}$/.test(id)) { idOk = false; console.log("BAD ID:", id); }
  const s = generateSecretCode();
  if (!/^[0-9A-F]{10}$/.test(s)) { secretOk = false; console.log("BAD SECRET:", s); }
}
console.log("ID format check (10k samples):", idOk ? "PASS" : "FAIL");
console.log("Secret format check (10k samples):", secretOk ? "PASS" : "FAIL");

// Test 2: collision rate sanity (36^6 possible ids minus ambiguous chars = 33^6 ≈ 1.29 billion space)
const seen = new Set();
let collisions = 0;
for (let i = 0; i < 100000; i++) {
  const id = generatePublicReportId();
  if (seen.has(id)) collisions++;
  seen.add(id);
}
console.log("Collisions in 100k samples (space ~1.29B):", collisions, collisions === 0 ? "PASS (expected)" : "check retry logic covers this");

// Test 3: bcrypt hash/verify round trip
const secret = generateSecretCode();
const hash = await bcrypt.hash(secret, 10);
const validMatch = await bcrypt.compare(secret, hash);
const wrongMatch = await bcrypt.compare("WRONGCODE1", hash);
console.log("Correct secret verifies:", validMatch ? "PASS" : "FAIL");
console.log("Wrong secret rejected:", !wrongMatch ? "PASS" : "FAIL");

// Test 4: case sensitivity check matches route logic (route does .trim() only, not case normalization on secret)
console.log("Note: secret code comparison is case-sensitive (bcrypt compares exact string) — track route does NOT uppercase user's secret input before compare, only trims. Verify UI doesn't alter case.");
