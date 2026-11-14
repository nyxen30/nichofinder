(() => {
  const $ = id => document.getElementById(id);
  const DAY = 864e5;
  const store = {
    get(k, d) { try { const v = localStorage.getItem('nf:' + k); return v === null ? d : JSON.parse(v); } catch { return d; } },
    set(k, v) { try { localStorage.setItem('nf:' + k, JSON.stringify(v)); } catch {} },
  };

  // ------------------------------------------------------------ estado
  const DEFAULTS = { lang: 'all', age: '21', first: '21', best: '10000', sort: 'vpd', text: '' };
  let DATA = null, TAX = null, SUBNAME = {}, GROUPS = [];
  // aproveita os filtros que a pessoa já usava no site antigo (chave "filters")
  const old = store.get('filters', {});
  const fromOld = Object.fromEntries(Object.keys(DEFAULTS).filter(k => old[k] != null).map(k => [k, old[k]]));
  if (old.tab) { fromOld.view = old.tab; fromOld.sub = old.sub || 'all'; }
  const S = Object.assign({ view: 'mine', sub: 'all' }, DEFAULTS, fromOld, store.get('view2', {}));
  const open = new Set(store.get('open', ['sem-superficie']));
  let saved = new Set(store.get('saved', []));

  // ------------------------------------------------------------ formatação
  const fmt = n => n == null ? '–' : n >= 1e6 ? (n / 1e6).toFixed(n >= 1e7 ? 0 : 1).replace('.', ',') + ' mi'
    : n >= 1e3 ? (n / 1e3).toFixed(n >= 1e5 ? 0 : 1).replace('.', ',').replace(/,0$/, '') + ' mil' : String(n);
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const days = iso => iso ? (Date.now() - new Date(iso).getTime()) / DAY : Infinity;
  const dfmt = iso => iso ? new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' }) : '–';
  const dur = s => { const h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60), x = s % 60; return (h ? h + ':' + String(m).padStart(2, '0') : m) + ':' + String(x).padStart(2, '0'); };
  const plural = (n, a, b) => `${n} ${n === 1 ? a : b}`;
  const toast = msg => { const t = $('toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove('show'), 1800); };
  // avatar com a inicial do canal por baixo (aparece se a foto não carregar)
  const avatar = (c, cls = '') => `<span class="av ${cls}" aria-hidden="true">${esc([...(c.title || '?').trim()][0] || '?').toUpperCase()}${c.avatar
    ? `<img loading="lazy" src="${esc(c.avatar)}" alt="" referrerpolicy="no-referrer" onerror="this.remove()">` : ''}</span>`;
  const chev ='<svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg>';

  function enrich(c) {
    c.tags ||= []; c.top ||= [];
    c.firstD = days(c.firstLongAt || c.firstVideoAt);
    c.ageD = days(c.createdAt);
    c.vpd = Math.round((c.longViews || 0) / Math.max(1, c.firstD));
    c.best = c.top[0]?.v || 0;
    const h = c.hist || [];
    c.growth = h.length >= 2 ? h[h.length - 1][1] - h[h.length - 2][1] : 0;
    c.isNew = days(c.discoveredAt) <= 2;
    c.nicheIds = [...new Set(c.tags.map(t => t.split('|')[0]))];
  }

  // ------------------------------------------------------------ filtros
  function inView(c, view) {
    if (view === 'all') return true;
    if (view === 'saved') return saved.has(c.id);
    return c.nicheIds.includes(view);
  }
  function baseFilter(c) {
    if (S.lang !== 'all' && !(c.langs || []).includes(S.lang)) return false;
    if (c.ageD > +S.age) return false;
    if (c.firstD > +S.first) return false;
    if (c.best < +S.best) return false;
    if (S.text) {
      const q = S.text.toLowerCase();
      if (!(c.title || '').toLowerCase().includes(q) && !c.top.some(v => (v.t || '').toLowerCase().includes(q))) return false;
    }
    return true;
  }
  const changedFilters = () => ['lang', 'age', 'first', 'best', 'sort'].filter(k => S[k] !== DEFAULTS[k]).length + (S.text ? 1 : 0);

  // ------------------------------------------------------------ barra lateral
  function renderNav(base) {
    const count = v => base.filter(c => inView(c, v)).length;
    const subCount = (gid, sid) => base.filter(c => c.tags.includes(gid + '|' + sid)).length;

    const group = (g, isMine) => {
      const isOpen = open.has(g.id);
      const on = S.view === g.id && S.sub === 'all';
      const subs = g.subs.map(s => {
        const k = g.id + '|' + s.id, n = subCount(g.id, s.id);
        return `<li><button class="sub ${S.sub === k ? 'on' : ''} ${n ? '' : 'zero'}" data-view="${g.id}" data-sub="${k}">
          <span class="lbl">${esc(s.name)}</span><span class="n">${n}</span></button></li>`;
      }).join('');
      return `<div class="${isMine ? 'mine-box' : ''}">
        <button class="nav-item ${on ? 'on' : ''}" data-group="${g.id}" aria-expanded="${isOpen}">
          <span class="em">${g.emoji}</span><span class="lbl">${esc(g.name)}</span><span class="n">${count(g.id)}</span>${chev}
        </button>
        <div class="subs ${isOpen ? 'open' : ''}"><div><ul>${subs}</ul></div></div>
      </div>`;
    };
    const flat = (id, em, label) =>
      `<button class="nav-item ${S.view === id ? 'on' : ''}" data-view="${id}"><span class="em">${em}</span><span class="lbl">${label}</span><span class="n">${count(id)}</span></button>`;

    $('nav').innerHTML =
      `<p class="sec">Meu canal</p>${group(TAX.mine, true)}
       <p class="sec">Atalhos</p>${flat('all', '🌐', 'Todos os nichos')}${flat('saved', '⭐', 'Salvos')}
       <p class="sec">Nichos</p>${TAX.niches.map(n => group(n, false)).join('')}`;
  }

  // ------------------------------------------------------------ cards
  function card(c) {
    const best = c.top[0];
    const flags = (c.langs || []).map(l => TAX.langs[l]?.flag || '').join('');
    const handle = c.handle ? (c.handle.startsWith('@') ? c.handle : '@' + c.handle) : '';
    const hot = c.vpd >= 20000;
    return `<article class="card ${c.mine ? 'mine' : ''}" data-open="${c.id}" tabindex="0" aria-label="${esc(c.title)}">
      <div class="thumb">
        <img loading="lazy" onerror="this.style.visibility='hidden'" src="https://i.ytimg.com/vi/${best.id}/mqdefault.jpg" alt="">
        <span class="badges">${c.isNew ? '<span class="b new">NOVO</span>' : ''}${hot ? '<span class="b hot">🔥</span>' : ''}</span>
        <span class="vv">▶ ${fmt(best.v)}</span>
        <button class="star ${saved.has(c.id) ? 'on' : ''}" data-save="${c.id}" aria-label="${saved.has(c.id) ? 'Remover dos salvos' : 'Salvar canal'}">${saved.has(c.id) ? '★' : '☆'}</button>
      </div>
      <div class="c-body">
        <div class="c-top">
          ${avatar(c)}
          <div class="c-name"><b>${esc(c.title)}</b><small>${esc(handle)}</small></div>
          <span class="flags">${flags}</span>
        </div>
        <div class="c-stats">
          <div><b class="acc">${fmt(c.vpd)}</b><small>views/dia</small></div>
          <div><b>${fmt(c.subs)}</b><small>inscritos</small></div>
          <div><b>${Math.floor(c.firstD)}d</b><small>1º vídeo</small></div>
        </div>
      </div>
    </article>`;
  }

  function render() {
    store.set('view2', S); store.set('open', [...open]);
    const base = DATA.channels.filter(baseFilter);
    renderNav(base);

    // título
    const g = S.view === 'mine' ? TAX.mine : [TAX.mine, ...TAX.niches].find(n => n.id === S.view);
    const titles = { all: ['', 'Todos os nichos'], saved: ['', 'Canais salvos'] };
    const [crumb, title, plain] = g
      ? (S.sub === 'all' ? [g.id === TAX.mine.id ? 'Meu nicho' : 'Nicho', `${g.emoji} ${g.name}`, g.name]
                         : [`${g.emoji} ${g.name}`, SUBNAME[S.sub] || S.sub, SUBNAME[S.sub] || S.sub])
      : [...(titles[S.view] || ['', '']), (titles[S.view] || ['', ''])[1]];
    $('crumb').textContent = crumb; $('title').textContent = title;
    document.title = plain && plain !== 'Sem Superfície' ? `${plain} · Sem Superfície` : 'Sem Superfície · canais novos que estão crescendo';

    // lista
    let list = base.filter(c => inView(c, S.view) && (S.sub === 'all' || c.tags.includes(S.sub)));
    const key = { vpd: c => c.vpd, best: c => c.best, views: c => c.longViews || 0, subs: c => c.subs || 0, growth: c => c.growth,
      young: c => -c.firstD, disc: c => new Date(c.discoveredAt).getTime() || 0 }[S.sort] || (c => c.vpd);
    list.sort((a, b) => key(b) - key(a));
    const total = list.reduce((s, c) => s + (c.longViews || 0), 0);
    $('summary').innerHTML = list.length
      ? `<b>${plural(list.length, 'canal', 'canais')}</b> · ${fmt(total)} views · ${list.filter(c => c.isNew).length} novos em 48 h`
      : '';
    $('out').innerHTML = list.length ? `<div class="grid">${list.map(card).join('')}</div>`
      : `<div class="empty"><b>${S.view === 'saved' && !saved.size ? 'Nenhum canal salvo ainda' : 'Nenhum canal com esses filtros'}</b>
         ${S.view === 'saved' && !saved.size ? 'Toque na ☆ de um card para guardar o canal aqui.' : 'Tente aumentar a idade máxima, baixar o mínimo de views ou trocar o idioma.'}
         ${S.view !== 'saved' && (+S.age < 45 || +S.first < 45) ? '<br><button class="btn primary" data-widen>Mostrar canais de até 45 dias</button>' : ''}
         ${changedFilters() ? ' <button class="btn" data-clear>Limpar filtros</button>' : ''}</div>`;

    // painel de filtros
    const n = changedFilters();
    $('fCount').textContent = n || '';
    $('fClear').disabled = !n;
    for (const [id, k] of [['fLang', 'lang'], ['fAge', 'age'], ['fFirst', 'first'], ['fBest', 'best'], ['fSort', 'sort']]) {
      $(id).value = S[k]; $(id).classList.toggle('changed', S[k] !== DEFAULTS[k]);
    }
    if ($('fText').value !== S.text) $('fText').value = S.text;
  }

  // ------------------------------------------------------------ detalhe do canal
  function spark(hist) {
    if (!hist || hist.length < 2) return '';
    const v = hist.map(h => h[1]), min = Math.min(...v), max = Math.max(...v), W = 600, H = 46;
    const pts = v.map((y, i) => [i / (v.length - 1) * W, H - 4 - (max === min ? .5 : (y - min) / (max - min)) * (H - 8)]);
    const d = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
    return `<p class="d-sec">Views do canal · últimos ${hist.length} dias</p>
      <svg class="spark" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" aria-hidden="true">
        <path d="${d} L${W} ${H} L0 ${H}Z" fill="rgba(69,227,211,.12)"/>
        <path d="${d}" fill="none" stroke="#45e3d3" stroke-width="2" vector-effect="non-scaling-stroke"/></svg>`;
  }

  function openDetail(id) {
    const c = DATA.channels.find(x => x.id === id); if (!c) return;
    const url = 'https://www.youtube.com/channel/' + c.id;
    const handle = c.handle ? (c.handle.startsWith('@') ? c.handle : '@' + c.handle) : '';
    const langs = (c.langs || []).map(l => `${TAX.langs[l]?.flag || ''} ${TAX.langs[l]?.label || l}`).join(', ');
    const tags = [...new Set(c.tags)].sort((a, b) => b.startsWith(TAX.mine.id + '|') - a.startsWith(TAX.mine.id + '|'))
      .map(k => `<span class="tg ${k.startsWith(TAX.mine.id + '|') ? 'mine' : ''}">${esc(SUBNAME[k] || k)}</span>`).join('');
    const isSaved = saved.has(c.id);
    $('dBody').innerHTML = `
      <div class="d-head">
        ${avatar(c, 'lg')}
        <div class="c-name"><b id="dTitle">${esc(c.title)}</b><small>${esc(handle)}${c.country ? ' · ' + esc(c.country) : ''}</small></div>
        <button class="iconbtn" data-close aria-label="Fechar"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
      </div>
      <div class="kpis">
        <div class="kpi"><b>${fmt(c.vpd)}</b><small>views/dia</small></div>
        <div class="kpi"><b>${fmt(c.longViews)}</b><small>views em longos</small></div>
        <div class="kpi"><b>${fmt(c.subs)}</b><small>inscritos</small></div>
        <div class="kpi"><b>${c.growth > 0 ? `<span class="up">+${fmt(c.growth)}</span>` : '–'}</b><small>views em 24 h</small></div>
      </div>
      <p class="d-sec">Vídeos longos mais vistos</p>
      <div class="vids">${c.top.map(v => `<a class="vid" href="https://www.youtube.com/watch?v=${v.id}" target="_blank" rel="noopener">
        <img loading="lazy" src="https://i.ytimg.com/vi/${v.id}/mqdefault.jpg" alt="" onerror="this.style.visibility='hidden'">
        <span class="t">${esc(v.t)}</span><span class="m"><b>${fmt(v.v)}</b>${dur(v.s || 0)}</span></a>`).join('')}</div>
      ${spark(c.hist)}
      ${tags ? `<p class="d-sec">Nichos</p><div class="tags">${tags}</div>` : ''}
      <dl class="facts">
        <div><dt>Canal criado</dt><dd>${dfmt(c.createdAt)} (${Math.floor(c.ageD)}d)</dd></div>
        <div><dt>1º vídeo longo</dt><dd>${dfmt(c.firstLongAt)} (${Math.floor(c.firstD)}d)</dd></div>
        <div><dt>Último vídeo longo</dt><dd>${dfmt(c.lastLongAt)}</dd></div>
        <div><dt>Descoberto</dt><dd>${dfmt(c.discoveredAt)}</dd></div>
        <div><dt>Vídeos</dt><dd>${c.longCount || 0} longos${c.shortCount ? ` + ${c.shortCount} shorts` : ''}</dd></div>
        <div><dt>Idiomas</dt><dd>${esc(langs) || '–'}</dd></div>
      </dl>
      <div class="d-actions">
        <a class="btn primary" href="${url}" target="_blank" rel="noopener">Abrir no YouTube ↗</a>
        <button class="btn ${isSaved ? 'saved' : ''}" data-save="${c.id}">${isSaved ? '★ Salvo' : '☆ Salvar'}</button>
        <button class="btn" data-copy="${c.id}">Copiar títulos</button>
      </div>`;
    const dlg = $('detail');
    if (!dlg.open) dlg.showModal();
    dlg.querySelector('.d-inner').scrollTop = 0;
  }

  // ------------------------------------------------------------ menu do celular
  const setMenu = on => {
    document.body.classList.toggle('menu-open', on);
    $('shade').hidden = !on;
    $('menuBtn').setAttribute('aria-expanded', on);
  };
  $('menuBtn').onclick = () => setMenu(true);
  $('closeBtn').onclick = () => setMenu(false);
  $('shade').onclick = () => setMenu(false);
  const isMobile = () => matchMedia('(max-width:900px)').matches;

  // ------------------------------------------------------------ cliques
  function toggleSave(id) {
    saved.has(id) ? saved.delete(id) : saved.add(id);
    store.set('saved', [...saved]);
    toast(saved.has(id) ? 'Canal salvo' : 'Removido dos salvos');
  }
  function clearFilters() { Object.assign(S, DEFAULTS); render(); toast('Filtros limpos'); }

  document.addEventListener('click', e => {
    const t = e.target.closest('[data-group],[data-view],[data-save],[data-copy],[data-open],[data-close],[data-clear],[data-widen]');
    if (!t) { if (e.target === $('detail')) $('detail').close(); return; }

    if (t.dataset.group) {                       // nicho (acordeão)
      const id = t.dataset.group;
      if (S.view === id && S.sub === 'all' && open.has(id)) open.delete(id);   // clicou de novo: fecha
      else { S.view = id; S.sub = 'all'; open.clear(); open.add(id); }        // abre só este
      render(); return;
    }
    if (t.dataset.view) {                        // atalho ou subnicho
      S.view = t.dataset.view; S.sub = t.dataset.sub || 'all';
      render(); if (isMobile()) setMenu(false); window.scrollTo({ top: 0 }); return;
    }
    if (t.dataset.save) {
      e.stopPropagation(); toggleSave(t.dataset.save); render();
      if ($('detail').open) openDetail(t.dataset.save);
      return;
    }
    if (t.dataset.copy) {
      const c = DATA.channels.find(x => x.id === t.dataset.copy);
      navigator.clipboard?.writeText(c.top.map(v => v.t).join('\n')).then(() => toast('Títulos copiados'), () => toast('Não deu para copiar'));
      return;
    }
    if ('close' in t.dataset) { $('detail').close(); return; }
    if ('clear' in t.dataset) { clearFilters(); return; }
    if ('widen' in t.dataset) { S.age = '45'; S.first = '45'; render(); return; }
    if (t.dataset.open) openDetail(t.dataset.open);
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && document.body.classList.contains('menu-open')) setMenu(false);
    const card = e.target.closest?.('[data-open]');
    if (card && (e.key === 'Enter' || e.key === ' ') && e.target === card) { e.preventDefault(); openDetail(card.dataset.open); }
  });

  for (const [id, k] of [['fLang', 'lang'], ['fAge', 'age'], ['fFirst', 'first'], ['fBest', 'best'], ['fSort', 'sort']])
    $(id).onchange = e => { S[k] = e.target.value; render(); };
  let typing;
  $('fText').oninput = e => { clearTimeout(typing); typing = setTimeout(() => { S.text = e.target.value.trim(); render(); }, 150); };
  $('fClear').onclick = clearFilters;
  $('fToggle').onclick = () => {
    const f = document.querySelector('.filters'); f.classList.toggle('open');
    $('fToggle').setAttribute('aria-expanded', f.classList.contains('open'));
  };

  // ------------------------------------------------------------ carrega os dados
  fetch('data/channels.json?t=' + Date.now()).then(r => { if (!r.ok) throw 0; return r.json(); }).then(d => {
    DATA = d; TAX = d.taxonomy;
    SUBNAME = {};
    for (const n of [TAX.mine, ...TAX.niches]) for (const s of n.subs) SUBNAME[n.id + '|' + s.id] = s.name;
    DATA.channels = (DATA.channels || []).filter(c => c.top?.length);
    DATA.channels.forEach(enrich);
    if (S.view === 'mine') S.view = TAX.mine.id;
    const valid = [TAX.mine.id, 'all', 'saved', ...TAX.niches.map(n => n.id)];
    if (!valid.includes(S.view)) { S.view = TAX.mine.id; S.sub = 'all'; }
    if (S.sub !== 'all' && !SUBNAME[S.sub]) S.sub = 'all';
    $('fLang').innerHTML = `<option value="all">Todos</option>` +
      Object.entries(TAX.langs).map(([k, v]) => `<option value="${k}">${v.flag} ${v.label}</option>`).join('');
    const when = new Date(d.updatedAt);
    $('upd').innerHTML = `Atualizado <b>${when.toLocaleDateString('pt-BR')} ${when.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</b><br>${d.stats?.tracked ?? DATA.channels.length} canais acompanhados`;
    render();
  }).catch(() => {
    $('upd').textContent = 'sem dados ainda';
    $('title').textContent = 'Sem dados ainda';
    $('out').innerHTML = `<div class="empty"><b>O robô ainda não rodou</b>No GitHub, abra a aba <b>Actions</b>, escolha <b>Atualizar Niche Finder</b> e clique em <b>Run workflow</b>. Em alguns minutos os canais aparecem aqui.</div>`;
  });
})();
