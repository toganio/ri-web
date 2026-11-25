// Cloudflare Pages için dist/_headers: başlıkların tek kaynağı firebase.json'dur, burada çevrilir.
// "**" → "/*", "**/*.@(a|b)" → "/*.a" ve "/*.b". HTML için no-cache kuralı (regex) çevrilmez:
// Cloudflare Pages varsayılanı zaten "public, max-age=0, must-revalidate".
import { readFileSync } from 'node:fs';

export function cfHeaders(firebaseJsonPath) {
  const rules = JSON.parse(readFileSync(firebaseJsonPath, 'utf8')).hosting.headers || [];
  const out = [];
  for (const r of rules) {
    if (!r.source) continue;
    let paths;
    const ext = r.source.match(/^\*\*\/\*\.@\(([\w|]+)\)$/);
    if (r.source === '**') paths = ['/*'];
    else if (ext) paths = ext[1].split('|').map((e) => `/*.${e}`);
    else throw new Error(`firebase.json başlık kuralı Cloudflare'e çevrilemedi: ${r.source}`);
    for (const p of paths) out.push(p, ...r.headers.map((h) => `  ${h.key}: ${h.value}`), '');
  }
  return out.join('\n');
}
