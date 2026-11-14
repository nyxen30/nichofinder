// =====================================================================
//  ROBÔ DO NICHE FINDER
//  Roda 1x por dia (GitHub Actions). Busca vídeos longos recentes em todos
//  os nichos, acha canais novos que estão performando, e grava:
//    site/data/channels.json  -> o que o site mostra
//    data/state.json          -> memória do robô (rodízio, canais já vistos)
// =====================================================================
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { NICHES, MY_NICHE, LANGS } from '../config/niches.mjs';
import { retagRecord } from './classify.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const STATE_FILE = path.join(ROOT, 'data/state.json');
const OUT_FILE = path.join(ROOT, 'site/data/channels.json');
const env = process.env;

const CFG = {
  searchWindowDays: +env.SEARCH_WINDOW_DAYS || 30,   // busca vídeos publicados nos últimos N dias
  trackDays: +env.TRACK_DAYS || 45,                  // guarda canais criados há até N dias (o site filtra 21 por padrão)
  budgetPerKey: +env.BUDGET_PER_KEY || 9300,         // cota grátis = 10.000 unidades/dia por chave
  othersPerRun: +env.OTHERS_PER_RUN || 50,           // buscas de outros nichos por dia (cada uma = 100 unidades)
  refreshReserve: +env.REFRESH_RESERVE || 1200,      // unidades guardadas para atualizar os canais já achados
  minLongSeconds: +env.MIN_LONG_SECONDS || 240,      // vídeo "longo" = 4 min ou mais
  minVideoViews: +env.MIN_VIDEO_VIEWS || 2000,       // vídeo precisa disso para o canal ser analisado
  minBestViews: +env.MIN_BEST_VIEWS || 5000,         // canal só aparece se o melhor vídeo longo passar disso
  minLongShare: +env.MIN_LONG_SHARE || 0.7,          // >=70% das views vêm de vídeos longos (corta canal de Shorts)
  maxUploadPages: 4,                                 // até 200 vídeos por canal
};

// aceita vírgula, espaço, ponto e vírgula ou quebra de linha entre as chaves, e ignora aspas
const KEYS = (env.YT_API_KEYS || env.YT_API_KEY || '').split(/[\s,;]+/).map(s => s.replace(/["']/g, '').trim()).filter(Boolean);
if (!KEYS.length) {
  console.error('❌ Falta a chave. Cadastre o secret YT_API_KEY no GitHub (Settings > Secrets and variables > Actions).');
  process.exit(1);
}

const DAY = 864e5;
const now = Date.now();
const daysAgo = iso => (now - new Date(iso).getTime()) / DAY;
const chunk = (a, n) => Array.from({ length: Math.ceil(a.length / n) }, (_, i) => a.slice(i * n, i * n + n));

// ---------------------------------------------------------------- API + cota
const COST = { search: 100, videos: 1, channels: 1, playlistItems: 1 };
const used = KEYS.map(() => 0);
const badKeys = [];
let keyIdx = 0;
class QuotaOut extends Error {}

function budgetLeft() {
  let left = 0;
  for (let i = keyIdx; i < KEYS.length; i++) left += CFG.budgetPerKey - used[i];
  return left;
}

async function yt(endpoint, params) {
  while (keyIdx < KEYS.length) {
    if (used[keyIdx] + COST[endpoint] > CFG.budgetPerKey) { keyIdx++; continue; }
    const url = new URL('https://www.googleapis.com/youtube/v3/' + endpoint);
    for (const [k, v] of Object.entries(params)) if (v !== undefined && v !== null) url.searchParams.set(k, v);
    url.searchParams.set('key', KEYS[keyIdx]);
    used[keyIdx] += COST[endpoint];
    let r;
    try { r = await fetch(url); } catch (e) { await new Promise(s => setTimeout(s, 1500)); r = await fetch(url); }
    if (r.ok) return r.json();
    const body = await r.json().catch(() => ({}));
    const reason = body?.error?.errors?.[0]?.reason || '';
    if ((r.status === 403 || r.status === 429) && /quota|dailyLimit|rateLimit/i.test(reason)) {
      console.warn(`⚠️ chave ${keyIdx + 1} sem cota (${reason}), tentando a próxima`);
      used[keyIdx] = CFG.budgetPerKey; keyIdx++; continue;
    }
    if (r.status === 404) return { items: [] };
    // problema na CHAVE (inválida, API não ativada, bloqueada): avisa e passa para a próxima
    const msg = body?.error?.message || '';
    if ((r.status === 400 && /key/i.test(msg)) || (r.status === 403 && /accessNotConfigured|forbidden|ipRefererBlocked|keyInvalid|API key|has not been used|disabled/i.test(reason + ' ' + msg))) {
      const why = /accessNotConfigured|has not been used|disabled/i.test(reason + ' ' + msg)
        ? 'a YouTube Data API v3 não está ativada no projeto dessa chave (Google Cloud > APIs e serviços > Biblioteca > Ativar)'
        : /ipRefererBlocked|referer|blocked/i.test(reason + ' ' + msg)
          ? 'a chave tem restrição de site/IP; em "Restrições de aplicativo" deixe "Nenhuma"'
          : 'a chave é inválida (copiada pela metade ou com caractere a mais)';
      console.log(`::warning::Chave ${keyIdx + 1} de ${KEYS.length} com problema: ${why}. [${r.status} ${reason}]`);
      badKeys.push(keyIdx + 1);
      used[keyIdx] = CFG.budgetPerKey; keyIdx++; continue;
    }
    throw new Error(`${endpoint} ${r.status} ${reason} ${msg}`);
  }
  if (badKeys.length === KEYS.length) {
    throw new Error(`Nenhuma chave funcionou (${KEYS.length} cadastrada${KEYS.length > 1 ? 's' : ''}). Veja os avisos acima e confira o secret.`);
  }
  throw new QuotaOut('cota do dia esgotada');
}

async function pool(items, n, fn) {
  const out = []; let i = 0;
  await Promise.all(Array.from({ length: Math.min(n, items.length) }, async () => {
    while (i < items.length) { const j = i++; out[j] = await fn(items[j], j); }
  }));
  return out;
}

const parseDur = d => {
  const m = /P(?:(\d+)D)?T?(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/.exec(d || '') || [];
  return (+m[1] || 0) * 86400 + (+m[2] || 0) * 3600 + (+m[3] || 0) * 60 + (+m[4] || 0);
};

// ---------------------------------------------------------------- estado
async function loadJSON(file, fallback) {
  try { return JSON.parse(await fs.readFile(file, 'utf8')); } catch { return fallback; }
}
const state = await loadJSON(STATE_FILE, {});
state.cursor ??= 0;
state.runs ??= 0;
state.tracked ??= {};   // canais novos sendo acompanhados
state.rejected ??= {};  // canais descartados (não gasta cota de novo por 30 dias)
state.lastSearched ??= {};

// limpa descartados antigos
for (const [id, r] of Object.entries(state.rejected)) if (daysAgo(r.at) > 30) delete state.rejected[id];

// ---------------------------------------------------------------- monta as buscas do dia
const myOrder = state.runs % 2 ? 'relevance' : 'viewCount';
const myJobs = [];
for (const s of MY_NICHE.subs) for (const lang of Object.keys(LANGS))
  myJobs.push({ niche: MY_NICHE.id, sub: s.id, lang, q: s.q[lang], order: myOrder, mine: true });

const all = [];
for (const n of NICHES) for (const s of n.subs) for (const lang of Object.keys(LANGS))
  all.push({ niche: n.id, sub: s.id, lang, q: s.q[lang] });
const others = [];
for (let k = 0; k < Math.min(CFG.othersPerRun, all.length); k++) {
  const idx = (state.cursor + k) % all.length;
  const cycle = Math.floor((state.cursor + k) / all.length);
  others.push({ ...all[idx], order: cycle % 2 ? 'relevance' : 'viewCount' });
}

const publishedAfter = new Date(now - CFG.searchWindowDays * DAY).toISOString().replace(/\.\d+Z$/, 'Z');
console.log(`▶️ Rodada ${state.runs + 1}: ${myJobs.length} buscas do meu nicho + ${others.length} de outros nichos. Chaves: ${KEYS.length}`);

// ---------------------------------------------------------------- 1. buscas
const hits = new Map(); // videoId -> [{niche, sub, lang, mine}]
let searchesDone = 0, othersDone = 0;
const runJob = async job => {
  const res = await yt('search', {
    part: 'snippet', type: 'video', order: job.order, q: job.q, maxResults: 50,
    publishedAfter, relevanceLanguage: job.lang, regionCode: LANGS[job.lang].region,
  });
  searchesDone++;
  state.lastSearched[`${job.niche}|${job.sub}|${job.lang}`] = new Date(now).toISOString();
  for (const it of res.items || []) {
    const id = it.id?.videoId; if (!id) continue;
    if (!hits.has(id)) hits.set(id, []);
    hits.get(id).push({ niche: job.niche, sub: job.sub, lang: job.lang, mine: !!job.mine });
  }
};

try {
  for (const job of myJobs) {
    if (budgetLeft() < CFG.refreshReserve + COST.search) break;
    await runJob(job);
  }
  for (const job of others) {
    if (budgetLeft() < CFG.refreshReserve + COST.search) break;
    await runJob(job); othersDone++;
  }
} catch (e) {
  if (!(e instanceof QuotaOut)) throw e;
  console.warn('⚠️ cota acabou durante as buscas');
}
state.cursor = (state.cursor + othersDone) % (all.length * 2);
console.log(`🔎 ${searchesDone} buscas, ${hits.size} vídeos encontrados`);

// ---------------------------------------------------------------- 2. detalhes dos vídeos encontrados
const candChannels = new Map(); // channelId -> tags
try {
  for (const ids of chunk([...hits.keys()], 50)) {
    const res = await yt('videos', { part: 'snippet,contentDetails,statistics', id: ids.join(',') });
    for (const v of res.items || []) {
      const secs = parseDur(v.contentDetails?.duration);
      const views = +v.statistics?.viewCount || 0;
      if (secs < CFG.minLongSeconds || views < CFG.minVideoViews) continue;
      const ch = v.snippet.channelId;
      if (!candChannels.has(ch)) candChannels.set(ch, []);
      candChannels.get(ch).push(...hits.get(v.id));
    }
  }
} catch (e) { if (!(e instanceof QuotaOut)) throw e; }

// junta as buscas em que o canal apareceu (rec.found); separa os realmente novos.
// rec.tags e rec.mine NÃO vêm mais direto da busca: são decididos no fim,
// conferindo os títulos do canal (scripts/classify.mjs).
const addTags = (rec, tags) => {
  rec.found ??= [...(rec.tags || [])];
  for (const t of tags) {
    const key = `${t.niche}|${t.sub}`;
    if (!rec.found.includes(key)) rec.found.push(key);
    rec.langs ??= [];
    if (!rec.langs.includes(t.lang)) rec.langs.push(t.lang);
  }
};
const fresh = [];
for (const [id, tags] of candChannels) {
  if (state.tracked[id]) addTags(state.tracked[id], tags);
  else if (!state.rejected[id]) fresh.push([id, tags]);
}
console.log(`📺 ${candChannels.size} canais com vídeo longo forte; ${fresh.length} nunca vistos`);

// ---------------------------------------------------------------- 3. checa idade dos canais novos
const toAnalyze = [];
try {
  for (const group of chunk(fresh, 50)) {
    const res = await yt('channels', { part: 'snippet,statistics,contentDetails', id: group.map(g => g[0]).join(',') });
    const byId = Object.fromEntries((res.items || []).map(c => [c.id, c]));
    for (const [id, tags] of group) {
      const c = byId[id];
      if (!c) { state.rejected[id] = { at: new Date(now).toISOString(), why: 'sumiu' }; continue; }
      if (daysAgo(c.snippet.publishedAt) > CFG.trackDays) {
        state.rejected[id] = { at: new Date(now).toISOString(), why: 'antigo' }; continue;
      }
      const rec = { id, discoveredAt: new Date(now).toISOString() };
      addTags(rec, tags);
      applyChannel(rec, c);
      state.tracked[id] = rec;
      toAnalyze.push(id);
    }
  }
} catch (e) { if (!(e instanceof QuotaOut)) throw e; }

function applyChannel(rec, c) {
  rec.title = c.snippet.title;
  rec.handle = c.snippet.customUrl || '';
  rec.avatar = c.snippet.thumbnails?.medium?.url || c.snippet.thumbnails?.default?.url || '';
  rec.country = c.snippet.country || '';
  rec.createdAt = c.snippet.publishedAt;
  rec.subs = c.statistics.hiddenSubscriberCount ? null : +c.statistics.subscriberCount || 0;
  rec.views = +c.statistics.viewCount || 0;
  rec.videoCount = +c.statistics.videoCount || 0;
  rec.uploads = c.contentDetails?.relatedPlaylists?.uploads || ('UU' + c.id.slice(2));
  rec.updatedAt = new Date(now).toISOString();
}

// ---------------------------------------------------------------- 4. atualiza números de todos os acompanhados (barato)
try {
  const ids = Object.keys(state.tracked).filter(id => !toAnalyze.includes(id));
  for (const group of chunk(ids, 50)) {
    const res = await yt('channels', { part: 'snippet,statistics,contentDetails', id: group.join(',') });
    const seen = new Set();
    for (const c of res.items || []) { applyChannel(state.tracked[c.id], c); seen.add(c.id); }
    for (const id of group) if (!seen.has(id)) delete state.tracked[id]; // canal apagado
  }
} catch (e) { if (!(e instanceof QuotaOut)) throw e; }

// ---------------------------------------------------------------- 5. analisa os vídeos de cada canal
async function analyze(id) {
  const rec = state.tracked[id]; if (!rec) return;
  const items = []; let pageToken;
  for (let p = 0; p < CFG.maxUploadPages; p++) {
    const res = await yt('playlistItems', { part: 'contentDetails', playlistId: rec.uploads, maxResults: 50, pageToken });
    items.push(...(res.items || []));
    pageToken = res.nextPageToken; if (!pageToken) break;
  }
  const vids = [];
  for (const ids of chunk(items.map(i => i.contentDetails.videoId), 50)) {
    const res = await yt('videos', { part: 'snippet,contentDetails,statistics', id: ids.join(',') });
    for (const v of res.items || []) {
      if (v.snippet.liveBroadcastContent && v.snippet.liveBroadcastContent !== 'none') continue;
      vids.push({
        id: v.id, title: v.snippet.title, publishedAt: v.snippet.publishedAt,
        secs: parseDur(v.contentDetails.duration), views: +v.statistics.viewCount || 0,
      });
    }
  }
  const long = vids.filter(v => v.secs >= CFG.minLongSeconds);
  const short = vids.filter(v => v.secs < CFG.minLongSeconds);
  const sum = a => a.reduce((s, v) => s + v.views, 0);
  const oldest = a => a.reduce((m, v) => (!m || v.publishedAt < m ? v.publishedAt : m), null);
  rec.firstVideoAt = oldest(vids);
  rec.firstLongAt = oldest(long);
  rec.longCount = long.length;
  rec.shortCount = short.length;
  rec.longViews = sum(long);
  rec.shortViews = sum(short);
  long.sort((a, b) => b.views - a.views);
  rec.top = long.slice(0, 4)
    .map(v => ({ id: v.id, t: v.title, v: v.views, s: v.secs, p: v.publishedAt }));
  rec.titles = long.slice(0, 30).map(v => v.title); // para conferir o tema (fica só no state.json)
  rec.lastLongAt = long.reduce((m, v) => (!m || v.publishedAt > m ? v.publishedAt : m), null);
  rec.analyzedAt = new Date(now).toISOString();
  // histórico curto de views (para mostrar crescimento)
  rec.hist ??= [];
  const today = new Date(now).toISOString().slice(0, 10);
  rec.hist = rec.hist.filter(h => h[0] !== today).concat([[today, rec.views]]).slice(-14);
}

const score = r => (r.longViews || 0) / Math.max(1, daysAgo(r.firstLongAt || r.createdAt));
const refreshList = Object.values(state.tracked)
  .filter(r => !toAnalyze.includes(r.id))
  .sort((a, b) => score(b) - score(a))
  .map(r => r.id);

try {
  await pool(toAnalyze, 4, analyze);
  // reanalisa os melhores enquanto sobrar cota
  for (const id of refreshList) {
    if (budgetLeft() < 30) break;
    await analyze(id);
  }
} catch (e) { if (!(e instanceof QuotaOut)) throw e; console.warn('⚠️ cota acabou durante a análise'); }

// ---------------------------------------------------------------- 6. aposenta canais velhos
for (const [id, r] of Object.entries(state.tracked)) {
  const first = r.firstVideoAt || r.createdAt;
  if (daysAgo(r.createdAt) > CFG.trackDays && daysAgo(first) > CFG.trackDays) {
    delete state.tracked[id];
    state.rejected[id] = { at: new Date(now).toISOString(), why: 'envelheceu' };
  }
}

// ---------------------------------------------------------------- 7. confere o tema de todos (sem cota)
let mineCount = 0;
for (const r of Object.values(state.tracked)) { retagRecord(r); if (r.mine) mineCount++; }
console.log(`🏷️ Tema conferido: ${mineCount} canais confirmados no ${MY_NICHE.name}`);

// ---------------------------------------------------------------- 8. grava o que o site mostra
const visible = Object.values(state.tracked).filter(r => {
  if (!r.longCount || !r.top?.length) return false;
  const total = (r.longViews || 0) + (r.shortViews || 0);
  if (total && r.longViews / total < CFG.minLongShare) return false;
  return r.top[0].v >= CFG.minBestViews;
}).map(r => ({
  id: r.id, title: r.title, handle: r.handle, avatar: r.avatar, country: r.country,
  createdAt: r.createdAt, firstVideoAt: r.firstVideoAt, firstLongAt: r.firstLongAt, lastLongAt: r.lastLongAt,
  subs: r.subs, views: r.views, videoCount: r.videoCount,
  longCount: r.longCount, shortCount: r.shortCount, longViews: r.longViews, shortViews: r.shortViews,
  top: r.top, tags: r.tags || [], langs: r.langs || [], mine: !!r.mine,
  discoveredAt: r.discoveredAt, hist: r.hist || [],
}));

const taxonomy = {
  langs: LANGS,
  mine: { id: MY_NICHE.id, name: MY_NICHE.name, emoji: MY_NICHE.emoji, subs: MY_NICHE.subs.map(s => ({ id: s.id, name: s.name })) },
  niches: NICHES.map(n => ({ id: n.id, name: n.name, emoji: n.emoji, subs: n.subs.map(s => ({ id: s.id, name: s.name })) })),
};

state.runs++;
state.lastRun = new Date(now).toISOString();
const unitsUsed = used.reduce((a, b) => a + b, 0);
const out = {
  updatedAt: state.lastRun,
  run: state.runs,
  stats: { searches: searchesDone, videosFound: hits.size, newChannels: toAnalyze.length, tracked: Object.keys(state.tracked).length, visible: visible.length, quotaUsed: unitsUsed, keys: KEYS.length },
  coverage: state.lastSearched,
  config: { trackDays: CFG.trackDays, minLongSeconds: CFG.minLongSeconds, minBestViews: CFG.minBestViews },
  taxonomy,
  channels: visible,
};

await fs.mkdir(path.dirname(OUT_FILE), { recursive: true });
await fs.mkdir(path.dirname(STATE_FILE), { recursive: true });
await fs.writeFile(OUT_FILE, JSON.stringify(out));
await fs.writeFile(STATE_FILE, JSON.stringify(state));
console.log(`✅ Pronto: ${visible.length} canais no site, ${Object.keys(state.tracked).length} acompanhados, ${unitsUsed} unidades de cota usadas.`);
