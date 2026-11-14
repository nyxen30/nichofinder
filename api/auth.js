// confere a senha do site (o navegador chama ao salvar a senha)
import { rota, MODELS } from '../lib/server.js';

export default rota(async () => ({
  ok: true,
  configurado: { gemini: !!process.env.GEMINI_API_KEY, youtube: !!process.env.YT_API_KEY },
  modelos: MODELS,
}));
