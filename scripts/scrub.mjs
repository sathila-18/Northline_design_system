// pnpm scrub (CLAUDE.md, "Scrub check").
// Searches every tracked file, and the commit messages on the current branch, for:
//   1. the words in scripts/scrub-words.txt (private, not committed; the check fails without it),
//   2. anything that looks like a Figma URL, file key or node ID.
// Known, allowed spans are removed from each line before checking (ALLOWED below).
// Exits 1 if anything is found.
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const wordsPath = fileURLToPath(new URL('scrub-words.txt', import.meta.url));
const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });

if (!existsSync(wordsPath)) {
  console.error('FAIL: scripts/scrub-words.txt is missing. Ask the designer for it (CLAUDE.md, "Scrub check").');
  process.exit(1);
}

// Word list: one entry per line, blank lines and # comments skipped. Plain entries match case-insensitively.
// Entries starting with "re:" are regular expressions; they are case-sensitive only if they contain [A-Z].
const words = readFileSync(wordsPath, 'utf8')
  .split(/\r?\n/)
  .map((line) => line.trim())
  .filter((line) => line && !line.startsWith('#'))
  .map((entry) => {
    if (entry.startsWith('re:')) {
      const source = entry.slice(3);
      return { label: 'word', pattern: new RegExp(source, source.includes('[A-Z]') ? 'g' : 'gi') };
    }
    return { label: 'word', pattern: new RegExp(entry.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi') };
  });

// Patterns for anything that looks like it came from a Figma file.
const FIGMA_CHECKS = [
  { label: 'the word Figma or a Figma URL', pattern: /figma/gi },
  { label: 'node ID', pattern: /\bI?\d+:\d+(?:;\d+:\d+)*\b/g },
  { label: 'node-id parameter', pattern: /node-id/gi },
  {
    label: 'file key (22+ letters and digits)',
    pattern: /\b(?=[A-Za-z0-9]*\d)(?=[A-Za-z0-9]*[A-Za-z])[A-Za-z0-9]{22,}\b/g,
  },
];

// Allowed spans, removed from a line before the checks run. Nothing here comes from the private word list.
const ALLOWED = [
  /https:\/\/fonts\.google\.com\/icons/g, // icon font link (DESIGN.md §1)
  /https:\/\/www\.designtokens\.org\/tr\/2025\.10\/format\//g, // DTCG spec URL (token file, audit)
  // Sentences saying no Figma file is used (DESIGN.md §1 and D2, CLAUDE.md "Before any task")
  /There is no Figma file for this demo/g,
  /The token JSON plays the part of the Figma export/g,
  /This repo never connects to that Figma file/g,
  /No Figma file\. The token JSON/g,
  /Never connect to Figma from this repo/g,
  /never write a Figma file key, node ID or URL into it/g,
  /\b\d{4}-\d{2}-\d{2}[ T]\d{1,2}:\d{2}(?::\d{2})?\b/g, // dates with times (build log)
  /\b\d+(?:\.\d+)?:1\b/g, // contrast ratios (4.5:1)
  /Co-Authored-By: Claude [\w .]+ <noreply@anthropic\.com>/g, // commit attribution line
  /\bsha\d+-[A-Za-z0-9+/=]+/g, // package integrity hashes in pnpm-lock.yaml
];

// This file defines the Figma patterns above, so only the word list is checked in it.
const WORDS_ONLY = new Set(['scripts/scrub.mjs']);

const hits = [];
function scan(name, text, checks) {
  text.split(/\r?\n/).forEach((original, index) => {
    let line = original;
    for (const allowed of ALLOWED) line = line.replace(allowed, ' ');
    for (const { label, pattern } of checks) {
      pattern.lastIndex = 0;
      for (const match of line.matchAll(pattern)) {
        hits.push(`${name}:${index + 1} [${label}] "${match[0]}"  ${original.trim().slice(0, 140)}`);
      }
    }
  });
}

const files = git('ls-files', '-z').split('\0').filter(Boolean);
for (const file of files) {
  const path = `${root}/${file}`;
  if (!existsSync(path)) continue; // deleted in the working tree but not yet committed
  const buffer = readFileSync(path);
  if (buffer.includes(0)) continue; // binary
  scan(file, buffer.toString('utf8'), WORDS_ONLY.has(file) ? words : [...words, ...FIGMA_CHECKS]);
}

let range = 'HEAD';
try {
  git('rev-parse', '--verify', '--quiet', 'origin/main');
  range = 'origin/main..HEAD';
} catch {
  // no origin/main yet: check every commit
}
const messages = git('log', '--format=%H%n%B%x00', range)
  .split('\0')
  .filter((m) => m.trim());
for (const message of messages) {
  const [hash = '', ...body] = message.trim().split('\n');
  scan(`commit ${hash.slice(0, 7)}`, body.join('\n'), [...words, ...FIGMA_CHECKS]);
}

if (hits.length > 0) {
  console.error(`Scrub found ${hits.length} hit(s). Stop and tell the designer (CLAUDE.md, "Scrub check").`);
  for (const hit of hits) console.error(`  ${hit}`);
  process.exit(1);
}
console.log(`Scrub passed: ${files.length} tracked files and ${messages.length} commit message(s) on ${range}.`);
