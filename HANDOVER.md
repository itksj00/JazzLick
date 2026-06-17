# JazzLick — AI 작업자 인수인계 문서

> 이 문서는 AI 작업자 교체 시 인수인계용입니다.
> 코드를 새로 짜거나 구조를 바꾸지 말고, 이 문서를 먼저 읽고 현재 상태를 파악한 뒤 **미완료 작업만** 이어서 진행하세요.

---

## 프로젝트 개요

**JazzLick** — 색소폰 연주자를 위한 멜로디 페이크 & 오블리가토 생성 도구

- 외부 API 없음, 완전 로컬 + 무료
- 규칙 기반 재즈 이론 엔진 (rule-engine.js) 중심
- Firebase Firestore로 사용자 피드백 수집 → 월별 rule-engine 개선에 활용
- GitHub Pages 배포 예정 (정적 파일만, 서버 없음)

---

## 폴더 구조

```
jazzlick/
├── index.html          ← 메인 UI (모든 HTML + CSS 포함)
├── HANDOVER.md         ← 이 파일
└── js/
    ├── rule-engine.js  ← 재즈 이론 규칙 엔진 (핵심)
    ├── firebase.js     ← Firebase Firestore 연동 (피드백 저장)
    ├── onboarding.js   ← 첫 방문 온보딩 (경력/목표 선택)
    ├── feedback.js     ← 👍👎 피드백 UI + 직접 수정 제출
    └── app.js          ← 메인 UI 로직 (이벤트, 렌더링 등)
```

**index.html 스크립트 로드 순서 (변경 금지)**
```html
rule-engine.js → firebase.js → onboarding.js → feedback.js → app.js
```

---

## 현재 완료된 작업

### ✅ rule-engine.js
재즈 이론 규칙 엔진. 이 프로젝트의 핵심.

- 코드 타입 24종 구성음 계산 (maj7, m7, 7, dim7, alt 등)
- 스케일 18종 (bebopDom/Maj/Min, altered, diminished 등)
- 코드 타입 → 스케일 자동 매핑 (CHORD_SCALE_MAP)
- 스타일별 설정 (jazz / ballad / bebop / gospel / latin / fusion / swing) — 확률값 차별화
- 꾸밈음: 앞꾸밈음, 경과음, 보조음, 돌음, 지연음, 당김음
- 비밥 어법: 인캡슐레이션, 이중 반음 접근, bebop 경과음
- 오블리가토 26가지 패턴
- 코드 진행 자동 감지: ii-V-I, 블루스, coltrane, chromatic_mediant
- COLOR_TONES / AVOID_NOTES / CHORD_FUNCTION 테이블
- outsidePlaying / sideStep / backdoor
- generatePhrase / getProgressionSpecificLick
- 릭 라이브러리: parker / cool / modal_jazz / soul_jazz / coltrane_sheets / latin / fusion / swing / coltrane
- 1절 생성: generateV1()
- 2절 생성: generateV2Fallback()
- 오블리가토 생성: generateObbliRule()

### ✅ firebase.js (71줄)
- 신뢰도 가중치 정의 (입문 1.0 ~ 강사 8.0)
- saveFeedback(): 👍👎 투표 저장
- saveEdit(): 유저 직접 수정 결과 저장
- getUserProfile() / saveUserProfile(): localStorage 프로필 관리

**Firebase 스키마:**
```
feedback/ {
  type, mode, input, systemResult, userResult,
  rating, profile: {level, goal}, trustWeight, ts
}
edits/ {
  mode, input, systemResult, userResult: {notes, memo},
  profile: {level, goal}, trustWeight, ts
}
```

### ✅ onboarding.js (101줄)
- 첫 방문 시 모달 표시
- 경력 6단계: 입문(1.0) / 초급(1.5) / 중급(2.5) / 고급(4.0) / 전문가(6.0) / 강사(8.0)
- 목표 5종: 멜로디 페이크 배우기 / 애드립 퀄리티 / 가르치기 / 무대 연주 / 탐색
- localStorage에 저장, 재방문 시 스킵

### ✅ feedback.js (127줄)
- 결과 카드마다 👍👎 피드백 바 렌더링
- 👍 클릭 → Firebase에 즉시 저장
- 👎 클릭 → "직접 수정하기" 버튼 노출
- 수정 모달: 시스템 결과 표시 + 유저 음표 입력 + 메모
- 수정 결과 Firebase edits 컬렉션에 저장

### ✅ index.html (356줄)
- 다크/라이트 모드 (시스템 자동 감지 + 토글)
- 상단 nav: 프로필 뱃지, 테마 토글
- 2개 탭: 멜로디 페이크 / 오블리가토
- 멜로디 입력: 음표 길이 선택 칩 (온/2분/4분/8분/16분) + 건반 클릭 + 텍스트 입력 (도레미/C D E 혼용, 길이 접미사 지원: C4, 도8, E16)
- 코드 진행: 직접 입력 + 프리셋 4종
- 스타일 칩: jazz / ballad / bebop / gospel / latin / fusion / swing
- 기법 칩: 앞꾸밈음 / 경과음 / 보조음 / 돌음 / 당김음 / 지연음
- 조성(Key) / 박자(4/4, 3/4, 6/8) 선택

### ✅ app.js (533줄)
- DOMContentLoaded: buildKeys + 테마 + Firebase 초기화 + 온보딩 체크
- melody 배열: `{ note: string, dur: string }` 객체 배열 (dur = '1'|'2'|'4'|'8'|'16')
- selDur: 현재 선택 음표 길이 (기본 '4'), setDur()로 변경
- parseManual(): 텍스트에서 음이름+길이 접미사 파싱 (C4, 도8, E16 등)
- generateFake() / generateObbli() → RuleEngine 직접 호출 (동기)
- renderFakeResult() / renderObbliResult(): 결과 카드 렌더링
- assignOctaves(): 음이름 배열 → MIDI 기반 자동 옥타브 배정
- renderInlineScore(): VexFlow 인라인 악보 — 음표별 duration 반영, 마디 너비 음표 수에 따라 자동 확장 (PX_PER_NOTE=38), 가로 스크롤 지원
- downloadInlineScore(): SVG 다운로드

---

## 미완료 작업 (다음 작업자가 이어서)

### 🟡 GitHub Pages 배포

1. GitHub 저장소 생성 (public, 이름: `jazzlick`)
2. 현재 jazzlick/ 폴더 내용 전체 push
3. Settings → Pages → Branch: main, folder: / (root)
4. 배포 URL 확인

주의: GitHub Pages는 정적 파일만 제공. 서버 없음. 현재 구조로 바로 배포 가능.

### 🟢 악보 고도화 (우선순위 낮음)

현재 인라인 악보는 음표 나열만 됨. 향후:
- 코드 이름 악보 위에 표시
- 붙임줄(tie) / 쉼표 더 정교하게 처리
- PDF 내보내기

---

## 핵심 설계 원칙 (변경 금지)

1. **외부 AI API 없음** — Claude, OpenAI, Ollama 등 모든 외부 AI API 사용 금지
2. **Firebase 없어도 완전 동작** — FB.isReady() 항상 체크 후 호출
3. **스크립트 로드 순서 고정** — rule-engine → firebase → onboarding → feedback → app
4. **주석 작성 금지** — 코드에 주석 넣지 말 것 (AI가 코딩하므로 불필요)
5. **모듈화 유지** — 기능 추가 시 새 .js 파일로 분리, app.js 비대화 금지

---

## 월별 업데이트 프로세스 (rule-engine 개선)

Firebase에 쌓인 edits 컬렉션을 분석:
- 특정 코드+스타일 조합에서 수정 빈도 높으면 → 해당 STYLE_CONFIG 확률값 조정
- 유저가 자주 선택한 음 패턴 → generateV2Fallback / generateObbliRule에 새 케이스 추가
- trustWeight 높은 수정(강사/전문가) 우선 반영

신뢰도 공식: `경력 가중치 × 해당 유저 수정의 👍 비율 = 최종 반영 가중치`

---

## 작업 이력

> **AI 작업자 필독 — 작업 완료 후 반드시 아래 테이블에 한 줄 추가할 것.**
> 형식: `| YYYY-MM-DD | AI이름 버전 | 완료한 작업 요약 (한 줄) |`
> 추가만 할 것. 기존 줄 수정/삭제 금지.

| 날짜 | 작업자 | 내용 |
|------|--------|------|
| 2026-05-28 | Claude Sonnet 4.6 | 초기 설계 / rule-engine v2 / 전체 구조 구축 / firebase + onboarding + feedback 모듈 생성 / 인수인계 문서 + 작업 이력 프로세스 수립 |
| 2026-05-28 | Claude Sonnet 4.6 | 프로젝트명 MelodyFake → JazzLick 변경 (폴더명, 모든 파일 참조, localStorage key 등) |
| 2026-05-29 | Claude Sonnet 4.6 | app.js 온보딩+피드백 연결 완료 / renderFakeResult + renderObbliResult에 피드백 UI 추가 / 모든 js 파일 주석 제거 |
| 2026-05-29 | Claude Sonnet 4.6 | Firebase 실제 연결 완료 (SDK 추가, config 설정) / 미완료 작업 업데이트 (GitHub Pages 배포만 남음) |
| 2026-05-30 | Claude Sonnet 4.6 | 악보 탭 완전 제거 / 멜로디 페이크 결과 카드 하단에 inline 악보 자동 표시 (VexFlow) / 음표 색상 코드음·비화성음·꾸밈음 구분 / SVG 다운로드 / assignOctaves 자동 옥타브 배정 함수 추가 |
| 2026-06-02 | Claude Sonnet 4.6 | rule-engine 2차 고도화: 스타일 4→7종(latin·fusion·swing) / 진행감지 coltrane·chromatic_mediant 추가 / 부속도미넌트·백사이클링·콜트레인체인지·나폴리화음·반음중간음 추가 / 모티브 mirror·rhythmicDisplacement / 릭 latin·fusion·swing·coltrane 카테고리 추가 / 오블리가토 15→19종 / longTurn·tripleApproach·latinClave·swingLick 추가 / 전체 검증 통과 |
| 2026-06-04 | Claude Sonnet 4.6 | rule-engine 3차 고도화: COLOR_TONES·AVOID_NOTES·CHORD_FUNCTION 테이블 / getColorTones·getAvoidNotes·getChordFunction / outsidePlaying·sideStep·backdoor / chromaticRun·diminishedSymmetry·augmentedPattern·quartalNotes·upperStructureNotes / generatePhrase 완결 프레이즈 생성 / getProgressionSpecificLick 진행별 릭 / 릭 라이브러리 parker·cool·modal_jazz·soul_jazz·coltrane_sheets 카테고리 추가 / 오블리가토 패턴 19→26종 / toJazzNote 플랫 표기 수정 / 전체 검증 통과 |
| 2026-06-05 | Claude Sonnet 4.6 | Ollama 완전 제거 (CORS 이슈 + 규칙 엔진 자급자족) / ollama.js·hybrid-engine.js 삭제 / RuleEngine 직접 호출로 단순화 / Ollama 배지·CSS·setup-card 제거 / generateFake·generateObbli 동기 처리로 변경 / setupVisible 변수 제거 |
| 2026-06-17 | Claude Sonnet 4.6 | 악보 입력 음표 길이 지원: melody 배열 {note,dur} 객체화 / 음표 길이 칩 UI (온·2분·4분·8분·16분) / 텍스트 입력 길이 접미사 파싱 (C4, 도8, E16) / renderInlineScore duration 반영·마디 너비 자동 확장 (PX_PER_NOTE=38) / SVG 가로 스크롤 지원 |
| 2026-06-17 | Claude Sonnet 4.6 | HANDOVER 정리: ollama.js·hybrid-engine.js 항목 제거 / 폴더 구조·스크립트 로드 순서·설계 원칙 현행화 / index.html·app.js 설명 현행화 / 중복 미완료 섹션 제거 |