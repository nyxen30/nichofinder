// ROTEIRO a partir de um vídeo de referência, em 2 etapas:
//   etapa "mapa":    o Gemini ASSISTE o vídeo e devolve título/descrição/tags traduzidos + o mapa do formato
//   etapa "roteiro": usa o mapa como esqueleto e escreve um roteiro NOVO (só texto, não reassiste o vídeo)
import { rota, Falha, videoId, dadosVideo, geminiJSON, videoPart, S, ESTILO_CANAL } from '../lib/server.js';

const SCHEMA_MAPA = S.obj({
  idioma_original: S.str('código do idioma falado no vídeo, ex.: en, pt, es'),
  titulo: S.str('título traduzido'),
  descricao: S.str('descrição traduzida'),
  tags: S.arr(S.str()),
  duracao_total: S.str('ex.: 14:32'),
  tema: S.str('do que o vídeo trata, em 1 frase'),
  blocos: S.arr(S.obj({
    nome: S.str('nome curto do bloco, ex.: Gancho, Contexto, Virada 1'),
    inicio: S.str('mm:ss'),
    fim: S.str('mm:ss'),
    funcao: S.str('o que o bloco faz para a retenção'),
    tipo: S.str('um destes: gancho, virada, desenvolvimento, cta, fechamento'),
    ideias: S.str('as ideias, fatos e números que o bloco apresenta (resumo em português, sem copiar frases)'),
  })),
  observacoes_ritmo: S.str('ritmo, duração média das frases, tom da narração'),
});

const SCHEMA_ROTEIRO = S.obj({
  titulo_trabalho: S.str('título provisório do roteiro novo'),
  paragrafos: S.arr(S.obj({
    bloco: S.str('nome do bloco do mapa a que pertence'),
    texto: S.str('só a fala do narrador, sem indicação de cena'),
    cena: S.str('sugestão visual para este parágrafo'),
  })),
  duracao_estimada: S.str('mm:ss narrando em ritmo normal'),
});

export default rota(async ({ url, etapa = 'mapa', mapa, video: meta }) => {
  const id = videoId(url);

  if (etapa === 'mapa') {
    const v = await dadosVideo(id);
    if (v.privacy !== 'public') throw new Falha(422, 'Esse vídeo não é público. O Gemini só consegue assistir vídeos públicos.');
    const prompt = `Assista ao vídeo inteiro e devolva o JSON pedido.

DADOS DO VÍDEO (YouTube):
- Título original: ${v.title}
- Descrição original:
${v.description.slice(0, 4000)}
- Tags originais: ${v.tags.join(', ') || '(sem tags)'}

REGRAS:
1. "titulo": traduza para português do Brasil natural, mantendo EXATAMENTE a mesma estrutura e a mesma promessa (mesmos números, mesma pergunta, mesmo tamanho aproximado, mesmas maiúsculas de ênfase). Se já estiver em português, devolva igual.
2. "descricao": traduza mantendo a mesma estrutura (parágrafos, listas, capítulos). REMOVA todos os links (http, www), menções com @, nomes de redes sociais, patrocinadores e créditos do criador original.
3. "tags": traduza cada tag para português; sem # e sem nomes do criador original.
4. "blocos": mapa do FORMATO do vídeo, em ordem: cada bloco com início e fim reais (mm:ss), a função dele na retenção, o tipo (gancho, virada, desenvolvimento, cta ou fechamento) e as ideias/fatos que apresenta. Marque como "virada" cada ponto onde o vídeo muda de direção, revela algo ou sobe a tensão.
5. Tudo em português do Brasil.`;
    const { data, usage } = await geminiJSON({
      input: [videoPart(v.url), { type: 'text', text: prompt }],
      schema: SCHEMA_MAPA,
      system: 'Você é um analista de roteiros de YouTube. Responde só com o JSON pedido.',
    });
    data.tags = (data.tags || []).map(t => String(t).replace(/^#/, '').trim()).filter(Boolean);
    data.descricao = String(data.descricao || '').replace(/https?:\/\/\S+|www\.\S+/gi, '').replace(/(^|\s)@[\w.]+/g, '$1').replace(/\n{3,}/g, '\n\n').trim();
    return { etapa: 'mapa', video: v, ...data, usage };
  }

  if (etapa === 'roteiro') {
    if (!mapa?.blocos?.length) throw new Falha(400, 'Falta o mapa do formato. Gere o mapa primeiro.');
    const prompt = `Escreva um ROTEIRO NOVO, do zero, em português do Brasil, para o canal abaixo.

${ESTILO_CANAL}

ESQUELETO (mapa do formato do vídeo de referência "${meta?.title || ''}", ${mapa.duracao_total || '?'}):
${mapa.blocos.map((b, i) => `${i + 1}. [${b.inicio}–${b.fim}] ${b.nome} (${b.tipo}) — função: ${b.funcao}. Ideias: ${b.ideias}`).join('\n')}
Ritmo do original: ${mapa.observacoes_ritmo || '-'}

REGRAS:
- Siga o esqueleto: mesma ordem de blocos, mesmo tipo de gancho, viradas nos mesmos pontos, mesmo ritmo e duração aproximada (${mapa.duracao_total || 'a mesma'}; ~150 palavras por minuto de narração).
- NÃO traduza nem parafraseie frase por frase. Use as ideias como base factual e escreva com frases, exemplos e imagens mentais SEUS. Pode trocar exemplos por outros mais fortes, desde que sejam fatos reais.
- Gancho forte nos primeiros 5–10 segundos (pergunta, perigo imediato ou número chocante). Mini-ganchos e viradas ao longo do vídeo para segurar a retenção ("mas isso não é o pior...").
- Pedido de inscrição/like LEVE, natural, uma vez perto do meio e uma no fim.
- "texto": só a fala do narrador, pronta para narrar no Google AI Studio. Sem indicações de cena, sem colchetes, sem emojis, sem títulos. Um parágrafo = uma respiração (2 a 4 frases).
- "cena": uma sugestão visual por parágrafo (animação 2D com traço limpo; diga quando misturar com imagem/vídeo real).`;
    const { data, usage } = await geminiJSON({
      input: prompt,
      schema: SCHEMA_ROTEIRO,
      system: 'Você é roteirista de documentários de YouTube de alta retenção. Escreve conteúdo original. Responde só com o JSON pedido.',
    });
    data.paragrafos = (data.paragrafos || []).map(p => ({ ...p, texto: String(p.texto || '').replace(/\[[^\]]*\]/g, '').trim() })).filter(p => p.texto);
    return { etapa: 'roteiro', ...data, usage };
  }

  throw new Falha(400, 'Etapa desconhecida.');
});
