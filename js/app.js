
'use strict';

const EN  = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
const KR  = ['도','도#','레','레#','미','파','파#','솔','솔#','라','라#','시'];
const KR2EN = {};
KR.forEach((k, i) => KR2EN[k] = EN[i]);

let melody    = [];
let chords    = [];
let selStyle  = 'jazz';
let selBeat   = '3';
let selFeel   = 'lyrical';
let curMode   = 'fake';
let activeTech = new Set(['grace', 'passing', 'neighbor']);
let setupVisible = false;

const STYLE_LABELS = { jazz:'재즈 페이크', ballad:'발라드', bebop:'비밥', gospel:'가스펠/소울' };
const TECH_LABELS  = { grace:'앞꾸밈음', passing:'경과음', neighbor:'보조음', turn:'돌음', anticipation:'당김음', delay:'지연음' };
const FEEL_LABELS  = { lyrical:'서정적', jazzy:'재즈풍', gospel:'가스펠', active:'활발하게' };

document.addEventListener('DOMContentLoaded', async () => {
  buildKeys();
  applySystemTheme();
  await initOllama();
  FB.configure({
    apiKey: "AIzaSyDB34Il0rIQWU7M5UXfTB8geTxosAscBQc",
    authDomain: "jazzlick-90cd0.firebaseapp.com",
    projectId: "jazzlick-90cd0",
    storageBucket: "jazzlick-90cd0.firebasestorage.app",
    messagingSenderId: "180782187928",
    appId: "1:180782187928:web:06f10fecdc2caec007d7ed"
  });
  if (Onboarding.needsOnboarding()) {
    Onboarding.show((profile) => {
      updateProfileBadge(profile);
    });
  } else {
    updateProfileBadge(FB.getUserProfile());
  }
});

async function initOllama() {
  updateOllamaBadge('checking');
  const status = await HybridEngine.init();
  updateOllamaBadge(status.available ? 'ok' : 'err', status.model);
}

function updateProfileBadge(profile) {
  if (!profile) return;
  const LEVEL_LABELS = {
    beginner: '입문', elementary: '초급', intermediate: '중급',
    advanced: '고급', professional: '전문가', instructor: '강사'
  };
  document.getElementById('profile-label').textContent = LEVEL_LABELS[profile.level] || '프로필';
}

function resetProfile() {
  if (!confirm('프로필을 다시 설정하시겠어요?')) return;
  localStorage.removeItem('jl_profile');
  Onboarding.show((profile) => updateProfileBadge(profile));
}

async function retryOllama() {
  const url = document.getElementById('ollama-url').value.trim();
  if (url) OllamaClient.setBaseUrl(url);
  updateOllamaBadge('checking');
  const status = await HybridEngine.init();
  updateOllamaBadge(status.available ? 'ok' : 'err', status.model);
}

function updateOllamaBadge(state, model) {
  const badge = document.getElementById('ollama-badge');
  const dot   = document.getElementById('ollama-dot');
  const label = document.getElementById('ollama-label');
  badge.className = 'ollama-badge';
  if (state === 'checking') {
    label.textContent = '연결 확인 중...';
  } else if (state === 'ok') {
    badge.classList.add('ok');
    label.textContent = `AI: ${model || 'Ollama'}`;
  } else {
    badge.classList.add('err');
    label.textContent = 'Ollama 미연결 (규칙 기반)';
  }
}

function toggleSetup() {
  setupVisible = !setupVisible;
  document.getElementById('setup-card').classList.toggle('show', setupVisible);
}

function applySystemTheme() {
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.setAttribute('data-theme', 'dark');
    document.getElementById('theme-btn').textContent = '🌙';
  }
}
function toggleTheme() {
  const dark = document.documentElement.getAttribute('data-theme') === 'dark';
  document.documentElement.setAttribute('data-theme', dark ? 'light' : 'dark');
  document.getElementById('theme-btn').textContent = dark ? '☀️' : '🌙';
}

function switchMode(mode) {
  curMode = mode;
  ['fake','obbli','score'].forEach(m => {
    document.getElementById(`tab-${m}`).classList.toggle('active', m === mode);
  });
  document.getElementById('main-two-col').style.display = mode === 'score' ? 'none' : '';
  document.getElementById('score-panel').style.display  = mode === 'score' ? 'block' : 'none';
  document.getElementById('melody-card').style.display  = mode === 'fake' ? '' : 'none';
  document.getElementById('style-card').style.display   = mode === 'fake' ? '' : 'none';
  document.getElementById('obbli-options').style.display = mode === 'obbli' ? '' : 'none';
  const btn = document.getElementById('gen-btn');
  btn.style.display   = mode === 'score' ? 'none' : '';
  btn.textContent = mode === 'fake' ? '✦ 멜로디 페이크 생성' : '✦ 오블리가토 생성';
  if (mode !== 'score') resetResult(mode);
}

function resetResult(mode) {
  document.getElementById('result-wrap').innerHTML = `
    <div class="result-empty-card">
      <div class="result-empty-icon">${mode === 'fake' ? '♩' : '🎷'}</div>
      <div style="font-size:13px;color:var(--text3);">입력 후 생성 버튼을 눌러주세요</div>
    </div>`;
}

function buildKeys() {
  const whites = ['C','D','E','F','G','A','B'];
  const blacks  = ['C#','D#','','F#','G#','A#',''];
  const kr_w   = ['도','레','미','파','솔','라','시'];
  let h = '';
  whites.forEach((n, i) => {
    h += `<button class="key-w" onclick="addNote('${n}')">${n}<span class="kr">${kr_w[i]}</span></button>`;
    if (blacks[i]) h += `<button class="key-b" onclick="addNote('${blacks[i]}')">${blacks[i]}</button>`;
  });
  document.getElementById('key-btns').innerHTML = h;
}

function addNote(n) { melody.push(n); renderMelody(); }
function clearMelody() { melody = []; renderMelody(); }

function renderMelody() {
  const d    = document.getElementById('melody-display');
  const hint = document.getElementById('mel-hint');
  hint.style.display = melody.length ? 'none' : '';
  Array.from(d.querySelectorAll('.m-tag')).forEach(el => el.remove());
  melody.forEach((n, i) => {
    const tag = document.createElement('div');
    tag.className = 'm-tag';
    tag.innerHTML = `${n}<button onclick="melody.splice(${i},1);renderMelody()" title="삭제">×</button>`;
    d.appendChild(tag);
  });
}

function parseManual() {
  const raw = document.getElementById('manual-in').value.trim();
  if (!raw) return;
  raw.split(/[\s,]+/).filter(Boolean).forEach(t => {
    const up = t.charAt(0).toUpperCase() + t.slice(1);
    if (EN.includes(up))       melody.push(up);
    else if (KR2EN[up])        melody.push(KR2EN[up]);
    else if (KR2EN[t])         melody.push(KR2EN[t]);
  });
  renderMelody();
  document.getElementById('manual-in').value = '';
}
document.getElementById('manual-in').addEventListener('keydown', e => { if (e.key === 'Enter') parseManual(); });

function addChord() {
  const v = document.getElementById('chord-in').value.trim();
  if (!v) return;
  chords.push(v);
  document.getElementById('chord-in').value = '';
  renderChords();
}
function clearChords() { chords = []; renderChords(); }
function loadChords(arr) { chords = [...arr]; renderChords(); }

function renderChords() {
  const d    = document.getElementById('chord-display');
  const hint = document.getElementById('chord-hint');
  hint.style.display = chords.length ? 'none' : '';
  Array.from(d.querySelectorAll('.c-tag')).forEach(el => el.remove());
  chords.forEach((c, i) => {
    const tag = document.createElement('div');
    tag.className = 'c-tag';
    tag.innerHTML = `${c}<button onclick="chords.splice(${i},1);renderChords()" title="삭제">×</button>`;
    d.appendChild(tag);
  });
}
document.getElementById('chord-in').addEventListener('keydown', e => { if (e.key === 'Enter') addChord(); });

function setStyle(btn) {
  document.querySelectorAll('#style-group .chip').forEach(b => b.classList.remove('on'));
  btn.classList.add('on');
  selStyle = btn.dataset.s;
}
function toggleTech(btn) {
  const t = btn.dataset.t;
  if (activeTech.has(t)) { activeTech.delete(t); btn.classList.remove('on'); }
  else { activeTech.add(t); btn.classList.add('on'); }
}
function setBeat(btn) {
  document.querySelectorAll('#beat-group .chip').forEach(b => b.classList.remove('on'));
  btn.classList.add('on');
  selBeat = btn.dataset.b;
}
function setFeel(btn) {
  document.querySelectorAll('#obbli-feel-group .chip').forEach(b => b.classList.remove('on'));
  btn.classList.add('on');
  selFeel = btn.dataset.f;
}

async function generate() {
  if (curMode === 'fake') await generateFake();
  else await generateObbli();
}

async function generateFake() {
  if (!melody.length) { alert('멜로디를 입력해주세요.'); return; }
  if (!chords.length) { alert('코드를 하나 이상 추가해주세요.'); return; }

  const btn = document.getElementById('gen-btn');
  btn.disabled = true;
  btn.textContent = '생성 중...';
  showLoading('페이크 버전 생성 중...');

  try {
    const result = await HybridEngine.generateFake({
      melody,
      chords,
      style: STYLE_LABELS[selStyle],
      techniques: activeTech,
      keyStr: document.getElementById('key-select').value || '',
      meter: document.getElementById('meter-select').value,
    });
    renderFakeResult(result);
  } catch (e) {
    showError(e.message);
  }
  btn.disabled = false;
  btn.textContent = '✦ 다시 생성';
}

async function generateObbli() {
  const sustainNote = document.getElementById('sustain-note').value.trim();
  const obbliChord  = document.getElementById('obbli-chord').value.trim();
  if (!sustainNote) { alert('긴 음(끌어주는 음)을 입력해주세요.'); return; }
  if (!obbliChord)  { alert('해당 마디 코드를 입력해주세요.'); return; }

  const btn = document.getElementById('gen-btn');
  btn.disabled = true;
  btn.textContent = '생성 중...';
  showLoading('오블리가토 선율 생성 중...');

  try {
    const result = await HybridEngine.generateObbli({
      sustainNote,
      beats: selBeat,
      chord: obbliChord,
      chords,
      feel: FEEL_LABELS[selFeel],
    });
    renderObbliResult(result, sustainNote, obbliChord);
  } catch (e) {
    showError(e.message);
  }
  btn.disabled = false;
  btn.textContent = '✦ 다시 생성';
}

function renderFakeResult({ v1, v2, _meta }) {
  const diffColor = { 쉬움:'#2ea86e', 보통:'#e6832a', 도전:'#e05555' };
  
  FeedbackUI.setContext('fake', { melody, chords, style: STYLE_LABELS[selStyle] }, [v1, v2]);

  let html = `
    <div class="info-bar">
      <div class="info-badge">🎵 원곡 <span>${melody.join(' · ')}</span></div>
      <div class="info-badge">🎼 <span>${chords.join(' → ')}</span></div>
      <div class="info-badge">🎷 <span>${STYLE_LABELS[selStyle]}</span></div>
      ${_meta.ollamaUsed ? `<div class="info-badge" style="margin-left:auto;"><span style="color:#2ea86e;font-size:11px;">✦ AI 생성 (${_meta.model})</span></div>` : ''}
    </div>
    <div class="legend">
      <div class="leg"><span class="leg-dot" style="background:var(--chord)"></span>코드 구성음</div>
      <div class="leg"><span class="leg-dot" style="background:var(--nonchord)"></span>비화성음</div>
      <div class="leg"><span class="leg-dot" style="background:var(--ornament)"></span>꾸밈음</div>
      <span style="font-size:11px;color:var(--text3);margin-left:auto;">음표에 마우스를 올리면 설명이 나와요</span>
    </div>`;

  let versionIdx = 0;
  [{ data: v1, badge: 'v-badge-1', label: '1절' }, { data: v2, badge: 'v-badge-2', label: '2절' }].forEach(item => {
    const v = item.data;
    const pills = (v.notes || []).map(n =>
      `<span class="note-pill ${n.type}">${n.note}<span class="tip">${n.label}</span></span>`
    ).join('');
    const dc = diffColor[v.difficulty] || 'var(--text3)';
    const src = v.source === 'ollama' ? '<span class="v-source ollama">AI</span>' : '<span class="v-source rule">규칙</span>';
    html += `
      <div class="version-card">
        <div class="version-head">
          <span class="v-badge ${item.badge}">${item.label}</span>
          <span class="v-name">${v.name || item.label}</span>
          ${src}
          <span class="v-diff" style="margin-left:auto;"><span class="diff-dot" style="background:${dc}"></span>${v.difficulty || ''}</span>
        </div>
        <div class="version-body">
          <div class="note-row">${pills}</div>
          <div class="why-box">${v.why || ''}</div>
          ${FeedbackUI.renderBar(versionIdx)}
        </div>
      </div>`;
    versionIdx++;
  });

  document.getElementById('result-wrap').innerHTML = html;
}

function renderObbliResult({ patterns, _meta }, sustainNote, chord) {
  FeedbackUI.setContext('obbli', { sustainNote, chord, beats: selBeat }, patterns);
  
  let html = `
    <div class="info-bar">
      <div class="info-badge">🎵 긴 음 <span>${sustainNote} (${selBeat}박)</span></div>
      <div class="info-badge">🎼 <span>${chord}</span></div>
      <div class="info-badge">✨ <span>${FEEL_LABELS[selFeel]}</span></div>
    </div>
    <div class="legend">
      <div class="leg"><span class="leg-dot" style="background:var(--chord)"></span>코드 구성음</div>
      <div class="leg"><span class="leg-dot" style="background:var(--nonchord)"></span>비화성음</div>
      <div class="leg"><span class="leg-dot" style="background:var(--ornament)"></span>꾸밈음</div>
      <div class="leg"><span class="leg-dot" style="background:var(--obbli)"></span>오블리가토음</div>
    </div>`;

  patterns.forEach((p, i) => {
    const pills = (p.notes || []).map(n =>
      `<span class="note-pill ${n.type}">${n.note}<span class="tip">${n.label}</span></span>`
    ).join('');
    const src = p.source === 'ollama' ? '<span class="v-source ollama">AI</span>' : '<span class="v-source rule">규칙</span>';
    html += `
      <div class="version-card" style="animation-delay:${i * 0.1}s">
        <div class="version-head">
          <span class="v-badge v-badge-ob">패턴 ${i + 1}</span>
          <span class="v-name">${p.name || `패턴 ${i + 1}`}</span>
          ${src}
          <span class="v-diff" style="color:var(--obbli);">♩ ${p.rhythm || ''}</span>
        </div>
        <div class="version-body">
          <div class="sustain-bar">
            <span class="sustain-note">${sustainNote}</span>
            <span style="color:var(--text3);font-size:18px;letter-spacing:-2px;">────</span>
            <div class="note-row" style="flex:1">${pills}</div>
          </div>
          <div class="why-box why-ob">${p.why || ''}</div>
          ${FeedbackUI.renderBar(i)}
        </div>
      </div>`;
  });

  document.getElementById('result-wrap').innerHTML = html;
}

function showLoading(msg) {
  document.getElementById('result-wrap').innerHTML = `
    <div class="loading-card">
      <div class="dots"><span></span><span></span><span></span></div>
      <div style="font-size:13px;color:var(--text2);">${msg}</div>
    </div>`;
}

function showError(msg) {
  document.getElementById('result-wrap').innerHTML = `
    <div class="card" style="padding:2rem;">
      <div style="color:#e05555;font-weight:600;margin-bottom:6px;">오류 발생</div>
      <div style="font-size:13px;color:var(--text2);">${msg}</div>
    </div>`;
}

function showGuide() {
  alert('💡 사용법\n\n【멜로디 페이크】\n멜로디 + 코드를 입력하면\n1절(꾸밈음 위주)·2절(애드립 위주) 버전을 생성합니다.\n\n【오블리가토】\n긴 음 + 박자 + 코드를 입력하면\n그 공간을 채워주는 장식 선율을 생성합니다.\n\nOllama가 연결되면 AI가 더 창의적인 버전을 만들어요.\n연결이 없어도 규칙 기반 엔진으로 기본 기능 동작합니다.');
}

function showAbout() {
  alert('🎷 MelodyFake\n\n재즈/색소폰 연주자를 위한 멜로디 페이크 학습 도구입니다.\n\n• 규칙 기반 엔진: 재즈 이론으로 정확하고 빠르게\n• Ollama AI: 더 창의적인 2절·오블리가토 생성\n• 완전 로컬 · 무료 · 외부 API 없음\n\n개발 중인 기능: 악보 자동 변환, PDF 내보내기');
}

function loadScoreExample(notes) {
  document.getElementById('score-notes-in').value = notes;
  drawScore();
}

function clearScore() {
  document.getElementById('score-notes-in').value = '';
  document.getElementById('score-area').innerHTML = '<div class="score-empty"><div style="font-size:36px;opacity:.3;">🎼</div><div style="font-size:13px;">음표를 입력하고 "악보 그리기"를 눌러주세요</div></div>';
}

function parseNoteInput(raw) {
  const NOTE_MAP = { 'Bb':'bb','Eb':'eb','Ab':'ab','Db':'db','Gb':'gb','Fs':'f#','Cs':'c#','Ds':'d#','Gs':'g#','As':'a#' };
  return raw.trim().split(/\s+/).filter(Boolean).map(tok => {
    const m = tok.match(/^([A-Ga-g][#b]?)(\d)$/);
    if (!m) return null;
    let [, name, oct] = m;
    const upper = name.charAt(0).toUpperCase() + name.slice(1);
    const mapped = NOTE_MAP[upper] || upper.toLowerCase().replace('#', '#');
    return { keys: [`${mapped}/${oct}`], duration: 'q' };
  }).filter(Boolean);
}

function drawScore() {
  const raw = document.getElementById('score-notes-in').value;
  if (!raw.trim()) { alert('음표를 입력해주세요.'); return; }
  const notes = parseNoteInput(raw);
  if (!notes.length) { alert('인식할 수 없는 형식입니다.\n예: C4 D4 E4 G4'); return; }
  const keyStr  = document.getElementById('score-key').value || 'C';
  const meterStr = document.getElementById('score-meter').value || '4/4';
  const [beats] = meterStr.split('/').map(Number);
  const area = document.getElementById('score-area');
  area.innerHTML = '<div id="vex-output"></div>';
  try {
    const VF = Vex.Flow;
    const containerW = Math.max(area.clientWidth - 40, 400);
    const barsPerRow = Math.max(1, Math.floor(containerW / 160));
    const bars = [];
    for (let i = 0; i < notes.length; i += beats) {
      const bar = notes.slice(i, i + beats);
      while (bar.length < beats) bar.push({ keys: ['b/4'], duration: 'qr' });
      bars.push(bar);
    }
    const rows = [];
    for (let i = 0; i < bars.length; i += barsPerRow) rows.push(bars.slice(i, i + barsPerRow));
    const barW = Math.floor((containerW - 60) / Math.min(bars.length, barsPerRow));
    const totalH = rows.length * 110 + 20;
    const renderer = new VF.Renderer('vex-output', VF.Renderer.Backends.SVG);
    renderer.resize(containerW, totalH);
    const ctx = renderer.getContext();
    rows.forEach((rowBars, ri) => {
      let xOffset = 10;
      rowBars.forEach((barNotes, bi) => {
        const stave = new VF.Stave(xOffset, ri * 110 + 20, barW);
        if (bi === 0) { stave.addClef('treble'); if (ri === 0) { stave.addKeySignature(keyStr); stave.addTimeSignature(meterStr); } }
        stave.setContext(ctx).draw();
        const vfNotes = barNotes.map(n => new VF.StaveNote(n));
        vfNotes.forEach(vn => {
          const k = vn.getKeys()[0];
          if (k.includes('#')) vn.addModifier(new VF.Accidental('#'), 0);
          else if (k.includes('b') && !k.startsWith('b/')) vn.addModifier(new VF.Accidental('b'), 0);
        });
        VF.Formatter.FormatAndDraw(ctx, stave, vfNotes);
        xOffset += barW;
      });
    });
  } catch (e) {
    area.innerHTML = `<div class="score-empty"><div style="color:#e05555;font-size:13px;">악보 렌더링 오류: ${e.message}</div></div>`;
  }
}

function downloadScore() {
  const svg = document.querySelector('#score-area svg');
  if (!svg) { alert('먼저 악보를 그려주세요.'); return; }
  const blob = new Blob([svg.outerHTML], { type: 'image/svg+xml' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'melody-fake-score.svg';
  a.click();
}
