// THUMBNAIL: gera uma thumbnail NOVA (16:9) a partir de uma referência, com o modelo de imagem do Gemini
import { rota, Falha, gemini, MODELS } from '../lib/server.js';

const ESTILO = `Estilo obrigatório: ilustração digital 2D com traço limpo e contornos firmes, sombreamento simples, cores saturadas e alto contraste, iluminação cinematográfica (oceano profundo, abismo, luz vinda de cima), um sujeito principal grande e fácil de ler em tamanho pequeno. NÃO é foto tratada nem 3D realista.`;

export default rota(async ({ imagem, mime = 'image/jpeg', titulo = '', ajuste = '', opcao = 1, anterior }) => {
  if (!imagem) throw new Falha(400, 'Envie uma imagem de referência.');
  if (imagem.length > 3_000_000) throw new Falha(413, 'A imagem é grande demais. Use uma de até ~2 MB.');
  if (!/^image\/(png|jpeg|webp)$/.test(mime)) throw new Falha(400, 'Formato de imagem não aceito. Use JPG, PNG ou WEBP.');

  const variacao = +opcao === 2
    ? 'Esta é a OPÇÃO 2: use um ângulo de câmera e um enquadramento diferentes da opção mais óbvia, mantendo a mesma ideia.'
    : 'Esta é a OPÇÃO 1: a interpretação mais direta da ideia.';

  const prompt = `Crie uma thumbnail de YouTube NOVA e ORIGINAL, 16:9, para o canal brasileiro "Sem Superfície" (animais perigosos, oceano profundo, predadores).

A primeira imagem é a thumbnail de REFERÊNCIA. Não a copie: redesenhe tudo como uma arte nova e própria. Não reproduza logos, marcas d'água, rostos de pessoas reais nem a arte original.
- Se a referência tiver texto em outro idioma que não o português: mantenha a mesma ideia, a mesma composição, as mesmas cores e a mesma intensidade, mas com o texto em PORTUGUÊS do Brasil, curto (no máximo 4 palavras), letras grandes e legíveis.
- Se o texto já estiver em português: use a referência só como inspiração e crie uma variação claramente diferente (outra composição e outro texto curto).
- Se não houver texto: pode criar um texto curto em português, ou nenhum, o que for mais forte.
${titulo ? `Título do meu vídeo (use para guiar a ideia e o texto): "${titulo}".` : ''}
${ESTILO}
${variacao}
${ajuste ? `AJUSTES PEDIDOS: ${ajuste}.` : ''}
${anterior ? 'A segunda imagem é a versão anterior desta opção: mantenha o que está bom nela e aplique os ajustes pedidos.' : ''}`;

  const input = [
    { type: 'image', mime_type: mime, data: imagem },
    ...(anterior?.data ? [{ type: 'image', mime_type: anterior.mime || 'image/jpeg', data: anterior.data }] : []),
    { type: 'text', text: prompt },
  ];

  const { parts, usage } = await gemini({
    model: MODELS.image,
    input,
    response_format: { type: 'image', mime_type: 'image/jpeg', aspect_ratio: '16:9', image_size: '1K' },
  });
  const img = parts.find(p => p.type === 'image' && p.data);
  if (!img) {
    const txt = parts.filter(p => p.type === 'text').map(p => p.text).join(' ').slice(0, 300);
    throw new Falha(502, 'O Gemini não devolveu imagem.' + (txt ? ` Ele disse: "${txt}"` : ' Tente de novo.'));
  }
  return { opcao: +opcao, mime: img.mime_type || 'image/jpeg', data: img.data, usage };
});
