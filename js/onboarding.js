'use strict';

const Onboarding = (() => {
  const LEVELS = [
    { key: 'beginner',     label: '입문',    sub: '1년 미만',    icon: '🌱', weight: 1.0 },
    { key: 'elementary',   label: '초급',    sub: '1 ~ 3년',     icon: '🎵', weight: 1.5 },
    { key: 'intermediate', label: '중급',    sub: '3 ~ 7년',     icon: '🎷', weight: 2.5 },
    { key: 'advanced',     label: '고급',    sub: '7 ~ 15년',    icon: '🌟', weight: 4.0 },
    { key: 'professional', label: '전문가',  sub: '15년 이상',   icon: '🏆', weight: 6.0 },
    { key: 'instructor',   label: '강사/연주자', sub: '가르치거나 무대에 서고 있어요', icon: '🎓', weight: 8.0 },
  ];

  const GOALS = [
    { key: 'learn_fake',   label: '멜로디 페이크 배우기',    icon: '📖' },
    { key: 'improve',      label: '애드립 퀄리티 높이기',    icon: '📈' },
    { key: 'teach',        label: '가르치는 데 활용하기',    icon: '👨‍🏫' },
    { key: 'perform',      label: '무대 연주에 활용하기',    icon: '🎤' },
    { key: 'explore',      label: '그냥 탐색 중',            icon: '🔍' },
  ];

  function needsOnboarding() {
    return !FB.getUserProfile();
  }

  function show(onComplete) {
    const overlay = document.createElement('div');
    overlay.id = 'onboarding-overlay';
    overlay.innerHTML = `
      <div class="ob-backdrop"></div>
      <div class="ob-modal">
        <div class="ob-step" id="ob-step-1">
          <div class="ob-logo">♪</div>
          <h1 class="ob-title">JazzLick에 오신 걸 환영해요</h1>
          <p class="ob-desc">색소폰 연주자를 위한 멜로디 페이크 & 오블리가토 러닝 도구입니다.<br>몇 가지 질문에 답해주시면 더 잘 맞는 결과를 드릴게요.</p>
          <button class="ob-next-btn" onclick="Onboarding._goStep(2)">시작하기 →</button>
        </div>
        <div class="ob-step" id="ob-step-2" style="display:none;">
          <p class="ob-step-label">1 / 2</p>
          <h2 class="ob-title">연주 경력이 어떻게 되세요?</h2>
          <p class="ob-desc">정확하지 않아도 괜찮아요. 가장 가까운 걸 선택해주세요.</p>
          <div class="ob-grid" id="ob-level-grid">
            ${LEVELS.map(l => `
              <button class="ob-option-btn" data-key="${l.key}" onclick="Onboarding._selectLevel('${l.key}', this)">
                <span class="ob-opt-icon">${l.icon}</span>
                <span class="ob-opt-label">${l.label}</span>
                <span class="ob-opt-sub">${l.sub}</span>
              </button>`).join('')}
          </div>
        </div>
        <div class="ob-step" id="ob-step-3" style="display:none;">
          <p class="ob-step-label">2 / 2</p>
          <h2 class="ob-title">주요 목표가 뭔가요?</h2>
          <p class="ob-desc">여러분의 목표를 알면 더 유용한 도구가 될 수 있어요.</p>
          <div class="ob-grid ob-grid-2" id="ob-goal-grid">
            ${GOALS.map(g => `
              <button class="ob-option-btn" data-key="${g.key}" onclick="Onboarding._selectGoal('${g.key}', this)">
                <span class="ob-opt-icon">${g.icon}</span>
                <span class="ob-opt-label">${g.label}</span>
              </button>`).join('')}
          </div>
        </div>
      </div>`;
    document.body.appendChild(overlay);
    window._obComplete = onComplete;
    window._obProfile = {};
  }

  function _goStep(n) {
    document.querySelectorAll('.ob-step').forEach(s => s.style.display = 'none');
    document.getElementById(`ob-step-${n}`).style.display = '';
  }

  function _selectLevel(key, btn) {
    document.querySelectorAll('#ob-level-grid .ob-option-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    window._obProfile.level = key;
    setTimeout(() => _goStep(3), 220);
  }

  function _selectGoal(key, btn) {
    document.querySelectorAll('#ob-goal-grid .ob-option-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    window._obProfile.goal = key;
    setTimeout(() => _finish(), 220);
  }

  function _finish() {
    const profile = window._obProfile;
    FB.saveUserProfile(profile);
    const overlay = document.getElementById('onboarding-overlay');
    overlay.classList.add('ob-fade-out');
    setTimeout(() => {
      overlay.remove();
      if (window._obComplete) window._obComplete(profile);
    }, 400);
  }

  return { needsOnboarding, show, _goStep, _selectLevel, _selectGoal, _finish, LEVELS, GOALS };
})();

window.Onboarding = Onboarding;
