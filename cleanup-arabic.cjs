/* eslint-disable */
// One-off cleanup for the Arabic block of translations.js:
//   - Replace em-dashes (—) with Arabic commas (،) inside Arabic text
//   - Replace mid-sentence "[Arabic]. [Arabic]" with "[Arabic]\n[Arabic]"
//   - Strip trailing periods that close an Arabic string literal
//   - Compress " ،" (space + Arabic comma) → "، " for clean Arabic comma usage
//
// Run: node cleanup-arabic.cjs
const fs = require("fs");
const path = require("path");

const file = path.join(__dirname, "src/i18n/translations.js");
let text = fs.readFileSync(file, "utf8");

const arStart = text.search(/^  ar: \{/m);
if (arStart < 0) {
  console.error("Could not locate `  ar: {` block — aborting.");
  process.exit(1);
}

const head = text.slice(0, arStart);
let body = text.slice(arStart);

const AR = "؀-ۿݐ-ݿࢠ-ࣿﭐ-﷿ﹰ-﻿";
const arChar = `[${AR}]`;

// 1. Em-dash sandwiched between Arabic text (and surrounded by spaces) → ،
//    "نص — نص" → "نص، نص"
let emDashCount = 0;
body = body.replace(
  new RegExp(`(${arChar}) — (?=${arChar})`, "g"),
  (_, a) => {
    emDashCount++;
    return a + "، ";
  }
);
// Em-dash before non-Arabic (e.g., date) — also use Arabic comma
body = body.replace(
  new RegExp(`(${arChar}) — `, "g"),
  (_, a) => {
    emDashCount++;
    return a + "، ";
  }
);

// 2. Mid-sentence period: "X. Y" where X is Arabic and Y is Arabic — split with \n
let midPeriodCount = 0;
body = body.replace(
  new RegExp(`(${arChar})\\. (?=${arChar})`, "g"),
  (_, a) => {
    midPeriodCount++;
    return a + "\\n";
  }
);

// 3. Trailing period that ends an Arabic string literal:
//    "نص." → "نص"   and    "نص."  →  "نص"
let trailingPeriodCount = 0;
body = body.replace(
  new RegExp(`(${arChar})\\.(?=["'])`, "g"),
  (_, a) => {
    trailingPeriodCount++;
    return a;
  }
);

// 4. Normalise stray " ،" (space-then-comma) into "، "
//    (no-op for already-correct copy)
const strayComma = (body.match(/ ،/g) || []).length;
body = body.replace(/ ،/g, "،");

fs.writeFileSync(file, head + body, "utf8");

console.log("Em-dashes replaced:        ", emDashCount);
console.log("Mid-sentence periods → \\n:", midPeriodCount);
console.log("Trailing periods removed:  ", trailingPeriodCount);
console.log("Stray ' ،' normalised:    ", strayComma);
