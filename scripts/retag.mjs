// =====================================================================
//  RECLASSIFICA OS CANAIS JÁ SALVOS (NÃO GASTA COTA, NÃO PRECISA DE CHAVE)
//  Refaz "mine" e as tags de data/state.json e site/data/channels.json
//  usando os títulos que já estão guardados.
//    node scripts/retag.mjs            -> grava os arquivos
//    node scripts/retag.mjs --teste    -> só mostra o que mudaria
// =====================================================================
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { MY_NICHE } from '../config/niches.mjs';
import { retagRecord } from './classify.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const STATE_FILE = path.join(ROOT, 'data/state.json');
const OUT_FILE = path.join(ROOT, 'site/data/channels.json');
const DRY = process.argv.includes('--teste');

const load = async f => { try { return JSON.parse(await fs.readFile(f, 'utf8')); } catch { return null; } };
const state = await load(STATE_FILE);
const site = await load(OUT_FILE);
if (!state && !site) { console.log('Nenhum dado salvo ainda. Nada a fazer.'); process.exit(0); }

const before = new Map();
const remember = c => { if (!before.has(c.id)) before.set(c.id, { mine: !!c.mine, tags: [...(c.tags || [])], title: c.title }); };

// 1. memória do robô
for (const r of Object.values(state?.tracked || {})) { remember(r); retagRecord(r); }

// 2. o que o site mostra (copia do state quando existir; senão usa os títulos do "top")
for (const c of site?.channels || []) {
  remember(c);
  const r = state?.tracked?.[c.id];
  if (r) { c.tags = [...r.tags]; c.mine = r.mine; }
  else { retagRecord(c); delete c.found; }
}

// relatório
const now = new Map();
for (const r of Object.values(state?.tracked || {})) now.set(r.id, r);
for (const c of site?.channels || []) now.set(c.id, c);
const out = [], kept = [], changed = [];
for (const [id, b] of before) {
  const a = now.get(id);
  if (b.mine && !a.mine) out.push(`  ❌ ${b.title}  →  ${a.tags.join(', ') || '(sem nicho: só em "Todos")'}`);
  else if (a.mine) kept.push(`  ✅ ${b.title}  →  ${a.tags.filter(t => t.startsWith(MY_NICHE.id + '|')).join(', ')}`);
  if (b.tags.join() !== a.tags.join()) changed.push(id);
}
console.log(`\nSaíram do ${MY_NICHE.name} (${out.length}):\n${out.join('\n') || '  nenhum'}`);
console.log(`\nContinuam no ${MY_NICHE.name} (${kept.length}):\n${kept.join('\n') || '  nenhum'}`);
console.log(`\n${changed.length} de ${before.size} canais tiveram as tags ajustadas.`);

if (DRY) { console.log('\n(modo teste: nada foi gravado)'); process.exit(0); }
if (state) await fs.writeFile(STATE_FILE, JSON.stringify(state));
if (site) await fs.writeFile(OUT_FILE, JSON.stringify(site));
console.log('✅ Arquivos atualizados.');
