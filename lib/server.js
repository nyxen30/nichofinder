// =====================================================================
//  CÓDIGO COMUM DAS FUNÇÕES /api (roda só no servidor da Vercel)
//  As chaves ficam em variáveis de ambiente e nunca vão para o navegador.
//    GEMINI_API_KEY  -> Google AI Studio
//    YT_API_KEY      -> YouTube Data API v3
//    SITE_PASSWORD   -> senha que o site manda no header x-site-password
//  Opcionais: GEMINI_MODEL (padrão gemini-3.8-flash) e
//             GEMINI_IMAGE_MODEL (padrão gemini-nano-banana-2.1)
// =====================================================================
import crypto from 'node:crypto';

const env = process.env;
export const MODELS = {
  text: env.GEMINI_MODEL || 'gemini-3.8-flash',             // assiste vídeo do YouTube pelo link
  image: env.GEMINI_IMAGE_MODEL || 'gemini-nano-banana-2.1', // gera e edita imagem
};

// erro com mensagem amigável (em português) e código HTTP
export class Falha extends Error {
  constructor(status, msg) { super(msg); this.status = status; }
}

// ------------------------------------------------------------ handler com senha
export function rota(fn) {
  return async (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    try {
      if (req.method !== 'POST') throw new Falha(405, 'Use POST.');
      checaSenha(req);
      let body = {};
      try { body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {}); }
      catch { throw new Falha(400, 'Pedido inválido (JSON quebrado).'); }
      const out = await fn(body, req);
      res.status(200).json(out);
    } catch (e) {
      const status = e instanceof Falha ? e.status : 500;
      if (!(e instanceof Falha)) console.error(e);
      res.status(status).json({ erro: e instanceof Falha ? e.message : 'Erro inesperado no servidor. Tente de novo em instantes.' });
    }
  };
}

function checaSenha(req) {
  const certa = env.SITE_PASSWORD;
  if (!certa) throw new Falha(500, 'A senha do site (SITE_PASSWORD) não está configurada na Vercel.');
  const veio = String(req.headers['x-site-password'] || '');
  const h = s => crypto.createHash('sha256').update(s).digest();
  if (!veio || !crypto.timingSafeEqual(h(veio), h(certa))) throw new Falha(401, 'Senha errada.');
}

// ------------------------------------------------------------ YouTube
export function videoId(url) {
  const s = String(url || '').trim();
  if (/^[\w-]{11}$/.test(s)) return s;
  const m = s.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|live\/|embed\/)|youtu\.be\/)([\w-]{11})/);
  if (!m) throw new Falha(400, 'Link do YouTube inválido. Cole o link do vídeo (youtube.com/watch?v=… ou youtu.be/…).');
  return m[1];
}

export async function yt(endpoint, params) {
  if (!env.YT_API_KEY) throw new Falha(500, 'A chave do YouTube (YT_API_KEY) não está configurada na Vercel.');
  const url = new URL('https://www.googleapis.com/youtube/v3/' + endpoint);
  for (const [k, v] of Object.entries(params)) if (v != null) url.searchParams.set(k, v);
  url.searchParams.set('key', env.YT_API_KEY);
  const r = await fetch(url);
  const body = await r.json().catch(() => ({}));
  if (r.ok) return body;
  const reason = body?.error?.errors?.[0]?.reason || '';
  if (/quota/i.test(reason)) throw new Falha(429, 'A cota diária da API do YouTube acabou. Tente amanhã (renova às 4h, horário de Brasília).');
  if (r.status === 400 || r.status === 403) throw new Falha(502, `Problema com a chave do YouTube (${reason || r.status}). Confira a YT_API_KEY na Vercel.`);
  throw new Falha(502, `O YouTube respondeu com erro ${r.status}.`);
}

export const parseDur = d => {
  const m = /P(?:(\d+)D)?T?(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/.exec(d || '') || [];
  return (+m[1] || 0) * 86400 + (+m[2] || 0) * 3600 + (+m[3] || 0) * 60 + (+m[4] || 0);
};

// dados de um vídeo (videos.list com snippet.tags)
export async function dadosVideo(id) {
  const r = await yt('videos', { part: 'snippet,statistics,contentDetails,status', id });
  const v = r.items?.[0];
  if (!v) throw new Falha(404, 'Vídeo não encontrado. Ele pode ser privado, ter sido apagado ou o link está errado.');
  const t = v.snippet.thumbnails || {};
  return {
    id, url: 'https://www.youtube.com/watch?v=' + id,
    title: v.snippet.title, description: v.snippet.description || '', tags: v.snippet.tags || [],
    channelId: v.snippet.channelId, channelTitle: v.snippet.channelTitle,
    publishedAt: v.snippet.publishedAt, lang: v.snippet.defaultAudioLanguage || v.snippet.defaultLanguage || '',
    thumb: (t.maxres || t.standard || t.high || t.medium || t.default || {}).url || `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
    secs: parseDur(v.contentDetails?.duration),
    views: +v.statistics?.viewCount || 0,
    likes: v.statistics?.likeCount != null ? +v.statistics.likeCount : null,
    comments: v.statistics?.commentCount != null ? +v.statistics.commentCount : null,
    privacy: v.status?.privacyStatus || 'public',
    live: v.snippet.liveBroadcastContent && v.snippet.liveBroadcastContent !== 'none',
  };
}

// dados do canal + média de views dos últimos vídeos longos (playlist de uploads)
export async function dadosCanal(channelId, ignorarId) {
  const r = await yt('channels', { part: 'snippet,statistics,contentDetails', id: channelId });
  const c = r.items?.[0];
  if (!c) return null;
  const uploads = c.contentDetails?.relatedPlaylists?.uploads || ('UU' + channelId.slice(2));
  const pl = await yt('playlistItems', { part: 'contentDetails', playlistId: uploads, maxResults: 50 }).catch(() => ({ items: [] }));
  const ids = (pl.items || []).map(i => i.contentDetails.videoId).filter(x => x !== ignorarId);
  let longos = [];
  if (ids.length) {
    const vr = await yt('videos', { part: 'contentDetails,statistics,snippet', id: ids.join(',') });
    longos = (vr.items || [])
      .filter(v => parseDur(v.contentDetails?.duration) >= 240 && (v.snippet.liveBroadcastContent || 'none') === 'none')
      .sort((a, b) => b.snippet.publishedAt.localeCompare(a.snippet.publishedAt))
      .slice(0, 10)
      .map(v => ({ views: +v.statistics?.viewCount || 0, publishedAt: v.snippet.publishedAt }));
  }
  const media = longos.length ? Math.round(longos.reduce((s, v) => s + v.views, 0) / longos.length) : null;
  return {
    title: c.snippet.title, avatar: c.snippet.thumbnails?.default?.url || '',
    subs: c.statistics.hiddenSubscriberCount ? null : +c.statistics.subscriberCount || 0,
    videoCount: +c.statistics.videoCount || 0,
    mediaLongos: media, nLongos: longos.length,
  };
}

// ------------------------------------------------------------ Gemini (Interactions API)
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/interactions';

export async function gemini(payload) {
  if (!env.GEMINI_API_KEY) throw new Falha(500, 'A chave do Gemini (GEMINI_API_KEY) não está configurada na Vercel.');
  const r = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': env.GEMINI_API_KEY, 'Api-Revision': '2026-05-20' },
    body: JSON.stringify({ store: false, ...payload }),
  });
  const body = await r.json().catch(() => ({}));
  if (!r.ok) throw erroGemini(r.status, body?.error || {});
  if (body.status && body.status !== 'completed') throw new Falha(502, `O Gemini não terminou a resposta (status: ${body.status}). Tente de novo.`);
  const parts = (body.steps || []).filter(s => s.type === 'model_output').flatMap(s => s.content || []);
  return { parts, usage: body.usage || null };
}

function erroGemini(status, err) {
  const code = err.code || '', msg = err.message || '';
  const txt = `${code} ${msg}`;
  if (status === 401 || code === 'authentication') return new Falha(502, 'A chave do Gemini é inválida ou expirou. Confira a GEMINI_API_KEY na Vercel.');
  if (status === 402 || code === 'payment_required') return new Falha(402, 'Esse recurso do Gemini precisa de faturamento ativado no Google AI Studio (o modelo de imagem não tem plano grátis).');
  if (status === 429) return new Falha(429, 'O limite ou a cota do Gemini acabou por agora. Espere alguns minutos (ou até amanhã, no plano grátis) e tente de novo.');
  if (/private|unlisted|not.*(public|available)|video.*(unavailable|not found)|youtube/i.test(txt))
    return new Falha(422, 'O Gemini não conseguiu abrir esse vídeo. Ele precisa ser PÚBLICO (privado e não listado não funcionam).');
  if (/safety|blocked|prohibited|policy/i.test(txt)) return new Falha(422, 'O Gemini recusou o pedido pelas regras de segurança dele. Tente mudar o texto ou a imagem.');
  if (status === 404 || code === 'model_not_found') return new Falha(502, `O modelo do Gemini não foi encontrado (${msg}). Pode ter mudado de nome: ajuste GEMINI_MODEL / GEMINI_IMAGE_MODEL na Vercel.`);
  if (status >= 500) return new Falha(503, 'O Gemini está instável agora. Tente de novo em alguns minutos.');
  return new Falha(502, `O Gemini recusou o pedido: ${msg || code || status}`);
}

// pede JSON com esquema e devolve o objeto já lido
export async function geminiJSON({ input, schema, system, model = MODELS.text }) {
  const { parts, usage } = await gemini({
    model, input, system_instruction: system,
    response_format: { type: 'text', mime_type: 'application/json', schema },
  });
  const txt = parts.filter(p => p.type === 'text').map(p => p.text).join('');
  try { return { data: JSON.parse(txt.replace(/^```(?:json)?\s*|\s*```$/g, '')), usage }; }
  catch { throw new Falha(502, 'O Gemini devolveu uma resposta fora do formato. Tente de novo.'); }
}

export const videoPart = url => ({ type: 'video', uri: url });

// esquema JSON curto: S.obj({a: S.str()}) etc.
export const S = {
  str: d => ({ type: 'string', ...(d ? { description: d } : {}) }),
  num: d => ({ type: 'number', ...(d ? { description: d } : {}) }),
  bool: d => ({ type: 'boolean', ...(d ? { description: d } : {}) }),
  arr: (items, d) => ({ type: 'array', items, ...(d ? { description: d } : {}) }),
  obj: (props, d) => ({ type: 'object', properties: props, required: Object.keys(props), ...(d ? { description: d } : {}) }),
};

export const ESTILO_CANAL = `Canal "Sem Superfície": vídeos longos sobre animais perigosos, risco real, oceano profundo/abismo, tubarões e predadores atuais e pré-históricos, no formato "quanto tempo você sobreviveria" / "e se você encontrasse...". Público brasileiro. Tom: tenso, curioso, cinematográfico, com fatos reais e números concretos.`;
