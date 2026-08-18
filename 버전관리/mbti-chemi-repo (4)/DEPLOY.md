# MBTI 케미 — 배포 & 분석 & 성장 런북

처음부터 끝까지: GitHub → 서버 배포 → Amplitude → GA4 → 데이터 웨어하우스 → 바이럴. 복붙 순서대로.

---

## 1. GitHub 레포

github.com에서 빈 레포 생성(README 체크 해제) 후:

```bash
unzip mbti-chemi-repo.zip -d mbti-chemi && cd mbti-chemi
git init && git add -A && git commit -m "init: MBTI 케미"
git branch -M main
git remote add origin https://github.com/<아이디>/mbti-chemi.git
git push -u origin main
```

인증창에서 비번 대신 **Personal Access Token**(GitHub → Settings → Developer settings → Tokens) 사용.

## 2. 서버 배포 (Vercel)

**웹(권장):** vercel.com → Add New Project → 위 레포 Import → 프레임워크 Vite 자동감지 → Deploy → `xxx.vercel.app` 발급.

**CLI:**
```bash
npm i -g vercel && vercel      # 질문은 기본값
```

### 2-1. 백엔드(멀티유저 누적) — Vercel KV
대시보드 → 프로젝트 → **Storage → Create Database → KV** → 프로젝트에 **Connect**. `KV_REST_API_URL`·`KV_REST_API_TOKEN`이 자동 주입되고 `/api/owner|map|connection`이 그대로 사용. (KV 없어도 앱은 localStorage로 동작.)

## 3. Amplitude (제품 분석)

1. amplitude.com 가입 → 프로젝트 생성 → Settings → Projects에서 **API Key** 복사.
2. Vercel → Settings → Environment Variables에 `VITE_AMPLITUDE_KEY` 추가.
3. `vercel --prod` 재배포. `src/main.jsx`가 초기화하고 앱의 모든 이벤트를 전송.
4. Amplitude → Events / User Look-Up에서 실시간 확인(앱 좌하단 🐞로도 확인).

주요 이벤트: `session_start, landing_view, test_start, quiz_answer, test_complete, direct_pick, card_view, nudge_test_click, map_view, connection_open, explain_open, add_view, add_submit, guest_make_own, share_click, share_done`. 사전은 `src/data/events.json`.

## 4. GA4 연결

1. analytics.google.com → 속성 만들기 → 웹 데이터 스트림 → **측정 ID**(`G-XXXX`) 복사.
2. Vercel 환경변수 `VITE_GA4_ID = G-XXXX` 추가 → 재배포.
3. `src/main.jsx`가 gtag를 로드하고, 앱 `track()`이 **Amplitude와 GA4 양쪽으로 동시 전송**.
4. GA4 → 실시간(Realtime)에서 이벤트 들어오는지 확인. (커스텀 이벤트는 GA4 관리 → 이벤트/맞춤 측정기준에 등록해야 리포트에 노출.)

> 이벤트 파라미터(`chemi`, `channel`, `src`, `sid` 등)를 리포트에 쓰려면 GA4 → 관리 → 맞춤 정의에서 **맞춤 측정기준**으로 등록.

## 5. 데이터 웨어하우스 (원천 데이터 저장)

두 경로 모두 무료 티어로 가능. 하나만 해도 되고, 둘 다 하면 이중화.

### 5-A. GA4 → BigQuery (네이티브·무료·권장)
GA4 → 관리 → **BigQuery 링크** → GCP 프로젝트 연결 → 데이터 위치 선택 → 매일(또는 스트리밍) 내보내기 ON. 그러면 `analytics_<id>.events_*` 테이블에 **원천 이벤트가 매일 적재**된다. SQL로 퍼널·채널 전환을 직접 계산 가능.

검증 쿼리(예):
```sql
SELECT event_name, COUNT(*) AS n
FROM `project.analytics_XXX.events_*`
WHERE _TABLE_SUFFIX = FORMAT_DATE('%Y%m%d', CURRENT_DATE()-1)
GROUP BY 1 ORDER BY 2 DESC;
```

### 5-B. Amplitude → 웨어하우스
Amplitude → Data → **Export/Destinations**에서 BigQuery·Snowflake·S3로 내보내기(플랜에 따라). 또는 Amplitude Export API로 원천 이벤트 JSON을 받아 적재.

### 5-C. (선택) 자체 적재
`/api/event.js`를 추가해 앱에서 이벤트를 직접 POST → KV/DB에 쌓고, 정기적으로 웨어하우스로 덤프. 앱에는 `track()`에 `apiPost("/api/event", …)` 한 줄만 추가하면 됨(원하면 붙여줄게).

### 저장 확인 체크리스트
- [ ] GA4 Realtime에 이벤트 표시
- [ ] BigQuery에 `events_*` 테이블 생성(첫 적재는 최대 24h)
- [ ] 위 SQL로 어제 이벤트 카운트 나옴
- [ ] Amplitude Events 차트에 동일 이벤트 카운트(교차검증)

## 6. 바이럴 마케팅 설계

이 앱은 **구조 자체가 바이럴 루프**다: 내 지도 → 공유 링크 → 친구 합류 → 친구가 자기 지도 생성(`guest_make_own`) → 다시 공유.

### 측정 (이미 계측됨)
- **K(바이럴 계수)** = `guest_make_own` ÷ `card_view`. K>1이면 자가 성장.
- 채널/유입: 공유 링크의 `?src=&sid=` → 수신 `landing_view{src,sid}`로 어디서 왔는지 추적.
- 퍼널: `share_done → landing_view → add_view → add_submit → guest_make_own`.

### 루프를 키우는 레버
1. **공유 유인**: "친구가 들어와야 케미가 보인다"를 초반에 노출(카드 후킹). 지도가 채워질수록 재공유 욕구 ↑.
2. **결과의 공유가치**: 케미 점수·관계유형·"나에게 없는 걸 가진 사람" 같은 문구는 캡처해서 올리기 좋게 → og:image가 이 캡처를 대신.
3. **미완성의 힘**: 지도가 "0명"일 때 채우고 싶은 심리 → 첫 공유 유도 카피.
4. **호혜성**: 게스트도 자기 지도를 만들면 서로의 지도에 뜨게(상호 등록).
5. **시즌/밈**: "우리 팀 MBTI 지도", "동아리 케미" 같은 집단 단위 공유 트리거.

### 채널 전술 (한국)
- **카카오톡 공유**가 핵심(링크 미리보기 = og:image). 오픈채팅/단톡 확산.
- **X·스레드·인스타 스토리**: 결과 캡처 + 링크. 해시태그(#MBTI케미).
- **커뮤니티**: 에브리타임·디시·레딧 관련 서브에 "내 지도 만들어봄" 형태.
- **인플루언서 시드**: MBTI 콘텐츠 계정에 초기 배포.

### 성장 실험 (A/B 후보)
- 랜딩 후킹 문구, 공유 버튼 위치/카피, 첫 결과 도달까지 문항 수(12 vs 6), og:image 디자인.
- 지표: `test_complete`율, `share_done`율, K값을 실험군별로 비교.

---

## 부록: 내가 대신 못 하는 것
계정 로그인·실제 배포·키 발급(GitHub push, Vercel/Amplitude/GA4/GCP 연결)은 인증이 필요해 직접 해야 함. 코드·설정·문서는 전부 이 레포에 포함. 막히는 화면/에러는 그대로 공유하면 풀이 제공.
