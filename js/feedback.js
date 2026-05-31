'use strict';

const FeedbackUI = (() => {
  let _lastResult = null;
  let _lastMode   = null;
  let _lastInput  = null;

  function setContext(mode, input, result) {
    _lastMode   = mode;
    _lastInput  = input;
    _lastResult = result;
  }

  function renderBar(versionIdx) {
    return `
      <div class="fb-bar" data-idx="${versionIdx}">
        <span class="fb-label">이 결과가 도움이 됐나요?</span>
        <button class="fb-btn fb-up"   onclick="FeedbackUI.vote(${versionIdx}, 'up')"   title="도움이 됐어요">👍</button>
        <button class="fb-btn fb-down" onclick="FeedbackUI.vote(${versionIdx}, 'down')" title="아쉬워요">👎</button>
      </div>`;
  }

  async function vote(versionIdx, rating) {
    const bar = document.querySelector(`.fb-bar[data-idx="${versionIdx}"]`);
    if (rating === 'up') {
      if (bar) bar.innerHTML = `<span class="fb-thanks">👍 감사합니다!</span>`;
      await FB.saveFeedback({
        type: 'vote',
        mode: _lastMode,
        input: _lastInput,
        systemResult: _lastResult?.[versionIdx] || null,
        userResult: null,
        rating: 'up',
        profile: FB.getUserProfile(),
      });
    } else {
      if (bar) bar.innerHTML = `<span class="fb-thanks">아쉬웠군요. 직접 수정해 주시면 큰 도움이 돼요!</span>
        <button class="fb-edit-btn" onclick="FeedbackUI.openEditor(${versionIdx})">✏️ 직접 수정하기</button>`;
      await FB.saveFeedback({
        type: 'vote',
        mode: _lastMode,
        input: _lastInput,
        systemResult: _lastResult?.[versionIdx] || null,
        userResult: null,
        rating: 'down',
        profile: FB.getUserProfile(),
      });
    }
  }

  function openEditor(versionIdx) {
    const systemNotes = (_lastResult?.[versionIdx]?.notes || []).map(n => n.note).join(' ');
    const modal = document.createElement('div');
    modal.id = 'edit-modal';
    modal.innerHTML = `
      <div class="edit-backdrop" onclick="FeedbackUI.closeEditor()"></div>
      <div class="edit-modal-box">
        <div class="edit-modal-head">
          <span class="edit-modal-title">✏️ 결과 직접 수정</span>
          <button class="edit-close-btn" onclick="FeedbackUI.closeEditor()">✕</button>
        </div>
        <div class="edit-modal-body">
          <p class="edit-desc">시스템 결과가 마음에 들지 않으셨나요?<br>더 좋은 음표 라인을 직접 입력해주세요. 이 데이터로 도구가 개선됩니다.</p>
          <div class="edit-section">
            <div class="s-label">시스템 결과 (참고)</div>
            <div class="edit-system-notes">${systemNotes || '(없음)'}</div>
          </div>
          <div class="edit-section">
            <div class="s-label">내가 원하는 음표 라인</div>
            <input class="inp" type="text" id="edit-user-notes" placeholder="예: C D# E G A C  (스페이스로 구분)" />
            <p class="hint-text">도레미 또는 C D E 형식 모두 가능</p>
          </div>
          <div class="edit-section">
            <div class="s-label">간단한 메모 (선택)</div>
            <input class="inp" type="text" id="edit-memo" placeholder="예: G7에서 이 음이 더 자연스러워요" />
          </div>
        </div>
        <div class="edit-modal-footer">
          <button class="btn btn-ghost" onclick="FeedbackUI.closeEditor()">취소</button>
          <button class="btn btn-primary" onclick="FeedbackUI.submitEdit(${versionIdx})">저장하고 제출</button>
        </div>
      </div>`;
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('show'), 10);
  }

  async function submitEdit(versionIdx) {
    const raw  = document.getElementById('edit-user-notes').value.trim();
    const memo = document.getElementById('edit-memo').value.trim();
    if (!raw) { alert('음표를 입력해주세요.'); return; }

    const EN   = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
    const KR   = ['도','도#','레','레#','미','파','파#','솔','솔#','라','라#','시'];
    const KR2EN = {};
    KR.forEach((k, i) => KR2EN[k] = EN[i]);
    const userNotes = raw.split(/[\s,]+/).filter(Boolean).map(t => {
      const up = t.charAt(0).toUpperCase() + t.slice(1);
      if (EN.includes(up)) return up;
      if (KR2EN[up]) return KR2EN[up];
      if (KR2EN[t]) return KR2EN[t];
      return null;
    }).filter(Boolean);

    if (!userNotes.length) { alert('인식할 수 없는 형식이에요.'); return; }

    await FB.saveEdit({
      mode: _lastMode,
      input: _lastInput,
      systemResult: _lastResult?.[versionIdx] || null,
      userResult: { notes: userNotes, memo },
      profile: FB.getUserProfile(),
    });

    closeEditor();
    const bar = document.querySelector(`.fb-bar[data-idx="${versionIdx}"]`);
    if (bar) bar.innerHTML = `<span class="fb-thanks">✓ 제출해주셔서 감사합니다! 도구 개선에 큰 도움이 돼요.</span>`;
  }

  function closeEditor() {
    const modal = document.getElementById('edit-modal');
    if (modal) { modal.classList.remove('show'); setTimeout(() => modal.remove(), 300); }
  }

  return { setContext, renderBar, vote, openEditor, submitEdit, closeEditor };
})();

window.FeedbackUI = FeedbackUI;
