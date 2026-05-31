# JazzLick — AI 작업자 인수인계 문서

> 이 문서는 AI 작업자 교체 시 인수인계용입니다.
> 코드를 새로 짜거나 구조를 바꾸지 말고, 이 문서를 먼저 읽고 현재 상태를 파악한 뒤 **미완료 작업만** 이어서 진행하세요.

---

## 프로젝트 개요

**JazzLick** — 색소폰 연주자를 위한 멜로디 페이크 & 오블리가토 생성 도구

- 외부 API 없음, 완전 로컬 + 무료
- 규칙 기반 재즈 이론 엔진 (rule-engine.js) 중심
- Ollama 로컬 LLM 선택적 연동 (없어도 동작)
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
    ├── ollama.js       ← Ollama 로컬 LLM 연동
    ├── hybrid-engine.js← 규칙 기반 + Ollama 조합 로직
    ├── firebase.js     ← Firebase Firestore 연동 (피드백 저장)
    ├── onboarding.js   ← 첫 방문 온보딩 (경력/목표 선택)
    ├── feedback.js     ← 👍👎 피드백 UI + 직접 수정 제출
    └── app.js          ← 메인 UI 로직 (이벤트, 렌더링 등)
```

**index.html 스크립트 로드 순서 (변경 금지)**
```html
rule-engine.js → ollama.js → hybrid-engine.js → firebase.js → onboarding.js → feedback.js → app.js
```

---

## 현재 완료된 작업

### ✅ rule-engine.js (v2.0 — 810줄)
재즈 이론 규칙 엔진. 이 프로젝트의 핵심.

- 코드 타입 24종 구성음 계산 (maj7, m7, 7, dim7, alt 등)
- 스케일 18종 (bebopDom/Maj/Min, altered, diminished 등)
- 코드 타입 → 스케일 자동 매핑 (CHORD_SCALE_MAP)
- 스타일별 설정 (jazz / ballad / bebop / gospel) — 확률값 차별화
- 꾸밈음: 앞꾸밈음, 경과음, 보조음, 돌음, 지연음, 당김음
- 비밥 어법: 인캡슐레이션, 이중 반음 접근, bebop 경과음
- 오블리가토 8가지 패턴: ascending / descending / arch / valley / chord_arp / chromatic_approach / turn_based / bebop_run
- 코드 진행 자동 감지: ii-V-I, 블루스
- 1절 생성: generateV1()
- 2절 생성: generateV2Fallback()
- 오블리가토 생성: generateObbliRule()

### ✅ ollama.js (239줄)
- Ollama 로컬 서버 연결 확인 (localhost:11434)
- 저사양 권장 모델: qwen2.5:7b, llama3.1:8b
- 재즈 전문 시스템 프롬프트 내장
- 타임아웃 25초, JSON 파싱 안전 처리
- 2절 페이크 / 오블리가토 프롬프트 빌더

### ✅ hybrid-engine.js (104줄)
- 1절: 항상 rule-engine (규칙 기반)
- 2절: Ollama 시도 → 실패 시 rule-engine 폴백
- 오블리가토: rule-engine 기본 + Ollama 2번째 패턴
- styleKey 한국어→영어 변환 처리

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

### ✅ index.html (407줄)
- 다크/라이트 모드 (시스템 자동 감지 + 토글)
- 상단 nav: 프로필 뱃지, Ollama 상태 뱃지, 테마 토글
- 3개 탭: 멜로디 페이크 / 오블리가토 / 악보 보기(🚧 개발 중)
- 멜로디 입력: 건반 클릭 + 텍스트 입력 (도레미/C D E 혼용)
- 코드 진행: 직접 입력 + 프리셋 4종
- 스타일 칩: jazz / ballad / bebop / gospel
- 기법 칩: 앞꾸밈음 / 경과음 / 보조음 / 돌음 / 당김음 / 지연음
- 악보 탭: VexFlow 4.2.2 기반, 기본 렌더링 구현

### ✅ app.js (479줄)
- DOMContentLoaded: buildKeys + 테마 + Ollama 초기화 + 온보딩 체크
- 멜로디/코드 태그 렌더링 버그 수정 (innerHTML 덮어쓰기 방지)
- generateFake() / generateObbli() → HybridEngine 호출
- renderFakeResult() / renderObbliResult(): 결과 카드 렌더링
- VexFlow 악보 그리기 / SVG 다운로드

---

## 미완료 작업 (다음 작업자가 이어서)

### 🟡 GitHub Pages 배포

1. GitHub 저장소 생성 (public, 이름: `jazzlick`)
2. 현재 jazzlick/ 폴더 내용 전체 push
3. Settings → Pages → Branch: main, folder: / (root)
4. 배포 URL 확인

주의: GitHub Pages는 정적 파일만 제공. 서버 없음. 현재 구조로 바로 배포 가능.

### 🟢 악보 탭 고도화 (우선순위 낮음, 나중에)

현재 악보 탭은 음표 직접 입력만 됨. 향후:
- 멜로디 페이크 결과를 악보로 자동 변환
- 코드 이름 표시
- 음표 색상 구분 (코드음/비화성음/꾸밈음)
- PDF 내보내기
### 🟡 GitHub Pages 배포 미완료

1. GitHub 저장소 생성 (public, 이름: `jazzlick`)
2. 현재 jazzlick/ 폴더 내용 전체 push
3. Settings → Pages → Branch: main, folder: / (root)
4. 배포 URL 확인

주의: GitHub Pages는 정적 파일만 제공. 서버 없음. 현재 구조로 바로 배포 가능.

---

### 🟢 악보 탭 고도화 (우선순위 낮음, 나중에)

현재 악보 탭은 음표 직접 입력만 됨. 향후:
- 멜로디 페이크 결과를 악보로 자동 변환
- 코드 이름 표시
- 음표 색상 구분 (코드음/비화성음/꾸밈음)
- PDF 내보내기

---

## 핵심 설계 원칙 (변경 금지)

1. **외부 AI API 없음** — Claude, OpenAI 등 유료 API 절대 사용 금지
2. **Ollama 없어도 완전 동작** — rule-engine만으로 모든 기능 동작
3. **Firebase 없어도 완전 동작** — FB.isReady() 항상 체크 후 호출
4. **스크립트 로드 순서 고정** — rule-engine → ollama → hybrid → firebase → onboarding → feedback → app
5. **주석 작성 금지** — 코드에 주석 넣지 말 것 (AI가 코딩하므로 불필요)
6. **모듈화 유지** — 기능 추가 시 새 .js 파일로 분리, app.js 비대화 금지

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
| 2026-05-30 | Claude Sonnet 4.6 | rule-engine 전면 고도화: encircle(4종) / 펜타토닉 오버 코드 매핑 / 코드 대리 시스템(상하3도·트리톤·관계조) / 모달 인터체인지 / ii-V-I 전용 릭 라이브러리 / 블루스 크라이 / 콜앤리스폰스 / 모티브 축소·시퀀스 / 릭 라이브러리 6→9카테고리 80개+ / getTensionNotes 버그 수정 / 오블리가토 패턴 11→15종 / 검증 완료 |
