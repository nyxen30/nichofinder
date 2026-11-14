// ANALISAR VÍDEO: números do YouTube + análise do Gemini (assiste o vídeo pelo link)
import { rota, Falha, videoId, dadosVideo, dadosCanal, geminiJSON, videoPart, S, ESTILO_CANAL } from '../lib/server.js';

const SCHEMA = S.obj({
  resumo: S.str('diagnóstico em 2 frases'),
  funcionando: S.arr(S.str(), 'o que está funcionando'),
  nao_funcionando: S.arr(S.str(), 'o que não está funcionando'),
  aspectos: S.obj({
    titulo: S.str(), thumbnail: S.str(), gancho_30s: S.str(), ritmo: S.str(),
    pontos_de_saida: S.str('momentos (mm:ss) onde o público provavelmente sai e por quê'),
    cta: S.str(),
  }),
  melhorias: S.arr(S.str(), '3 a 5 melhorias concretas'),
  titulos_alternativos: S.arr(S.str(), 'exatamente 3 títulos'),
  ideia_thumbnail: S.str(),
  gancho_novo: S.str('como reescrever os primeiros 30 segundos'),
  quando_voltar: S.obj({
    prazo: S.str('ex.: volte em 48 h'),
    motivo: S.str(),
    o_que_olhar: S.arr(S.str()),
  }),
});

// regra base de quando reavaliar, pela idade do vídeo
function prazoBase(horas) {
  if (horas < 24) return 'Vídeo com menos de 1 dia: o algoritmo ainda está testando. Volte em 48 h e compare as views/hora.';
  if (horas < 72) return 'Vídeo com 1–3 dias: volte em 4–5 dias (quando completar 1 semana) para decidir se troca título e thumbnail.';
  if (horas < 24 * 14) return 'Vídeo com 3–14 dias: já dá para agir. Se estiver abaixo da média, troque título/thumbnail agora e volte em 72 h para comparar.';
  if (horas < 24 * 60) return 'Vídeo com 2–8 semanas: volte em 14 dias; foque em busca e vídeos sugeridos.';
  return 'Vídeo com mais de 2 meses: volte em 30 dias; avalie se vale atualizar título, thumbnail e descrição para busca.';
}

export default rota(async ({ url }) => {
  const v = await dadosVideo(videoId(url));
  if (v.privacy === 'private') throw new Falha(422, 'Esse vídeo é privado. Só dá para analisar vídeos públicos.');
  const canal = await dadosCanal(v.channelId, v.id);
  const horas = Math.max(1, (Date.now() - new Date(v.publishedAt).getTime()) / 36e5);
  const vph = Math.round(v.views / horas);
  const vsMedia = canal?.mediaLongos ? +(v.views / canal.mediaLongos).toFixed(2) : null;

  const numeros = {
    horas_no_ar: Math.round(horas), views: v.views, likes: v.likes, comentarios: v.comments,
    views_por_hora: vph, duracao_seg: v.secs,
    inscritos_canal: canal?.subs ?? null, media_views_ultimos_longos: canal?.mediaLongos ?? null,
    vezes_a_media: vsMedia,
  };

  const prompt = `Analise este vídeo do YouTube como um consultor de crescimento de canal. Assista ao vídeo inteiro.
A imagem anexada é a thumbnail atual.

Título: ${v.title}
Números agora: ${JSON.stringify(numeros)}
${vsMedia != null ? `O vídeo está com ${vsMedia}x a média de views dos últimos vídeos longos do canal (considere que vídeos novos ainda não tiveram tempo).` : ''}
Referência de quando reavaliar: ${prazoBase(horas)}

Contexto de quem pede: ${ESTILO_CANAL}

Seja específico e prático, cite momentos com mm:ss. Avalie: título, thumbnail, gancho dos primeiros 30 s, ritmo, onde o público provavelmente sai, CTA.
Dê 3 a 5 melhorias concretas, exatamente 3 títulos alternativos em português, uma ideia de thumbnail nova e como reescrever o gancho.
Em "quando_voltar", diga o prazo exato para reavaliar com base na idade do vídeo (${Math.round(horas)} h no ar) e o que olhar quando voltar. Tudo em português do Brasil.`;

  const input = [videoPart(v.url)];
  try {
    const r = await fetch(`https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`);
    if (r.ok) input.push({ type: 'image', mime_type: 'image/jpeg', data: Buffer.from(await r.arrayBuffer()).toString('base64') });
  } catch {}
  input.push({ type: 'text', text: prompt });

  const { data, usage } = await geminiJSON({
    input, schema: SCHEMA,
    system: 'Você é especialista em retenção e CTR no YouTube. Responde só com o JSON pedido.',
  });
  return { video: v, canal, numeros, prazo_base: prazoBase(horas), analise: data, usage };
});
