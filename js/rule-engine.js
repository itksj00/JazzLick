'use strict';

const CHROMATIC = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
const ENHARMONIC = {
  'Db':'C#','Eb':'D#','Fb':'E','Gb':'F#','Ab':'G#','Bb':'A#','Cb':'B','E#':'F','B#':'C',
};

const CHORD_INTERVALS = {
  '':        [0,4,7],
  'm':       [0,3,7],
  'dim':     [0,3,6],
  'aug':     [0,4,8],
  'maj7':    [0,4,7,11],
  'm7':      [0,3,7,10],
  '7':       [0,4,7,10],
  'dom7':    [0,4,7,10],
  'dim7':    [0,3,6,9],
  'm7b5':    [0,3,6,10],
  'mM7':     [0,3,7,11],
  'aug7':    [0,4,8,10],
  '6':       [0,4,7,9],
  'm6':      [0,3,7,9],
  'sus2':    [0,2,7],
  'sus4':    [0,5,7],
  '7sus4':   [0,5,7,10],
  '9':       [0,4,7,10,14],
  'maj9':    [0,4,7,11,14],
  'm9':      [0,3,7,10,14],
  'add9':    [0,4,7,14],
  '11':      [0,4,7,10,14,17],
  'm11':     [0,3,7,10,14,17],
  '13':      [0,4,7,10,14,17,21],
  'maj13':   [0,4,7,11,14,17,21],
  '7b9':     [0,4,7,10,13],
  '7#9':     [0,4,7,10,15],
  '7b5':     [0,4,6,10],
  '7#5':     [0,4,8,10],
  'alt':     [0,4,8,10,13,15],
  '7b9b5':   [0,4,6,10,13],
  '7#9#5':   [0,4,8,10,15],
  'maj7#11': [0,4,7,11,18],
  'm7b9':    [0,3,7,10,13],
  '7#11':    [0,4,7,10,18],
  'maj7#5':  [0,4,8,11],
  '6/9':     [0,4,7,9,14],
  'm6/9':    [0,3,7,9,14],
};

const SCALE_INTERVALS = {
  major:         [0,2,4,5,7,9,11],
  dorian:        [0,2,3,5,7,9,10],
  phrygian:      [0,1,3,5,7,8,10],
  phrygianDom:   [0,1,4,5,7,8,10],
  lydian:        [0,2,4,6,7,9,11],
  lydianDom:     [0,2,4,6,7,9,10],
  mixolydian:    [0,2,4,5,7,9,10],
  aeolian:       [0,2,3,5,7,8,10],
  locrian:       [0,1,3,5,6,8,10],
  locrianNat2:   [0,2,3,5,6,8,10],
  harmonicMinor: [0,2,3,5,7,8,11],
  melodicMinor:  [0,2,3,5,7,9,11],
  bebopDom:      [0,2,4,5,7,9,10,11],
  bebopMaj:      [0,2,4,5,7,8,9,11],
  bebopMin:      [0,2,3,5,7,8,9,10],
  bebopHalf:     [0,1,3,4,6,7,9,10],
  blues:         [0,3,5,6,7,10],
  bluesMaj:      [0,2,3,4,7,9],
  pentatonicMaj: [0,2,4,7,9],
  pentatonicMin: [0,3,5,7,10],
  wholeTone:     [0,2,4,6,8,10],
  diminished:    [0,2,3,5,6,8,9,11],
  dimHalfWhole:  [0,1,3,4,6,7,9,10],
  altered:       [0,1,3,4,6,8,10],
  chromatic:     [0,1,2,3,4,5,6,7,8,9,10,11],
  dorianb2:      [0,1,3,5,7,9,10],
  lydianAug:     [0,2,4,6,8,9,11],
  acoustic:      [0,2,4,6,7,9,10],
  majorPent:     [0,2,4,7,9],
  minorPent:     [0,3,5,7,10],
  gospelMaj:     [0,2,3,4,7,9,10],
  gospelMin:     [0,3,4,5,7,10],
};

const CHORD_SCALE_MAP = {
  'maj7':    ['bebopMaj','major','lydian'],
  'maj9':    ['major','lydian','bebopMaj'],
  'maj13':   ['major','lydian'],
  'maj7#11': ['lydian','bebopMaj'],
  'maj7#5':  ['lydianAug','melodicMinor'],
  '6':       ['major','bebopMaj'],
  '6/9':     ['major','pentatonicMaj'],
  '':        ['major','pentatonicMaj','bebopMaj'],
  'add9':    ['major'],
  'm7':      ['dorian','bebopMin','aeolian','pentatonicMin'],
  'm':       ['aeolian','dorian','pentatonicMin'],
  'm9':      ['dorian','bebopMin'],
  'm11':     ['dorian'],
  'm6':      ['melodicMinor','dorian'],
  'm6/9':    ['melodicMinor','dorian'],
  'mM7':     ['harmonicMinor','melodicMinor'],
  '7':       ['bebopDom','mixolydian','blues','pentatonicMin'],
  '9':       ['mixolydian','bebopDom','lydianDom'],
  '13':      ['mixolydian','bebopDom'],
  '7#11':    ['lydianDom','bebopDom'],
  '7b9':     ['dimHalfWhole','harmonicMinor','phrygianDom'],
  '7#9':     ['bebopDom','blues','altered'],
  '7b5':     ['lydianDom','wholeTone'],
  '7#5':     ['wholeTone','altered'],
  'alt':     ['altered','dimHalfWhole'],
  'dim7':    ['diminished','dimHalfWhole'],
  'dim':     ['diminished'],
  'm7b5':    ['locrianNat2','locrian','harmonicMinor'],
  'aug7':    ['wholeTone','altered'],
  'sus4':    ['mixolydian','major'],
  'sus2':    ['major'],
  '7sus4':   ['mixolydian'],
  '7b9b5':   ['altered','dimHalfWhole'],
  '7#9#5':   ['altered','wholeTone'],
  'm7b9':    ['phrygian','harmonicMinor'],
};

const STYLE_CONFIG = {
  jazz: {
    v1GraceProb:0.55, v1PassProb:0.45,
    v2GraceProb:1.0,  v2PassProb:0.85, v2EncapProb:0.4, v2ApproachProb:0.5,
    lickProb:0.35, tensionProb:0.4, motivicProb:0.5,
    encircleProb:0.3, pentatonicOverProb:0.3, substituteProb:0.25,
    scaleIdx:0, label:'재즈 페이크',
  },
  ballad: {
    v1GraceProb:0.35, v1PassProb:0.3,
    v2GraceProb:0.7,  v2PassProb:0.6,  v2EncapProb:0.2, v2ApproachProb:0.3,
    lickProb:0.15, tensionProb:0.25, motivicProb:0.35,
    encircleProb:0.15, pentatonicOverProb:0.2, substituteProb:0.1,
    scaleIdx:1, label:'발라드',
  },
  bebop: {
    v1GraceProb:0.7,  v1PassProb:0.6,
    v2GraceProb:1.0,  v2PassProb:1.0,  v2EncapProb:0.7, v2ApproachProb:0.8,
    lickProb:0.6, tensionProb:0.6, motivicProb:0.7,
    encircleProb:0.6, pentatonicOverProb:0.4, substituteProb:0.4,
    scaleIdx:0, label:'비밥',
  },
  gospel: {
    v1GraceProb:0.5,  v1PassProb:0.4,
    v2GraceProb:0.9,  v2PassProb:0.8,  v2EncapProb:0.35, v2ApproachProb:0.55,
    lickProb:0.45, tensionProb:0.45, motivicProb:0.5,
    encircleProb:0.25, pentatonicOverProb:0.5, substituteProb:0.2,
    scaleIdx:2, label:'가스펠/소울',
  },
};

function noteToIndex(note) { return CHROMATIC.indexOf(ENHARMONIC[note] || note); }
function indexToNote(idx)  { return CHROMATIC[((idx % 12) + 12) % 12]; }
function transposeNote(note, st) {
  const idx = noteToIndex(note);
  return idx === -1 ? note : indexToNote(idx + st);
}
function normalizeNote(note) { return ENHARMONIC[note] || note; }
function semitonesBetween(a, b) {
  const ia = noteToIndex(a), ib = noteToIndex(b);
  if (ia === -1 || ib === -1) return 0;
  let d = ib - ia;
  if (d > 6) d -= 12;
  if (d < -6) d += 12;
  return d;
}
function rand()   { return Math.random(); }
function pick(arr){ return arr[Math.floor(rand() * arr.length)]; }
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length-1; i > 0; i--) {
    const j = Math.floor(rand()*(i+1));
    [a[i],a[j]] = [a[j],a[i]];
  }
  return a;
}
function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

function parseChord(str) {
  if (!str || typeof str !== 'string') return null;
  const slash = str.match(/^(.+)\/([A-G][b#]?)$/);
  const bass  = slash ? normalizeNote(slash[2]) : null;
  const main  = slash ? slash[1] : str;
  const rm    = main.match(/^([A-G][b#]?)/);
  if (!rm) return null;
  const root = rm[1];
  return { root: normalizeNote(root), type: main.slice(root.length) || '', bass };
}
function getChordTones(chordStr) {
  const c = parseChord(chordStr);
  if (!c) return [];
  const ri = noteToIndex(c.root);
  if (ri === -1) return [];
  return (CHORD_INTERVALS[c.type] || CHORD_INTERVALS['']).map(iv => indexToNote(ri + iv));
}
function isChordTone(note, chordStr) {
  return getChordTones(chordStr).includes(normalizeNote(note));
}
function getScaleNotes(root, scaleName) {
  const ivs = SCALE_INTERVALS[scaleName];
  if (!ivs) return [];
  const ri = noteToIndex(root);
  if (ri === -1) return [];
  return ivs.map(iv => indexToNote(ri + iv));
}
function getBestScale(chordStr, styleKey = 'jazz') {
  const c = parseChord(chordStr);
  if (!c) return { name:'major', notes:getScaleNotes('C','major'), root:'C' };
  const cands = CHORD_SCALE_MAP[c.type] || ['major'];
  const cfg   = STYLE_CONFIG[styleKey] || STYLE_CONFIG.jazz;
  const idx   = Math.min(cfg.scaleIdx, cands.length-1);
  return { name:cands[idx], notes:getScaleNotes(c.root, cands[idx]), root:c.root, allCandidates:cands };
}
function isInScale(note, scaleNotes) { return scaleNotes.includes(normalizeNote(note)); }

function classifyNote(note, chordStr, role = 'passing') {
  if (getChordTones(chordStr).includes(normalizeNote(note))) return 'chord';
  if (['grace','turn','ornament','approach','encap','encircle'].includes(role)) return 'ornament';
  return 'nonchord';
}
function makeNote(note, chordStr, role = 'passing') {
  const type = classifyNote(note, chordStr, role);
  const LABELS = {
    chord:'코드 구성음', nonchord:'비화성음', ornament:'꾸밈음',
    passing:'경과음', neighbor:'보조음', grace:'앞꾸밈음', turn:'돌음',
    approach:'접근음', anticipation:'당김음', delay:'지연음',
    encap:'인캡슐레이션', encircle:'감싸기', blues:'블루스 음',
    chromatic:'반음 경과음', bebop:'비밥 경과음', tension:'텐션음',
    lick:'재즈 관용구', iiVI:'ii-V-I 라인', motivic:'모티브 변형',
    voicelead:'보이스 리딩', suspension:'서스펜션', tritone:'트리톤 대리음',
    colorTone:'컬러 톤', scale:'스케일 패싱', pentatonicOver:'펜타토닉 오버',
    modalExchange:'모달 인터체인지', substitute:'대리음', gospel:'가스펠 어법',
    bluesCry:'블루스 크라이', callResponse:'콜 앤 리스폰스',
  };
  return { note, type, label: LABELS[role] || LABELS[type] || type };
}

function graceBelow(note)  { return transposeNote(note, -1); }
function graceWhole(note)  { return transposeNote(note, -2); }
function graceAbove(note)  { return transposeNote(note,  1); }
function passingTones(a, b) {
  const ia = noteToIndex(a), ib = noteToIndex(b);
  if (ia === -1 || ib === -1) return [];
  const diff = ib - ia;
  if (Math.abs(diff) <= 1) return [];
  const step = diff > 0 ? 1 : -1;
  const res = [];
  for (let i = ia + step; i !== ib; i += step) res.push(indexToNote(i));
  return res;
}
function neighborUpper(note) { return transposeNote(note,  1); }
function neighborLower(note) { return transposeNote(note, -1); }
function turnFigure(note)  { return [transposeNote(note,2), note, transposeNote(note,-1), note]; }
function shortTurn(note)   { return [transposeNote(note,1), note, transposeNote(note,-1)]; }
function delayNote(note, chordStr) {
  const ct = getChordTones(chordStr).filter(t => t !== normalizeNote(note));
  return ct.length ? pick(ct) : transposeNote(note, 4);
}

function approachNote(target, type = 'chromatic_below') {
  const MAP = { chromatic_below:-1, chromatic_above:1, diatonic_below:-2, diatonic_above:2 };
  return transposeNote(target, MAP[type] ?? -1);
}
function doubleChromatic(target) {
  return [transposeNote(target, 2), transposeNote(target, 1), target];
}
function encapsulation(target) {
  return [transposeNote(target, -1), transposeNote(target, 1), target];
}

function encircle(target, type = 'double') {
  switch(type) {
    case 'double':
      return [transposeNote(target, -1), transposeNote(target, 2), transposeNote(target, 1), target];
    case 'triple':
      return [transposeNote(target, 2), transposeNote(target, -1), transposeNote(target, 1), target];
    case 'above_first':
      return [transposeNote(target, 1), transposeNote(target, -2), transposeNote(target, -1), target];
    case 'chromatic_quad':
      return [transposeNote(target,-2), transposeNote(target,-1), transposeNote(target,1), target];
    default:
      return encapsulation(target);
  }
}

function bebopPassingNote(note, chordStr) {
  const c = parseChord(chordStr);
  if (!c) return null;
  const n = normalizeNote(note);
  if (!getChordTones(chordStr).includes(n)) return null;
  if (['7','9','13','dom7'].includes(c.type)) return indexToNote(noteToIndex(c.root) + 11);
  if (['maj7','maj9','maj13'].includes(c.type)) return indexToNote(noteToIndex(c.root) + 8);
  if (['m7','m9'].includes(c.type)) return indexToNote(noteToIndex(c.root) + 8);
  return null;
}
function chordArp(chordStr, direction = 'up') {
  const t = getChordTones(chordStr);
  return direction === 'up' ? t : [...t].reverse();
}

function getTritoneSubChord(chordStr) {
  const c = parseChord(chordStr);
  if (!c) return null;
  if (!['7','9','13','dom7','alt','7b9','7#9'].includes(c.type)) return null;
  return indexToNote(noteToIndex(c.root) + 6) + '7';
}
function getGuideTones(chordStr) {
  const ct = getChordTones(chordStr);
  return [ct[1], ct[3]].filter(Boolean);
}
function getNextGuideToVoiceLead(curChord, nextChord) {
  const cur  = getGuideTones(curChord);
  const nxt  = getGuideTones(nextChord);
  if (!cur.length || !nxt.length) return null;
  let best = null, bestDist = 99;
  cur.forEach(cg => nxt.forEach(ng => {
    const d = Math.abs(semitonesBetween(cg, ng));
    if (d < bestDist) { bestDist = d; best = { from:cg, to:ng, semitones:d }; }
  }));
  return best;
}

function getTensionNotes(chordStr) {
  const c = parseChord(chordStr);
  if (!c) return [];
  const ri  = noteToIndex(c.root);
  const ct  = getChordTones(chordStr);
  const res = [];
  if (['maj7','maj9','7','9','13','dom7'].includes(c.type)) {
    res.push(indexToNote(ri + 2));
  }
  if (['7','9','13','dom7','maj7','maj9'].includes(c.type)) {
    res.push(indexToNote(ri + 9));
  }
  if (['m7','m9','m11'].includes(c.type)) {
    res.push(indexToNote(ri + 2));
    res.push(indexToNote(ri + 5));
  }
  if (['7b9','alt','7#9'].includes(c.type)) {
    res.push(indexToNote(ri + 1));
    res.push(indexToNote(ri + 3));
  }
  if (['maj7','maj9','maj13'].includes(c.type)) {
    res.push(indexToNote(ri + 6));
  }
  return [...new Set(res)].filter(t => !ct.includes(t));
}

function extractMotif(melody) {
  if (melody.length < 2) return null;
  return melody.slice(0, Math.min(3, melody.length));
}
function invertMotif(motif) {
  if (!motif || motif.length < 2) return motif;
  const ivs = [];
  for (let i = 1; i < motif.length; i++) ivs.push(semitonesBetween(motif[i-1], motif[i]));
  const res = [motif[0]];
  ivs.forEach((iv, i) => res.push(transposeNote(res[i], -iv)));
  return res;
}
function retrogradeMotif(motif) { return motif ? [...motif].reverse() : motif; }
function transposeMotif(motif, st) { return motif ? motif.map(n => transposeNote(n, st)) : motif; }
function augmentMotif(motif, chordStr) {
  if (!motif) return [];
  const res = [];
  motif.forEach(n => {
    res.push(n);
    if (getChordTones(chordStr).includes(normalizeNote(n))) res.push(neighborUpper(n));
  });
  return res;
}
function diminishMotif(motif) {
  if (!motif || motif.length < 2) return motif;
  return motif.slice(0, Math.ceil(motif.length / 2));
}
function sequenceMotif(motif, step, count = 2) {
  const res = [...motif];
  for (let i = 1; i < count; i++) {
    transposeMotif(motif, step * i).forEach(n => res.push(n));
  }
  return res;
}

function getSubstituteChords(chordStr) {
  const c = parseChord(chordStr);
  if (!c) return [];
  const ri = noteToIndex(c.root);
  const subs = [];
  subs.push({ chord: indexToNote(ri + 3) + 'maj7', type: 'minor_third_up' });
  subs.push({ chord: indexToNote(ri - 3) + 'maj7', type: 'minor_third_down' });
  if (['7','9','13','dom7'].includes(c.type)) {
    subs.push({ chord: indexToNote(ri + 6) + '7', type: 'tritone' });
  }
  if (['maj7','maj9'].includes(c.type)) {
    subs.push({ chord: indexToNote(ri + 9) + 'm7', type: 'relative_minor' });
  }
  if (['m7','m9'].includes(c.type)) {
    subs.push({ chord: indexToNote(ri + 3) + 'maj7', type: 'relative_major' });
  }
  return subs;
}

function getPentatonicOver(chordStr) {
  const c = parseChord(chordStr);
  if (!c) return [];
  const ri  = noteToIndex(c.root);
  const res = [];
  if (['maj7','maj9','maj13','6',''].includes(c.type)) {
    res.push({ root: c.root,              scale:'pentatonicMaj', label:'루트 메이저 펜타' });
    res.push({ root: indexToNote(ri + 9), scale:'pentatonicMin', label:'장6도 마이너 펜타' });
    res.push({ root: indexToNote(ri + 4), scale:'pentatonicMaj', label:'장3도 메이저 펜타' });
  }
  if (['m7','m9','m11'].includes(c.type)) {
    res.push({ root: c.root,              scale:'pentatonicMin', label:'루트 마이너 펜타' });
    res.push({ root: indexToNote(ri + 3), scale:'pentatonicMaj', label:'단3도 메이저 펜타' });
    res.push({ root: indexToNote(ri + 7), scale:'pentatonicMin', label:'5도 마이너 펜타' });
  }
  if (['7','9','13','dom7'].includes(c.type)) {
    res.push({ root: indexToNote(ri + 9), scale:'pentatonicMin', label:'장6도 마이너 펜타 (블루스틱)' });
    res.push({ root: indexToNote(ri + 5), scale:'pentatonicMaj', label:'4도 메이저 펜타' });
    res.push({ root: c.root,              scale:'pentatonicMaj', label:'루트 메이저 펜타' });
  }
  if (['alt','7b9','7#9'].includes(c.type)) {
    res.push({ root: indexToNote(ri + 8), scale:'pentatonicMin', label:'단6도 마이너 펜타 (얼터드 위)' });
    res.push({ root: indexToNote(ri + 1), scale:'pentatonicMin', label:'단2도 마이너 펜타' });
  }
  return res;
}

function getModalInterchangeNotes(chordStr, targetMode) {
  const c = parseChord(chordStr);
  if (!c) return [];
  const altScale = getScaleNotes(c.root, targetMode);
  const origCT   = getChordTones(chordStr);
  return altScale.filter(n => !origCT.includes(n));
}

function detectProgression(chords) {
  if (!chords || chords.length < 2) return null;
  const parsed = chords.map(c => parseChord(c)).filter(Boolean);
  const types  = parsed.map(p => p.type);
  const roots  = parsed.map(p => p.root);
  const DOM    = new Set(['7','9','13','dom7','7b9','7#9','alt','7b5','7#5','7#11']);
  const MIN7   = new Set(['m7','m9','m11']);
  const MAJ    = new Set(['maj7','maj9','maj13','','6','add9','6/9']);

  for (let i = 0; i < parsed.length - 1; i++) {
    if (MIN7.has(types[i]) && DOM.has(types[i+1])) {
      const diff = (noteToIndex(roots[i+1]) - noteToIndex(roots[i]) + 12) % 12;
      if (diff === 5) return 'ii-V-I';
    }
  }
  if (parsed.length >= 4) {
    const r = roots.map(n => noteToIndex(n));
    const d = [];
    for (let i = 1; i < r.length; i++) d.push((r[i]-r[i-1]+12)%12);
    if (d[0]===9 && d[1]===5 && d[2]===7) return 'I-VI-II-V';
  }
  if (types.filter(t => DOM.has(t)).length >= 2) return 'blues';
  if (types.length >= 4 && types.some(t=>MAJ.has(t)) && types.some(t=>DOM.has(t)) && types.some(t=>MIN7.has(t))) return 'rhythm_changes';
  if (parsed.length >= 3) {
    const ds = roots.map((r,i) => i===0 ? null : (noteToIndex(roots[i])-noteToIndex(roots[i-1])+12)%12).filter(d=>d!==null);
    if (ds.every(d=>d===5)) return 'cycle_of_fourths';
    if (ds.every(d=>d===7)) return 'cycle_of_fifths';
  }
  return null;
}

const JAZZ_LICK_LIBRARY = {
  dom7: [
    [0,-2,2,7,5,3,2],
    [7,5,4,3,2,0],
    [10,11,0,2,4,5,4],
    [0,1,2,4,5,7,9,10],
    [4,3,2,0,10,9,7],
    [-2,-1,0,4,2,0,-1,0],
    [7,9,10,11,0,2,4],
    [0,4,2,1,0,-1,0,2,4],
    [5,4,2,0,11,9,7,5],
    [2,4,5,7,5,4,2,0],
    [10,9,7,6,5,4,2,0],
    [0,2,4,5,4,3,2,1,0],
  ],
  maj7: [
    [0,2,4,7,9,11,12],
    [11,9,7,4,2,0],
    [0,4,7,11,9,7,4],
    [7,9,11,0,2,4,7],
    [0,2,4,5,7,4,2,0],
    [4,7,9,11,9,7,4,2],
    [0,4,2,0,11,9,7,4],
    [9,11,0,2,4,7,9],
    [0,2,4,7,4,2,0,11],
    [11,0,2,4,7,9,11,12],
    [7,4,2,0,11,7,4,0],
  ],
  m7: [
    [0,3,5,7,10,12],
    [10,9,7,5,3,0],
    [0,2,3,5,7,9,10],
    [3,5,7,10,9,7,5,3],
    [7,5,3,2,0,10,9,7],
    [0,-1,0,3,2,0,-2,0],
    [10,12,3,5,7,10,9,7],
    [0,3,2,0,10,9,7,5],
    [5,7,9,10,9,7,5,3],
    [3,5,7,3,5,3,2,0],
    [0,2,3,5,3,2,0,10],
    [7,10,9,7,5,3,2,0],
  ],
  iiVI: [
    [2,0,-1,0,4,2,0,-1,0],
    [2,3,5,4,3,2,0,11],
    [5,4,3,2,0,-1,0,4],
    [2,1,0,11,0,4,7,11],
    [3,2,0,11,0,2,4,7],
    [5,7,9,10,9,7,4,2],
    [2,4,5,7,5,4,2,0],
    [0,2,3,5,4,2,0,-1],
  ],
  blues: [
    [0,3,5,6,7,10],
    [10,7,6,5,3,0],
    [7,6,5,3,0,3],
    [0,3,5,6,7,10,12,10,7],
    [5,6,7,10,7,5,3,0],
    [3,5,6,7,5,3,0,3],
    [0,3,5,6,5,3,0,-2,0],
    [7,10,12,10,7,6,5,3],
    [5,3,0,3,5,6,7,10],
    [0,2,3,5,6,7,9,10],
    [10,7,5,3,0,-2,0,3],
  ],
  pentatonic: [
    [0,2,4,7,9],
    [9,7,4,2,0],
    [0,2,4,7,4,2],
    [4,7,9,12,9,7,4],
    [7,9,12,9,7,4,2,0],
    [0,4,7,9,7,4,0],
    [2,4,7,9,7,4,2,0],
    [9,12,14,12,9,7,4,2],
    [0,2,4,7,9,12,9,7],
    [4,2,0,9,7,4,2,0],
  ],
  bebop: [
    [0,-1,0,4,2,0,-1,0],
    [7,6,5,4,3,2,1,0],
    [0,1,2,4,2,1,0,-1,0],
    [4,3,2,1,0,-1,0,2],
    [10,11,0,2,4,5,7,9],
    [0,2,4,5,4,3,2,1,0],
    [7,5,4,3,2,1,0,11],
    [4,2,1,0,11,10,9,7],
    [10,11,0,1,2,4,5,7],
    [0,4,3,2,1,0,-1,0,2],
    [7,9,10,11,0,2,4,5],
  ],
  gospel: [
    [0,2,3,4,7,9,10],
    [0,3,4,7,4,3,0],
    [7,9,10,12,10,9,7,4],
    [0,4,7,10,9,7,4,2],
    [3,4,7,9,10,9,7,4],
    [0,2,4,7,4,3,2,0],
    [7,10,12,10,9,7,4,3],
    [0,3,4,5,7,9,10,12],
    [4,3,2,0,3,4,7,4],
    [0,2,3,7,9,10,9,7],
  ],
  altered: [
    [0,1,3,4,6,8,10],
    [10,8,6,4,3,1,0],
    [1,3,4,6,8,10,0],
    [4,3,1,0,10,8,6,4],
    [0,1,4,3,1,0,10,8],
    [6,8,10,0,1,3,4,6],
    [0,4,3,1,0,10,8,6],
  ],
  dim: [
    [0,2,3,5,6,8,9,11],
    [9,8,6,5,3,2,0],
    [0,3,6,9,0],
    [2,3,5,6,8,9,11,0],
    [0,1,3,4,6,7,9,10],
    [3,6,9,0,3],
    [0,3,5,6,8,9,11,0],
  ],
};

function getLick(chordStr, styleKey = 'jazz') {
  const c = parseChord(chordStr);
  if (!c) return null;
  let key = 'maj7';
  if (['7','9','13','dom7'].includes(c.type)) key = 'dom7';
  else if (['7b9','7#9','alt'].includes(c.type)) key = 'altered';
  else if (['m7','m9','m11'].includes(c.type)) key = 'm7';
  else if (['dim7','dim'].includes(c.type)) key = 'dim';
  else if (['maj7','maj9','maj13','6',''].includes(c.type)) key = 'maj7';
  if (styleKey === 'bebop')  key = 'bebop';
  if (styleKey === 'gospel') key = 'gospel';
  const lib = JAZZ_LICK_LIBRARY[key] || JAZZ_LICK_LIBRARY.maj7;
  return pick(lib).map(iv => indexToNote(noteToIndex(c.root) + iv));
}

function getIIVILick(iiChord, VChord) {
  const ii = parseChord(iiChord);
  if (!ii) return null;
  const lib = JAZZ_LICK_LIBRARY.iiVI;
  const ri  = noteToIndex(ii.root);
  return pick(lib).map(iv => indexToNote(ri + iv));
}

function tensionResolution(note, chordStr) {
  const c = parseChord(chordStr);
  if (!c) return null;
  const n   = normalizeNote(note);
  const ri  = noteToIndex(c.root);
  const ni  = noteToIndex(n);
  if (ri === -1 || ni === -1) return null;
  const iv  = (ni - ri + 12) % 12;
  if (['7','9','13','dom7','7b9','7#9','alt'].includes(c.type)) {
    if (iv === 6)  return indexToNote(ri + 7);
    if (iv === 1)  return indexToNote(ri);
    if (iv === 10) return indexToNote(ri + 11);
    if (iv === 4)  return indexToNote(ri + 3);
    if (iv === 3)  return indexToNote(ri + 4);
  }
  if (['sus4','7sus4'].includes(c.type)) {
    if (iv === 5) return indexToNote(ri + 4);
  }
  if (['dim7','dim'].includes(c.type)) return indexToNote(ni + 1);
  if (['maj7','maj9','maj13'].includes(c.type)) {
    if (iv === 11) return indexToNote(ri);
    if (iv === 6)  return indexToNote(ri + 7);
  }
  if (['m7','m9','m11'].includes(c.type)) {
    if (iv === 10) return indexToNote(ri + 12);
    if (iv === 1)  return indexToNote(ri);
  }
  return null;
}

function suspensionPattern(note, chordStr) {
  const n = normalizeNote(note);
  if (!getChordTones(chordStr).includes(n)) return null;
  return [transposeNote(note, 2), note];
}

function bluesCry(note, chordStr) {
  const n   = normalizeNote(note);
  const ct  = getChordTones(chordStr);
  if (!ct.includes(n)) return null;
  const iv  = (noteToIndex(n) - noteToIndex(parseChord(chordStr)?.root || 'C') + 12) % 12;
  if ([4,7].includes(iv)) {
    return [transposeNote(note,-1), note, transposeNote(note,1), note];
  }
  return null;
}

function callResponse(melody, chordStr) {
  if (melody.length < 2) return [];
  const call   = melody.slice(0, Math.ceil(melody.length/2));
  const respIv = pick([-2,-1,2,5,7]);
  return call.map(n => transposeNote(n, respIv));
}

function buildObbliPattern(type, sustainNote, beats, chordStr, styleKey) {
  const ct    = getChordTones(chordStr);
  const scale = getBestScale(chordStr, styleKey);
  const sn    = normalizeNote(sustainNote);
  const snIdx = noteToIndex(sn);
  const nc    = beats * 2;
  const above = scale.notes.filter(n => noteToIndex(n) > snIdx);
  const below = scale.notes.filter(n => noteToIndex(n) < snIdx);
  const abv   = above.length ? above : scale.notes;
  const blw   = below.length ? below : [...scale.notes].reverse();

  switch(type) {
    case 'ascending':          return [...blw.slice(-Math.floor(nc/2)), sn, ...abv.slice(0,2)];
    case 'descending':         return [...abv.slice(0,Math.floor(nc/2)), sn, ...blw.slice(-2)];
    case 'arch': {
      const up = abv.slice(0, Math.ceil(nc/2));
      return [...up, ...[...up].reverse().slice(1)];
    }
    case 'valley': {
      const dn = blw.slice(-Math.ceil(nc/2));
      return [...dn, ...[...dn].reverse().slice(1)];
    }
    case 'chord_arp': {
      const arp = ct.slice(0, Math.ceil(nc/2));
      return [...arp, ...[...arp].reverse()].slice(0, nc);
    }
    case 'chromatic_approach': {
      const res = [];
      ct.forEach(t => { res.push(approachNote(t,'chromatic_below')); res.push(t); });
      return res.slice(0, nc);
    }
    case 'turn_based': {
      const res = [];
      ct.slice(0,2).forEach(t => shortTurn(t).forEach(n => res.push(n)));
      return res.slice(0, nc);
    }
    case 'bebop_run': {
      const bs  = getScaleNotes(scale.root, 'bebopDom');
      const si  = Math.max(0, bs.indexOf(sn));
      return Array.from({length:nc}, (_,i) => bs[(si+i)%bs.length]);
    }
    case 'lick_based': {
      const lick = getLick(chordStr, styleKey);
      return lick ? lick.slice(0, nc) : scale.notes.slice(0, nc);
    }
    case 'tension_resolve': {
      const tens = getTensionNotes(chordStr);
      const res  = [];
      tens.slice(0,2).forEach(t => {
        res.push(t);
        const r = tensionResolution(t, chordStr);
        if (r) res.push(r);
      });
      while (res.length < nc) res.push(ct[res.length % ct.length]);
      return res.slice(0, nc);
    }
    case 'guide_tone': {
      const guides = getGuideTones(chordStr);
      const res    = [];
      guides.forEach(g => { res.push(approachNote(g,'chromatic_below')); res.push(g); });
      while (res.length < nc) res.push(pick(guides.length ? guides : ct));
      return res.slice(0, nc);
    }
    case 'encircle_run': {
      const res = [];
      ct.slice(0,2).forEach(t => encircle(t,'double').forEach(n => res.push(n)));
      while (res.length < nc) res.push(pick(ct));
      return res.slice(0, nc);
    }
    case 'pentatonic_burst': {
      const po  = getPentatonicOver(chordStr);
      const ptn = po.length ? getScaleNotes(po[0].root, po[0].scale) : scale.notes;
      const si  = Math.max(0, ptn.indexOf(sn));
      return Array.from({length:nc}, (_,i) => ptn[(si+i)%ptn.length]);
    }
    case 'call_response': {
      const half = Math.ceil(nc/2);
      const call = abv.slice(0, half);
      const resp = blw.slice(-Math.floor(nc/2));
      return [...call, ...resp];
    }
    case 'iivi_approach': {
      const lick = getIIVILick(chordStr, chordStr);
      return lick ? lick.slice(0, nc) : ct.slice(0, nc);
    }
    default:
      return scale.notes.slice(0, nc);
  }
}

function notesToObjects(noteArr, chordStr) {
  const ct = getChordTones(chordStr);
  return noteArr.map((n, i) => {
    const norm = normalizeNote(n);
    if (ct.includes(norm)) return makeNote(n, chordStr, 'chord');
    if (i > 0 && i < noteArr.length-1) return makeNote(n, chordStr, 'passing');
    return makeNote(n, chordStr, 'approach');
  });
}

const WHY_TEMPLATES = {
  v1: {
    jazz:   '원곡 멜로디를 유지하면서 앞꾸밈음과 경과음을 살짝 얹었어요. 코드 구성음 중심으로 움직여 화성감을 유지하면서도 표정이 생깁니다.',
    ballad: '원곡의 서정적인 흐름을 살리면서, 중요한 음마다 부드러운 꾸밈음을 추가했어요.',
    bebop:  '강박마다 코드 구성음을 배치하고, 박 사이에 반음 접근음을 넣었어요. 비밥 어법의 기초입니다.',
    gospel: '코드 구성음을 중심으로 위아래 보조음을 추가했어요. 가스펠 특유의 따뜻한 표현이 느껴집니다.',
  },
  v2: {
    jazz:   '스케일 패싱, 감싸기(encircle), 관용 라인을 활용해 재즈답게 변형했어요. 코드 흐름을 따르기 때문에 어색하지 않아요.',
    ballad: '텐션-해결, 서스펜션, 펜타토닉 오버를 활용해 감성적인 흐름을 만들었어요.',
    bebop:  '비밥 스케일 경과음, 이중 반음 접근, 가이드 톤 보이스 리딩으로 역동적인 라인을 만들었어요.',
    gospel: '가스펠 관용 라인, 블루스 크라이, 펜타토닉 오버를 조합했어요. 가스펠/소울 색소폰의 특징적인 표현입니다.',
  },
};
const PROG_EXTRA = {
  'ii-V-I':          ' ii-V-I 진행에서 V코드를 향한 가이드 톤 접근과 ii-V 전용 라인이 적용됩니다.',
  'blues':           ' 블루스 진행의 7화음 색깔과 블루 노트를 살렸습니다.',
  'I-VI-II-V':       ' I-VI-II-V 진행의 각 코드 변화마다 보이스 리딩이 적용됩니다.',
  'rhythm_changes':  ' 리듬 체인지 진행으로, 반음 접근으로 코드를 연결합니다.',
  'cycle_of_fourths':' 4도 순환 진행으로, 각 코드로의 반음 접근이 강조됩니다.',
};
function getV1Why(styleKey, prog) {
  return (WHY_TEMPLATES.v1[styleKey] || WHY_TEMPLATES.v1.jazz) + (PROG_EXTRA[prog] || '');
}
function getV2Why(styleKey, scaleName, prog) {
  const KR = {
    bebopDom:'비밥 도미넌트', bebopMaj:'비밥 메이저', bebopMin:'비밥 마이너',
    dorian:'도리안', mixolydian:'믹솔리디안', harmonicMinor:'화성 단음계',
    major:'메이저', blues:'블루스', altered:'얼터드', diminished:'디미니쉬드',
    lydian:'리디안', lydianDom:'리디안 도미넌트', melodicMinor:'선율 단음계',
    pentatonicMaj:'메이저 펜타토닉', pentatonicMin:'마이너 펜타토닉',
    gospelMaj:'가스펠 메이저', gospelMin:'가스펠 마이너',
  };
  return `${KR[scaleName]||scaleName} 스케일 중심 — ` + (WHY_TEMPLATES.v2[styleKey]||WHY_TEMPLATES.v2.jazz) + (PROG_EXTRA[prog]||'');
}

function generateV1(melody, chords, techniques, styleKey = 'jazz') {
  if (!melody.length) return { notes:[], why:'멜로디를 입력해주세요.' };
  const cfg      = STYLE_CONFIG[styleKey] || STYLE_CONFIG.jazz;
  const prog     = detectProgression(chords);
  const result   = [];
  const mainChord = chords[0] || 'C';

  melody.forEach((note, i) => {
    const chord     = chords[Math.min(i, chords.length-1)] || mainChord;
    const nextChord = chords[Math.min(i+1, chords.length-1)] || chord;
    const isCT      = isChordTone(note, chord);

    if (techniques.has('grace') && isCT && rand() < cfg.v1GraceProb) {
      const graceType = rand() > 0.7 ? graceWhole(note) : graceBelow(note);
      result.push(makeNote(graceType, chord, 'grace'));
    }
    result.push(makeNote(note, chord, isCT ? 'chord' : 'passing'));
    if (techniques.has('passing') && i < melody.length-1) {
      const pts = passingTones(note, melody[i+1]);
      if (pts.length === 1 && rand() < cfg.v1PassProb) result.push(makeNote(pts[0], chord, 'passing'));
    }
    if (i < melody.length-1 && rand() < 0.3) {
      const vl = getNextGuideToVoiceLead(chord, nextChord);
      if (vl && vl.semitones <= 2) result.push(makeNote(vl.from, chord, 'voicelead'));
    }
    if (techniques.has('neighbor') && i === melody.length-2 && rand() > 0.55) {
      result.push(makeNote(neighborUpper(note), chord, 'neighbor'));
    }
  });
  return { name: styleKey==='bebop'?'비밥 기초 (1절)':'꾸밈음 버전 (1절)', difficulty:'쉬움', notes:result, why:getV1Why(styleKey,prog), source:'rule' };
}

function generateV2Fallback(melody, chords, techniques, styleKey = 'jazz') {
  if (!melody.length) return { notes:[], why:'멜로디를 입력해주세요.' };
  const cfg       = STYLE_CONFIG[styleKey] || STYLE_CONFIG.jazz;
  const prog      = detectProgression(chords);
  const result    = [];
  const mainChord = chords[0] || 'C';
  const scale0    = getBestScale(mainChord, styleKey);
  const motif     = extractMotif(melody);
  let iiVIUsed    = false;

  melody.forEach((note, i) => {
    const chord     = chords[Math.min(i, chords.length-1)] || mainChord;
    const nextChord = chords[Math.min(i+1, chords.length-1)] || chord;
    const scale     = getBestScale(chord, styleKey);
    const isCT      = isChordTone(note, chord);
    const nextNote  = melody[i+1] || null;

    if (prog === 'ii-V-I' && !iiVIUsed && i === 0 && rand() < 0.5) {
      const lick = getIIVILick(chord, nextChord);
      if (lick) { lick.slice(0,3).forEach(n => result.push(makeNote(n, chord, 'iiVI'))); iiVIUsed = true; }
    }

    if (styleKey === 'bebop' && isCT && rand() < cfg.v2EncapProb) {
      const encType = pick(['double','triple','above_first']);
      encircle(note, encType).slice(0,2).forEach(n => result.push(makeNote(n, chord, 'encircle')));
    }
    if (styleKey !== 'bebop' && isCT && rand() < cfg.encircleProb) {
      encapsulation(note).slice(0,2).forEach(n => result.push(makeNote(n, chord, 'encap')));
    }

    if (techniques.has('grace') && isCT && rand() < cfg.v2GraceProb) {
      if (styleKey === 'bebop') result.push(makeNote(graceWhole(note), chord, 'grace'));
      result.push(makeNote(graceBelow(note), chord, 'grace'));
    }

    if (techniques.has('passing') && isCT && rand() < cfg.v2ApproachProb) {
      const aType = pick(['chromatic_below','chromatic_above','diatonic_below','diatonic_above']);
      result.push(makeNote(approachNote(note, aType), chord, 'approach'));
    }

    if (isCT && rand() < cfg.pentatonicOverProb) {
      const po = getPentatonicOver(chord);
      if (po.length) {
        const chosen = pick(po);
        const pNotes = getScaleNotes(chosen.root, chosen.scale);
        const pn     = pNotes[Math.floor(rand() * pNotes.length)];
        result.push(makeNote(pn, chord, 'pentatonicOver'));
      }
    }

    if (isCT && rand() < cfg.lickProb && i % 2 === 0) {
      const lick = getLick(chord, styleKey);
      if (lick) lick.slice(0,3).forEach(n => result.push(makeNote(n, chord, 'lick')));
    }

    if (isCT && rand() < cfg.tensionProb) {
      const tens = getTensionNotes(chord);
      if (tens.length) {
        const t = pick(tens);
        result.push(makeNote(t, chord, 'tension'));
        const res = tensionResolution(t, chord);
        if (res) result.push(makeNote(res, chord, 'voicelead'));
      }
    }

    if (motif && isCT && rand() < cfg.motivicProb && i > 0 && i % 3 === 0) {
      const variation = pick([
        () => invertMotif(motif),
        () => retrogradeMotif(motif),
        () => transposeMotif(motif, 5),
        () => augmentMotif(motif, chord),
        () => diminishMotif(motif),
        () => sequenceMotif(motif, 2, 2),
      ])();
      if (variation) variation.slice(0,2).forEach(n => result.push(makeNote(n, chord, 'motivic')));
    }

    result.push(makeNote(note, chord, isCT ? 'chord' : 'passing'));

    if (techniques.has('passing') && nextNote && rand() < cfg.v2PassProb) {
      const pts = passingTones(note, nextNote);
      if (styleKey === 'bebop') {
        pts.forEach(p => result.push(makeNote(p, chord, 'chromatic')));
      } else {
        pts.filter(p => isInScale(p, scale.notes)).slice(0,2)
           .forEach(p => result.push(makeNote(p, nextChord, 'passing')));
      }
    }

    if (styleKey === 'bebop' && isCT) {
      const bp = bebopPassingNote(note, chord);
      if (bp && rand() > 0.5) result.push(makeNote(bp, chord, 'bebop'));
    }

    if (['jazz','gospel'].includes(styleKey) && isCT && rand() > 0.75) {
      const co = parseChord(chord);
      const bn = getScaleNotes(co?.root||'C','blues').find(n => !isChordTone(n, chord));
      if (bn) result.push(makeNote(bn, chord, 'blues'));
    }

    if (styleKey === 'gospel' && isCT && rand() < 0.35) {
      const cry = bluesCry(note, chord);
      if (cry) cry.forEach(n => result.push(makeNote(n, chord, 'bluesCry')));
    }

    if (isCT && rand() < 0.25) {
      const susp = suspensionPattern(note, chord);
      if (susp) susp.forEach(n => result.push(makeNote(n, chord, 'suspension')));
    }

    if (isCT && rand() < cfg.substituteProb) {
      const subs = getSubstituteChords(chord);
      if (subs.length) {
        const sub     = pick(subs);
        const subNotes = getChordTones(sub.chord);
        const sn      = subNotes[Math.floor(rand()*subNotes.length)];
        if (sn) result.push(makeNote(sn, chord, 'substitute'));
      }
    }

    if (techniques.has('anticipation') && nextNote && rand() > 0.7) {
      if (isChordTone(nextNote, nextChord)) result.push(makeNote(nextNote, chord, 'anticipation'));
    }
    if (techniques.has('neighbor') && isCT && rand() > 0.65) {
      result.push(makeNote(rand()>0.5 ? neighborUpper(note) : neighborLower(note), chord, 'neighbor'));
    }
    if (techniques.has('turn') && i === melody.length-1) {
      turnFigure(note).forEach(n => result.push(makeNote(n, chord, 'turn')));
    }
    if (techniques.has('delay') && isCT && i > 0 && rand() > 0.8) {
      result.push(makeNote(delayNote(note, chord), chord, 'delay'));
    }
    if (rand() < 0.2) {
      const tens9_13 = getTensionNotes(chord).filter(t => {
        const iv = (noteToIndex(t) - noteToIndex(parseChord(chord)?.root||'C') + 12) % 12;
        return [2,9].includes(iv);
      });
      if (tens9_13.length) result.push(makeNote(pick(tens9_13), chord, 'colorTone'));
    }
  });

  return {
    name: styleKey==='bebop'?'비밥 애드립 (2절)':styleKey==='gospel'?'가스펠 애드립 (2절)':'애드립 버전 (2절)',
    difficulty: styleKey==='bebop'?'도전':'보통',
    notes: result,
    why: getV2Why(styleKey, scale0.name, prog),
    source: 'rule',
  };
}

function generateObbliRule(sustainNote, beats, chordStr, styleKey = 'jazz', feel = '서정적') {
  const beatsNum = parseInt(beats) || 3;
  const scale    = getBestScale(chordStr, styleKey);
  const CHOICES  = {
    jazz:   { lyrical:['arch','guide_tone'],            jazzy:['chromatic_approach','encircle_run'], gospel:['chord_arp','ascending'],         active:['lick_based','iivi_approach']   },
    ballad: { lyrical:['arch','tension_resolve'],        jazzy:['arch','turn_based'],                gospel:['ascending','call_response'],     active:['ascending','pentatonic_burst'] },
    bebop:  { lyrical:['bebop_run','guide_tone'],        jazzy:['bebop_run','encircle_run'],         gospel:['chord_arp','bebop_run'],         active:['iivi_approach','bebop_run']    },
    gospel: { lyrical:['chord_arp','arch'],              jazzy:['chromatic_approach','turn_based'],  gospel:['chord_arp','pentatonic_burst'],  active:['ascending','call_response']    },
  };
  const FK = { '서정적':'lyrical','재즈풍':'jazzy','가스펠':'gospel','활발하게':'active' };
  const [p1, p2] = (CHOICES[styleKey]||CHOICES.jazz)[FK[feel]||'lyrical'] || ['arch','chord_arp'];

  const PAT_LABELS = {
    ascending:'상행 패턴', descending:'하행 패턴',
    arch:'아치형', valley:'계곡형', chord_arp:'코드 아르페지오',
    chromatic_approach:'반음 접근', turn_based:'돌음 중심',
    bebop_run:'비밥 런', lick_based:'관용 라인', tension_resolve:'텐션-해결',
    guide_tone:'가이드 톤', encircle_run:'감싸기 런', pentatonic_burst:'펜타토닉 버스트',
    call_response:'콜 앤 리스폰스', iivi_approach:'ii-V-I 접근',
  };
  const RHYTHM_LABELS = {
    ascending:'8분음표 상행', descending:'8분음표 하행',
    arch:'8분음표 아치', valley:'8분음표 계곡', chord_arp:'아르페지오',
    chromatic_approach:'반음 접근 8분음표', turn_based:'돌음 위주',
    bebop_run:'비밥 런', lick_based:'관용 라인 리듬', tension_resolve:'텐션→해결',
    guide_tone:'가이드 톤', encircle_run:'감싸기 8분음표', pentatonic_burst:'펜타토닉 버스트',
    call_response:'콜-리스폰스', iivi_approach:'ii-V-I 런',
  };
  const WHY_OB = {
    ascending:        `${sustainNote}음이 울리는 동안 스케일을 타고 위로 올라가며 다음 멜로디를 자연스럽게 연결합니다.`,
    descending:       `위에서 아래로 흘러내리며 ${sustainNote}음의 공간을 채워줘요.`,
    arch:             `올라갔다 내려오는 아치형 흐름으로, ${chordStr} 코드의 색깔을 풍부하게 표현합니다.`,
    valley:           `내려갔다 올라오는 계곡형 패턴으로, 긴 음 뒤 공간을 서정적으로 채워줍니다.`,
    chord_arp:        `${chordStr} 코드 구성음을 아르페지오로 훑어서 화성을 명확히 드러냅니다.`,
    chromatic_approach:`각 코드음에 반음 아래에서 접근하는 비밥 어법이에요. 긴장감을 줬다가 해소합니다.`,
    turn_based:       `코드음 주변을 돌음으로 장식해서 고전적인 재즈 오블리가토 느낌을 냅니다.`,
    bebop_run:        `비밥 스케일 경과음을 활용한 빠른 런(run)으로 공간을 에너지감 있게 채워줍니다.`,
    lick_based:       `재즈 연주자들이 자주 쓰는 관용 라인(lick)으로 자연스럽고 재즈다운 느낌을 냅니다.`,
    tension_resolve:  `텐션음을 넣었다가 코드음으로 해결하는 패턴으로 긴장감과 해소감이 공간을 풍부하게 만들어요.`,
    guide_tone:       `3도와 7도(가이드 톤)를 중심으로 접근해서 화성 변화를 가장 효율적으로 표현합니다.`,
    encircle_run:     `코드음을 위아래 반음으로 감싸는 비밥 어법으로, 공간에 세련된 재즈 색채를 더합니다.`,
    pentatonic_burst: `이 코드에 최적화된 펜타토닉 스케일로 자유롭고 표현력 있는 오블리가토를 만듭니다.`,
    call_response:    `올라가는 콜(call)과 내려오는 리스폰스(response)로 공간에 대화감을 만듭니다.`,
    iivi_approach:    `ii-V-I 클리셰 라인을 활용해서 화성 진행과 자연스럽게 어우러집니다.`,
  };

  function buildPat(patType, idx) {
    return {
      name:   `패턴 ${idx+1}: ${PAT_LABELS[patType]||patType}`,
      notes:  notesToObjects(buildObbliPattern(patType, sustainNote, beatsNum, chordStr, styleKey), chordStr),
      rhythm: RHYTHM_LABELS[patType]||'8분음표',
      why:    WHY_OB[patType]||`${chordStr} 코드와 ${scale.name} 스케일을 활용한 오블리가토입니다.`,
      source: 'rule',
    };
  }
  return [buildPat(p1, 0), buildPat(p2, 1)];
}

const RuleEngine = {
  CHROMATIC, CHORD_INTERVALS, SCALE_INTERVALS, CHORD_SCALE_MAP, STYLE_CONFIG, JAZZ_LICK_LIBRARY,
  noteToIndex, indexToNote, transposeNote, normalizeNote, semitonesBetween, pick, shuffle, clamp,
  parseChord, getChordTones, isChordTone,
  getScaleNotes, getBestScale, isInScale,
  classifyNote, makeNote,
  graceBelow, graceWhole, graceAbove, passingTones, neighborUpper, neighborLower,
  turnFigure, shortTurn, delayNote,
  approachNote, doubleChromatic, encapsulation, encircle, bebopPassingNote, chordArp,
  getTritoneSubChord, getGuideTones, getNextGuideToVoiceLead, getTensionNotes,
  getSubstituteChords, getPentatonicOver, getModalInterchangeNotes,
  extractMotif, invertMotif, retrogradeMotif, transposeMotif, augmentMotif, diminishMotif, sequenceMotif,
  detectProgression, getLick, getIIVILick, tensionResolution, suspensionPattern, bluesCry, callResponse,
  generateV1, generateV2Fallback, generateObbliRule,
};

if (typeof module !== 'undefined') module.exports = RuleEngine;
else window.RuleEngine = RuleEngine;
