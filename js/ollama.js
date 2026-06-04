'use strict';

const OllamaClient = (() => {

  const CONFIG = {
    baseUrl: 'http://localhost:11434',
    preferredModels: [
      'qwen2.5:7b-instruct-q5_K_M',
      'qwen2.5:7b',
      'llama3.1:8b-instruct-q4_K_M',
      'llama3.1:8b',
      'mistral:7b-instruct-q4_K_M',
      'mistral:7b',
      'gemma2:9b',
    ],
    timeoutMs: 25000,   // 저사양 고려, 25초
    maxTokens: 600,     // 응답 길이 제한 (속도 우선)
    temperature: 0.7,
  };

  let _activeModel = null;
  let _isAvailable = null; // null=미확인, true/false


  function isLocalEnvironment() {
    const h = window.location.hostname;
    return h === 'localhost' || h === '127.0.0.1' || h === '' || h.endsWith('.local');
  }

  async function checkAvailability() {
    if (!isLocalEnvironment()) {
      _isAvailable = false;
      return false;
    }
    try {
      const ctrl = new AbortController();
      const tid = setTimeout(() => ctrl.abort(), 3000);
      const resp = await fetch(`${CONFIG.baseUrl}/api/tags`, { signal: ctrl.signal });
      clearTimeout(tid);
      if (!resp.ok) { _isAvailable = false; return false; }
      const data = await resp.json();
      const models = (data.models || []).map(m => m.name);
      _activeModel = CONFIG.preferredModels.find(m => models.some(installed => installed.startsWith(m.split(':')[0])))
        || models[0] || null;
      _isAvailable = !!_activeModel;
      return _isAvailable;
    } catch {
      _isAvailable = false;
      return false;
    }
  }

  async function getStatus() {
    if (_isAvailable === null) await checkAvailability();
    return { available: _isAvailable, model: _activeModel, baseUrl: CONFIG.baseUrl };
  }

  function setModel(modelName) { _activeModel = modelName; }
  function setBaseUrl(url) { CONFIG.baseUrl = url.replace(/\/$/, ''); }


  const SYSTEM_PROMPT = `You are a jazz melody expert and music educator specializing in saxophone improvisation.
Your expertise: melody fake (embellishment), obbligato, chord tone approach, bebop vocabulary, non-chord tones.

RULES FOR OUTPUT:
- Respond ONLY with valid JSON. No markdown, no explanation outside JSON.
- Keep responses concise and fast.
- All "why" explanations must be in Korean (한국어), simple enough for non-musicians.
- Note names: use English (C, D#, Bb, etc.)
- "type" field must be exactly one of: chord, nonchord, ornament, obbligato

JAZZ PRINCIPLES TO APPLY:
- Land on chord tones (1,3,5,7) on strong beats
- Use passing tones and neighbor tones between chord tones
- Grace notes approach from a half-step below
- Bebop scale adds a chromatic passing tone
- Obbligato fills space naturally, leading back to the melody`;


  async function ask(userPrompt, options = {}) {
    if (!_activeModel) {
      const ok = await checkAvailability();
      if (!ok) throw new Error('OLLAMA_UNAVAILABLE');
    }

    const ctrl = new AbortController();
    const tid = setTimeout(() => ctrl.abort(), options.timeoutMs || CONFIG.timeoutMs);

    try {
      const resp = await fetch(`${CONFIG.baseUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: ctrl.signal,
        body: JSON.stringify({
          model: options.model || _activeModel,
          system: SYSTEM_PROMPT,
          prompt: userPrompt,
          stream: false,
          options: {
            temperature: options.temperature ?? CONFIG.temperature,
            num_predict: options.maxTokens || CONFIG.maxTokens,
            top_p: 0.9,
            repeat_penalty: 1.1,
          },
        }),
      });
      clearTimeout(tid);
      if (!resp.ok) throw new Error(`Ollama HTTP ${resp.status}`);
      const data = await resp.json();
      return data.response || '';
    } catch (e) {
      clearTimeout(tid);
      if (e.name === 'AbortError') throw new Error('OLLAMA_TIMEOUT');
      throw e;
    }
  }


  function parseJSON(raw) {
    if (!raw) return null;
    let clean = raw.replace(/```json|```/g, '').trim();
    const firstBrace = clean.search(/[{[]/);
    if (firstBrace === -1) return null;
    clean = clean.slice(firstBrace);
    const lastBrace = Math.max(clean.lastIndexOf('}'), clean.lastIndexOf(']'));
    if (lastBrace === -1) return null;
    clean = clean.slice(0, lastBrace + 1);
    try {
      return JSON.parse(clean);
    } catch {
      const fixed = clean.replace(/,\s*([}\]])/g, '$1');
      try { return JSON.parse(fixed); } catch { return null; }
    }
  }


  function buildV2Prompt(melody, chords, style, techniques, v1Notes) {
    const techStr = [...techniques].join(', ');
    const v1Preview = v1Notes.slice(0, 6).map(n => n.note).join(' ');
    return `Generate a creative jazz melody fake version (2절/second verse) for saxophone.

Original melody: ${melody.join(' ')}
Chord progression: ${chords.join(' → ')}
Style: ${style}
Techniques to use: ${techStr}
Simple version (1절) already generated: ${v1Preview}...

The 2절 version should be MORE creative - use more passing tones, bebop runs, approach notes.

Respond with ONLY this JSON (no other text):
{
  "name": "creative version name in Korean",
  "difficulty": "보통 or 도전",
  "notes": [
    {"note": "C", "type": "chord", "label": "코드 구성음"},
    {"note": "D", "type": "nonchord", "label": "경과음"}
  ],
  "why": "2줄 이내 한국어 설명"
}`;
  }


  function buildObbliPrompt(sustainNote, beats, chord, chords, feel) {
    return `Generate an obbligato (장식 선율) for saxophone.

The melody holds ${sustainNote} for ${beats} beats.
Current chord: ${chord}
Full progression context: ${chords.join(' → ')}
Feel/mood: ${feel}

Fill this space naturally. Notes should lead back to the melody.
Number of notes: ${beats * 2} to ${beats * 3} (8th notes).

Respond with ONLY this JSON:
{
  "patterns": [
    {
      "name": "패턴 이름 (한국어)",
      "notes": [
        {"note": "G", "type": "chord", "label": "코드 구성음"},
        {"note": "A", "type": "obbligato", "label": "오블리가토 특징음"}
      ],
      "rhythm": "리듬 설명 (한국어, 예: 8분음표 위주)",
      "why": "한국어 설명 1~2줄"
    },
    {
      "name": "두번째 패턴",
      "notes": [],
      "rhythm": "",
      "why": ""
    }
  ]
}`;
  }


  return {
    CONFIG,
    checkAvailability,
    getStatus,
    setModel,
    setBaseUrl,
    ask,
    parseJSON,
    buildV2Prompt,
    buildObbliPrompt,
    SYSTEM_PROMPT,
  };

})();

if (typeof module !== 'undefined') module.exports = OllamaClient;
else window.OllamaClient = OllamaClient;