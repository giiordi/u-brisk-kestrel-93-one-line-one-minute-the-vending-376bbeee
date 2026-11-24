// One Line, One Minute: The Vending Machine Pickup Line Contest
// Entry program: validates the gate, then writes one pickup line
// (spoken by the vending machine itself) to $MAKEFUN_OUTPUT_DIR/entry.txt.
// Node.js standard library only. No trailing newline: the gate counts
// characters 1..200, and the line is the whole file.

const fs = require("node:fs");
const path = require("node:path");

// The entry: a vending machine flirting with a passing human.
// Machine's own world: exact change, coils, the B7 button, its hum.
// Punch lands in the last few words; charming, never creepy.
const ENTRY =
  "Hey, gorgeous \u2014 you must be exact change, because the second you walked by, " +
  "my coils started spinning and my B7 light hasn't stopped blinking.";

const MAX_CHARS = 200;

function fail(message) {
  process.stderr.write("entry invalid: " + message + "\n");
  process.exit(1);
}

// Gate: 1 to 200 characters, not only whitespace, valid UTF-8 text.
const chars = [...ENTRY];
if (chars.length < 1 || chars.length > MAX_CHARS) {
  fail("line is " + chars.length + " characters, gate wants 1 to 200");
}
if (ENTRY.trim().length === 0) {
  fail("line is only whitespace");
}
if (ENTRY.includes("\n") || ENTRY.includes("\r")) {
  fail("line must be a single line");
}
// No control characters: a pickup line is plain speakable text.
for (const ch of ENTRY) {
  if (ch.charCodeAt(0) < 0x20 && ch !== "\t") {
    fail("line contains a control character");
  }
}
// Sanity guard: the line must speak from the machine's own world,
// not generic love talk — at least one machine word must be present.
const MACHINE_WORDS = ["coil", "slot", "button", "snack", "hum", "exact change", "B7", "vend"];
if (!MACHINE_WORDS.some((w) => ENTRY.toLowerCase().includes(w))) {
  fail("line does not use the machine's own world");
}
if (Buffer.from(ENTRY, "utf8").toString("utf8") !== ENTRY) {
  fail("line is not valid UTF-8 text");
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
fs.mkdirSync(outDir, { recursive: true });
const outPath = path.join(outDir, "entry.txt");
fs.writeFileSync(outPath, ENTRY, "utf8");

console.log("wrote " + chars.length + " characters to " + outPath);
