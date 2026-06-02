'use strict';

const HybridEngine = (() => {

  let _ollamaStatus = { available: false, model: null };
  let _statusChecked = false;

  async function init() {
    try {
      _ollamaStatus = await OllamaClient.getStatus();
    } catch {
      _ollamaStatus = { available: false, model: null };
    }
    _statusChecked = true;
    return _ollamaStatus;
  }

  function getStatus() { return { ..._ollamaStatus, checked: _statusChecked }; }

  function safeNotes(notes) {
    if (!Array.isArray(notes)) return [];
    return notes.filter(n =>
      n && typeof n.note === 'string' &&
      ['chord','nonchord','ornament','obbligato'].includes(n.type) &&
      typeof n.label === 'string'
    );
  }

  const STYLE_KEY_MAP = {
    '재즈 페이크':'jazz', '발라드':'ballad', '비밥':'bebop', '가스펠/소울':'gospel',
    '라틴 재즈':'latin', '퓨전':'fusion', '스윙':'swing',
    'jazz':'jazz', 'ballad':'ballad', 'bebop':'bebop', 'gospel':'gospel',
    'latin':'latin', 'fusion':'fusion', 'swing':'swing',
  };

  async function generateFake({ melody, chords, style, techniques, keyStr, meter }) {
    if (!melody.length) throw new Error('멜로디를 입력해주세요.');
    if (!chords.length) throw new Error('코드를 하나 이상 추가해주세요.');

    const styleKey = STYLE_KEY_MAP[style] || 'jazz';

    const v1 = RuleEngine.generateV1(melody, chords, techniques, styleKey);

    let v2;
    if (_ollamaStatus.available) {
      try {
        const prompt = OllamaClient.buildV2Prompt(melody, chords, style, techniques, v1.notes);
        const raw    = await OllamaClient.ask(prompt, { timeoutMs: 20000 });
        const parsed = OllamaClient.parseJSON(raw);
        if (parsed && Array.isArray(parsed.notes) && parsed.notes.length > 0) {
          v2 = { name: parsed.name || '애드립 버전 (2절)', difficulty: parsed.difficulty || '보통',
                 notes: safeNotes(parsed.notes), why: parsed.why || '', source: 'ollama' };
        } else throw new Error('Invalid JSON');
      } catch {
        v2 = RuleEngine.generateV2Fallback(melody, chords, techniques, styleKey);
      }
    } else {
      v2 = RuleEngine.generateV2Fallback(melody, chords, techniques, styleKey);
    }

    if (!v1.notes.length) throw new Error('1절 생성 실패');
    if (!v2.notes.length) v2 = RuleEngine.generateV2Fallback(melody, chords, techniques, styleKey);

    return { v1, v2, _meta: { ollamaUsed: v2.source === 'ollama', model: _ollamaStatus.model } };
  }

  async function generateObbli({ sustainNote, beats, chord, chords, feel }) {
    if (!sustainNote) throw new Error('긴 음을 입력해주세요.');
    if (!chord)       throw new Error('해당 마디 코드를 입력해주세요.');

    const styleKey = 'jazz';
    const rulePatterns = RuleEngine.generateObbliRule(sustainNote, beats, chord, styleKey, feel);
    let patterns = [...rulePatterns];

    if (_ollamaStatus.available) {
      try {
        const prompt  = OllamaClient.buildObbliPrompt(sustainNote, beats, chord, chords, feel);
        const raw     = await OllamaClient.ask(prompt, { timeoutMs: 20000 });
        const parsed  = OllamaClient.parseJSON(raw);
        if (parsed && Array.isArray(parsed.patterns) && parsed.patterns.length > 0) {
          const op = parsed.patterns.map(p => ({
            name: p.name || 'AI 패턴', notes: safeNotes(p.notes || []),
            rhythm: p.rhythm || '', why: p.why || '', source: 'ollama',
          })).filter(p => p.notes.length > 0);
          if (op.length > 0) patterns = [rulePatterns[0], op[0]];
        }
      } catch { /* 규칙 기반 유지 */ }
    }

    return { patterns: patterns.slice(0, 2),
             _meta: { ollamaUsed: patterns.some(p => p.source === 'ollama'), model: _ollamaStatus.model } };
  }

  return { init, getStatus, generateFake, generateObbli };
})();

if (typeof module !== 'undefined') module.exports = HybridEngine;
else window.HybridEngine = HybridEngine;