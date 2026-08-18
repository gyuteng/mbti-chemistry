# MBTI 케미

인지기능 기반으로 내 성향을 알아보고, 사람들과의 **케미를 관계 지도로 모으는** 웹앱. 재미로 보는 오락용 서비스입니다(검증된 심리검사가 아닙니다).

## 흐름 · 라우팅

```
/                     메인(이름·MBTI 입력) → 테스트/맛보기 → 카드 → 관계 지도
/?owner=<id>          그 사람 지도로 진입 = 게스트 합류(/add) → 내 MBTI 넣고 케미 확인 → 지도에 누적
```

- **토글로 MBTI 직접 입력** = 맛보기(전형/스테레오타입 설명)
- **12문항 테스트** = 정밀. 유형을 새로 정하는 게 아니라 **지표별 선호 강도(가중치)** 를 재서 케미를 세밀화. 카드의 강점 문장·"내 성향 강도" 막대·인접유형 blend 문구가 이 강도로 달라짐
- **관계 지도** = 나 중심 궤도 + 케미순 리스트(이해·보완·긴장·자율 4영역)

## 백엔드 (멀티유저 누적)

Vercel 서버리스 + **Vercel KV**(Redis)로 owner_id 기준 누적:

| API | 동작 |
|-----|------|
| `POST /api/owner` | 오너 생성 → `{ ownerId }` (KV: `owner:<id>`, `conn:<id>`) |
| `GET /api/map?owner=<id>` | 오너+합류자 반환 |
| `POST /api/connection` | 합류자 append (이름 dedupe, 최대 200) |

클라이언트는 `window.__PSYMATCH_API__`(기본 same-origin)로 호출하고, **API가 없으면 자동으로 localStorage 폴백**이라 로컬에서도 동작합니다.

## 로깅 (Amplitude)

`VITE_AMPLITUDE_KEY`를 넣으면 `src/main.jsx`에서 Amplitude를 초기화하고 `window.amplitude`를 노출합니다. 앱의 `track()`이 **모든 이벤트를 Amplitude로 전송**하며, 동시에 로컬에도 적재해 좌하단 🐞 패널로 확인할 수 있습니다.

주요 이벤트: `session_start`, `test_start`, `test_complete`, `card_view`, `nudge_test_click`, `map_view`, `connection_open`, `add_view`, `add_submit`, `share_click`. 사전은 `src/data/events.json`.

## 로컬 실행

```bash
npm install
cp .env.example .env.local   # VITE_AMPLITUDE_KEY 입력(선택)
npm run dev                  # http://localhost:5173  (API 없이 localStorage로 동작)
```

## Vercel 배포

```bash
vercel                       # 프로젝트 연결
vercel kv create mbti-kv     # KV 생성 후 프로젝트에 연결 (KV_REST_API_* 자동 주입)
# 환경변수 VITE_AMPLITUDE_KEY 설정
vercel --prod
```

## 파일

```
├─ api/            owner.js · map.js · connection.js  (Vercel KV)
├─ src/App.jsx     통합 앱 (엔진·화면·라우팅·로깅)
├─ src/main.jsx    Amplitude 초기화 + storage 폴리필
├─ src/data/       functions·types·rules·questions·events.json
├─ engine/engine.py 검증용 파이썬 엔진
├─ vercel.json / vite.config.js / package.json / .env.example
```

## 주의

점수·해석은 **오락용**입니다. 신뢰도·타당도 통계가 없는 간이 척도이며 사람을 규정하는 근거로 쓰지 마세요.
