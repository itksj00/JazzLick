'use strict';

const CHROMATIC = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
const ENHARMONIC = {
  'Db':'C#','Eb':'D#','Fb':'E','Gb':'F#','Ab':'G#','Bb':'A#','Cb':'B','E#':'F','B#':'C',
};

const CHORD_INTERVALS = {
  '':        [0,4,7],          'm':       [0,3,7],
  'dim':     [0,3,6],          'aug':     [0,4,8],
  'maj7':    [0,4,7,11],       'm7':      [0,3,7,10],
  '7':       [0,4,7,10],       'dom7':    [0,4,7,10],
  'dim7':    [0,3,6,9],        'm7b5':    [0,3,6,10],
  'mM7':     [0,3,7,11],       'aug7':    [0,4,8,10],
  '6':       [0,4,7,9],        'm6':      [0,3,7,9],
  'sus2':    [0,2,7],          'sus4':    [0,5,7],
  '7sus4':   [0,5,7,10],       '9':       [0,4,7,10,14],
  'maj9':    [0,4,7,11,14],    'm9':      [0,3,7,10,14],
  'add9':    [0,4,7,14],       'majadd9': [0,4,7,14],
  '11':      [0,4,7,10,14,17], 'm11':     [0,3,7,10,14,17],
  '13':      [0,4,7,10,14,17,21], 'maj13':[0,4,7,11,14,17,21],
  '7b9':     [0,4,7,10,13],    '7#9':     [0,4,7,10,15],
  '7b5':     [0,4,6,10],       '7#5':     [0,4,8,10],
  'alt':     [0,4,8,10,13,15], '7b9b5':   [0,4,6,10,13],
  '7#9#5':   [0,4,8,10,15],    'maj7#11': [0,4,7,11,18],
  'm7b9':    [0,3,7,10,13],    '7#11':    [0,4,7,10,18],
  'maj7#5':  [0,4,8,11],       '6/9':     [0,4,7,9,14],
  'm6/9':    [0,3,7,9,14],     'add11':   [0,4,7,17],
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
  harmonicMajor: [0,2,4,5,7,8,11],
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
  superLocrian:  [0,1,3,4,6,8,10],
  chromatic:     [0,1,2,3,4,5,6,7,8,9,10,11],
  dorianb2:      [0,1,3,5,7,9,10],
  lydianAug:     [0,2,4,6,8,9,11],
  acoustic:      [0,2,4,6,7,9,10],
  majorPent:     [0,2,4,7,9],
  minorPent:     [0,3,5,7,10],
  gospelMaj:     [0,2,3,4,7,9,10],
  gospelMin:     [0,3,4,5,7,10],
  latinMaj:      [0,2,4,5,7,9,10],
  latinMin:      [0,2,3,5,7,8,10],
  fusionPent:    [0,2,4,6,9],
  enigmatic:     [0,1,4,6,8,10,11],
  neapolitan:    [0,1,3,5,7,9,11],
  quartal:       [0,5,10,3,8],
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
  'majadd9': ['major'],
  'add11':   ['lydian'],
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
  'alt':     ['altered','superLocrian','dimHalfWhole'],
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

const COLOR_TONES_MAP = {
  '':        [2,6,9],
  'maj7':    [2,6,9],
  'maj9':    [6,9],
  'maj13':   [6],
  'm7':      [2,5],
  'm9':      [5,9],
  'm11':     [9],
  'm6':      [2,6],
  '7':       [1,2,3,6,9],
  '9':       [6,9],
  '13':      [6],
  '7b9':     [1,3,8],
  '7#9':     [3,6,8],
  'alt':     [1,3,6,8],
  'dim7':    [2,5,11],
  'm7b5':    [2],
  'sus4':    [2,9],
  '7sus4':   [2,9],
  'mM7':     [2,6],
};

const AVOID_NOTES_MAP = {
  'maj7':    [5],
  '':        [5],
  'maj9':    [5],
  'm7':      [],
  'dorian':  [],
  '7':       [11],
  'dom7':    [11],
  'mixolydian':[11],
  'locrian': [0],
};

const CHORD_FUNCTION_MAP = {
  '':     'tonic',   'maj7':'tonic',   'maj9':'tonic', 'maj13':'tonic',
  '6':    'tonic',   '6/9':'tonic',    'add9':'tonic',
  'm7':   'subdominant', 'm9':'subdominant', 'm11':'subdominant',
  'm':    'subdominant',
  '7':    'dominant', '9':'dominant',  '13':'dominant', 'dom7':'dominant',
  '7b9':  'dominant', '7#9':'dominant','alt':'dominant', '7b5':'dominant',
  '7#5':  'dominant', '7sus4':'dominant',
  'dim7': 'diminished', 'dim':'diminished', 'm7b5':'subdominant',
  'aug7': 'dominant',
};

const STYLE_CONFIG = {
  jazz: {
    v1GraceProb:0.55, v1PassProb:0.45,
    v2GraceProb:1.0,  v2PassProb:0.85, v2EncapProb:0.4, v2ApproachProb:0.5,
    lickProb:0.35, tensionProb:0.4, motivicProb:0.5,
    encircleProb:0.3, pentatonicOverProb:0.3, substituteProb:0.25,
    backCycleProb:0.2, secDomProb:0.2, rhythmDisplaceProb:0.15,
    outsideProb:0.1, colorToneProb:0.35, phraseProb:0.3,
    scaleIdx:0, label:'재즈 페이크',
  },
  ballad: {
    v1GraceProb:0.35, v1PassProb:0.3,
    v2GraceProb:0.7,  v2PassProb:0.6,  v2EncapProb:0.2, v2ApproachProb:0.3,
    lickProb:0.15, tensionProb:0.25, motivicProb:0.35,
    encircleProb:0.15, pentatonicOverProb:0.2, substituteProb:0.1,
    backCycleProb:0.1, secDomProb:0.1, rhythmDisplaceProb:0.08,
    outsideProb:0.0, colorToneProb:0.2, phraseProb:0.25,
    scaleIdx:1, label:'발라드',
  },
  bebop: {
    v1GraceProb:0.7,  v1PassProb:0.6,
    v2GraceProb:1.0,  v2PassProb:1.0,  v2EncapProb:0.7, v2ApproachProb:0.8,
    lickProb:0.6, tensionProb:0.6, motivicProb:0.7,
    encircleProb:0.6, pentatonicOverProb:0.4, substituteProb:0.4,
    backCycleProb:0.4, secDomProb:0.35, rhythmDisplaceProb:0.3,
    outsideProb:0.25, colorToneProb:0.5, phraseProb:0.45,
    scaleIdx:0, label:'비밥',
  },
  gospel: {
    v1GraceProb:0.5,  v1PassProb:0.4,
    v2GraceProb:0.9,  v2PassProb:0.8,  v2EncapProb:0.35, v2ApproachProb:0.55,
    lickProb:0.45, tensionProb:0.45, motivicProb:0.5,
    encircleProb:0.25, pentatonicOverProb:0.5, substituteProb:0.2,
    backCycleProb:0.15, secDomProb:0.15, rhythmDisplaceProb:0.1,
    outsideProb:0.0, colorToneProb:0.35, phraseProb:0.3,
    scaleIdx:2, label:'가스펠/소울',
  },
  latin: {
    v1GraceProb:0.4,  v1PassProb:0.5,
    v2GraceProb:0.75, v2PassProb:0.9,  v2EncapProb:0.25, v2ApproachProb:0.6,
    lickProb:0.4, tensionProb:0.35, motivicProb:0.45,
    encircleProb:0.2, pentatonicOverProb:0.55, substituteProb:0.2,
    backCycleProb:0.2, secDomProb:0.25, rhythmDisplaceProb:0.2,
    outsideProb:0.05, colorToneProb:0.3, phraseProb:0.3,
    scaleIdx:0, label:'라틴 재즈',
  },
  fusion: {
    v1GraceProb:0.45, v1PassProb:0.55,
    v2GraceProb:0.8,  v2PassProb:0.9,  v2EncapProb:0.5, v2ApproachProb:0.65,
    lickProb:0.5, tensionProb:0.55, motivicProb:0.6,
    encircleProb:0.45, pentatonicOverProb:0.6, substituteProb:0.35,
    backCycleProb:0.3, secDomProb:0.3, rhythmDisplaceProb:0.35,
    outsideProb:0.3, colorToneProb:0.5, phraseProb:0.35,
    scaleIdx:0, label:'퓨전',
  },
  swing: {
    v1GraceProb:0.6,  v1PassProb:0.5,
    v2GraceProb:0.95, v2PassProb:0.85, v2EncapProb:0.45, v2ApproachProb:0.55,
    lickProb:0.5, tensionProb:0.45, motivicProb:0.55,
    encircleProb:0.35, pentatonicOverProb:0.35, substituteProb:0.3,
    backCycleProb:0.25, secDomProb:0.25, rhythmDisplaceProb:0.2,
    outsideProb:0.15, colorToneProb:0.4, phraseProb:0.4,
    scaleIdx:0, label:'스윙',
  },
};

function noteToIndex(n) { return CHROMATIC.indexOf(ENHARMONIC[n]||n); }
function indexToNote(i) { return CHROMATIC[((i%12)+12)%12]; }
function transposeNote(note,st){ const i=noteToIndex(note); return i===-1?note:indexToNote(i+st); }
function normalizeNote(n){ return ENHARMONIC[n]||n; }
function semitonesBetween(a,b){
  const ia=noteToIndex(a),ib=noteToIndex(b);
  if(ia===-1||ib===-1)return 0;
  let d=ib-ia; if(d>6)d-=12; if(d<-6)d+=12; return d;
}
function rand(){ return Math.random(); }
function pick(arr){ return arr[Math.floor(rand()*arr.length)]; }
function pickWeighted(items){
  const tot=items.reduce((s,it)=>s+(it.weight||1),0);
  let r=rand()*tot;
  for(const it of items){ r-=(it.weight||1); if(r<=0)return it.value; }
  return items[items.length-1].value;
}
function shuffle(arr){
  const a=[...arr];
  for(let i=a.length-1;i>0;i--){ const j=Math.floor(rand()*(i+1));[a[i],a[j]]=[a[j],a[i]]; }
  return a;
}
function clamp(v,lo,hi){ return Math.max(lo,Math.min(hi,v)); }

function parseChord(str){
  if(!str||typeof str!=='string')return null;
  const slash=str.match(/^(.+)\/([A-G][b#]?)$/);
  const bass=slash?normalizeNote(slash[2]):null;
  const main=slash?slash[1]:str;
  const rm=main.match(/^([A-G][b#]?)/);
  if(!rm)return null;
  const root=rm[1];
  return{root:normalizeNote(root),type:main.slice(root.length)||'',bass};
}
function getChordTones(s){
  const c=parseChord(s); if(!c)return [];
  const ri=noteToIndex(c.root); if(ri===-1)return [];
  return(CHORD_INTERVALS[c.type]||CHORD_INTERVALS['']).map(iv=>indexToNote(ri+iv));
}
function isChordTone(note,s){ return getChordTones(s).includes(normalizeNote(note)); }
function getScaleNotes(root,scaleName){
  const ivs=SCALE_INTERVALS[scaleName]; if(!ivs)return [];
  const ri=noteToIndex(root); if(ri===-1)return [];
  return ivs.map(iv=>indexToNote(ri+iv));
}
function getBestScale(s,styleKey='jazz'){
  const c=parseChord(s);
  if(!c)return{name:'major',notes:getScaleNotes('C','major'),root:'C'};
  const cands=CHORD_SCALE_MAP[c.type]||['major'];
  const cfg=STYLE_CONFIG[styleKey]||STYLE_CONFIG.jazz;
  const idx=Math.min(cfg.scaleIdx,cands.length-1);
  return{name:cands[idx],notes:getScaleNotes(c.root,cands[idx]),root:c.root,allCandidates:cands};
}
function getScaleForContext(s,prevS,nextS,styleKey='jazz'){
  const c=parseChord(s); if(!c)return getBestScale(s,styleKey);
  const base=getBestScale(s,styleKey);
  if(!nextS)return base;
  const nc=parseChord(nextS); if(!nc)return base;
  const rootDiff=(noteToIndex(nc.root)-noteToIndex(c.root)+12)%12;
  const DOM=new Set(['7','9','13','dom7','7b9','7#9','alt']);
  if(DOM.has(c.type)&&rootDiff===5){
    return{...base,contextScale:getScaleNotes(c.root,'altered'),mixScale:getScaleNotes(c.root,'mixolydian')};
  }
  return base;
}
function isInScale(note,scaleNotes){ return scaleNotes.includes(normalizeNote(note)); }

function getColorTones(s){
  const c=parseChord(s); if(!c)return [];
  const ri=noteToIndex(c.root);
  const ivs=COLOR_TONES_MAP[c.type]||[];
  return ivs.map(iv=>indexToNote(ri+iv)).filter(t=>!getChordTones(s).includes(t));
}
function getAvoidNotes(s){
  const c=parseChord(s); if(!c)return [];
  const ri=noteToIndex(c.root);
  const ivs=AVOID_NOTES_MAP[c.type]||[];
  return ivs.map(iv=>indexToNote(ri+iv));
}
function getChordFunction(s){
  const c=parseChord(s); if(!c)return 'unknown';
  return CHORD_FUNCTION_MAP[c.type]||'unknown';
}

function classifyNote(note,s,role='passing'){
  if(getChordTones(s).includes(normalizeNote(note)))return 'chord';
  if(['grace','turn','ornament','approach','encap','encircle','backCycle','secDom','outside','coltrane','phrase'].includes(role))return 'ornament';
  return 'nonchord';
}
function makeNote(note,s,role='passing'){
  const type=classifyNote(note,s,role);
  const L={
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
    backCycle:'백 사이클링', secDom:'부속 도미넌트', displaced:'리듬 변위',
    coltrane:'콜트레인 체인지', chromaticMediant:'반음 중간음',
    outside:'아웃사이드', sideStep:'사이드스텝', backdoor:'백도어',
    phrase:'프레이즈', quartal:'4도 보이싱', upperStruct:'상부 구조',
    diminSym:'디미니쉬드 대칭', augPat:'어그멘티드 패턴',
    chromRun:'반음계 런', parkerLick:'파커 어법', coolLick:'쿨 재즈',
    modalLick:'모달 재즈', soulLick:'소울 재즈',
    latin:'라틴 어법', fusion:'퓨전 어법', swing:'스윙 어법',
  };
  return{note,type,label:L[role]||L[type]||type};
}

function graceBelow(n)  { return transposeNote(n,-1); }
function graceWhole(n)  { return transposeNote(n,-2); }
function graceAbove(n)  { return transposeNote(n,1); }
function passingTones(a,b){
  const ia=noteToIndex(a),ib=noteToIndex(b);
  if(ia===-1||ib===-1)return [];
  const diff=ib-ia; if(Math.abs(diff)<=1)return [];
  const step=diff>0?1:-1; const res=[];
  for(let i=ia+step;i!==ib;i+=step)res.push(indexToNote(i));
  return res;
}
function neighborUpper(n){ return transposeNote(n,1); }
function neighborLower(n){ return transposeNote(n,-1); }
function turnFigure(n){ return[transposeNote(n,2),n,transposeNote(n,-1),n]; }
function shortTurn(n){ return[transposeNote(n,1),n,transposeNote(n,-1)]; }
function longTurn(n){ return[transposeNote(n,2),transposeNote(n,1),n,transposeNote(n,-1),transposeNote(n,-2),n]; }
function delayNote(n,s){
  const ct=getChordTones(s).filter(t=>t!==normalizeNote(n));
  return ct.length?pick(ct):transposeNote(n,4);
}
function approachNote(t,type='chromatic_below'){
  const M={chromatic_below:-1,chromatic_above:1,diatonic_below:-2,diatonic_above:2,tritone:6};
  return transposeNote(t,M[type]??-1);
}
function doubleChromatic(t){ return[transposeNote(t,2),transposeNote(t,1),t]; }
function tripleApproach(t){ return[transposeNote(t,-2),transposeNote(t,2),transposeNote(t,1),t]; }
function encapsulation(t){ return[transposeNote(t,-1),transposeNote(t,1),t]; }
function encircle(t,type='double'){
  switch(type){
    case 'double':        return[transposeNote(t,-1),transposeNote(t,2),transposeNote(t,1),t];
    case 'triple':        return[transposeNote(t,2),transposeNote(t,-1),transposeNote(t,1),t];
    case 'above_first':   return[transposeNote(t,1),transposeNote(t,-2),transposeNote(t,-1),t];
    case 'chromatic_quad':return[transposeNote(t,-2),transposeNote(t,-1),transposeNote(t,1),t];
    case 'wide':          return[transposeNote(t,-2),transposeNote(t,2),transposeNote(t,-1),transposeNote(t,1),t];
    default:              return encapsulation(t);
  }
}

function bebopPassingNote(note,s){
  const c=parseChord(s); if(!c)return null;
  const n=normalizeNote(note); if(!getChordTones(s).includes(n))return null;
  if(['7','9','13','dom7'].includes(c.type))return indexToNote(noteToIndex(c.root)+11);
  if(['maj7','maj9','maj13'].includes(c.type))return indexToNote(noteToIndex(c.root)+8);
  if(['m7','m9'].includes(c.type))return indexToNote(noteToIndex(c.root)+8);
  return null;
}
function wholeTonePassingNote(note,s){
  const c=parseChord(s); if(!c)return null;
  if(!['aug7','7#5','alt','7b5'].includes(c.type))return null;
  return transposeNote(note,2);
}
function chordArp(s,dir='up'){
  const t=getChordTones(s); return dir==='up'?t:[...t].reverse();
}

function chromaticRun(startNote,length,dir='up'){
  const step=dir==='up'?1:-1;
  return Array.from({length},(_,i)=>transposeNote(startNote,i*step));
}
function diminishedSymmetry(root,pattern=[0,2,3,5]){
  const ri=noteToIndex(root); const res=[];
  [0,3,6,9].forEach(offset=>pattern.forEach(iv=>res.push(indexToNote(ri+offset+iv))));
  return res;
}
function augmentedPattern(root){
  const ri=noteToIndex(root);
  return[0,4,8,0,4,8].map(iv=>indexToNote(ri+iv));
}
function quartalNotes(root,count=5){
  const ri=noteToIndex(root);
  return Array.from({length:count},(_,i)=>indexToNote(ri+i*5));
}
function upperStructureNotes(s){
  const c=parseChord(s); if(!c)return [];
  const ri=noteToIndex(c.root);
  const DOM=new Set(['7','9','13','dom7','7b9','7#9','alt']);
  if(DOM.has(c.type)){
    const uspRoot=indexToNote((ri+2)%12);
    return getChordTones(uspRoot+'maj7');
  }
  if(['maj7','maj9'].includes(c.type)){
    return getChordTones(indexToNote((ri+4)%12)+'maj7');
  }
  if(['m7','m9'].includes(c.type)){
    return getChordTones(indexToNote((ri+3)%12)+'maj7');
  }
  return [];
}

function outsidePlaying(notes,type='half_step'){
  if(!notes||!notes.length)return notes;
  const SHIFTS={half_step:1,whole_step:2,tritone:6,minor_third:3};
  const shift=SHIFTS[type]||1;
  const half=Math.ceil(notes.length/2);
  return[
    ...notes.slice(0,half).map(n=>transposeNote(n,shift)),
    ...notes.slice(half),
  ];
}
function sideStep(notes,semitones=1){
  if(!notes)return notes;
  return notes.map(n=>transposeNote(n,semitones));
}

function getTritoneSubChord(s){
  const c=parseChord(s); if(!c)return null;
  if(!['7','9','13','dom7','alt','7b9','7#9'].includes(c.type))return null;
  return indexToNote((noteToIndex(c.root)+6)%12)+'7';
}
function getGuideTones(s){
  const ct=getChordTones(s); return[ct[1],ct[3]].filter(Boolean);
}
function getNextGuideToVoiceLead(cur,nxt){
  const cg=getGuideTones(cur),ng=getGuideTones(nxt);
  if(!cg.length||!ng.length)return null;
  let best=null,bestDist=99;
  cg.forEach(c=>ng.forEach(n=>{
    const d=Math.abs(semitonesBetween(c,n));
    if(d<bestDist){bestDist=d;best={from:c,to:n,semitones:d};}
  }));
  return best;
}
function getVoiceLeadingLine(chords){
  if(!chords||chords.length<2)return [];
  const line=[];
  for(let i=0;i<chords.length-1;i++){
    const vl=getNextGuideToVoiceLead(chords[i],chords[i+1]);
    if(vl)line.push({chord:chords[i],note:vl.from,target:vl.to,semitones:vl.semitones});
  }
  return line;
}

function getTensionNotes(s){
  const c=parseChord(s); if(!c)return [];
  const ri=noteToIndex(c.root); const ct=getChordTones(s); const res=[];
  if(['maj7','maj9','7','9','13','dom7'].includes(c.type))res.push(indexToNote(ri+2));
  if(['7','9','13','dom7','maj7','maj9'].includes(c.type))res.push(indexToNote(ri+9));
  if(['m7','m9','m11'].includes(c.type)){res.push(indexToNote(ri+2));res.push(indexToNote(ri+5));}
  if(['7b9','alt','7#9'].includes(c.type)){res.push(indexToNote(ri+1));res.push(indexToNote(ri+3));}
  if(['maj7','maj9','maj13'].includes(c.type))res.push(indexToNote(ri+6));
  if(['m6','mM7'].includes(c.type))res.push(indexToNote(ri+2));
  if(['dim7','dim'].includes(c.type)){res.push(indexToNote(ri+2));res.push(indexToNote(ri+11));}
  return[...new Set(res)].filter(t=>!ct.includes(t));
}

function getSecondaryDominant(s){
  const c=parseChord(s); if(!c)return null;
  return indexToNote((noteToIndex(c.root)+7)%12)+'7';
}
function getBackCycleChords(s){
  const c=parseChord(s); if(!c)return [];
  const ri=noteToIndex(c.root);
  return[
    {chord:indexToNote((ri+5)%12)+'m7',label:'ii of target'},
    {chord:indexToNote(ri)+'7',label:'V of target'},
  ];
}
function backdoor(targetChord){
  const c=parseChord(targetChord); if(!c)return null;
  return indexToNote((noteToIndex(c.root)-2+12)%12)+'7';
}
function getColtraneChanges(root){
  const ri=noteToIndex(normalizeNote(root)); if(ri===-1)return [];
  return[ri,(ri+4)%12,(ri+8)%12].map(i=>indexToNote(i)+'maj7');
}
function getChromaticMediant(s){
  const c=parseChord(s); if(!c)return [];
  const ri=noteToIndex(c.root);
  return[
    indexToNote((ri+4)%12)+(c.type||'maj7'),
    indexToNote((ri+8)%12)+(c.type||'maj7'),
    indexToNote((ri+3)%12)+'m7',
    indexToNote((ri+9)%12)+'m7',
  ];
}
function getNeapolitanApproach(s){
  const c=parseChord(s); if(!c)return null;
  return indexToNote((noteToIndex(c.root)-1+12)%12)+'maj7';
}

function extractMotif(melody){
  if(melody.length<2)return null;
  return melody.slice(0,Math.min(3,melody.length));
}
function invertMotif(m){
  if(!m||m.length<2)return m;
  const ivs=[]; for(let i=1;i<m.length;i++)ivs.push(semitonesBetween(m[i-1],m[i]));
  const res=[m[0]]; ivs.forEach((iv,i)=>res.push(transposeNote(res[i],-iv)));
  return res;
}
function retrogradeMotif(m){ return m?[...m].reverse():m; }
function transposeMotif(m,st){ return m?m.map(n=>transposeNote(n,st)):m; }
function augmentMotif(m,s){
  if(!m)return [];
  const res=[];
  m.forEach(n=>{res.push(n);if(getChordTones(s).includes(normalizeNote(n)))res.push(neighborUpper(n));});
  return res;
}
function diminishMotif(m){
  if(!m||m.length<2)return m;
  return m.slice(0,Math.ceil(m.length/2));
}
function sequenceMotif(m,step,count=2){
  const res=[...m];
  for(let i=1;i<count;i++)transposeMotif(m,step*i).forEach(n=>res.push(n));
  return res;
}
function rhythmicDisplacement(m,shift=1){
  if(!m||m.length<2)return m;
  const s=((shift%m.length)+m.length)%m.length;
  return[...m.slice(s),...m.slice(0,s)];
}
function mirrorMotif(m){
  if(!m||m.length<2)return m;
  return[...m,...[...m].reverse().slice(1)];
}

function getSubstituteChords(s){
  const c=parseChord(s); if(!c)return [];
  const ri=noteToIndex(c.root); const subs=[];
  subs.push({chord:indexToNote((ri+3)%12)+'maj7',type:'minor_third_up'});
  subs.push({chord:indexToNote((ri+9)%12)+'maj7',type:'minor_third_down'});
  if(['7','9','13','dom7'].includes(c.type))subs.push({chord:indexToNote((ri+6)%12)+'7',type:'tritone'});
  if(['maj7','maj9'].includes(c.type))subs.push({chord:indexToNote((ri+9)%12)+'m7',type:'relative_minor'});
  if(['m7','m9'].includes(c.type))subs.push({chord:indexToNote((ri+3)%12)+'maj7',type:'relative_major'});
  subs.push({chord:indexToNote((ri+4)%12)+c.type,type:'chromatic_mediant_up'});
  subs.push({chord:indexToNote((ri+8)%12)+c.type,type:'chromatic_mediant_down'});
  return subs;
}
function getPentatonicOver(s){
  const c=parseChord(s); if(!c)return [];
  const ri=noteToIndex(c.root); const res=[];
  if(['maj7','maj9','maj13','6',''].includes(c.type)){
    res.push({root:c.root,scale:'pentatonicMaj',label:'루트 메이저 펜타'});
    res.push({root:indexToNote((ri+9)%12),scale:'pentatonicMin',label:'장6도 마이너 펜타'});
    res.push({root:indexToNote((ri+4)%12),scale:'pentatonicMaj',label:'장3도 메이저 펜타'});
    res.push({root:indexToNote((ri+7)%12),scale:'pentatonicMaj',label:'5도 메이저 펜타'});
  }
  if(['m7','m9','m11'].includes(c.type)){
    res.push({root:c.root,scale:'pentatonicMin',label:'루트 마이너 펜타'});
    res.push({root:indexToNote((ri+3)%12),scale:'pentatonicMaj',label:'단3도 메이저 펜타'});
    res.push({root:indexToNote((ri+7)%12),scale:'pentatonicMin',label:'5도 마이너 펜타'});
    res.push({root:indexToNote((ri+10)%12),scale:'pentatonicMaj',label:'단7도 메이저 펜타'});
  }
  if(['7','9','13','dom7'].includes(c.type)){
    res.push({root:indexToNote((ri+9)%12),scale:'pentatonicMin',label:'장6도 마이너 펜타'});
    res.push({root:indexToNote((ri+5)%12),scale:'pentatonicMaj',label:'4도 메이저 펜타'});
    res.push({root:c.root,scale:'pentatonicMaj',label:'루트 메이저 펜타'});
    res.push({root:indexToNote((ri+2)%12),scale:'pentatonicMin',label:'장2도 마이너 펜타'});
  }
  if(['alt','7b9','7#9'].includes(c.type)){
    res.push({root:indexToNote((ri+8)%12),scale:'pentatonicMin',label:'단6도 마이너 펜타'});
    res.push({root:indexToNote((ri+1)%12),scale:'pentatonicMin',label:'단2도 마이너 펜타'});
    res.push({root:indexToNote((ri+6)%12),scale:'pentatonicMaj',label:'트리톤 메이저 펜타'});
  }
  return res;
}
function getModalInterchangeNotes(s,targetMode){
  const c=parseChord(s); if(!c)return [];
  return getScaleNotes(c.root,targetMode).filter(n=>!getChordTones(s).includes(n));
}

function detectProgression(chords){
  if(!chords||chords.length<2)return null;
  const parsed=chords.map(c=>parseChord(c)).filter(Boolean);
  const types=parsed.map(p=>p.type);
  const roots=parsed.map(p=>p.root);
  const DOM=new Set(['7','9','13','dom7','7b9','7#9','alt','7b5','7#5','7#11']);
  const MIN7=new Set(['m7','m9','m11']);
  const MAJ=new Set(['maj7','maj9','maj13','','6','add9','6/9']);

  for(let i=0;i<parsed.length-1;i++){
    if(MIN7.has(types[i])&&DOM.has(types[i+1])){
      if((noteToIndex(roots[i+1])-noteToIndex(roots[i])+12)%12===5)return 'ii-V-I';
    }
  }
  if(parsed.length>=4){
    const r=roots.map(n=>noteToIndex(n));
    const d=[];
    for(let i=1;i<r.length;i++)d.push((r[i]-r[i-1]+12)%12);
    if(d[0]===9&&d[1]===5&&d[2]===7)return 'I-VI-II-V';
  }
  for(let i=0;i<parsed.length-2;i++){
    const d1=(noteToIndex(roots[i+1])-noteToIndex(roots[i])+12)%12;
    const d2=(noteToIndex(roots[i+2])-noteToIndex(roots[i+1])+12)%12;
    if(d1===4&&d2===4)return 'coltrane';
  }
  if(types.filter(t=>DOM.has(t)).length>=2)return 'blues';
  if(types.length>=4&&types.some(t=>MAJ.has(t))&&types.some(t=>DOM.has(t))&&types.some(t=>MIN7.has(t)))return 'rhythm_changes';
  if(parsed.length>=3){
    const ds=roots.map((r,i)=>i===0?null:(noteToIndex(roots[i])-noteToIndex(roots[i-1])+12)%12).filter(d=>d!==null);
    if(ds.every(d=>d===5))return 'cycle_of_fourths';
    if(ds.every(d=>d===7))return 'cycle_of_fifths';
    if(ds.every(d=>d===3))return 'chromatic_mediant';
  }
  return null;
}

const JAZZ_LICK_LIBRARY = {
  dom7:[
    [0,-2,2,7,5,3,2],[7,5,4,3,2,0],[10,11,0,2,4,5,4],[0,1,2,4,5,7,9,10],
    [4,3,2,0,10,9,7],[-2,-1,0,4,2,0,-1,0],[7,9,10,11,0,2,4],[0,4,2,1,0,-1,0,2,4],
    [5,4,2,0,11,9,7,5],[2,4,5,7,5,4,2,0],[10,9,7,6,5,4,2,0],[0,2,4,5,4,3,2,1,0],
    [7,5,4,2,0,-1,0,2],[0,4,5,7,9,10,9,7],[10,11,0,4,2,0,10,9],[2,1,0,10,9,7,5,4],
    [0,2,4,7,10,9,7,5],[5,7,9,10,9,5,4,2],[0,10,11,0,4,2,0,-1],[7,6,5,4,3,2,0,11],
  ],
  maj7:[
    [0,2,4,7,9,11,12],[11,9,7,4,2,0],[0,4,7,11,9,7,4],[7,9,11,0,2,4,7],
    [0,2,4,5,7,4,2,0],[4,7,9,11,9,7,4,2],[0,4,2,0,11,9,7,4],[9,11,0,2,4,7,9],
    [0,2,4,7,4,2,0,11],[11,0,2,4,7,9,11,12],[7,4,2,0,11,7,4,0],[0,4,7,9,11,9,7,4],
    [2,4,7,9,11,0,2,4],[9,7,4,2,0,4,7,9],[0,2,4,9,7,4,2,0],[4,2,0,11,9,7,4,2],
    [0,4,7,11,14,11,9,7],[6,7,9,11,0,2,4,7],[0,2,6,7,9,11,0,2],
  ],
  m7:[
    [0,3,5,7,10,12],[10,9,7,5,3,0],[0,2,3,5,7,9,10],[3,5,7,10,9,7,5,3],
    [7,5,3,2,0,10,9,7],[0,-1,0,3,2,0,-2,0],[10,12,3,5,7,10,9,7],[0,3,2,0,10,9,7,5],
    [5,7,9,10,9,7,5,3],[3,5,7,3,5,3,2,0],[0,2,3,5,3,2,0,10],[7,10,9,7,5,3,2,0],
    [0,3,5,7,10,9,5,3],[10,12,14,12,10,9,7,5],[3,2,0,10,9,7,5,3],[5,7,10,12,10,7,5,3],
    [0,3,5,10,9,7,5,3],[2,3,5,7,9,10,12,10],
  ],
  iiVI:[
    [2,0,-1,0,4,2,0,-1,0],[2,3,5,4,3,2,0,11],[5,4,3,2,0,-1,0,4],[2,1,0,11,0,4,7,11],
    [3,2,0,11,0,2,4,7],[5,7,9,10,9,7,4,2],[2,4,5,7,5,4,2,0],[0,2,3,5,4,2,0,-1],
    [2,3,5,7,5,4,3,2,0],[5,4,2,0,11,0,2,4],[2,1,0,11,9,11,0,2],[3,5,4,2,1,0,11,0],
    [2,4,7,5,4,2,0,11],[5,3,2,0,11,0,4,7],[0,2,4,5,4,2,0,-1],[3,2,0,4,2,0,11,0],
  ],
  blues:[
    [0,3,5,6,7,10],[10,7,6,5,3,0],[7,6,5,3,0,3],[0,3,5,6,7,10,12,10,7],
    [5,6,7,10,7,5,3,0],[3,5,6,7,5,3,0,3],[0,3,5,6,5,3,0,-2,0],[7,10,12,10,7,6,5,3],
    [5,3,0,3,5,6,7,10],[0,2,3,5,6,7,9,10],[10,7,5,3,0,-2,0,3],[0,3,5,6,7,6,5,3],
    [7,5,6,7,10,7,5,3],[3,0,3,5,6,7,5,3],[0,5,6,7,10,12,10,7],[3,5,7,6,5,3,0,3],
    [0,3,5,6,7,10,9,7],[6,7,10,12,10,7,6,5],
  ],
  pentatonic:[
    [0,2,4,7,9],[9,7,4,2,0],[0,2,4,7,4,2],[4,7,9,12,9,7,4],
    [7,9,12,9,7,4,2,0],[0,4,7,9,7,4,0],[2,4,7,9,7,4,2,0],[9,12,14,12,9,7,4,2],
    [0,2,4,7,9,12,9,7],[4,2,0,9,7,4,2,0],[7,4,2,0,4,7,9,12],[0,4,7,4,2,0,9,7],
    [2,4,7,4,2,0,9,0],[9,7,4,7,9,12,9,7],[0,2,4,7,9,4,2,0],
  ],
  bebop:[
    [0,-1,0,4,2,0,-1,0],[7,6,5,4,3,2,1,0],[0,1,2,4,2,1,0,-1,0],[4,3,2,1,0,-1,0,2],
    [10,11,0,2,4,5,7,9],[0,2,4,5,4,3,2,1,0],[7,5,4,3,2,1,0,11],[4,2,1,0,11,10,9,7],
    [10,11,0,1,2,4,5,7],[0,4,3,2,1,0,-1,0,2],[7,9,10,11,0,2,4,5],[0,1,2,4,5,7,9,11],
    [11,10,9,7,5,4,2,1],[4,5,7,9,11,0,2,4],[2,1,0,11,10,9,7,5],[0,2,4,5,7,9,11,0],
    [7,11,10,9,7,5,4,2],[10,0,11,10,9,7,5,4],
  ],
  gospel:[
    [0,2,3,4,7,9,10],[0,3,4,7,4,3,0],[7,9,10,12,10,9,7,4],[0,4,7,10,9,7,4,2],
    [3,4,7,9,10,9,7,4],[0,2,4,7,4,3,2,0],[7,10,12,10,9,7,4,3],[0,3,4,5,7,9,10,12],
    [4,3,2,0,3,4,7,4],[0,2,3,7,9,10,9,7],[3,4,7,10,12,10,7,4],[0,4,3,2,0,3,4,7],
    [7,9,10,12,14,12,10,9],[0,2,3,4,7,4,3,2],[4,7,10,9,7,4,3,2],
  ],
  altered:[
    [0,1,3,4,6,8,10],[10,8,6,4,3,1,0],[1,3,4,6,8,10,0],[4,3,1,0,10,8,6,4],
    [0,1,4,3,1,0,10,8],[6,8,10,0,1,3,4,6],[0,4,3,1,0,10,8,6],[8,6,4,3,1,0,10,8],
    [1,0,10,8,6,4,3,1],[3,4,6,8,10,0,1,3],[0,1,3,6,8,10,1,0],[4,6,8,10,1,3,4,0],
  ],
  dim:[
    [0,2,3,5,6,8,9,11],[9,8,6,5,3,2,0],[0,3,6,9,0],[2,3,5,6,8,9,11,0],
    [0,1,3,4,6,7,9,10],[3,6,9,0,3],[0,3,5,6,8,9,11,0],[9,11,0,2,3,5,6,8],
    [6,8,9,11,0,2,3,5],[0,2,3,6,9,11,0,3],
  ],
  latin:[
    [0,2,4,5,7,5,4,2],[7,9,10,9,7,5,4,2],[0,4,5,7,9,7,5,4],[2,4,5,7,9,10,9,7],
    [5,4,2,0,10,9,7,5],[0,2,4,7,9,10,9,7],[4,5,7,9,10,9,7,5],[9,7,5,4,2,0,2,4],
    [0,4,2,0,9,7,5,4],[7,9,10,12,10,9,7,5],[2,4,7,5,4,2,0,4],[0,5,4,2,0,4,5,7],
    [9,10,12,10,9,7,5,4],[4,5,7,10,9,7,5,4],
  ],
  fusion:[
    [0,2,4,6,9,0],[0,3,5,6,7,9],[2,4,6,9,11,0,2],[0,4,6,7,9,11,0],
    [6,7,9,0,2,4,6],[0,2,6,7,9,2,0],[4,6,9,11,0,4,6],[0,2,4,9,6,4,2,0],
    [9,11,0,2,4,6,9],[0,6,4,2,0,9,6,4],[2,6,9,11,0,6,4,2],[0,4,6,9,0,9,6,4],
  ],
  swing:[
    [0,2,4,5,7,9,10,11],[11,10,9,7,5,4,2,0],[0,4,5,7,10,9,5,4],[7,5,4,2,0,11,10,9],
    [2,4,5,7,9,10,11,0],[0,2,4,7,5,4,2,0],[10,11,0,2,4,5,4,2],[5,7,9,10,11,0,2,4],
    [0,4,2,0,11,9,7,5],[9,10,11,0,2,4,5,7],[0,2,4,5,9,7,5,4],[7,9,11,0,4,2,0,11],
  ],
  coltrane:[
    [0,4,7,11,4,8,11,3],[0,4,8,0,4,8],[4,8,0,4,8,0,4],[0,3,4,7,8,0,3,4],
    [11,0,4,7,8,11,3,4],[0,4,7,8,0,4,8,11],[4,0,8,4,0,8],[0,4,8,11,3,7,11,2],
  ],
  parker:[
    [0,4,3,4,7,9,10,9,7],[0,2,4,3,4,7,5,4],[0,4,7,9,7,6,5,4],[7,4,2,0,11,0,2,4],
    [0,2,3,4,5,4,3,2],[4,5,7,9,10,9,5,4],[0,4,3,2,1,0,11,10],[7,9,10,11,0,10,9,7],
    [0,1,2,4,5,4,3,2,0],[-1,0,2,4,5,7,9,10],[4,3,1,0,11,10,9,7],[10,11,0,4,3,2,1,0],
    [0,4,7,10,4,3,2,0],[7,5,4,3,4,5,7,9],[0,2,4,7,9,10,4,2],[5,4,3,2,0,4,3,2],
  ],
  cool:[
    [0,7,4,2,0],[0,2,4,7,9,7,4],[0,4,7,9,7,4,2,0],[7,4,2,0,4,7,9,12],
    [9,7,4,2,0,4,7],[0,4,9,7,4,2],[2,4,7,9,12,9,7],[0,2,7,9,7,4,2,0],
    [4,7,9,12,9,7,4,0],[0,7,9,12,9,4,2,0],[2,0,9,7,4,2,0],[0,4,7,4,2,0,9],
  ],
  modal_jazz:[
    [0,5,10,3,8,1,6,11],[0,5,2,7,4,9,6,11],[0,5,10,15,10,5,0],[5,10,3,8,1,6,11,0],
    [0,5,9,2,7,11,4],[10,3,8,1,6,11,4,9],[0,5,7,0,5,7,0],[5,0,5,10,3,8,1],
    [0,7,2,9,4,11,6,1],[3,8,1,6,11,4,9,2],[0,5,10,2,7,0,5,10],
  ],
  soul_jazz:[
    [0,3,4,7,3,4,7,10],[3,4,7,10,9,7,4,3],[0,4,7,10,4,7,10,0],[3,4,7,10,12,10,7,4],
    [0,3,5,7,10,7,5,3],[4,7,10,12,10,7,4,3],[0,2,3,5,7,10,9,7],[7,9,10,12,10,9,7,4],
    [0,4,3,2,0,4,7,10],[3,7,10,12,10,7,3,0],[4,3,0,4,7,10,9,7],
  ],
  coltrane_sheets:[
    [0,4,7,11,14,11,7,4],[0,3,7,10,14,10,7,3],[0,4,8,0,4,8,12],[0,4,7,11,4,8,11,3],
    [0,3,7,10,3,7,10,0],[4,8,11,3,8,11,3,7],[0,4,8,12,8,4,0],[0,3,6,9,12,9,6,3],
    [0,4,7,11,2,4,7,11],[3,7,10,14,10,7,3,0],
  ],
};

function getLick(s,styleKey='jazz'){
  const c=parseChord(s); if(!c)return null;
  let key='maj7';
  if(['7','9','13','dom7'].includes(c.type))               key='dom7';
  else if(['7b9','7#9','alt'].includes(c.type))            key='altered';
  else if(['m7','m9','m11'].includes(c.type))              key='m7';
  else if(['dim7','dim'].includes(c.type))                 key='dim';
  else if(['maj7','maj9','maj13','6',''].includes(c.type)) key='maj7';

  const STYLE_LICK={
    bebop:'bebop', gospel:'gospel', latin:'latin', fusion:'fusion',
    swing:'swing', cool:'cool', modal_jazz:'modal_jazz', soul_jazz:'soul_jazz',
  };
  if(STYLE_LICK[styleKey])key=STYLE_LICK[styleKey];

  const lib=JAZZ_LICK_LIBRARY[key]||JAZZ_LICK_LIBRARY.maj7;
  return pick(lib).map(iv=>indexToNote(noteToIndex(c.root)+iv));
}
function getIIVILick(iiChord){
  const ii=parseChord(iiChord); if(!ii)return null;
  return pick(JAZZ_LICK_LIBRARY.iiVI).map(iv=>indexToNote(noteToIndex(ii.root)+iv));
}
function getColtraneChangesLick(root){
  const ri=noteToIndex(normalizeNote(root)); if(ri===-1)return null;
  return pick(JAZZ_LICK_LIBRARY.coltrane).map(iv=>indexToNote(ri+iv));
}
function getProgressionSpecificLick(prog,chord,styleKey='jazz'){
  const c=parseChord(chord); if(!c)return getLick(chord,styleKey);
  const ri=noteToIndex(c.root);
  switch(prog){
    case 'ii-V-I':
      return pick(JAZZ_LICK_LIBRARY.iiVI).map(iv=>indexToNote(ri+iv));
    case 'blues':
      return pick(JAZZ_LICK_LIBRARY.blues).map(iv=>indexToNote(ri+iv));
    case 'coltrane':
      return getColtraneChangesLick(c.root);
    case 'rhythm_changes':
      return pick(JAZZ_LICK_LIBRARY.bebop).map(iv=>indexToNote(ri+iv));
    default:
      return getLick(chord,styleKey);
  }
}

function tensionResolution(note,s){
  const c=parseChord(s); if(!c)return null;
  const n=normalizeNote(note);
  const ri=noteToIndex(c.root),ni=noteToIndex(n);
  if(ri===-1||ni===-1)return null;
  const iv=(ni-ri+12)%12;
  if(['7','9','13','dom7','7b9','7#9','alt'].includes(c.type)){
    if(iv===6)return indexToNote(ri+7);
    if(iv===1)return indexToNote(ri);
    if(iv===10)return indexToNote(ri+11);
    if(iv===4)return indexToNote(ri+3);
    if(iv===3)return indexToNote(ri+4);
  }
  if(['sus4','7sus4'].includes(c.type)){if(iv===5)return indexToNote(ri+4);}
  if(['dim7','dim'].includes(c.type))return indexToNote(ni+1);
  if(['maj7','maj9','maj13'].includes(c.type)){
    if(iv===11)return indexToNote(ri);
    if(iv===6)return indexToNote(ri+7);
  }
  if(['m7','m9','m11'].includes(c.type)){
    if(iv===10)return indexToNote(ri);
    if(iv===1)return indexToNote(ri);
  }
  return null;
}
function suspensionPattern(note,s){
  const n=normalizeNote(note);
  if(!getChordTones(s).includes(n))return null;
  return[transposeNote(note,2),note];
}
function bluesCry(note,s){
  const n=normalizeNote(note); const ct=getChordTones(s);
  if(!ct.includes(n))return null;
  const iv=(noteToIndex(n)-noteToIndex(parseChord(s)?.root||'C')+12)%12;
  if([4,7].includes(iv))return[transposeNote(note,-1),note,transposeNote(note,1),note];
  return null;
}
function callResponse(melody,s){
  if(melody.length<2)return [];
  const call=melody.slice(0,Math.ceil(melody.length/2));
  const respIv=pick([-2,-1,2,5,7]);
  return call.map(n=>transposeNote(n,respIv));
}
function latinClave(note){
  return[note,transposeNote(note,2),transposeNote(note,5),transposeNote(note,7),transposeNote(note,5)];
}
function swingLick(note,s){
  const n=normalizeNote(note);
  if(!getChordTones(s).includes(n))return null;
  return[transposeNote(note,-1),note,transposeNote(note,2),note,transposeNote(note,-1),note];
}

function generatePhrase(s,beats,styleKey='jazz'){
  const ct=getChordTones(s);
  const tensions=getTensionNotes(s);
  const colors=getColorTones(s);
  const scale=getBestScale(s,styleKey);
  const fn=getChordFunction(s);
  const noteCount=beats*2;
  const result=[];

  const landingNote=ct[0];
  result.push(makeNote(approachNote(landingNote,'chromatic_below'),s,'grace'));
  result.push(makeNote(landingNote,s,'chord'));

  if(ct[2]){
    result.push(makeNote(ct[1]||ct[0],s,'chord'));
    result.push(makeNote(ct[2],s,'chord'));
  }

  if(fn==='dominant'&&tensions.length){
    const t=pick(tensions);
    result.push(makeNote(t,s,'tension'));
    const res=tensionResolution(t,s);
    if(res)result.push(makeNote(res,s,'voicelead'));
  } else if(colors.length){
    result.push(makeNote(pick(colors),s,'colorTone'));
  }

  const guide=getGuideTones(s);
  if(guide.length){
    result.push(makeNote(approachNote(guide[0],'chromatic_below'),s,'approach'));
    result.push(makeNote(guide[0],s,'chord'));
  }

  while(result.length<noteCount){
    const idx=result.length%scale.notes.length;
    result.push(makeNote(scale.notes[idx],s,'scale'));
  }
  return result.slice(0,noteCount);
}

function buildObbliPattern(type,sustainNote,beats,s,styleKey){
  const ct=getChordTones(s);
  const scale=getBestScale(s,styleKey);
  const sn=normalizeNote(sustainNote);
  const snIdx=noteToIndex(sn);
  const nc=beats*2;
  const above=scale.notes.filter(n=>noteToIndex(n)>snIdx);
  const below=scale.notes.filter(n=>noteToIndex(n)<snIdx);
  const abv=above.length?above:scale.notes;
  const blw=below.length?below:[...scale.notes].reverse();

  switch(type){
    case 'ascending':  return[...blw.slice(-Math.floor(nc/2)),sn,...abv.slice(0,2)];
    case 'descending': return[...abv.slice(0,Math.floor(nc/2)),sn,...blw.slice(-2)];
    case 'arch':{const up=abv.slice(0,Math.ceil(nc/2));return[...up,...[...up].reverse().slice(1)];}
    case 'valley':{const dn=blw.slice(-Math.ceil(nc/2));return[...dn,...[...dn].reverse().slice(1)];}
    case 'chord_arp':{const arp=ct.slice(0,Math.ceil(nc/2));return[...arp,...[...arp].reverse()].slice(0,nc);}
    case 'chromatic_approach':{const res=[];ct.forEach(t=>{res.push(approachNote(t,'chromatic_below'));res.push(t);});return res.slice(0,nc);}
    case 'turn_based':{const res=[];ct.slice(0,2).forEach(t=>shortTurn(t).forEach(n=>res.push(n)));return res.slice(0,nc);}
    case 'long_turn':{const res=[];ct.slice(0,1).forEach(t=>longTurn(t).forEach(n=>res.push(n)));while(res.length<nc)res.push(pick(ct));return res.slice(0,nc);}
    case 'bebop_run':{const bs=getScaleNotes(scale.root,'bebopDom');const si=Math.max(0,bs.indexOf(sn));return Array.from({length:nc},(_,i)=>bs[(si+i)%bs.length]);}
    case 'lick_based':{const lick=getLick(s,styleKey);return lick?lick.slice(0,nc):scale.notes.slice(0,nc);}
    case 'tension_resolve':{const tens=getTensionNotes(s);const res=[];tens.slice(0,2).forEach(t=>{res.push(t);const r=tensionResolution(t,s);if(r)res.push(r);});while(res.length<nc)res.push(ct[res.length%ct.length]);return res.slice(0,nc);}
    case 'guide_tone':{const guides=getGuideTones(s);const res=[];guides.forEach(g=>{res.push(approachNote(g,'chromatic_below'));res.push(g);});while(res.length<nc)res.push(pick(guides.length?guides:ct));return res.slice(0,nc);}
    case 'encircle_run':{const res=[];ct.slice(0,2).forEach(t=>encircle(t,'double').forEach(n=>res.push(n)));while(res.length<nc)res.push(pick(ct));return res.slice(0,nc);}
    case 'pentatonic_burst':{const po=getPentatonicOver(s);const ptn=po.length?getScaleNotes(po[0].root,po[0].scale):scale.notes;const si=Math.max(0,ptn.indexOf(sn));return Array.from({length:nc},(_,i)=>ptn[(si+i)%ptn.length]);}
    case 'call_response':{return[...abv.slice(0,Math.ceil(nc/2)),...blw.slice(-Math.floor(nc/2))];}
    case 'iivi_approach':{const lick=getIIVILick(s);return lick?lick.slice(0,nc):ct.slice(0,nc);}
    case 'whole_tone_run':{const wt=getScaleNotes(scale.root,'wholeTone');const si=Math.max(0,wt.indexOf(sn));return Array.from({length:nc},(_,i)=>wt[(si+i)%wt.length]);}
    case 'coltrane_run':{const cl=getColtraneChangesLick(scale.root);return cl?cl.slice(0,nc):ct.slice(0,nc);}
    case 'displaced':{const base=scale.notes.slice(0,Math.ceil(nc/2));return rhythmicDisplacement([...base,...base],1).slice(0,nc);}
    case 'triple_approach':{const res=[];ct.slice(0,2).forEach(t=>tripleApproach(t).forEach(n=>res.push(n)));while(res.length<nc)res.push(pick(ct));return res.slice(0,nc);}
    case 'chromatic_run':{return chromaticRun(sn,nc,'up');}
    case 'dim_symmetry':{return diminishedSymmetry(scale.root).slice(0,nc);}
    case 'augmented':{return[...augmentedPattern(scale.root),...ct].slice(0,nc);}
    case 'upper_struct':{const us=upperStructureNotes(s);return us.length?[...us,...ct].slice(0,nc):ct.slice(0,nc);}
    case 'quartal':{return quartalNotes(sn,nc);}
    case 'outside_in':{const lick=getLick(s,styleKey)||ct;return outsidePlaying(lick.slice(0,nc),'half_step');}
    case 'phrase_based':{const ph=generatePhrase(s,beats,styleKey);return ph.map(n=>n.note);}
    default: return scale.notes.slice(0,nc);
  }
}

function notesToObjects(noteArr,s){
  const ct=getChordTones(s);
  return noteArr.map((n,i)=>{
    const norm=normalizeNote(n);
    if(ct.includes(norm))return makeNote(n,s,'chord');
    if(i>0&&i<noteArr.length-1)return makeNote(n,s,'passing');
    return makeNote(n,s,'approach');
  });
}

const WHY_TEMPLATES={
  v1:{
    jazz:  '원곡 멜로디를 유지하면서 앞꾸밈음과 경과음을 살짝 얹었어요. 코드 구성음 중심으로 움직여 화성감을 유지하면서도 표정이 생깁니다.',
    ballad:'원곡의 서정적인 흐름을 살리면서, 중요한 음마다 부드러운 꾸밈음을 추가했어요.',
    bebop: '강박마다 코드 구성음을 배치하고, 박 사이에 반음 접근음을 넣었어요. 비밥 어법의 기초입니다.',
    gospel:'코드 구성음을 중심으로 위아래 보조음을 추가했어요. 가스펠 특유의 따뜻한 표현이 느껴집니다.',
    latin: '코드 구성음 중심으로 라틴 특유의 활기찬 꾸밈음을 추가했어요.',
    fusion:'기본 멜로디에 퓨전 스타일의 반음 접근과 모달 색채를 더했어요.',
    swing: '스윙 어법 특유의 강박 코드음 배치와 약박 경과음으로 그루브를 살렸어요.',
  },
  v2:{
    jazz:  '스케일 패싱, 감싸기, 관용 라인을 활용해 재즈답게 변형했어요. 코드 흐름을 따르기 때문에 어색하지 않아요.',
    ballad:'텐션-해결, 서스펜션, 펜타토닉 오버를 활용해 감성적인 흐름을 만들었어요.',
    bebop: '비밥 스케일 경과음, 이중 반음 접근, 가이드 톤 보이스 리딩으로 역동적인 라인을 만들었어요.',
    gospel:'가스펠 관용 라인, 블루스 크라이, 펜타토닉 오버를 조합했어요. 가스펠/소울 색소폰의 특징적인 표현입니다.',
    latin: '라틴 관용 라인과 클라베 리듬 패턴, 펜타토닉 오버를 조합해 라틴 재즈 특유의 활기찬 흐름을 만들었어요.',
    fusion:'퓨전 스케일 패싱, 모달 인터체인지, 아웃사이드 플레잉을 활용해 현대적인 라인을 만들었어요.',
    swing: '스윙 관용 라인과 비밥 어법, 강박 코드음 배치를 통해 정통 스윙 색소폰 느낌을 살렸어요.',
  },
};
const PROG_EXTRA={
  'ii-V-I':          ' ii-V-I 진행에서 V코드를 향한 가이드 톤 접근과 ii-V 전용 라인이 적용됩니다.',
  'blues':           ' 블루스 진행의 7화음 색깔과 블루 노트를 살렸습니다.',
  'I-VI-II-V':       ' I-VI-II-V 진행의 각 코드 변화마다 보이스 리딩이 적용됩니다.',
  'rhythm_changes':  ' 리듬 체인지 진행으로, 반음 접근으로 코드를 연결합니다.',
  'cycle_of_fourths':' 4도 순환 진행으로, 각 코드로의 반음 접근이 강조됩니다.',
  'coltrane':        ' 콜트레인 체인지 진행으로, 장3도 간격의 화성 이동이 핵심입니다.',
  'chromatic_mediant':' 반음 중간음 관계 진행으로, 특색 있는 반음 색채 이동이 적용됩니다.',
};
function getV1Why(sk,prog){
  return(WHY_TEMPLATES.v1[sk]||WHY_TEMPLATES.v1.jazz)+(PROG_EXTRA[prog]||'');
}
function getV2Why(sk,scaleName,prog){
  const KR={
    bebopDom:'비밥 도미넌트',bebopMaj:'비밥 메이저',bebopMin:'비밥 마이너',
    dorian:'도리안',mixolydian:'믹솔리디안',harmonicMinor:'화성 단음계',
    major:'메이저',blues:'블루스',altered:'얼터드',diminished:'디미니쉬드',
    lydian:'리디안',lydianDom:'리디안 도미넌트',melodicMinor:'선율 단음계',
    pentatonicMaj:'메이저 펜타토닉',pentatonicMin:'마이너 펜타토닉',
    gospelMaj:'가스펠 메이저',gospelMin:'가스펠 마이너',
    latinMaj:'라틴 메이저',fusionPent:'퓨전 펜타토닉',superLocrian:'슈퍼 로크리안',
    wholeTone:'온음',quartal:'4도 보이싱',
  };
  return`${KR[scaleName]||scaleName} 스케일 중심 — `+(WHY_TEMPLATES.v2[sk]||WHY_TEMPLATES.v2.jazz)+(PROG_EXTRA[prog]||'');
}

function generateV1(melody,chords,techniques,styleKey='jazz'){
  if(!melody.length)return{notes:[],why:'멜로디를 입력해주세요.'};
  const cfg=STYLE_CONFIG[styleKey]||STYLE_CONFIG.jazz;
  const prog=detectProgression(chords);
  const result=[]; const mainChord=chords[0]||'C';

  melody.forEach((note,i)=>{
    const chord=chords[Math.min(i,chords.length-1)]||mainChord;
    const nextChord=chords[Math.min(i+1,chords.length-1)]||chord;
    const isCT=isChordTone(note,chord);
    const avoids=getAvoidNotes(chord);

    if(techniques.has('grace')&&isCT&&rand()<cfg.v1GraceProb){
      const g=rand()>0.7?graceWhole(note):rand()>0.5?graceBelow(note):graceAbove(note);
      result.push(makeNote(g,chord,'grace'));
    }
    result.push(makeNote(note,chord,isCT?'chord':'passing'));
    if(techniques.has('passing')&&i<melody.length-1){
      const pts=passingTones(note,melody[i+1]);
      if(pts.length===1&&rand()<cfg.v1PassProb&&!avoids.includes(pts[0]))
        result.push(makeNote(pts[0],chord,'passing'));
    }
    if(i<melody.length-1&&rand()<0.3){
      const vl=getNextGuideToVoiceLead(chord,nextChord);
      if(vl&&vl.semitones<=2)result.push(makeNote(vl.from,chord,'voicelead'));
    }
    if(styleKey==='latin'&&isCT&&rand()<0.3)
      latinClave(note).slice(0,2).forEach(n=>result.push(makeNote(n,chord,'latin')));
    if(styleKey==='swing'&&isCT&&rand()<0.35){
      const sw=swingLick(note,chord);
      if(sw)sw.slice(0,2).forEach(n=>result.push(makeNote(n,chord,'swing')));
    }
    if(techniques.has('neighbor')&&i===melody.length-2&&rand()>0.55)
      result.push(makeNote(neighborUpper(note),chord,'neighbor'));
  });
  const NAMES={bebop:'비밥 기초 (1절)',swing:'스윙 기초 (1절)',latin:'라틴 기초 (1절)'};
  return{name:NAMES[styleKey]||'꾸밈음 버전 (1절)',difficulty:'쉬움',notes:result,why:getV1Why(styleKey,prog),source:'rule'};
}

function generateV2Fallback(melody,chords,techniques,styleKey='jazz'){
  if(!melody.length)return{notes:[],why:'멜로디를 입력해주세요.'};
  const cfg=STYLE_CONFIG[styleKey]||STYLE_CONFIG.jazz;
  const prog=detectProgression(chords);
  const result=[]; const mainChord=chords[0]||'C';
  const scale0=getBestScale(mainChord,styleKey);
  const motif=extractMotif(melody);
  let iiVIUsed=false,coltraneUsed=false,phraseUsed=false;

  melody.forEach((note,i)=>{
    const chord=chords[Math.min(i,chords.length-1)]||mainChord;
    const nextChord=chords[Math.min(i+1,chords.length-1)]||chord;
    const prevChord=chords[Math.max(i-1,0)]||chord;
    const scale=getScaleForContext(chord,prevChord,nextChord,styleKey);
    const isCT=isChordTone(note,chord);
    const nextNote=melody[i+1]||null;
    const avoids=getAvoidNotes(chord);
    const colors=getColorTones(chord);
    const chordFn=getChordFunction(chord);

    if(prog==='ii-V-I'&&!iiVIUsed&&i===0&&rand()<0.5){
      const lick=getProgressionSpecificLick(prog,chord,styleKey);
      if(lick){lick.slice(0,3).forEach(n=>result.push(makeNote(n,chord,'iiVI')));iiVIUsed=true;}
    }
    if(prog==='coltrane'&&!coltraneUsed&&isCT&&rand()<0.5){
      const cl=getColtraneChangesLick(parseChord(chord)?.root||'C');
      if(cl){cl.slice(0,3).forEach(n=>result.push(makeNote(n,chord,'coltrane')));coltraneUsed=true;}
    }
    if(!phraseUsed&&i%4===0&&rand()<cfg.phraseProb){
      const ph=generatePhrase(chord,2,styleKey);
      ph.forEach(n=>result.push(n));
      phraseUsed=true;
    }

    if(styleKey==='bebop'&&isCT&&rand()<cfg.v2EncapProb)
      encircle(note,pick(['double','triple','above_first','chromatic_quad'])).slice(0,2)
        .forEach(n=>result.push(makeNote(n,chord,'encircle')));
    if(styleKey!=='bebop'&&isCT&&rand()<cfg.encircleProb)
      encapsulation(note).slice(0,2).forEach(n=>result.push(makeNote(n,chord,'encap')));

    if(techniques.has('grace')&&isCT&&rand()<cfg.v2GraceProb){
      if(styleKey==='bebop')result.push(makeNote(graceWhole(note),chord,'grace'));
      result.push(makeNote(graceBelow(note),chord,'grace'));
    }
    if(techniques.has('passing')&&isCT&&rand()<cfg.v2ApproachProb)
      result.push(makeNote(approachNote(note,pick(['chromatic_below','chromatic_above','diatonic_below','diatonic_above'])),chord,'approach'));

    if(isCT&&rand()<cfg.outsideProb){
      const lick=getLick(chord,styleKey)||[note];
      const outside=outsidePlaying(lick.slice(0,2),'half_step');
      outside.forEach(n=>result.push(makeNote(n,chord,'outside')));
    }

    if(isCT&&colors.length&&rand()<cfg.colorToneProb)
      result.push(makeNote(pick(colors),chord,'colorTone'));

    if(isCT&&rand()<cfg.pentatonicOverProb){
      const po=getPentatonicOver(chord);
      if(po.length){const pn=pick(getScaleNotes(pick(po).root,pick(po).scale));result.push(makeNote(pn,chord,'pentatonicOver'));}
    }
    if(isCT&&rand()<cfg.lickProb&&i%2===0){
      const lick=prog?getProgressionSpecificLick(prog,chord,styleKey):getLick(chord,styleKey);
      if(lick)lick.slice(0,3).forEach(n=>result.push(makeNote(n,chord,'lick')));
    }
    if(isCT&&rand()<cfg.tensionProb){
      const tens=getTensionNotes(chord);
      if(tens.length){const t=pick(tens);result.push(makeNote(t,chord,'tension'));const r=tensionResolution(t,chord);if(r)result.push(makeNote(r,chord,'voicelead'));}
    }
    if(motif&&isCT&&rand()<cfg.motivicProb&&i>0&&i%3===0){
      const variation=pick([
        ()=>invertMotif(motif),()=>retrogradeMotif(motif),()=>transposeMotif(motif,5),
        ()=>augmentMotif(motif,chord),()=>diminishMotif(motif),()=>sequenceMotif(motif,2,2),
        ()=>rhythmicDisplacement(motif,1),()=>mirrorMotif(motif),
      ])();
      if(variation)variation.slice(0,2).forEach(n=>result.push(makeNote(n,chord,'motivic')));
    }
    if(isCT&&rand()<cfg.backCycleProb){
      const bc=getBackCycleChords(chord);
      if(bc.length){const bcN=getChordTones(bc[0].chord);if(bcN.length)result.push(makeNote(pick(bcN),chord,'backCycle'));}
    }
    if(isCT&&rand()<cfg.secDomProb){
      const sd=getSecondaryDominant(chord);
      if(sd){const sdN=getChordTones(sd);if(sdN.length)result.push(makeNote(pick(sdN),chord,'secDom'));}
    }
    if(isCT&&rand()<cfg.rhythmDisplaceProb){
      rhythmicDisplacement([note,transposeNote(note,2),transposeNote(note,4)],1).slice(0,1)
        .forEach(n=>result.push(makeNote(n,chord,'displaced')));
    }

    result.push(makeNote(note,chord,isCT?'chord':'passing'));

    if(techniques.has('passing')&&nextNote&&rand()<cfg.v2PassProb){
      const pts=passingTones(note,nextNote);
      if(styleKey==='bebop'||styleKey==='fusion'){
        pts.forEach(p=>result.push(makeNote(p,chord,'chromatic')));
      } else {
        pts.filter(p=>isInScale(p,scale.notes)&&!avoids.includes(p)).slice(0,2)
          .forEach(p=>result.push(makeNote(p,nextChord,'passing')));
      }
    }
    if(styleKey==='bebop'&&isCT){const bp=bebopPassingNote(note,chord);if(bp&&rand()>0.5)result.push(makeNote(bp,chord,'bebop'));}
    if(styleKey==='fusion'&&isCT){const wp=wholeTonePassingNote(note,chord);if(wp&&rand()>0.6)result.push(makeNote(wp,chord,'whole_tone'));}
    if(['jazz','gospel','swing'].includes(styleKey)&&isCT&&rand()>0.75){
      const co=parseChord(chord);
      const bn=getScaleNotes(co?.root||'C','blues').find(n=>!isChordTone(n,chord));
      if(bn)result.push(makeNote(bn,chord,'blues'));
    }
    if(styleKey==='gospel'&&isCT&&rand()<0.35){const cry=bluesCry(note,chord);if(cry)cry.forEach(n=>result.push(makeNote(n,chord,'bluesCry')));}
    if(styleKey==='latin'&&isCT&&rand()<0.35)latinClave(note).slice(0,2).forEach(n=>result.push(makeNote(n,chord,'latin')));
    if(styleKey==='swing'&&isCT&&rand()<0.4){const sw=swingLick(note,chord);if(sw)sw.slice(0,2).forEach(n=>result.push(makeNote(n,chord,'swing')));}
    if(isCT&&rand()<0.25){const susp=suspensionPattern(note,chord);if(susp)susp.forEach(n=>result.push(makeNote(n,chord,'suspension')));}
    if(isCT&&rand()<cfg.substituteProb){
      const subs=getSubstituteChords(chord);
      if(subs.length){const sn=pick(getChordTones(pick(subs).chord));if(sn)result.push(makeNote(sn,chord,'substitute'));}
    }
    if(techniques.has('anticipation')&&nextNote&&rand()>0.7&&isChordTone(nextNote,nextChord))
      result.push(makeNote(nextNote,chord,'anticipation'));
    if(techniques.has('neighbor')&&isCT&&rand()>0.65)
      result.push(makeNote(rand()>0.5?neighborUpper(note):neighborLower(note),chord,'neighbor'));
    if(techniques.has('turn')&&i===melody.length-1)
      turnFigure(note).forEach(n=>result.push(makeNote(n,chord,'turn')));
    if(techniques.has('delay')&&isCT&&i>0&&rand()>0.8)
      result.push(makeNote(delayNote(note,chord),chord,'delay'));
  });

  const NAMES={bebop:'비밥 애드립 (2절)',gospel:'가스펠 애드립 (2절)',latin:'라틴 재즈 애드립 (2절)',fusion:'퓨전 애드립 (2절)',swing:'스윙 애드립 (2절)'};
  return{name:NAMES[styleKey]||'애드립 버전 (2절)',difficulty:styleKey==='bebop'?'도전':'보통',notes:result,why:getV2Why(styleKey,scale0.name,prog),source:'rule'};
}

function generateObbliRule(sustainNote,beats,s,styleKey='jazz',feel='서정적'){
  const beatsNum=parseInt(beats)||3;
  const scale=getBestScale(s,styleKey);
  const CHOICES={
    jazz:   {lyrical:['arch','guide_tone'],         jazzy:['chromatic_approach','encircle_run'], gospel:['chord_arp','ascending'],          active:['lick_based','iivi_approach']},
    ballad: {lyrical:['arch','tension_resolve'],     jazzy:['arch','turn_based'],                gospel:['ascending','call_response'],      active:['ascending','pentatonic_burst']},
    bebop:  {lyrical:['bebop_run','guide_tone'],     jazzy:['bebop_run','encircle_run'],         gospel:['chord_arp','bebop_run'],          active:['iivi_approach','coltrane_run']},
    gospel: {lyrical:['chord_arp','arch'],           jazzy:['chromatic_approach','turn_based'],  gospel:['chord_arp','pentatonic_burst'],   active:['ascending','call_response']},
    latin:  {lyrical:['ascending','call_response'],  jazzy:['chromatic_approach','pentatonic_burst'],gospel:['chord_arp','ascending'],     active:['lick_based','displaced']},
    fusion: {lyrical:['whole_tone_run','tension_resolve'],jazzy:['encircle_run','coltrane_run'],gospel:['pentatonic_burst','outside_in'],   active:['displaced','triple_approach']},
    swing:  {lyrical:['arch','long_turn'],           jazzy:['chromatic_approach','encircle_run'],gospel:['chord_arp','guide_tone'],         active:['lick_based','bebop_run']},
  };
  const FK={'서정적':'lyrical','재즈풍':'jazzy','가스펠':'gospel','활발하게':'active'};
  const[p1,p2]=(CHOICES[styleKey]||CHOICES.jazz)[FK[feel]||'lyrical']||['arch','chord_arp'];

  const PAT_LABELS={
    ascending:'상행 패턴',descending:'하행 패턴',arch:'아치형',valley:'계곡형',
    chord_arp:'코드 아르페지오',chromatic_approach:'반음 접근',turn_based:'돌음 중심',
    long_turn:'긴 돌음',bebop_run:'비밥 런',lick_based:'관용 라인',tension_resolve:'텐션-해결',
    guide_tone:'가이드 톤',encircle_run:'감싸기 런',pentatonic_burst:'펜타토닉 버스트',
    call_response:'콜 앤 리스폰스',iivi_approach:'ii-V-I 접근',whole_tone_run:'온음 런',
    coltrane_run:'콜트레인 런',displaced:'리듬 변위',triple_approach:'3중 접근',
    chromatic_run:'반음계 런',dim_symmetry:'디미니쉬드 대칭',augmented:'어그멘티드',
    upper_struct:'상부 구조',quartal:'4도 보이싱',outside_in:'아웃사이드-인',
    phrase_based:'완결 프레이즈',
  };
  const RHYTHM_LABELS={
    ascending:'8분음표 상행',descending:'8분음표 하행',arch:'8분음표 아치',valley:'8분음표 계곡',
    chord_arp:'아르페지오',chromatic_approach:'반음 접근',turn_based:'돌음',long_turn:'긴 돌음',
    bebop_run:'비밥 런',lick_based:'관용 리듬',tension_resolve:'텐션→해결',
    guide_tone:'가이드 톤',encircle_run:'감싸기',pentatonic_burst:'펜타토닉',
    call_response:'콜-리스폰스',iivi_approach:'ii-V-I 런',whole_tone_run:'온음 런',
    coltrane_run:'콜트레인',displaced:'리듬 변위',triple_approach:'3중 접근',
    chromatic_run:'반음계',dim_symmetry:'디미니쉬드 대칭',augmented:'어그멘티드',
    upper_struct:'상부 구조',quartal:'4도 보이싱',outside_in:'아웃사이드-인',
    phrase_based:'완결 프레이즈',
  };
  const WHY_OB={
    ascending:        `${sustainNote}음이 울리는 동안 스케일을 타고 위로 올라가며 다음 멜로디를 연결합니다.`,
    descending:       `위에서 아래로 흘러내리며 ${sustainNote}음의 공간을 채워줘요.`,
    arch:             `올라갔다 내려오는 아치형 흐름으로 ${s} 코드의 색깔을 풍부하게 표현합니다.`,
    valley:           `내려갔다 올라오는 계곡형 패턴으로 긴 음 뒤 공간을 서정적으로 채워줍니다.`,
    chord_arp:        `${s} 코드 구성음을 아르페지오로 훑어서 화성을 명확히 드러냅니다.`,
    chromatic_approach:`각 코드음에 반음 아래에서 접근하는 비밥 어법이에요.`,
    turn_based:       `코드음 주변을 돌음으로 장식해서 고전적인 재즈 오블리가토 느낌을 냅니다.`,
    long_turn:        `넓은 돌음 패턴으로 긴 공간을 우아하게 채워줍니다.`,
    bebop_run:        `비밥 스케일 경과음을 활용한 빠른 런(run)으로 에너지감 있게 채워줍니다.`,
    lick_based:       `재즈 연주자들이 자주 쓰는 관용 라인으로 자연스럽고 재즈다운 느낌을 냅니다.`,
    tension_resolve:  `텐션음을 넣었다가 코드음으로 해결하는 패턴으로 긴장감과 해소감이 공간을 풍부하게 만들어요.`,
    guide_tone:       `3도와 7도(가이드 톤)를 중심으로 접근해서 화성 변화를 가장 효율적으로 표현합니다.`,
    encircle_run:     `코드음을 위아래 반음으로 감싸는 비밥 어법으로 세련된 재즈 색채를 더합니다.`,
    pentatonic_burst: `이 코드에 최적화된 펜타토닉 스케일로 자유롭고 표현력 있는 오블리가토를 만듭니다.`,
    call_response:    `올라가는 콜(call)과 내려오는 리스폰스(response)로 공간에 대화감을 만듭니다.`,
    iivi_approach:    `ii-V-I 클리셰 라인을 활용해서 화성 진행과 자연스럽게 어우러집니다.`,
    whole_tone_run:   `온음 스케일의 몽환적인 색채로 공간을 가득 채웁니다.`,
    coltrane_run:     `콜트레인 체인지 어법으로 장3도씩 이동하는 독창적인 색채를 더합니다.`,
    displaced:        `멜로디 패턴을 리듬적으로 변위시켜 예상치 못한 재미를 줍니다.`,
    triple_approach:  `3중 반음 접근으로 코드음에 강렬하게 진입하는 비밥 어법입니다.`,
    chromatic_run:    `반음계로 이어지는 빠른 크로매틱 런으로 공간을 강렬하게 채웁니다.`,
    dim_symmetry:     `디미니쉬드 대칭 패턴으로 신비롭고 긴장감 있는 분위기를 만들어요.`,
    augmented:        `어그멘티드 트라이어드의 반복 패턴으로 독특한 색채감을 줍니다.`,
    upper_struct:     `상부 구조 화음의 음들을 사용해 고급스러운 텐션감을 만들어요.`,
    quartal:          `4도 보이싱을 기반으로 한 모달 재즈 특유의 개방감 있는 패턴입니다.`,
    outside_in:       `반음 위로 아웃사이드 플레잉 후 코드음으로 해결하는 현대적 어법이에요.`,
    phrase_based:     `완결된 음악적 프레이즈 구조로, 시작-발전-긴장-해결의 자연스러운 흐름입니다.`,
  };

  function buildPat(patType,idx){
    return{
      name:`패턴 ${idx+1}: ${PAT_LABELS[patType]||patType}`,
      notes:notesToObjects(buildObbliPattern(patType,sustainNote,beatsNum,s,styleKey),s),
      rhythm:RHYTHM_LABELS[patType]||'8분음표',
      why:WHY_OB[patType]||`${s} 코드와 ${scale.name} 스케일을 활용한 오블리가토입니다.`,
      source:'rule',
    };
  }
  return[buildPat(p1,0),buildPat(p2,1)];
}

const RuleEngine={
  CHROMATIC,CHORD_INTERVALS,SCALE_INTERVALS,CHORD_SCALE_MAP,STYLE_CONFIG,JAZZ_LICK_LIBRARY,
  COLOR_TONES_MAP,AVOID_NOTES_MAP,CHORD_FUNCTION_MAP,
  noteToIndex,indexToNote,transposeNote,normalizeNote,semitonesBetween,pick,pickWeighted,shuffle,clamp,
  parseChord,getChordTones,isChordTone,
  getScaleNotes,getBestScale,getScaleForContext,isInScale,
  getColorTones,getAvoidNotes,getChordFunction,
  classifyNote,makeNote,
  graceBelow,graceWhole,graceAbove,passingTones,neighborUpper,neighborLower,
  turnFigure,shortTurn,longTurn,delayNote,
  approachNote,doubleChromatic,tripleApproach,encapsulation,encircle,
  bebopPassingNote,wholeTonePassingNote,chordArp,
  chromaticRun,diminishedSymmetry,augmentedPattern,quartalNotes,upperStructureNotes,
  outsidePlaying,sideStep,
  getTritoneSubChord,getGuideTones,getNextGuideToVoiceLead,getVoiceLeadingLine,getTensionNotes,
  getSecondaryDominant,getBackCycleChords,backdoor,getColtraneChanges,getChromaticMediant,getNeapolitanApproach,
  getSubstituteChords,getPentatonicOver,getModalInterchangeNotes,
  extractMotif,invertMotif,retrogradeMotif,transposeMotif,augmentMotif,diminishMotif,sequenceMotif,
  rhythmicDisplacement,mirrorMotif,
  detectProgression,getLick,getIIVILick,getColtraneChangesLick,getProgressionSpecificLick,
  tensionResolution,suspensionPattern,bluesCry,callResponse,latinClave,swingLick,
  generatePhrase,
  generateV1,generateV2Fallback,generateObbliRule,
};

if(typeof module!=='undefined')module.exports=RuleEngine;
else window.RuleEngine=RuleEngine;