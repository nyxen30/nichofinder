// dados públicos de um vídeo (e, se pedido, do canal) pela YouTube Data API
import { rota, videoId, dadosVideo, dadosCanal } from '../lib/server.js';

export default rota(async ({ url, canal }) => {
  const video = await dadosVideo(videoId(url));
  const ch = canal ? await dadosCanal(video.channelId, video.id) : null;
  return { video, canal: ch };
});
