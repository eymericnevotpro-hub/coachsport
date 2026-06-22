/* ============================================================
   Coach — app logic (vanilla JS, no build, localStorage)
   ============================================================ */
(function () {
  'use strict';

  const STORE_KEY = 'coachsport_v1';

  /* ---------- Static data ---------- */
  const ACCENTS = [
    { id: 'lime',   val: '#C5FF41', val2: '#9BE800' },
    { id: 'orange', val: '#FF7A1A', val2: '#FF5C00' },
    { id: 'blue',   val: '#4DA3FF', val2: '#1E7BFF' },
    { id: 'violet', val: '#B98CFF', val2: '#8A5CFF' },
  ];

  const PROGRAMS = [
    { id: 'push', name: 'Push — Pecs / Épaules / Triceps', exercises: [
      { id: 'dc',      name: 'Développé couché',            target: '4 × 6-8' },
      { id: 'dm',      name: 'Développé militaire',         target: '4 × 8' },
      { id: 'incline', name: 'Développé incliné haltères',  target: '3 × 10' },
      { id: 'dips',    name: 'Dips lestés',                 target: '3 × 8' },
      { id: 'triceps', name: 'Extension triceps poulie',    target: '3 × 12' },
    ]},
    { id: 'pull', name: 'Pull — Dos / Biceps', exercises: [
      { id: 'sdt',     name: 'Soulevé de terre',            target: '4 × 5' },
      { id: 'pullup',  name: 'Tractions lestées',           target: '4 × 6-8' },
      { id: 'row',     name: 'Rowing barre',                target: '4 × 8' },
      { id: 'curl',    name: 'Curl barre',                  target: '3 × 10' },
      { id: 'face',    name: 'Face pull',                   target: '3 × 15' },
    ]},
    { id: 'legs', name: 'Legs — Jambes', exercises: [
      { id: 'squat',   name: 'Squat',                       target: '4 × 6-8' },
      { id: 'rdl',     name: 'Soulevé de terre roumain',    target: '3 × 8' },
      { id: 'press',   name: 'Presse à cuisses',            target: '3 × 12' },
      { id: 'legcurl', name: 'Leg curl',                    target: '3 × 12' },
      { id: 'calf',    name: 'Mollets debout',              target: '4 × 15' },
    ]},
    { id: 'full', name: 'Full Body', exercises: [
      { id: 'fsquat',  name: 'Squat',                       target: '3 × 8' },
      { id: 'fbench',  name: 'Développé couché',            target: '3 × 8' },
      { id: 'frow',    name: 'Rowing',                      target: '3 × 8' },
      { id: 'fohp',    name: 'Développé militaire',         target: '3 × 10' },
      { id: 'fcurl',   name: 'Curl',                        target: '3 × 12' },
    ]},
  ];

  const SKILLS = [
    { id: 'muscleup', emoji: '💪', name: 'Muscle-up', steps: [
      'Tractions strictes × 10', 'Tractions explosives (sternum à la barre)',
      'Dips lestés +20 kg', 'Transition négative lente',
      'Muscle-up assisté (élastique)', 'Muscle-up strict',
    ]},
    { id: 'planche', emoji: '🧘', name: 'Full Planche', steps: [
      'Planche lean (gainage)', 'Tuck planche', 'Advanced tuck planche',
      'Straddle planche', 'Full planche',
    ]},
    { id: 'frontlever', emoji: '🪂', name: 'Front Lever', steps: [
      'Tuck front lever', 'Advanced tuck', 'One-leg front lever',
      'Straddle front lever', 'Full front lever',
    ]},
    { id: 'handstand', emoji: '🤸', name: 'Handstand', steps: [
      'Handstand dos au mur', 'Handstand ventre au mur (alignement)',
      'Kick-up + tenue 5 s', 'Handstand libre 10 s', 'Handstand libre 30 s',
    ]},
  ];

  const TIPS = [
    'Ectomorphe ? Vise un surplus de +300 à +500 kcal/jour. Le muscle se construit en cuisine autant qu’à la salle.',
    '2 g de protéines par kg de poids de corps : c’est ton minimum pour prendre du muscle.',
    'Surcharge progressive : ajoute des reps ou du poids chaque semaine, même un peu.',
    'Dors 7 à 9 h. La croissance musculaire se fait surtout pendant le sommeil.',
    'Muscle-up : maîtrise d’abord 10 tractions strictes ET 10 dips lestés.',
    'Handstand : travaille l’équilibre tous les jours, même 5 min. La fréquence prime.',
    'Front lever : garde les omoplates basses, « tire la barre vers les hanches ».',
    'Hydrate-toi : ~35 ml d’eau par kg de poids de corps par jour.',
  ];

  const DAY_PLAN = [
    { label: 'Calisthénie & mobilité', prog: null },  // Dimanche
    { label: 'Push',                   prog: 'push' }, // Lundi
    { label: 'Pull',                   prog: 'pull' }, // Mardi
    { label: 'Legs',                   prog: 'legs' }, // Mercredi
    { label: 'Push',                   prog: 'push' }, // Jeudi
    { label: 'Pull',                   prog: 'pull' }, // Vendredi
    { label: 'Calisthénie',            prog: null },   // Samedi
  ];

  /* ---------- Icons ---------- */
  const S = 'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';
  const ICONS = {
    home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5"/>',
    dumbbell: '<line x1="4" y1="9" x2="4" y2="15"/><line x1="7" y1="6.5" x2="7" y2="17.5"/><line x1="17" y1="6.5" x2="17" y2="17.5"/><line x1="20" y1="9" x2="20" y2="15"/><line x1="7" y1="12" x2="17" y2="12"/>',
    apple: '<path d="M12 8c-1.4-2.2-5-2.6-6.5-.2C4 9.6 5 14 7.4 16.8c1 1.1 1.9 2 4.6 2s3.6-.9 4.6-2C19 14 20 9.6 18.5 7.8 17 5.4 13.4 5.8 12 8z"/><path d="M12 8c.2-1.8 1.2-3 3-3.4"/>',
    trending: '<polyline points="3 17 9 11 13 15 21 7"/><polyline points="15 7 21 7 21 13"/>',
    user: '<circle cx="12" cy="8" r="3.6"/><path d="M4.5 20c0-3.6 3.4-5.6 7.5-5.6s7.5 2 7.5 5.6"/>',
    plus: '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
    check: '<polyline points="20 6 9 17 4 12"/>',
    camera: '<path d="M4 8h2.5L8 6h8l1.5 2H20a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/><circle cx="12" cy="13" r="3.4"/>',
    bolt: '<path d="M13 2 4.5 13.5H11l-1 8.5L19.5 10H13z"/>',
    trash: '<path d="M4 7h16"/><path d="M9 7V4.5h6V7"/><path d="M6.5 7l.9 12.2a1 1 0 0 0 1 .8h7.2a1 1 0 0 0 1-.8L18.5 7"/>',
  };
  const PLAY = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
  function icon(n) { return '<svg viewBox="0 0 24 24" ' + S + '>' + (ICONS[n] || '') + '</svg>'; }

  /* ---------- State ---------- */
  function defaultState() {
    return {
      profile: {
        name: 'Eymeric', objectives: ['Prise de muscle', 'Calisthénie'],
        morph: 'Ectomorphe', age: null, height: null,
        startWeight: null, targetWeight: null, accent: 'lime',
      },
      nutrition: { kcalTarget: 2900, proTarget: 180, log: {} },
      weights: [],
      photos: { before: null, after: null },
      measures: { bras: null, poitrine: null, cuisse: null, taille: null },
      training: { skills: {}, salleLog: {} },
      activity: { days: [], streak: 0 },
    };
  }

  function migrate(s) {
    const d = defaultState();
    const out = Object.assign({}, d, s);
    out.profile   = Object.assign({}, d.profile, s.profile);
    out.nutrition = Object.assign({}, d.nutrition, s.nutrition);
    out.nutrition.log = (s.nutrition && s.nutrition.log) || {};
    out.training  = Object.assign({}, d.training, s.training);
    out.training.skills   = (s.training && s.training.skills) || {};
    out.training.salleLog = (s.training && s.training.salleLog) || {};
    out.photos    = Object.assign({}, d.photos, s.photos);
    out.measures  = Object.assign({}, d.measures, s.measures);
    out.activity  = Object.assign({}, d.activity, s.activity);
    out.activity.days = Array.isArray(out.activity.days) ? out.activity.days : [];
    out.weights   = Array.isArray(s.weights) ? s.weights : [];
    return out;
  }

  function load() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      return raw ? migrate(JSON.parse(raw)) : defaultState();
    } catch (e) { return defaultState(); }
  }
  function save() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); }
    catch (e) { console.warn('Sauvegarde impossible', e); }
  }

  let state = load();
  let currentTab = 'home';
  const ui = { trainTab: 'salle', selectedProgram: 'push' };

  /* ---------- Helpers ---------- */
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function sum(arr, k) { return arr.reduce(function (a, x) { return a + (Number(x[k]) || 0); }, 0); }
  function clamp(x) { return Math.max(0, Math.min(1, isFinite(x) ? x : 0)); }
  function valOf(id) { const e = document.getElementById(id); return e ? e.value.trim() : ''; }
  function numFrom(v) { return v === '' || v == null ? null : parseFloat(String(v).replace(',', '.')); }
  function dateKey(d) {
    const z = function (n) { return String(n).padStart(2, '0'); };
    return d.getFullYear() + '-' + z(d.getMonth() + 1) + '-' + z(d.getDate());
  }
  function todayStr() { return dateKey(new Date()); }
  function daysAgo(ds) {
    const d = new Date(ds + 'T00:00:00'); const n = new Date(); n.setHours(0, 0, 0, 0);
    return Math.round((n - d) / 86400000);
  }
  function todayPlan() { return DAY_PLAN[new Date().getDay()]; }
  function greeting() {
    const h = new Date().getHours();
    return h < 6 ? 'Bonne nuit' : h < 12 ? 'Bonjour' : h < 18 ? 'Bon après-midi' : 'Bonsoir';
  }
  function computeStreak(days) {
    const set = new Set(days); let s = 0; const d = new Date();
    if (!set.has(dateKey(d))) d.setDate(d.getDate() - 1);
    while (set.has(dateKey(d))) { s++; d.setDate(d.getDate() - 1); }
    return s;
  }
  function markActive() {
    const t = todayStr();
    if (!state.activity.days.includes(t)) state.activity.days.push(t);
    state.activity.streak = computeStreak(state.activity.days);
  }
  function lastKg(exId) {
    const log = state.training.salleLog || {};
    const dates = Object.keys(log).filter(function (d) { return d < todayStr(); }).sort().reverse();
    for (let i = 0; i < dates.length; i++) {
      const v = log[dates[i]][exId];
      if (v && v.kg != null) return v.kg;
    }
    return null;
  }
  function applyAccent() {
    const a = ACCENTS.find(function (x) { return x.id === state.profile.accent; }) || ACCENTS[0];
    document.documentElement.style.setProperty('--accent', a.val);
    document.documentElement.style.setProperty('--accent-2', a.val2);
  }

  function ringSvg(pct, mid) {
    const r = 33, c = 2 * Math.PI * r, off = c * (1 - clamp(pct));
    return '<div class="ring"><svg width="78" height="78" viewBox="0 0 78 78">' +
      '<circle cx="39" cy="39" r="' + r + '" fill="none" stroke="var(--surface-3)" stroke-width="7"/>' +
      '<circle cx="39" cy="39" r="' + r + '" fill="none" stroke="var(--accent)" stroke-width="7" stroke-linecap="round" ' +
      'stroke-dasharray="' + c.toFixed(1) + '" stroke-dashoffset="' + off.toFixed(1) + '"/></svg>' +
      '<div class="ring-mid">' + mid + '</div></div>';
  }
  function ringCard(pct, mid, label, sub, nav) {
    return '<div class="ring-card"' + (nav ? ' data-act="nav" data-tab="' + nav + '"' : '') + '>' +
      ringSvg(pct, mid) + '<div class="rc-label">' + label + '</div><div class="rc-sub">' + sub + '</div></div>';
  }

  function weightChart() {
    const ws = state.weights.slice(-14);
    if (ws.length < 2) {
      return '<div class="empty">' + icon('trending') + '<div>Ajoute au moins 2 pesées pour voir ta courbe.</div></div>';
    }
    const W = 320, H = 140, pad = 10;
    const kgs = ws.map(function (w) { return w.kg; });
    const min = Math.min.apply(null, kgs), max = Math.max.apply(null, kgs), span = (max - min) || 1;
    const x = function (i) { return pad + i * ((W - 2 * pad) / (ws.length - 1)); };
    const y = function (k) { return H - pad - ((k - min) / span) * (H - 2 * pad - 6) - 3; };
    const pts = ws.map(function (w, i) { return [x(i), y(w.kg)]; });
    const line = pts.map(function (p, i) { return (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join(' ');
    const area = 'M' + pts[0][0].toFixed(1) + ' ' + (H - pad).toFixed(1) + ' ' +
      pts.map(function (p) { return 'L' + p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join(' ') +
      ' L' + pts[pts.length - 1][0].toFixed(1) + ' ' + (H - pad).toFixed(1) + ' Z';
    const dots = pts.map(function (p) { return '<circle class="pt" cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="3"/>'; }).join('');
    return '<svg class="chart" viewBox="0 0 ' + W + ' ' + H + '">' +
      '<defs><linearGradient id="g-accent" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0" stop-color="var(--accent)" stop-opacity=".28"/>' +
      '<stop offset="1" stop-color="var(--accent)" stop-opacity="0"/></linearGradient></defs>' +
      '<path class="area" d="' + area + '"/><path class="line" d="' + line + '"/>' + dots + '</svg>';
  }

  /* ---------- Views ---------- */
  function viewHome() {
    const t = todayStr(), plan = todayPlan();
    const meals = state.nutrition.log[t] || [];
    const kcal = sum(meals, 'kcal'), pro = sum(meals, 'pro');
    const kcalT = state.nutrition.kcalTarget, proT = state.nutrition.proTarget;
    const wToday = (state.weights.find(function (w) { return w.date === t; }) || {}).kg;
    const curW = state.weights.length ? state.weights[state.weights.length - 1].kg : state.profile.startWeight;
    const tip = TIPS[new Date().getDate() % TIPS.length];
    const sessions7 = state.activity.days.filter(function (d) { return daysAgo(d) < 7; }).length;
    const isSkill = !plan.prog;
    return '' +
      '<div class="hero"><div class="eyebrow">' + (isSkill ? 'Jour calisthénie' : 'Séance du jour') + '</div>' +
      '<h2>' + plan.label + '</h2><p>' + (isSkill
        ? 'Travaille tes skills : muscle-up, planche, front lever, handstand.'
        : 'Surcharge progressive — bats ta dernière perf.') + '</p>' +
      '<button class="btn btn-primary btn-block" data-act="start-session" data-prog="' + (plan.prog || '') + '">' + PLAY + ' Commencer la séance</button></div>' +
      '<div class="section-title">Aujourd’hui</div>' +
      '<div class="rings">' +
        ringCard(kcal / kcalT, Math.round(kcal / kcalT * 100) + '%', 'Calories', kcal + ' / ' + kcalT, 'nutrition') +
        ringCard(pro / proT, pro + 'g', 'Protéines', 'sur ' + proT + ' g', 'nutrition') +
        ringCard(wToday ? 1 : 0, wToday ? wToday : '+', 'Poids', wToday ? 'noté ✓' : 'à noter', 'progress') +
      '</div>' +
      '<div class="tip"><div class="tip-ic">' + icon('bolt') + '</div><p>' + tip + '</p></div>' +
      '<div class="grid-2">' +
        '<div class="card"><div class="muted" style="font-size:12px;font-weight:600">Poids actuel</div>' +
        '<div class="big-num" style="margin-top:8px">' + (curW ? curW : '—') + '<span class="unit"> kg</span></div></div>' +
        '<div class="card"><div class="muted" style="font-size:12px;font-weight:600">Série</div>' +
        '<div class="big-num streak" style="margin-top:8px">' + state.activity.streak + '<span class="unit"> j 🔥</span></div></div>' +
      '</div>' +
      '<div class="card card-row"><div><div style="font-weight:700">Séances cette semaine</div>' +
      '<div class="faint" style="font-size:12.5px;margin-top:2px">7 derniers jours</div></div>' +
      '<div class="big-num">' + sessions7 + '</div></div>';
  }

  function viewTraining() {
    const seg = ui.trainTab;
    return '<div class="segment">' +
      '<button class="' + (seg === 'salle' ? 'is-active' : '') + '" data-act="train-seg" data-seg="salle">Salle 🏋️</button>' +
      '<button class="' + (seg === 'skills' ? 'is-active' : '') + '" data-act="train-seg" data-seg="skills">Calisthénie 🤸</button>' +
      '</div>' + (seg === 'salle' ? salleHtml() : skillsHtml());
  }

  function salleHtml() {
    const prog = PROGRAMS.find(function (p) { return p.id === ui.selectedProgram; }) || PROGRAMS[0];
    const t = todayStr();
    const log = (state.training.salleLog[t] = state.training.salleLog[t] || {});
    const doneCount = prog.exercises.filter(function (e) { return log[e.id] && log[e.id].done; }).length;
    const chips = PROGRAMS.map(function (p) {
      return '<button class="chip ' + (p.id === prog.id ? 'accent' : '') + '" data-act="pick-program" data-prog="' + p.id + '">' +
        p.name.split('—')[0].trim() + '</button>';
    }).join('');
    const rows = prog.exercises.map(function (e) {
      const cur = log[e.id] || {}; const last = lastKg(e.id);
      return '<div class="row">' +
        '<button class="row-ic" data-act="ex-toggle" data-ex="' + e.id + '" style="' + (cur.done ? 'background:var(--accent);color:var(--accent-ink)' : '') + '">' +
        (cur.done ? icon('check') : icon('dumbbell')) + '</button>' +
        '<div class="row-main"><div class="row-title">' + e.name + '</div>' +
        '<div class="row-sub">' + e.target + (last ? ' · dernier : ' + last + ' kg' : '') + '</div></div>' +
        '<input class="input" style="width:74px;text-align:center" inputmode="decimal" placeholder="kg" value="' +
        (cur.kg != null ? cur.kg : '') + '" data-act="ex-kg" data-ex="' + e.id + '"></div>';
    }).join('');
    const finished = state.activity.days.includes(t);
    return '<div style="display:flex;gap:8px;overflow-x:auto;padding-bottom:6px;margin-bottom:14px">' + chips + '</div>' +
      '<div class="card flush"><div class="list">' + rows + '</div></div>' +
      '<div class="card-row" style="margin-top:6px">' +
      '<div class="muted" style="font-size:13px">' + doneCount + '/' + prog.exercises.length + ' exercices</div>' +
      '<button class="btn ' + (finished ? 'btn-ghost' : 'btn-primary') + ' btn-sm" data-act="finish-session">' +
      (finished ? 'Séance validée ✓' : 'Valider la séance') + '</button></div>';
  }

  function skillsHtml() {
    return SKILLS.map(function (s) {
      const lvl = state.training.skills[s.id] || 0, total = s.steps.length;
      const pct = Math.round(lvl / total * 100);
      const stage = lvl >= total ? 'Maîtrisé 🏆' : 'Étape ' + (lvl + 1) + '/' + total + ' · ' + s.steps[lvl];
      const steps = s.steps.map(function (st, i) {
        const cls = i < lvl ? 'done' : (i === lvl ? 'current' : '');
        return '<div class="step ' + cls + '"><span class="dot">' + (i < lvl ? '✓' : '') + '</span><span>' + st + '</span></div>';
      }).join('');
      return '<div class="skill"><div class="skill-head"><div class="skill-title">' + s.name + '</div>' +
        '<div class="skill-emoji">' + s.emoji + '</div></div>' +
        '<div class="skill-stage">' + stage + '</div>' +
        '<div class="progress"><i style="width:' + pct + '%"></i></div>' +
        '<div class="skill-steps" style="margin-top:14px">' + steps + '</div>' +
        '<div class="stepper">' +
        '<button class="btn btn-ghost btn-sm" data-act="skill-dec" data-skill="' + s.id + '">−</button>' +
        '<button class="btn btn-primary btn-sm" data-act="skill-inc" data-skill="' + s.id + '"' +
        (lvl >= total ? ' disabled style="opacity:.5"' : '') + '>' +
        (lvl >= total ? 'Terminé' : 'Valider l’étape') + '</button></div></div>';
    }).join('');
  }

  function viewNutrition() {
    const t = todayStr();
    const meals = state.nutrition.log[t] || [];
    const kcal = sum(meals, 'kcal'), pro = sum(meals, 'pro');
    const kcalT = state.nutrition.kcalTarget, proT = state.nutrition.proTarget;
    const rem = kcalT - kcal;
    const mealRows = meals.length ? meals.map(function (m, i) {
      return '<div class="row"><div class="row-ic">' + icon('apple') + '</div>' +
        '<div class="row-main"><div class="row-title">' + esc(m.name) + '</div>' +
        '<div class="row-sub">' + (m.pro || 0) + ' g protéines</div></div>' +
        '<div class="row-val">' + (m.kcal || 0) + '<small>kcal</small></div>' +
        '<button class="row-ic" data-act="del-meal" data-i="' + i + '" style="background:transparent;color:var(--faint)">' + icon('trash') + '</button></div>';
    }).join('') : '<div class="empty">' + icon('apple') + '<div>Aucun repas enregistré aujourd’hui.</div></div>';
    return '<div class="card"><div class="card-row"><div>' +
      '<div class="big-num">' + kcal + '<span class="unit"> / ' + kcalT + ' kcal</span></div>' +
      '<div class="muted" style="margin-top:4px;font-size:13px">' +
      (rem > 0 ? 'Encore ' + rem + ' kcal pour ton surplus' : 'Surplus atteint 💪') + '</div></div>' +
      ringSvg(kcal / kcalT, Math.round(kcal / kcalT * 100) + '%') + '</div>' +
      '<div class="macro-row"><div class="macro"><div class="m-top"><span>Protéines</span>' +
      '<span><b>' + pro + '</b> / ' + proT + ' g</span></div>' +
      '<div class="progress"><i style="width:' + clamp(pro / proT) * 100 + '%"></i></div></div></div></div>' +
      '<div class="section-title">Ajouter un repas</div>' +
      '<div class="card"><div class="field"><input class="input" id="meal-name" placeholder="Ex. Poulet riz patate douce"></div>' +
      '<div class="inline-form" style="grid-template-columns:1fr 1fr auto">' +
      '<input class="input" id="meal-kcal" inputmode="numeric" placeholder="kcal">' +
      '<input class="input" id="meal-pro" inputmode="numeric" placeholder="prot. (g)">' +
      '<button class="btn btn-primary" data-act="add-meal">' + icon('plus') + '</button></div></div>' +
      '<div class="section-title">Repas du jour</div>' +
      '<div class="card flush"><div class="list">' + mealRows + '</div></div>';
  }

  function viewProgress() {
    const cur = state.weights.length ? state.weights[state.weights.length - 1].kg : null;
    const start = state.profile.startWeight;
    const delta = (cur != null && start != null) ? (cur - start) : null;
    const unlocked = SKILLS.filter(function (s) { return (state.training.skills[s.id] || 0) > 0; });
    const measureField = function (key, label) {
      const v = state.measures[key];
      return '<div class="field"><label>' + label + '</label>' +
        '<input class="input" inputmode="decimal" value="' + (v != null ? v : '') + '" placeholder="—" data-act="field" data-key="m_' + key + '"></div>';
    };
    const photoSlot = function (slot, label) {
      const url = state.photos[slot];
      return '<label class="photo-slot"><span class="ps-tag">' + label + '</span>' +
        (url ? '<img src="' + url + '" alt="' + label + '">' : '<span class="ps-empty">' + icon('camera') + 'Ajouter</span>') +
        '<input type="file" accept="image/*" data-act="photo" data-slot="' + slot + '"></label>';
    };
    return '<div class="section-title">Poids</div>' +
      '<div class="card"><div class="card-row"><div>' +
      '<div class="big-num">' + (cur != null ? cur : '—') + '<span class="unit"> kg</span></div>' +
      (delta != null ? '<div class="muted" style="font-size:13px;margin-top:4px">' + (delta >= 0 ? '+' : '') + delta.toFixed(1) + ' kg depuis le début</div>' : '') +
      '</div>' + (start != null ? '<div class="chip">Départ ' + start + ' kg</div>' : '') + '</div>' +
      '<div style="margin:16px 0">' + weightChart() + '</div>' +
      '<div class="row-form"><input class="input" id="w-input" inputmode="decimal" placeholder="Poids du jour (kg)">' +
      '<button class="btn btn-primary" data-act="add-weight">' + icon('plus') + ' Ajouter</button></div></div>' +
      '<div class="section-title">Photos avant / après</div>' +
      '<div class="photo-compare">' + photoSlot('before', 'Avant') + photoSlot('after', 'Après') + '</div>' +
      '<div class="section-title">Skills débloqués</div>' +
      (unlocked.length ? '<div class="card flush"><div class="list">' + unlocked.map(function (s) {
        const lvl = state.training.skills[s.id] || 0, total = s.steps.length;
        return '<div class="row"><div class="row-ic" style="color:inherit;font-size:18px">' + s.emoji + '</div>' +
          '<div class="row-main"><div class="row-title">' + s.name + '</div>' +
          '<div class="row-sub">' + (lvl >= total ? 'Maîtrisé 🏆' : 'Étape ' + lvl + '/' + total) + '</div></div>' +
          '<div class="row-val">' + Math.round(lvl / total * 100) + '%</div></div>';
      }).join('') + '</div></div>'
        : '<div class="empty">' + icon('trending') + '<div>Valide des étapes dans Training pour les voir ici.</div></div>') +
      '<div class="section-title">Mensurations (cm)</div>' +
      '<div class="card"><div class="grid-2">' +
      measureField('bras', 'Bras') + measureField('poitrine', 'Poitrine') +
      measureField('cuisse', 'Cuisse') + measureField('taille', 'Taille') + '</div></div>';
  }

  function viewProfile() {
    const p = state.profile;
    const OBJ = ['Prise de muscle', 'Calisthénie', 'Perte de gras', 'Force', 'Endurance', 'Santé'];
    const MORPH = ['Ectomorphe', 'Mésomorphe', 'Endomorphe'];
    return '<div class="profile-head"><div class="avatar">' + esc((p.name || 'A').slice(0, 1).toUpperCase()) + '</div>' +
      '<h2>' + esc(p.name || 'Athlète') + '</h2>' +
      '<p>' + esc(p.morph || '') + ' · ' + (esc((p.objectives || []).join(' · ')) || 'Définis tes objectifs') + '</p></div>' +
      '<div class="section-title">Objectifs</div><div class="objectives">' +
      OBJ.map(function (o) { return '<button class="obj ' + ((p.objectives || []).includes(o) ? 'is-on' : '') + '" data-act="toggle-obj" data-obj="' + esc(o) + '">' + o + '</button>'; }).join('') + '</div>' +
      '<div class="section-title">Morphotype</div><div class="objectives">' +
      MORPH.map(function (m) { return '<button class="obj ' + (p.morph === m ? 'is-on' : '') + '" data-act="set-morph" data-morph="' + m + '">' + m + '</button>'; }).join('') + '</div>' +
      '<div class="section-title">Mes infos</div><div class="card">' +
      '<div class="field"><label>Prénom</label><input class="input" value="' + esc(p.name || '') + '" data-act="field" data-key="name"></div>' +
      '<div class="grid-2">' +
      '<div class="field"><label>Âge</label><input class="input" inputmode="numeric" value="' + (p.age == null ? '' : p.age) + '" placeholder="—" data-act="field" data-key="age"></div>' +
      '<div class="field"><label>Taille (cm)</label><input class="input" inputmode="numeric" value="' + (p.height == null ? '' : p.height) + '" placeholder="—" data-act="field" data-key="height"></div>' +
      '<div class="field"><label>Poids départ (kg)</label><input class="input" inputmode="decimal" value="' + (p.startWeight == null ? '' : p.startWeight) + '" placeholder="—" data-act="field" data-key="startWeight"></div>' +
      '<div class="field"><label>Poids cible (kg)</label><input class="input" inputmode="decimal" value="' + (p.targetWeight == null ? '' : p.targetWeight) + '" placeholder="—" data-act="field" data-key="targetWeight"></div>' +
      '</div></div>' +
      '<div class="section-title">Objectifs nutrition</div><div class="card"><div class="grid-2">' +
      '<div class="field"><label>Calories / jour</label><input class="input" inputmode="numeric" value="' + state.nutrition.kcalTarget + '" data-act="field" data-key="kcalTarget"></div>' +
      '<div class="field"><label>Protéines / jour (g)</label><input class="input" inputmode="numeric" value="' + state.nutrition.proTarget + '" data-act="field" data-key="proTarget"></div>' +
      '</div></div>' +
      '<div class="section-title">Couleur d’accent</div><div class="swatches">' +
      ACCENTS.map(function (a) { return '<button class="swatch ' + (p.accent === a.id ? 'is-on' : '') + '" data-act="set-accent" data-accent="' + a.id + '" style="background:' + a.val + '"></button>'; }).join('') + '</div>' +
      '<div class="spacer-lg"></div><button class="link-danger" data-act="reset-data">Réinitialiser toutes mes données</button>';
  }

  const VIEWS = { home: viewHome, training: viewTraining, nutrition: viewNutrition, progress: viewProgress, profile: viewProfile };
  const TABS = [
    ['home', 'Aujourd’hui', 'home'], ['training', 'Training', 'dumbbell'],
    ['nutrition', 'Nutrition', 'apple'], ['progress', 'Progrès', 'trending'], ['profile', 'Profil', 'user'],
  ];

  function renderHeader() {
    const meta = {
      home: ['', state.profile.name || 'Athlète'], training: ['Entraînement', 'Training'],
      nutrition: ['Alimentation', 'Nutrition'], progress: ['Suivi', 'Progrès'], profile: ['Compte', 'Profil'],
    }[currentTab];
    const eyebrow = currentTab === 'home' ? greeting() : meta[0];
    document.getElementById('appHeader').innerHTML =
      '<div><p class="h-greeting">' + eyebrow + '</p><h1 class="h-title">' + esc(meta[1]) + '</h1></div>' +
      '<div class="avatar">' + esc((state.profile.name || 'A').slice(0, 1).toUpperCase()) + '</div>';
  }
  function renderTabbar() {
    document.getElementById('tabbar').innerHTML = TABS.map(function (t) {
      return '<button class="tab ' + (currentTab === t[0] ? 'active' : '') + '" data-act="nav" data-tab="' + t[0] + '">' +
        icon(t[2]) + '<span>' + t[1] + '</span></button>';
    }).join('');
  }
  function render() {
    renderHeader();
    document.getElementById('view').innerHTML = (VIEWS[currentTab] || viewHome)();
    renderTabbar();
  }

  /* ---------- Events ---------- */
  function setField(key, raw) {
    if (key === 'name') state.profile.name = raw;
    else if (key === 'age') state.profile.age = raw === '' ? null : parseInt(raw, 10);
    else if (key === 'height') state.profile.height = raw === '' ? null : parseInt(raw, 10);
    else if (key === 'startWeight') state.profile.startWeight = numFrom(raw);
    else if (key === 'targetWeight') state.profile.targetWeight = numFrom(raw);
    else if (key === 'kcalTarget') state.nutrition.kcalTarget = parseInt(raw, 10) || 0;
    else if (key === 'proTarget') state.nutrition.proTarget = parseInt(raw, 10) || 0;
    else if (key.indexOf('m_') === 0) state.measures[key.slice(2)] = numFrom(raw);
  }

  function resizeImage(file, max, cb) {
    const reader = new FileReader();
    reader.onload = function (ev) {
      const img = new Image();
      img.onload = function () {
        const sc = Math.min(1, max / Math.max(img.width, img.height));
        const w = Math.round(img.width * sc), h = Math.round(img.height * sc);
        const c = document.createElement('canvas'); c.width = w; c.height = h;
        c.getContext('2d').drawImage(img, 0, 0, w, h);
        try { cb(c.toDataURL('image/jpeg', 0.82)); } catch (e) { cb(ev.target.result); }
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  }

  function onChange(e) {
    const el = e.target; if (!el.dataset) return;
    const act = el.dataset.act;
    if (act === 'photo') {
      const f = el.files && el.files[0];
      if (f) resizeImage(f, 1000, function (url) { state.photos[el.dataset.slot] = url; save(); render(); });
    } else if (act === 'ex-kg') {
      const t = todayStr(); const log = (state.training.salleLog[t] = state.training.salleLog[t] || {});
      const ex = el.dataset.ex; log[ex] = log[ex] || {}; log[ex].kg = el.value ? numFrom(el.value) : null; save();
    } else if (act === 'field') {
      setField(el.dataset.key, el.value); save();
    }
  }

  function onClick(e) {
    const el = e.target.closest('[data-act]'); if (!el) return;
    const act = el.dataset.act, t = todayStr();
    switch (act) {
      case 'nav': currentTab = el.dataset.tab; window.scrollTo(0, 0); render(); break;
      case 'start-session': {
        const prog = el.dataset.prog; currentTab = 'training';
        ui.trainTab = prog ? 'salle' : 'skills'; if (prog) ui.selectedProgram = prog;
        window.scrollTo(0, 0); render(); break;
      }
      case 'train-seg': ui.trainTab = el.dataset.seg; render(); break;
      case 'pick-program': ui.selectedProgram = el.dataset.prog; render(); break;
      case 'ex-toggle': {
        const log = (state.training.salleLog[t] = state.training.salleLog[t] || {});
        const ex = el.dataset.ex; log[ex] = log[ex] || {}; log[ex].done = !log[ex].done; save(); render(); break;
      }
      case 'finish-session': markActive(); save(); render(); break;
      case 'skill-inc': {
        const id = el.dataset.skill; const sk = SKILLS.find(function (s) { return s.id === id; });
        const c = state.training.skills[id] || 0;
        if (c < sk.steps.length) { state.training.skills[id] = c + 1; markActive(); save(); render(); }
        break;
      }
      case 'skill-dec': {
        const id = el.dataset.skill; const c = state.training.skills[id] || 0;
        if (c > 0) { state.training.skills[id] = c - 1; save(); render(); }
        break;
      }
      case 'add-meal': {
        const name = valOf('meal-name'), kcal = parseInt(valOf('meal-kcal'), 10) || 0, pro = parseInt(valOf('meal-pro'), 10) || 0;
        if (!name && !kcal) break;
        (state.nutrition.log[t] = state.nutrition.log[t] || []).push({ name: name || 'Repas', kcal: kcal, pro: pro });
        markActive(); save(); render(); break;
      }
      case 'del-meal': {
        const arr = state.nutrition.log[t] || []; arr.splice(parseInt(el.dataset.i, 10), 1); save(); render(); break;
      }
      case 'add-weight': {
        const kg = numFrom((document.getElementById('w-input') || {}).value || '');
        if (!kg || kg <= 0) break;
        const ex = state.weights.find(function (w) { return w.date === t; });
        if (ex) ex.kg = kg; else state.weights.push({ date: t, kg: kg });
        state.weights.sort(function (a, b) { return a.date < b.date ? -1 : 1; });
        markActive(); save(); render(); break;
      }
      case 'toggle-obj': {
        const o = el.dataset.obj; const arr = state.profile.objectives = state.profile.objectives || [];
        const i = arr.indexOf(o); if (i >= 0) arr.splice(i, 1); else arr.push(o); save(); render(); break;
      }
      case 'set-morph': state.profile.morph = el.dataset.morph; save(); render(); break;
      case 'set-accent': state.profile.accent = el.dataset.accent; applyAccent(); save(); render(); break;
      case 'reset-data':
        if (confirm('Réinitialiser toutes tes données ? Cette action est irréversible.')) {
          localStorage.removeItem(STORE_KEY); state = defaultState(); applyAccent(); currentTab = 'home'; render();
        }
        break;
    }
  }

  /* ---------- Init ---------- */
  applyAccent();
  document.addEventListener('click', onClick);
  document.addEventListener('change', onChange);
  render();
})();
