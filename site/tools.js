// =====================================================================
//  FERRAMENTAS: Roteiro, Thumbnail e Analisar vídeo
//  Tudo que usa IA ou a API do YouTube passa por /api (no servidor),
//  com a senha do painel no header x-site-password.
// =====================================================================
(() => {
  const $ = id => document.getElementById(id);
  const store = {
    get(k, d) { try { const v = localStorage.getItem('nf:' + k); return v === null ? d : JSON.parse(v); } catch { return d; } },
    set(k, v) { try { localStorage.setItem('nf:' + k, JSON.stringify(v)); } catch {} },
    del(k) { try { localStorage.removeItem('nf:' + k); } catch {} },
  };
  const toast = m => (window.NF_toast || alert)(m);
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fmt = n => n == null ? '–' : n >= 1e6 ? (n / 1e6).toFixed(n >= 1e7 ? 0 : 1).replace('.', ',') + ' mi'
    : n >= 1e3 ? (n / 1e3).toFixed(n >= 1e5 ? 0 : 1).replace('.', ',').replace(/,0$/, '') + ' mil' : String(n);
  const num = n => n == null ? '–' : Number(n).toLocaleString('pt-BR');
  const dur = s => { const h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60), x = s % 60; return (h ? h + ':' + String(m).padStart(2, '0') : m) + ':' + String(x).padStart(2, '0'); };
  const dataBR = iso => new Date(iso).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  const idade = iso => {
    const h = (Date.now() - new Date(iso).getTime()) / 36e5;
    return h < 48 ? `${Math.max(1, Math.round(h))} h` : `${Math.round(h / 24)} dias`;
  };

  // ------------------------------------------------------------ navegação entre as 4 áreas
  const VIEWS = ['finder', 'roteiro', 'thumb', 'analise'];
  const TITLES = { finder: '', roteiro: 'Roteiro', thumb: 'Thumbnail', analise: 'Analisar vídeo' };
  function route() {
    const [name, qs] = location.hash.slice(1).split('?');
    const view = VIEWS.includes(name) ? name : 'finder';
    document.body.dataset.view = view;
    for (const v of VIEWS) $('view-' + v).hidden = v !== view;
    document.querySelectorAll('[data-tool]').forEach(a => a.classList.toggle('on', a.dataset.tool === view));
    document.title = view === 'finder' ? 'Sem Superfície · painel do canal' : `${TITLES[view]} · Sem Superfície`;
    window.NF_setMenu?.(false);
    const p = new URLSearchParams(qs || '');
    if (view === 'roteiro' && p.get('url')) {
      $('rtUrl').value = p.get('url');
      history.replaceState(null, '', '#roteiro');
      carregarRef();
    }
    if (view === 'analise' && p.get('url')) {
      $('anUrl').value = p.get('url');
      history.replaceState(null, '', '#analise');
    }
    if (view !== 'finder') window.scrollTo({ top: 0 });
  }
  addEventListener('hashchange', route);

  // ------------------------------------------------------------ senha + chamadas /api
  let pwWait = null;
  function pedirSenha(msg) {
    if (pwWait) return pwWait;
    $('pwErr').hidden = !msg; $('pwErr').textContent = msg || '';
    $('pwInput').value = '';
    $('pwDlg').showModal(); $('pwInput').focus();
    pwWait = new Promise(resolve => {
      const fim = ok => { pwWait = null; $('pwDlg').close(); resolve(ok); };
      $('pwForm').onsubmit = async e => {
        e.preventDefault();
        const pw = $('pwInput').value;
        $('pwOk').disabled = true; $('pwOk').textContent = 'Conferindo…';
        try {
          const r = await fetch('/api/auth', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-site-password': pw }, body: '{}' });
          if (r.status === 401) { $('pwErr').hidden = false; $('pwErr').textContent = 'Senha errada.'; return; }
          const j = await r.json().catch(() => ({}));
          if (!r.ok) { $('pwErr').hidden = false; $('pwErr').textContent = j.erro || `Erro ${r.status} ao conferir a senha.`; return; }
          store.set('pw', pw); toast('Senha salva neste navegador'); fim(true);
        } catch { $('pwErr').hidden = false; $('pwErr').textContent = 'Sem conexão com o servidor.'; }
        finally { $('pwOk').disabled = false; $('pwOk').textContent = 'Entrar'; }
      };
      $('pwCancel').onclick = () => fim(false);
      $('pwDlg').oncancel = e => { e.preventDefault(); fim(false); };
    });
    return pwWait;
  }
  $('pwBtn').onclick = () => pedirSenha();
  $('pwForget').onclick = () => { store.del('pw'); $('pwInput').value = ''; toast('Senha apagada deste navegador'); };

  class ErroApi extends Error {}
  async function api(path, body, tentativa = 0) {
    let pw = store.get('pw', '');
    if (!pw) { if (!(await pedirSenha())) throw new ErroApi('Você precisa digitar a senha do painel para usar esta ferramenta.'); pw = store.get('pw', ''); }
    let r;
    try {
      r = await fetch('/api/' + path, { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-site-password': pw }, body: JSON.stringify(body) });
    } catch { throw new ErroApi('Sem conexão com o servidor. Confira sua internet e tente de novo.'); }
    if (r.status === 401 && tentativa === 0) {
      store.del('pw');
      if (await pedirSenha('Senha errada ou alterada. Digite de novo.')) return api(path, body, 1);
      throw new ErroApi('Senha errada.');
    }
    const j = await r.json().catch(() => null);
    if (r.ok && j) return j;
    if (j?.erro) throw new ErroApi(j.erro);
    if (r.status === 504) throw new ErroApi('Demorou demais (mais de 5 min). Vídeos muito longos podem passar do limite; tente um vídeo mais curto ou tente de novo.');
    if (r.status === 413) throw new ErroApi('Arquivo grande demais para enviar. Use uma imagem menor.');
    if (r.status === 404) throw new ErroApi('As funções do servidor (/api) não foram encontradas. Confira se o deploy na Vercel terminou.');
    throw new ErroApi(`O servidor respondeu com erro ${r.status}. Tente de novo.`);
  }

  // ------------------------------------------------------------ peças de interface
  function carregando(el, msg) {
    const t0 = Date.now();
    el.innerHTML = `<div class="status"><span class="spin" aria-hidden="true"></span><span><b>${esc(msg)}</b> <span class="secs">0 s</span></span></div>`;
    const tick = setInterval(() => { const s = el.querySelector('.secs'); if (s) s.textContent = Math.round((Date.now() - t0) / 1000) + ' s'; }, 1000);
    return () => { clearInterval(tick); el.innerHTML = ''; };
  }
  const erroBox = (el, e) => { el.innerHTML = `<div class="status err"><b>⚠️ ${esc(e.message || e)}</b></div>`; };

  const COPY = new Map(); let copyId = 0;
  const copyBtn = (text, label = 'Copiar') => { const id = 'c' + (++copyId); COPY.set(id, text); return `<button class="btn sm" type="button" data-cp="${id}">${label}</button>`; };
  function bloco(titulo, html, copiar, extra = '') {
    return `<section class="block"><header><h3>${titulo}</h3><div class="b-acts">${extra}${copiar != null ? copyBtn(copiar) : ''}</div></header><div class="b-body">${html}</div></section>`;
  }
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-cp]'); if (!b) return;
    const txt = COPY.get(b.dataset.cp) ?? '';
    const ok = () => { const o = b.textContent; b.textContent = '✓ Copiado'; setTimeout(() => (b.textContent = o), 1400); };
    if (navigator.clipboard?.writeText) navigator.clipboard.writeText(txt).then(ok, () => fallback(txt) && ok());
    else if (fallback(txt)) ok();
  });
  function fallback(t) {
    const ta = document.createElement('textarea'); ta.value = t; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select(); let ok = false; try { ok = document.execCommand('copy'); } catch {} ta.remove();
    if (!ok) toast('Não deu para copiar'); return ok;
  }

  function cardVideo(v, extra = '') {
    return `<div class="panel vcard">
      <div class="embed"><iframe src="https://www.youtube-nocookie.com/embed/${v.id}" title="${esc(v.title)}" loading="lazy"
        allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>
      <div class="vmeta">
        <a class="vthumb" href="${esc(v.thumb)}" target="_blank" rel="noopener" title="Abrir a thumbnail"><img src="${esc(v.thumb)}" alt="Thumbnail"></a>
        <div class="vinfo">
          <h2>${esc(v.title)}</h2>
          <p class="vsub">${esc(v.channelTitle)}</p>
          <div class="chips">
            <span class="chip">▶ ${fmt(v.views)} views</span>
            <span class="chip">📅 ${new Date(v.publishedAt).toLocaleDateString('pt-BR')} · há ${idade(v.publishedAt)}</span>
            <span class="chip">⏱ ${dur(v.secs)}</span>
            ${v.tags?.length ? `<span class="chip">🏷 ${v.tags.length} tags</span>` : ''}
          </div>
          ${extra}
        </div>
      </div>
    </div>`;
  }

  // ================================================================ 1. ROTEIRO
  let rtVideo = null, rtMapa = null;
  async function carregarRef() {
    const url = $('rtUrl').value.trim(); if (!url) return null;
    if (rtVideo && rtVideo._url === url) return rtVideo;
    const stop = carregando($('rtStatus'), 'Buscando os dados do vídeo…');
    try {
      const { video } = await api('video', { url });
      video._url = url; rtVideo = video; rtMapa = null;
      $('rtVideo').innerHTML = cardVideo(video); $('rtOut').innerHTML = '';
      stop(); return video;
    } catch (e) { stop(); erroBox($('rtStatus'), e); rtVideo = null; return null; }
  }
  $('rtLoad').onclick = carregarRef;
  $('rtUrl').addEventListener('change', () => { rtVideo = null; });
  $('rtForm').onsubmit = async e => {
    e.preventDefault();
    const v = await carregarRef(); if (!v) return;
    $('rtGo').disabled = true;
    try {
      let stop = carregando($('rtStatus'), 'O Gemini está assistindo ao vídeo e montando o mapa do formato… (1 a 3 min)');
      let m;
      try { m = await api('roteiro', { url: v.url, etapa: 'mapa' }); } finally { stop(); }
      rtMapa = m;
      $('rtOut').innerHTML = renderMapa(m) + '<div id="rtRoteiro"></div>';
      await gerarRoteiro();
    } catch (err) { erroBox($('rtStatus'), err); }
    finally { $('rtGo').disabled = false; }
  };
  async function gerarRoteiro() {
    const box = $('rtRoteiro'); if (!box || !rtMapa) return;
    const stop = carregando(box, 'Escrevendo o roteiro novo em cima do mapa…');
    try {
      const r = await api('roteiro', { url: rtVideo.url, etapa: 'roteiro', mapa: rtMapa, video: { title: rtVideo.title } });
      stop(); box.innerHTML = renderRoteiro(r);
    } catch (e) { stop(); erroBox(box, e); box.insertAdjacentHTML('beforeend', '<button class="btn" data-redo>Tentar de novo</button>'); }
  }
  document.addEventListener('click', e => { if (e.target.closest('[data-redo]')) gerarRoteiro(); });

  const TIPO = { gancho: 'Gancho', virada: 'Virada', desenvolvimento: 'Desenvolvimento', cta: 'CTA', fechamento: 'Fechamento' };
  const seg = t => { const [m, s] = String(t || '0:0').split(':').map(Number); return (m || 0) * 60 + (s || 0); };
  function renderMapa(m) {
    const total = Math.max(1, ...m.blocos.map(b => seg(b.fim)));
    const barra = m.blocos.map(b => `<span class="seg t-${esc(b.tipo)}" style="flex:${Math.max(1, seg(b.fim) - seg(b.inicio))}" title="${esc(b.nome)} (${b.inicio}–${b.fim})"></span>`).join('');
    const linhas = m.blocos.map((b, i) => `<li class="t-${esc(b.tipo)}">
      <span class="tm">${esc(b.inicio)}–${esc(b.fim)}</span>
      <div><b>${i + 1}. ${esc(b.nome)}</b> <span class="tag t-${esc(b.tipo)}">${TIPO[b.tipo] || esc(b.tipo)}</span>
      <p>${esc(b.funcao)}</p><p class="dim">${esc(b.ideias)}</p></div></li>`).join('');
    const mapaTxt = m.blocos.map((b, i) => `${i + 1}. [${b.inicio}–${b.fim}] ${b.nome} (${TIPO[b.tipo] || b.tipo}) — ${b.funcao}\n   ${b.ideias}`).join('\n');
    return `<div class="blocks">
      ${bloco('a) Título', `<p class="big">${esc(m.titulo)}</p>`, m.titulo)}
      ${bloco('b) Descrição', `<pre>${esc(m.descricao)}</pre>`, m.descricao)}
      ${bloco('c) Tags', `<p class="mono">${esc(m.tags.join(', '))}</p>`, m.tags.join(', '))}
      ${bloco(`🗺️ Mapa do formato <small>${esc(m.duracao_total)} · ${m.blocos.length} blocos</small>`,
        `<div class="mbar" aria-hidden="true">${barra}</div>
         <div class="legend">${Object.entries(TIPO).map(([k, v]) => `<span><i class="t-${k}"></i>${v}</span>`).join('')}</div>
         <ol class="mapa">${linhas}</ol>${m.observacoes_ritmo ? `<p class="dim"><b>Ritmo:</b> ${esc(m.observacoes_ritmo)}</p>` : ''}`, mapaTxt)}
    </div>`;
  }
  function renderRoteiro(r) {
    const fala = r.paragrafos.map(p => p.texto).join('\n\n');
    const cenas = r.paragrafos.map((p, i) => `${i + 1}. ${p.cena}`).join('\n');
    const palavras = fala.split(/\s+/).filter(Boolean).length;
    return `<div class="blocks">
      ${bloco(`d) Roteiro novo <small>${palavras} palavras · ~${esc(r.duracao_estimada)}</small>`,
        `<div class="script">${r.paragrafos.map((p, i) => `<p><span class="pn">${i + 1}</span>${esc(p.texto)}</p>`).join('')}</div>
         <p class="hint">Pronto para colar no Google AI Studio: só a fala, parágrafos separados por linha em branco (cada linha em branco vira uma pausa).</p>`,
        fala, `<button class="btn sm" data-redo type="button">↻ Reescrever</button>`)}
      ${bloco('🎬 Cenas (uma por parágrafo)', `<ol class="cenas">${r.paragrafos.map(p => `<li><span class="dim">${esc(p.bloco)}</span> ${esc(p.cena)}</li>`).join('')}</ol>`, cenas)}
    </div>`;
  }

  // ================================================================ 2. THUMBNAIL
  let ref = null; // { data, mime, url }
  const opcoes = {}; // 1|2 -> { data, mime }
  function lerArquivo(file) {
    if (!file) return;
    if (!/^image\/(png|jpeg|webp)$/.test(file.type)) { toast('Use uma imagem JPG, PNG ou WEBP'); return; }
    const img = new Image();
    img.onload = () => {
      const k = Math.min(1, 1280 / img.width), c = document.createElement('canvas');
      c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      const url = c.toDataURL('image/jpeg', 0.9);
      ref = { url, mime: 'image/jpeg', data: url.split(',')[1] };
      $('thPreview').src = url; $('thPreview').hidden = false; $('thEmpty').hidden = true;
      $('thGo').disabled = false; URL.revokeObjectURL(img.src);
    };
    img.onerror = () => toast('Não consegui abrir essa imagem');
    img.src = URL.createObjectURL(file);
  }
  $('thFile').onchange = e => lerArquivo(e.target.files[0]);
  const drop = $('thDrop');
  drop.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); $('thFile').click(); } });
  ['dragenter', 'dragover'].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.add('over'); }));
  ['dragleave', 'drop'].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.remove('over'); }));
  drop.addEventListener('drop', e => lerArquivo(e.dataTransfer.files[0]));
  addEventListener('paste', e => { if (document.body.dataset.view === 'thumb') { const f = [...(e.clipboardData?.files || [])][0]; if (f) lerArquivo(f); } });

  $('thGo').onclick = () => {
    if (!ref) return;
    $('thOut').innerHTML = [1, 2].map(n => `<div class="panel opt" id="opt${n}">
      <header><h3>Opção ${n}</h3></header>
      <div class="opt-img" id="optImg${n}"></div>
      <div class="opt-acts" id="optActs${n}" hidden>
        <a class="btn primary" id="optDl${n}" download="thumbnail-opcao-${n}.jpg">⬇ Baixar 1280×720</a>
        <div class="adj"><input id="optAdj${n}" type="text" placeholder="Ajustes: mais escuro, tubarão maior…">
        <button class="btn" type="button" data-again="${n}">↻ Gerar de novo</button></div>
      </div></div>`).join('');
    gerarOpcao(1); gerarOpcao(2);
  };
  document.addEventListener('click', e => { const b = e.target.closest('[data-again]'); if (b) gerarOpcao(+b.dataset.again, true); });

  async function gerarOpcao(n, refazer = false) {
    const box = $('optImg' + n), acts = $('optActs' + n);
    const btn = acts.querySelector('[data-again]'); btn.disabled = true;
    const anterior = refazer ? opcoes[n] : null;
    const old = anterior ? `<img src="data:${anterior.mime};base64,${anterior.data}" alt="" class="faded">` : '';
    box.innerHTML = old + '<div class="overlay"></div>';
    const stop = carregando(box.querySelector('.overlay'), refazer ? 'Ajustando…' : 'Gerando…');
    try {
      const r = await api('thumb', { imagem: ref.data, mime: ref.mime, titulo: $('thTitle').value.trim(), ajuste: refazer ? $('optAdj' + n).value.trim() : '', opcao: n, anterior });
      stop();
      const final = await para1280(`data:${r.mime};base64,${r.data}`);
      opcoes[n] = { mime: 'image/jpeg', data: final.split(',')[1] };
      box.innerHTML = `<img src="${final}" alt="Opção ${n} gerada">`;
      $('optDl' + n).href = final; acts.hidden = false;
    } catch (e) {
      stop(); box.innerHTML = old; box.insertAdjacentHTML('beforeend', `<div class="status err"><b>⚠️ ${esc(e.message)}</b></div>`);
      acts.hidden = !opcoes[n];
      if (!opcoes[n]) box.insertAdjacentHTML('beforeend', `<button class="btn" type="button" data-again="${n}">Tentar de novo</button>`);
    } finally { btn.disabled = false; }
  }
  // corta/escala para exatamente 1280x720 (16:9)
  function para1280(src) {
    return new Promise((res, rej) => {
      const img = new Image();
      img.onload = () => {
        const W = 1280, H = 720, c = document.createElement('canvas'); c.width = W; c.height = H;
        const k = Math.max(W / img.width, H / img.height), w = img.width * k, h = img.height * k;
        const g = c.getContext('2d'); g.imageSmoothingQuality = 'high'; g.drawImage(img, (W - w) / 2, (H - h) / 2, w, h);
        res(c.toDataURL('image/jpeg', 0.92));
      };
      img.onerror = () => rej(new Error('A imagem gerada veio corrompida. Gere de novo.'));
      img.src = src;
    });
  }

  // ================================================================ 3. ANALISAR VÍDEO
  const HIST_MAX = 60;
  $('anForm').onsubmit = async e => {
    e.preventDefault();
    const url = $('anUrl').value.trim(); if (!url) return;
    $('anGo').disabled = true; $('anOut').innerHTML = '';
    let stop = carregando($('anStatus'), 'Buscando os números do vídeo e do canal…');
    try {
      const { video: v, canal } = await api('video', { url, canal: true });
      stop();
      const hist = store.get('analises', []);
      const antes = hist.filter(h => h.id === v.id).sort((a, b) => b.at.localeCompare(a.at))[0];
      $('anOut').innerHTML = renderNumeros(v, canal, antes) + '<div id="anIA"></div>';
      hist.push({ id: v.id, url: v.url, title: v.title, at: new Date().toISOString(), views: v.views, likes: v.likes, comments: v.comments });
      store.set('analises', hist.slice(-HIST_MAX)); renderHist();

      stop = carregando($('anIA'), 'O Gemini está assistindo e analisando o vídeo… (1 a 3 min)');
      const r = await api('analise', { url: v.url });
      stop(); $('anIA').innerHTML = renderAnalise(r);
    } catch (err) { stop(); erroBox($('anIA') || $('anStatus'), err); }
    finally { $('anGo').disabled = false; }
  };

  function renderNumeros(v, c, antes) {
    const horas = Math.max(1, (Date.now() - new Date(v.publishedAt).getTime()) / 36e5);
    const vph = Math.round(v.views / horas);
    const x = c?.mediaLongos ? v.views / c.mediaLongos : null;
    const cmp = x == null ? '<span class="dim">Sem vídeos longos anteriores para comparar.</span>'
      : x >= 1 ? `<b class="up">${x.toFixed(1).replace('.', ',')}× acima</b> da média do canal`
        : `<b class="down">${(1 / x).toFixed(1).replace('.', ',')}× abaixo</b> da média do canal`;
    let cresc = '';
    if (antes) {
      const dh = Math.max(1 / 60, (Date.now() - new Date(antes.at).getTime()) / 36e5);
      const dv = v.views - antes.views;
      cresc = `<div class="growth">📈 Desde a última análise (${dataBR(antes.at)}, há ${dh < 48 ? Math.round(dh) + ' h' : Math.round(dh / 24) + ' dias'}):
        <b>${dv >= 0 ? '+' : ''}${num(dv)} views</b> (${num(Math.round(dv / dh))}/h)
        ${antes.likes != null && v.likes != null ? ` · ${v.likes - antes.likes >= 0 ? '+' : ''}${num(v.likes - antes.likes)} likes` : ''}
        ${antes.comments != null && v.comments != null ? ` · ${v.comments - antes.comments >= 0 ? '+' : ''}${num(v.comments - antes.comments)} comentários` : ''}</div>`;
    }
    const k = (val, lbl) => `<div class="kpi"><b>${val}</b><small>${lbl}</small></div>`;
    return cardVideo(v, `<p class="cmp">${cmp}${c?.mediaLongos ? ` <span class="dim">(média de ${fmt(c.mediaLongos)} nos últimos ${c.nLongos} longos)</span>` : ''}</p>`) +
      `${cresc}<div class="kpis wide">
        ${k(num(v.views), 'views')}${k(num(vph), 'views por hora')}${k(num(v.likes), 'likes')}${k(num(v.comments), 'comentários')}
        ${k(idade(v.publishedAt), 'no ar')}${k(dur(v.secs), 'duração')}${k(fmt(c?.subs), 'inscritos do canal')}${k(fmt(c?.mediaLongos), 'média dos longos')}
      </div>`;
  }

  function renderAnalise({ analise: a, prazo_base }) {
    const li = arr => `<ul class="list">${(arr || []).map(t => `<li>${esc(t)}</li>`).join('')}</ul>`;
    const asp = a.aspectos || {};
    const ASP = { titulo: 'Título', thumbnail: 'Thumbnail', gancho_30s: 'Gancho (30 s)', ritmo: 'Ritmo', pontos_de_saida: 'Onde o público sai', cta: 'CTA' };
    const voltar = a.quando_voltar || {};
    const voltarTxt = `${voltar.prazo}\n${voltar.motivo}\nO que olhar:\n${(voltar.o_que_olhar || []).map(t => '- ' + t).join('\n')}`;
    return `<div class="blocks">
      <section class="block when"><header><h3>⏰ Quando voltar</h3><div class="b-acts">${copyBtn(voltarTxt)}</div></header>
        <div class="b-body"><p class="big">${esc(voltar.prazo)}</p><p>${esc(voltar.motivo)}</p>${li(voltar.o_que_olhar)}<p class="dim">${esc(prazo_base)}</p></div></section>
      ${bloco('Resumo', `<p>${esc(a.resumo)}</p>`, a.resumo)}
      <div class="two">
        ${bloco('✅ Funcionando', li(a.funcionando), (a.funcionando || []).join('\n'))}
        ${bloco('❌ Não está funcionando', li(a.nao_funcionando), (a.nao_funcionando || []).join('\n'))}
      </div>
      ${bloco('Ponto a ponto', `<dl class="asp">${Object.entries(ASP).map(([k, l]) => `<div><dt>${l}</dt><dd>${esc(asp[k])}</dd></div>`).join('')}</dl>`,
        Object.entries(ASP).map(([k, l]) => `${l}: ${asp[k]}`).join('\n\n'))}
      ${bloco('🛠 Melhorias', `<ol class="list">${(a.melhorias || []).map(t => `<li>${esc(t)}</li>`).join('')}</ol>`, (a.melhorias || []).map((t, i) => `${i + 1}. ${t}`).join('\n'))}
      ${bloco('Títulos alternativos', `<ul class="titles">${(a.titulos_alternativos || []).map(t => `<li><span>${esc(t)}</span>${copyBtn(t)}</li>`).join('')}</ul>`, (a.titulos_alternativos || []).join('\n'))}
      <div class="two">
        ${bloco('Ideia de thumbnail', `<p>${esc(a.ideia_thumbnail)}</p>`, a.ideia_thumbnail)}
        ${bloco('Gancho novo', `<p>${esc(a.gancho_novo)}</p>`, a.gancho_novo)}
      </div>
    </div>`;
  }

  function renderHist() {
    const h = store.get('analises', []);
    if (!h.length) { $('anHist').innerHTML = ''; return; }
    const linhas = h.slice().reverse().slice(0, 15).map(x => `<li><a href="#analise?url=${encodeURIComponent(x.url)}" data-reuse="${esc(x.url)}">${esc(x.title)}</a>
      <span class="dim">${dataBR(x.at)} · ${num(x.views)} views</span></li>`).join('');
    $('anHist').innerHTML = `<section class="block hist"><header><h3>🕘 Análises anteriores <small>guardadas neste navegador</small></h3>
      <div class="b-acts"><button class="btn sm ghost" type="button" data-clearhist>Apagar histórico</button></div></header>
      <div class="b-body"><ul class="histlist">${linhas}</ul></div></section>`;
  }
  document.addEventListener('click', e => {
    if (e.target.closest('[data-clearhist]')) { if (confirm('Apagar o histórico de análises deste navegador?')) { store.del('analises'); renderHist(); } }
    const r = e.target.closest('[data-reuse]');
    if (r) { e.preventDefault(); $('anUrl').value = r.dataset.reuse; window.scrollTo({ top: 0, behavior: 'smooth' }); $('anUrl').focus(); }
  });

  renderHist();
  route();
})();
