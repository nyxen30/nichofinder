// =====================================================================
//  CONFERE O TEMA DOS CANAIS
//  As buscas do YouTube trazem muito canal fora do tema. Aqui o robô olha
//  os títulos dos vídeos longos do canal e só deixa ele num nicho se os
//  títulos baterem com as palavras-chave (kw) de config/niches.mjs.
//  Não usa a API: funciona só com os títulos já salvos.
// =====================================================================
import { NICHES, MY_NICHE } from '../config/niches.mjs';

// Regra: o nicho "bate" se pelo menos 40% dos títulos baterem,
// ou se o melhor vídeo bater e mais pelo menos um outro também.
export const RULE = { minShare: 0.4 };

// tira acento, deixa minúsculo e troca pontuação por espaço: "Tubarões!" -> " tubaroes "
export function norm(s) {
  return ' ' + String(s || '').toLowerCase().replace(/ß/g, 'ss')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, ' ').trim() + ' ';
}

// 'tubar*' -> começa com "tubar"; 'tubarão' -> palavra inteira
function compile(kw) {
  const list = Object.values(kw || {}).flat();
  const pats = new Set();
  for (const k of list) {
    const prefix = k.trim().endsWith('*');
    const body = norm(k.replace(/\*+\s*$/, '')).trim();
    if (body) pats.add(prefix ? ' ' + body : ' ' + body + ' ');
  }
  return [...pats];
}
const hit = (title, pats) => pats.some(p => title.includes(p));

// pré-compila tudo uma vez
const GROUPS = [MY_NICHE, ...NICHES].map(g => {
  const subs = Object.fromEntries(g.subs.map(s => [s.id, compile(s.kw)]));
  const own = compile(g.kw);
  return {
    id: g.id,
    mine: g.id === MY_NICHE.id,
    // quem libera o nicho são as palavras do NICHO (as dos subnichos são mais genéricas,
    // tipo "e se" ou "sobreviver", e só escolhem o chip). Sem kw no nicho, usa as dos subnichos.
    all: own.length ? own : [...new Set(Object.values(subs).flat())],
    subs,
  };
});
const GROUP = Object.fromEntries(GROUPS.map(g => [g.id, g]));

// titles: do mais visto para o menos visto (o primeiro é o "melhor vídeo")
export function themeMatches(titles, pats) {
  if (!titles.length || !pats.length) return { ok: false, n: 0, share: 0 };
  const flags = titles.map(t => hit(t, pats));
  const n = flags.filter(Boolean).length;
  const share = n / titles.length;
  const ok = titles.length === 1 ? n === 1 : share >= RULE.minShare || (flags[0] && n >= 2);
  return { ok, n, share };
}

/**
 * Decide os nichos de um canal.
 * @param {string[]} rawTitles títulos dos vídeos longos (mais vistos primeiro)
 * @param {string[]} found tags "nicho|sub" vindas das buscas onde o canal apareceu
 * @returns {{ tags: string[], mine: boolean }}
 */
export function classify(rawTitles, found) {
  const titles = (rawTitles || []).map(norm);
  const byGroup = new Map();
  for (const tag of found || []) {
    const [g, s] = tag.split('|');
    if (!GROUP[g]) continue;
    if (!byGroup.has(g)) byGroup.set(g, []);
    if (!byGroup.get(g).includes(s)) byGroup.get(g).push(s);
  }

  const tags = [];
  let mine = false;
  for (const [gid, subs] of byGroup) {
    const g = GROUP[gid];
    if (!themeMatches(titles, g.all).ok) continue;
    if (g.mine) mine = true;
    // subnicho: fica nos que têm pelo menos um título com as palavras dele;
    // se nenhum bater (ou não tiver palavras), mantém os subnichos da busca
    const good = subs.filter(s => g.subs[s]?.length && titles.some(t => hit(t, g.subs[s])));
    for (const s of good.length ? good : subs) tags.push(`${gid}|${s}`);
  }

  // nenhum nicho confirmou: o canal fica com as tags da busca dos OUTROS nichos
  // (nunca com a do meu nicho, que precisa ser confirmada)
  if (!tags.length) {
    for (const tag of found || []) if (!tag.startsWith(MY_NICHE.id + '|') && !tags.includes(tag)) tags.push(tag);
  }
  return { tags, mine };
}

// títulos guardados de um canal (lista maior se existir, senão os 4 do "top")
export const titlesOf = rec => (rec.titles?.length ? rec.titles : (rec.top || []).map(v => v.t));

// aplica a classificação num registro (state.tracked[id] ou canal do site)
export function retagRecord(rec) {
  rec.found ??= [...(rec.tags || [])];   // canais antigos: as tags salvas eram as da busca
  const r = classify(titlesOf(rec), rec.found);
  rec.tags = r.tags;
  rec.mine = r.mine;
  return rec;
}
