(() => {
  const $ = id => document.getElementById(id);
  const DAY = 864e5;
  const store = {
    get(k, d) { try { const v = localStorage.getItem('nf:' + k); return v === null ? d : JSON.parse(v); } catch { return d; } },
    set(k, v) { try { localStorage.setItem('nf:' + k, JSON.stringify(v)); } catch {} },
  };

  let DATA = null, TAX = null, SUBNAME = {};
  const S = Object.assign({ tab: 'mine', sub: 'all', lang: 'all', age: '21', first: '21', best: '10000', sort: 'vpd', text: '' }, store.get('filters', {}));
  let saved = new Set(store.get('saved', []));

  const fmt = n => n == null ? '–' : n >= 1e6 ? (n / 1e6).toFixed(n >= 1e7 ? 0 : 1).replace('.', ',') + ' mi'
    : n >= 1e3 ? (n / 1e3).toFixed(n >= 1e5 ? 0 : 1).replace('.', ',').replace(/,0$/, '') + ' mil' : String(n);
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const days = iso => iso ? (Date.now() - new Date(iso).getTime()) / DAY : Infinity;
  const dfmt = iso => iso ? new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) : '–';
  const dur = s => { const h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60), x = s % 60; return (h ? h + ':' + String(m).padStart(2, '0') : m) + ':' + String(x).padStart(2, '0'); };
  const toast = msg => { const t = $('toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove('show'), 1800); };

  function enrich(c) {
    c.firstD = days(c.firstLongAt || c.firstVideoAt);
    c.ageD = days(c.createdAt);
    c.vpd = Math.round((c.longViews || 0) / Math.max(1, c.firstD));
    c.best = c.top?.[0]?.v || 0;
    const h = c.hist || [];
    c.growth = h.length >= 2 ? h[h.length - 1][1] - h[h.length - 2][1] : 0;
    c.isNew = days(c.discoveredAt) <= 2;
    c.nicheIds = [...new Set((c.tags || []).map(t => t.split('|')[0]))];
  }

  function inTab(c, tab) {
    if (tab === 'all') return true;
    if (tab === 'saved') return saved.has(c.id);
    if (tab === 'mine') return c.nicheIds.includes(TAX.mine.id);
    return c.nicheIds.includes(tab);
  }

  function baseFilter(c) {
    if (S.lang !== 'all' && !(c.langs || []).includes(S.lang)) return false;
    if (c.ageD > +S.age) return false;
    if (c.firstD > +S.first) return false;
    if (c.best < +S.best) return false;
    if (S.text) {
      const q = S.text.toLowerCase();
      if (!(c.title || '').toLowerCase().includes(q) && !(c.top || []).some(v => v.t.toLowerCase().includes(q))) return false;
    }
    return true;
  }

  function renderTabs() {
    const base = DATA.channels.filter(baseFilter);
    const count = tab => base.filter(c => inTab(c, tab)).length;
    const tabs = [
      { id: 'mine', label: `${TAX.mine.emoji} Meu nicho: ${TAX.mine.name}`, cls: 'mine' },
      { id: 'all', label: '🌐 Todos os nichos' },
      { id: 'saved', label: '⭐ Salvos' },
      ...TAX.niches.map(n => ({ id: n.id, label: `${n.emoji} ${n.name}` })),
    ];
    $('tabs').innerHTML = tabs.map(t =>
      `<button class="tab ${t.cls || ''} ${S.tab === t.id ? 'on' : ''}" data-tab="${t.id}">${esc(t.label)} <span class="n">${count(t.id)}</span></button>`).join('');

    const group = S.tab === 'mine' ? TAX.mine : TAX.niches.find(n => n.id === S.tab);
    if (!group) { $('subs').innerHTML = ''; return; }
    const inT = base.filter(c => inTab(c, S.tab));
    $('subs').innerHTML = [`<button class="chip ${S.sub === 'all' ? 'on' : ''}" data-sub="all">Todos <span class="n">${inT.length}</span></button>`]
      .concat(group.subs.map(s => {
        const k = group.id + '|' + s.id;
        const n = inT.filter(c => c.tags.includes(k)).length;
        return `<button class="chip ${S.sub === k ? 'on' : ''}" data-sub="${k}">${esc(s.name)} <span class="n">${n}</span></button>`;
      })).join('');
  }

  function renderLangs() {
    const L = TAX.langs;
    $('langs').innerHTML = [`<button class="chip ${S.lang === 'all' ? 'on' : ''}" data-lang="all">Todos idiomas</button>`]
      .concat(Object.entries(L).map(([k, v]) => `<button class="chip ${S.lang === k ? 'on' : ''}" data-lang="${k}">${v.flag} ${k.toUpperCase()}</button>`)).join('');
  }

  function card(c) {
    const best = c.top[0];
    const flags = (c.langs || []).map(l => TAX.langs[l]?.flag || '').join('');
    const url = 'https://www.youtube.com/channel/' + c.id;
    const handle = c.handle ? (c.handle.startsWith('@') ? c.handle : '@' + c.handle) : '';
    const allTags = [...new Set(c.tags)].sort((a, b) => b.startsWith(TAX.mine.id + '|') - a.startsWith(TAX.mine.id + '|'));
    const tags = allTags.slice(0, 4).map(k => `<span class="tg ${k.startsWith(TAX.mine.id + '|') ? 'mine' : ''}">${esc(SUBNAME[k] || k)}</span>`).join('')
      + (allTags.length > 4 ? `<span class="tg" title="${esc(allTags.slice(4).map(k => SUBNAME[k] || k).join(', '))}">+${allTags.length - 4}</span>` : '');
    const hot = c.vpd >= 20000;
    return `<article class="card ${c.mine ? 'mine' : ''}">
      <a class="thumb" href="https://www.youtube.com/watch?v=${best.id}" target="_blank" rel="noopener">
        <img loading="lazy" onerror="this.style.visibility='hidden'" src="https://i.ytimg.com/vi/${best.id}/mqdefault.jpg" alt="">
        <span class="vv">▶ ${fmt(best.v)} views</span>
        <span class="badges">${c.isNew ? '<span class="b new">NOVO</span>' : ''}${hot ? `<span class="b hot">🔥 ${fmt(c.vpd)}/dia</span>` : ''}</span>
      </a>
      <div class="body">
        <div class="top">
          <img class="av" loading="lazy" onerror="this.style.visibility='hidden'" src="${esc(c.avatar)}" alt="" referrerpolicy="no-referrer">
          <div class="nm"><a href="${url}" target="_blank" rel="noopener">${esc(c.title)}</a><small>${esc(handle)}${c.country ? ' · ' + esc(c.country) : ''}</small></div>
          <span class="flags">${flags}</span>
        </div>
        <div class="kpis">
          <div class="kpi"><b>${fmt(c.longViews)}</b><small>views longos</small></div>
          <div class="kpi"><b>${fmt(c.subs)}</b><small>inscritos</small></div>
          <div class="kpi"><b>${fmt(c.vpd)}</b><small>views/dia</small></div>
          <div class="kpi"><b>${c.longCount}${c.shortCount ? `<small style="font-family:Inter;color:var(--dim)"> +${c.shortCount}s</small>` : ''}</b><small>${c.growth > 0 ? `<span class="up">+${fmt(c.growth)} 24h</span>` : 'vídeos longos'}</small></div>
        </div>
        <div class="vids">${c.top.slice(0, 3).map(v => `<a class="vid" href="https://www.youtube.com/watch?v=${v.id}" target="_blank" rel="noopener"><span class="v">${fmt(v.v)}</span><span class="t">${esc(v.t)}</span><span class="l">${dur(v.s)}</span></a>`).join('')}</div>
        <div class="tags">${tags}</div>
        <div class="meta">
          <span>Criado ${dfmt(c.createdAt)} (${Math.floor(c.ageD)}d) · 1º vídeo ${dfmt(c.firstLongAt)} (${Math.floor(c.firstD)}d)</span>
          <span class="actions">
            <button class="btn ${saved.has(c.id) ? 'saved' : ''}" data-save="${c.id}">${saved.has(c.id) ? '★ Salvo' : '☆ Salvar'}</button>
            <button class="btn" data-copy="${esc(c.top.map(v => v.t).join('\n'))}">Copiar títulos</button>
          </span>
        </div>
      </div>
    </article>`;
  }

  function render() {
    store.set('filters', S);
    renderTabs(); renderLangs();
    let list = DATA.channels.filter(c => baseFilter(c) && inTab(c, S.tab) && (S.sub === 'all' || c.tags.includes(S.sub)));
    const key = { vpd: c => c.vpd, best: c => c.best, views: c => c.longViews, subs: c => c.subs || 0, growth: c => c.growth,
      young: c => -c.firstD, disc: c => new Date(c.discoveredAt).getTime() }[S.sort];
    list.sort((a, b) => key(b) - key(a));
    const total = list.reduce((s, c) => s + (c.longViews || 0), 0);
    $('summary').innerHTML = `<b>${list.length}</b> canais · <b>${fmt(total)}</b> views somadas · <b>${list.filter(c => c.best >= 100000).length}</b> com vídeo de 100 mil+ · <b>${list.filter(c => c.isNew).length}</b> descobertos nas últimas 48 h`;
    $('out').innerHTML = list.length ? `<div class="grid">${list.map(card).join('')}</div>`
      : `<div class="empty"><b>Nenhum canal com esses filtros.</b><br>Tente aumentar a idade máxima do canal, baixar o mínimo de views ou trocar o idioma.</div>`;
  }

  document.addEventListener('click', e => {
    const t = e.target.closest('[data-tab],[data-sub],[data-lang],[data-save],[data-copy]');
    if (!t) return;
    if (t.dataset.tab) { S.tab = t.dataset.tab; S.sub = 'all'; render(); }
    else if (t.dataset.sub) { S.sub = t.dataset.sub; render(); }
    else if (t.dataset.lang) { S.lang = t.dataset.lang; render(); }
    else if (t.dataset.save) {
      const id = t.dataset.save; saved.has(id) ? saved.delete(id) : saved.add(id);
      store.set('saved', [...saved]); render(); toast(saved.has(id) ? 'Canal salvo' : 'Removido dos salvos');
    } else if (t.dataset.copy) {
      navigator.clipboard?.writeText(t.dataset.copy).then(() => toast('Títulos copiados'), () => toast('Não deu para copiar'));
    }
  });
  for (const [id, k] of [['fAge', 'age'], ['fFirst', 'first'], ['fBest', 'best'], ['fSort', 'sort']]) {
    $(id).value = S[k]; $(id).onchange = e => { S[k] = e.target.value; render(); };
  }
  $('fText').value = S.text;
  $('fText').oninput = e => { S.text = e.target.value.trim(); render(); };

  fetch('data/channels.json?t=' + Date.now()).then(r => { if (!r.ok) throw 0; return r.json(); }).then(d => {
    DATA = d; TAX = d.taxonomy;
    SUBNAME = {};
    for (const n of [TAX.mine, ...TAX.niches]) for (const s of n.subs) SUBNAME[n.id + '|' + s.id] = s.name;
    DATA.channels.forEach(enrich);
    const when = new Date(d.updatedAt);
    $('upd').innerHTML = `Atualizado <b>${when.toLocaleDateString('pt-BR')} às ${when.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</b><br>${d.stats.tracked} canais novos acompanhados · ${d.stats.searches} buscas hoje`;
    if (!TAX.niches.some(n => n.id === S.tab) && !['mine', 'all', 'saved'].includes(S.tab)) S.tab = 'mine';
    render();
  }).catch(() => {
    $('upd').textContent = 'sem dados ainda';
    $('out').innerHTML = `<div class="empty"><b>O robô ainda não rodou.</b><br>No GitHub, abra a aba <b>Actions</b>, escolha <b>Atualizar Niche Finder</b> e clique em <b>Run workflow</b>. Em alguns minutos os canais aparecem aqui.</div>`;
  });
})();
