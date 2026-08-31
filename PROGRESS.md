# Sloway 포트폴리오 — 작업 기록 (이어서 작업용)

> 집/다른 곳에서 이어서 할 때 **새 Claude Code 세션에 이 파일을 먼저 읽히면** 패턴·현황·남은 일을 바로 파악할 수 있다.
> 위치: `D:\dev\portfolio\` / 결과물: **Vite + React (JavaScript)** 정적 사이트. `npm run dev` 로 개발, `npm run build` → `dist/` 배포(깃).

---

## 1. 무엇을 만들고 있나
면접용 **정적 포트폴리오 사이트** (Vite + React, JavaScript). 깃 배포용.
- 왼쪽 **사이드바 2단 아코디언** + 오른쪽 메인(SPA 해시 라우팅).
- 메뉴: 프로젝트 개요 / 기술 스택 / ─ / ▼세미(TaskFlow)[프로젝트 관리·체크리스트] / ▼파이널(Sloway)[결제·환불·정산·통계·쿠폰·포인트] / ▼개인 프로젝트 (Python)[hospital-price-monitor] / ─ / 트러블슈팅·성능 개선·회고.
- 디자인: 세이지 `#A8B89F` / 크림 `#F4EFE6` / Noto Sans KR. 코드 패널만 다크(github-dark).

### 명령 (포트폴리오 루트에서)
```powershell
npm install        # 최초 1회
npm run dev        # 개발 서버 (localhost:5173)
npm run build      # 프로덕션 빌드 → dist/
npm run preview    # 빌드 결과 미리보기
```

### 파일 구조 (2026-06-14 React 전환 — 정적 HTML/CSS/JS → Vite+React)
```
portfolio/
├─ index.html            ← Vite 진입 (root div + 폰트 CDN link)
├─ package.json / vite.config.js (base:'./')
├─ src/
│  ├─ main.jsx           ← createRoot + CSS import (github-dark → base → screens 순서)
│  ├─ App.jsx            ← 레이아웃 + 전체 페이지 렌더(active 아닌 건 hidden)
│  ├─ router.js          ← useHashRoute 훅 (해시 라우팅, 외부 의존성 0)
│  ├─ nav.js             ← 사이드바 구성 + PAGE_IDS + groupOf (단일 출처)
│  ├─ styles/
│  │  ├─ base.css        ← (legacy 그대로 복사) 공통·구조·문서형
│  │  └─ screens.css     ← (legacy 그대로 복사) 도메인 화면 재현
│  ├─ components/
│  │  ├─ Sidebar.jsx     ← nav.js 기반 아코디언 사이드바
│  │  ├─ Func.jsx        ← 오른쪽 기능 아코디언 한 칸 (rich/비-rich)
│  │  ├─ CodeBlock.jsx   ← highlight.js(core + java·python) 코드 하이라이트 (`lang` prop, 기본 java)
│  │  └─ CodeImageModal.jsx ← 세미 placeholder 이미지 모달
│  └─ pages/             ← ★ 챕터별 1파일 (12개)
│     ├─ Overview.jsx / Tech.jsx
│     ├─ SemiProject.jsx / SemiChecklist.jsx
│     ├─ Payment.jsx / Refund.jsx / Settlement.jsx / Stats.jsx / CouponPoint.jsx
│     ├─ PriceMonitor.jsx  ← 개인 프로젝트(Python) hospital-price-monitor (2026-08-31, 8번 참고)
│     └─ Troubleshooting.jsx / Performance.jsx / Retrospective.jsx
└─ _legacy/              ← 이전 정적 버전(index.html·css·app.js) 참고 보존
```
- **CSS는 legacy 그대로 복사** — 손대지 않음. React가 동일 마크업·클래스·`hidden` 토글을 재현해 `.page[hidden]`·`.main:has(#payment:not([hidden]))` 같은 선택자가 그대로 동작.
- **로드 순서 중요**: main.jsx 에서 base → screens 순서 import. 새 공통 스타일은 base.css, 화면 재현은 screens.css.
- 폰트 CDN(Noto Sans KR / JetBrains Mono)은 `index.html <head>` 에 link. highlight.js·github-dark 테마는 npm 패키지로 import.
- **모든 페이지를 렌더하되 active 아닌 건 `hidden`** — CSS의 `:has(#id:not([hidden]))` 6:4 폭 해제 규칙을 살리기 위한 의도. 페이지별 코드는 각 jsx 파일의 백틱(`` ` ``) 상수에 원본 그대로 보관(HTML 이스케이프 불필요).

---

## 2. 핵심 패턴 (★ 새 작업 시 반드시 따를 것)

### 파이널 도메인 페이지 = 좌우 2단
```
<section id="도메인"> <header> + <div class="pay2">
  <왼쪽: 실제 화면 정적 재현>   ← React 화면을 HTML/CSS로 옮김
  <div class="pay2__right">  ← 기능 아코디언(.func) N개
```
- 오른쪽 `.func` 아코디언: `func__head--rich`(기능 이름 + 설명 2~3줄) + `func__body[hidden]` 안에
  `func__bar`(기능명 + 파일명) + `<pre class="func__code"><code class="language-java">…코드…</code></pre>`.
- **기본 전부 닫힘.** (예외: 결제만 첫 항목 `is-open` + body의 `hidden` 제거)
- 토글·하이라이트는 `app.js`가 자동 처리(`.func__head` 클릭 토글 + `hljs.highlightElement`).

### ★ 코드는 "있는 그대로" (가장 중요)
- 백엔드 실제 파일에서 메서드를 **원본 그대로** 넣는다. 주석·들여쓰기·줄바꿈·빈 줄 전부 보존. **각색·요약·주석 변경 금지.**
- React 전환 후엔 각 `src/pages/*.jsx` 의 백틱(`` ` ``) 상수에 백엔드 코드를 **그대로** 붙인다. JS 문자열이라 `<`·`>`·`&` 이스케이프 **불필요**(legacy HTML 시절의 `&lt;`/`&gt;`/`&amp;` 규칙은 폐기). 단 코드에 `` ` `` 나 `${` 가 있으면 그것만 백슬래시 이스케이프(현 5도메인 코드엔 없음).
- 작업 후 `npm run build` 통과 + 백엔드 원본과 줄 단위 대조(아래 6번).

### 비율은 도메인마다
- 현재 5개 도메인 모두 **6:4 + 본문 폭 해제** 사용.
- 적용법: `#도메인 .pay2 { grid-template-columns: minmax(0,6fr) minmax(0,4fr); }` (긴 코드가 트랙 밀지 않게 `minmax(0,…)` 필수) + `@media(max-width:880px)`에서 `1fr` + `.main:has(#도메인:not([hidden])) { max-width: none; }`.
- 좁은 세로 화면(결제/환불)은 화면 카드를 `max-width: 600px; margin: 0 auto`로 가운데 → 좌우 여백.

### 화면 CSS 네임스페이스 (도메인별 분리)
결제 `.pd-*` / 환불 `.rf-*` / 정산 `.st-*` / 통계 `.sv-*` / 쿠폰포인트 `.cp-*`. 공용은 `.func-*`, `.pay2`.

---

## 3. 완료 현황 (2026-06-14 기준)
- [x] 사이드바 2단 아코디언 + SPA 라우팅
- [x] 기술 스택 = shields.io 뱃지 이미지
- [x] **결제** 좌우 2단 (왼쪽 PaymentDetail 재현 / 첫 항목 펼침 / 설명 O)
- [x] **환불** 좌우 2단 (RefundRequest 재현 / 설명 O)
- [x] **정산** 좌우 2단 (AdminSettlementList 재현 / **설명 X — 단순 제목**)
- [x] **통계** 좌우 2단 (RevenueStats 재현 / 설명 O)
- [x] **쿠폰·포인트** 좌우 2단 (MyCoupons+PointHistory 재현 / 설명 O)
- [x] 문서 페이지(개요·트러블슈팅·성능·회고) 텍스트
- [x] 전역 가독성(코드 0.875rem/줄간격1.75, 본문 1.7, 설명 1.65)
- [x] **파일 분리** (2026-06-10) — 단일 index.html → index.html + base.css + screens.css + app.js.
- [x] **React 전환** (2026-06-14) — 정적 HTML/CSS/JS → **Vite + React (JavaScript)**. 챕터별 1파일(`src/pages/*.jsx` 12개). CSS는 손대지 않고 그대로 복사, 동일 마크업/`hidden` 토글로 기존 선택자 유지. `npm run build` 통과 + legacy 15개 코드 블록 ↔ 신규 jsx 자동 대조 15/15 일치. 이전 정적본은 `_legacy/` 보존.
- 코드 블록 15개(5도메인×3) 전부 원본 대조 일치.

### VS Code 에서 실행
- 폴더 열기: `D:\dev\portfolio` → 내장 터미널에서 `npm install`(최초 1회) → `npm run dev` → `localhost:5173`.
- 깃 배포: `npm run build` → `dist/` 를 정적 호스팅(GitHub Pages 등)에 올림. `vite.config.js` 의 `base:'./'` 로 상대경로 처리됨.

---

## 4. 도메인별 코드 매핑 (백엔드 원본 위치)
베이스: `D:\dev\sloway_PJ\back\app\src\main\java\com\sloway\app\payment\`

| 도메인 | 기능(아코디언) | 백엔드 파일·메서드 |
|---|---|---|
| 결제 | 결제 준비·검증 / 결제 승인 / 결제 완료 후처리 | `pay/service/PayService.java` — `buildReadyPay`·`approvePay`·`completePayAfterApprove` |
| 환불 | 환불 요청·환불율 / 환불 처리 / 환불율 산정 | `refund/service/RefundService.java` — `createRefund`·`doRefundProcess`·`refundRate` |
| 정산 | 정산 생성 / 수수료 계산 / 자동 정산 배치 | `settlement/settle/service/SettleService.java` — `createSettle`·`calcFee` / `…/scheduler/SettleScheduler.java` — `settleBatch` |
| 통계 | 일자별 적재 / 호스트 매출 / 응답 DTO | `stats/service/StatsService.java` — `loadDailyStats`·`findHostSalesStats` / `stats/dto/response/HostSalesStatsResDto.java` — `of` |
| 쿠폰·포인트 | 쿠폰 회수 / 잔액 계산 / 포인트 복원·취소 | `coupon/entity/CouponEntity.java` — `returnCoupon` / `point/service/PointService.java` — `calcBalance`·`refundUsedPoint`·`cancelEarnedPoint` |

### 왼쪽 화면 참고한 프론트 (React → 정적 변환)
- 결제 `front/.../pay/pages/user/PaymentDetail.jsx`
- 환불 `front/.../refund/pages/user/RefundRequest.jsx`
- 정산 `front/.../settlement/pages/admin/AdminSettlementList.jsx`
- 통계 `front/.../stats/pages/admin/RevenueStats.jsx`
- 쿠폰·포인트 `front/.../coupon/pages/user/MyCoupons.jsx` + `front/.../point/pages/user/PointHistory.jsx`

### 포트폴리오 페이지 ↔ 파일 매핑 (React)
- 도메인 5개 → `src/pages/Payment.jsx` · `Refund.jsx` · `Settlement.jsx` · `Stats.jsx` · `CouponPoint.jsx`
- 문서 4개 → `Overview.jsx` · `Tech.jsx` · `Troubleshooting.jsx` · `Performance.jsx` · `Retrospective.jsx`
- 세미 2개 → `SemiProject.jsx` · `SemiChecklist.jsx`
- 각 도메인 jsx 안: 왼쪽 화면은 JSX 마크업, 오른쪽 코드는 백틱 상수 + `<Func>` 컴포넌트(`src/components/Func.jsx`)로 렌더.

---

## 5. 남은 작업
1. **정산 헤더 설명 추가** — `src/pages/Settlement.jsx` 의 `<Func>` 3개가 `rich={false}`(설명 없음). 다른 도메인처럼 통일하려면 `rich` + `desc` 부여.
2. **세미 프로젝트 2개**(`SemiProject.jsx`·`SemiChecklist.jsx`) — 아직 옛 방식(placeholder + 이미지 모달 `CodeImageModal`). 파이널 도메인처럼 좌우 2단(`.pay2` + `<Func>`)으로 전환 필요.
   - 단, 세미(TaskFlow)는 별도 프로젝트라 백엔드 코드 위치를 본인이 알려줘야 함. 화면도 그 프로젝트 기준.
3. 문서 페이지(개요·트러블슈팅·성능·회고) 내용 다듬기 — 해당 jsx 직접 수정.
4. (선택) 화면 더미 데이터·문구 다듬기.

> 참고: 초기에 쓰던 "캡처 이미지 + 클릭 핫스팟/모달" 방식은 폐기됐고, 지금은 **왼쪽 JSX 화면 재현 + 오른쪽 코드 직접 표시**가 표준. 세미 placeholder 의 `images/...` 경로는 `public/images/` 에 넣어야 빌드에 포함됨(현재 미사용).

---

## 6. 검증 방법 (작업 후 매번)
- **빌드 통과**: `npm run build` — 모듈 변환 성공 + 에러 0 (import 누락·JSX 문법 오류는 여기서 잡힘).
- **dev 확인**: `npm run dev` → 브라우저에서 도메인 전환 / 아코디언 펼침·접힘 / 하이라이트 / 스크롤 확인.
- **코드 원본 대조**(가장 중요): 각 `src/pages/*.jsx` 의 백틱 코드 상수가 백엔드 원본과 줄 단위로 일치하는지. React 코드 문자열은 HTML 이스케이프가 없어 백엔드 파일과 **그대로** 비교 가능(`-ceq`). 새 코드 블록을 넣을 땐 백엔드에서 복사 → 백틱 안에 그대로 붙이고, `${`·백틱 문자가 코드에 있으면 이스케이프(현 5도메인 코드엔 없음).
- (참고) 2026-06-14 React 전환 시점에 legacy 15개 코드 블록 ↔ 신규 jsx 코드 상수 자동 대조 = 15/15 일치 확인.

---

## 7. 디자인 토큰 (CSS 변수, `:root`)
`--sage #a8b89f` / `--sage-dark #8a9c80` / `--sage-soft #c4cfbd` / `--cream #f4efe6` / `--cream-card #fbf8f2` /
`--ink #3a3a34` / `--ink-soft #6b6b62` / `--line #e3ddd0` / 코드: `--code-bg #1e1e24` `--code-bar #2a2a32` `--code-accent #a8b89f` /
간격 `--space-2..8`(8·12·16·24·32) / 반경 `--radius-md 10px` `--radius-lg 16px` / 할인 마이너스 색 `#b85a4e`.

새 색·폰트 추가 금지, 위 변수만 사용.

---

## 8. 개인 프로젝트 (Python) 페이지 추가 (2026-08-31)
원본: https://github.com/blackbean9081-svg/hospital-price-monitor — Django REST Framework 프로토타입(`prices/views.py`·`prices/models.py`). 전달받은 `portfolio_lexcode.patch` 가 저장소에 없어 명세대로 직접 구현.

- **사이드바**: `src/nav.js` NAV 의 divider 앞에 그룹 `{ id: "solo", label: "개인 프로젝트 (Python)" }` 추가, 하위 `price-monitor`(라벨 `hospital-price-monitor`). `PAGE_IDS` 는 `"semi-checklist"` 다음에 `"price-monitor"`.
- **페이지**: `src/pages/PriceMonitor.jsx` (신규, `App.jsx` PAGES 등록). 문서형 1단 구조 —
  `page__head` → `doc-block` > `proj`(개요: `def-list` 기간·만든 이유·구현 API·Spring↔Django 대응·도구·GitHub) → 기술 스택 칩(`tag-section`/`tech-item`: Python·Django·Django REST Framework·SQLite, devicon) → `PaneHead` + `<Func>` 4개(가격 감시 `monitor_prices` / 가격 비교 `compare_prices` / 가격 CRUD `TreatmentPriceViewSet` / 모델 `models.py`). 각 `retro` 에 구현 포인트(F()로 DB 조건 처리, select_related로 N+1 방지) 1~2문장. 기본 전부 닫힘.
- **코드 상수 4개**(`CODE_MONITOR`·`CODE_COMPARE`·`CODE_VIEWSET`·`CODE_MODELS`)는 원본 그대로: views.py L58-76 / L20-55 / L15-17, models.py L1-19. 원본은 CRLF 라 비교 시 줄바꿈만 정규화(내용·들여쓰기·빈 줄 동일). 백틱·`${` 없음.
- **컴포넌트**: `CodeBlock.jsx` 에 highlight.js python 등록(java 유지, effect deps 에 `lang` 추가) / `Func.jsx` 에 `lang` prop(기본 `"java"`) → `<CodeBlock lang>` 전달. 기존 페이지는 lang 미지정이라 동작 동일.
- **Profile.jsx**: 소개에 "주력은 Java / Spring Boot이며, 같은 원리가 Python에서도 통하는지 Django REST Framework 프로토타입으로 확인했습니다." 추가, GitHub 링크에 hospital-price-monitor 추가.
- **CSS 변경 없음** — 기존 클래스만 조합, 새 색·폰트 없음(7번 토큰). `#price-monitor` 는 `.main:has()` 폭 해제 목록에 없어 기본 본문 폭(1100px) — 1단 문서형이라 의도한 것. 넓히려면 base.css 의 `:has` 목록에 추가(2단 `.pay2` 전환 시).
- **검증**(6번 절차): `npm run build` 통과 / CODE_* 4개 ↔ 원본 줄 단위 대조 4/4 일치(원본을 `git clone --depth 1` 임시 클론 → jsx 백틱 상수 추출 → 원본 연속 줄 블록 탐색, 클론은 삭제) / dev 서버(5173)에서 사이드바 "개인 프로젝트 (Python)" 그룹 표시·클릭 시 페이지 열림·python 토큰 하이라이트(`hljs-keyword` 등) 확인.
- 다른 언어 코드를 넣을 땐: `CodeBlock.jsx` 에 `highlight.js/lib/languages/<lang>` 등록 → `<Func lang="<lang>">`.
