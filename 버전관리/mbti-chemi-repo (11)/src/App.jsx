import React, { useState, useEffect, useCallback } from "react";

/* ═══ 팔레트 · 이미지 ═══ */
const FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLScV6ORfxUjTkCLUrJdBUnYYN88XQDxacT8C6tjG_wWXILQSRQ/viewform?embedded=true";
const C = { bg:"#EFE7D6", panel:"#FBF6EC", panel2:"#F4ECDB", soft:"#EDE3CF", line:"#E1D6BF",
  ink:"#2C2823", sub:"#6E6553", faint:"#9A8F79", navy:"#1E2547", gold:"#B58412", blue:"#2F6DA6", red:"#BB463B", indigo:"#3E4A7A", green:"#5B7A4B",
  mapBg:"#141A33", mapRing:"#2A3358", star:"#3A4570" };
const HERO = "data:image/webp;base64,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";
const domColor = { 이해:C.blue, 보완:C.gold, 긴장:C.red, 자율:C.green };
const TYPE_COLOR = { 보완형:"#E0A83B", 이해형:"#5B93D6", 긴장형:"#E06A63", 독립형:"#6FA85B" };
const TYPE_ICON = { 보완형:"🧩", 이해형:"🤝", 긴장형:"⚡", 독립형:"🌿" };

/* ═══ 엔진 ═══ */
const F = { Ni:["N","i","p"],Ne:["N","e","p"],Si:["S","i","p"],Se:["S","e","p"],Ti:["T","i","j"],Te:["T","e","j"],Fi:["F","i","j"],Fe:["F","e","j"] };
const STACK = { INTJ:["Ni","Te","Fi","Se"],ENTJ:["Te","Ni","Se","Fi"],INFJ:["Ni","Fe","Ti","Se"],ENFJ:["Fe","Ni","Se","Ti"],
  INTP:["Ti","Ne","Si","Fe"],ENTP:["Ne","Ti","Fe","Si"],INFP:["Fi","Ne","Si","Te"],ENFP:["Ne","Fi","Te","Si"],
  ISTP:["Ti","Se","Ni","Fe"],ESTP:["Se","Ti","Fe","Ni"],ISFP:["Fi","Se","Ni","Te"],ESFP:["Se","Fi","Te","Ni"],
  ISTJ:["Si","Te","Fi","Ne"],ESTJ:["Te","Si","Ne","Fi"],ISFJ:["Si","Fe","Ti","Ne"],ESFJ:["Fe","Si","Ne","Ti"] };
const NICK = { INTJ:"큰그림 전략가",ENTJ:"밀어붙이는 지휘관",INFJ:"의미를 읽는 통찰가",ENFJ:"사람을 이끄는 조율가",INTP:"파고드는 분석가",ENTP:"판을 흔드는 발상가",INFP:"가치를 지키는 몽상가",ENFP:"불붙이는 탐험가",ISTP:"손으로 푸는 해결사",ESTP:"현장의 승부사",ISFP:"결대로 사는 예술가",ESFP:"지금을 즐기는 무대체질",ISTJ:"믿음직한 관리자",ESTJ:"체계를 세우는 실행가",ISFJ:"조용히 챙기는 수호자",ESFJ:"살뜰한 살림꾼" };
const FLOW = { INTJ:"멀리 보고 구조를 세우는 사람",ENTJ:"목표를 향해 판을 끌고 가는 사람",INFJ:"본질을 읽어 의미로 잇는 사람",ENFJ:"사람을 한 방향으로 모으는 사람",INTP:"원리를 파고들어 이해하는 사람",ENTP:"가능성을 던지고 검증하는 사람",INFP:"소중한 가치를 넓게 펼치는 사람",ENFP:"가능성에 불을 붙이는 사람",ISTP:"직접 해보며 푸는 사람",ESTP:"지금 현장을 장악하는 사람",ISFP:"내 결대로 지금을 사는 사람",ESFP:"순간을 즐기며 사는 사람",ISTJ:"검증된 방식으로 쌓는 사람",ESTJ:"체계를 세워 굴리는 사람",ISFJ:"조용히 곁을 챙기는 사람",ESFJ:"살뜰히 관계를 돌보는 사람" };
const ROLE = { Ni:"미래를 내다보는 감", Ne:"아이디어를 떠올리는 힘", Si:"경험으로 꼼꼼히 챙기는 힘", Se:"지금 상황에 바로 반응하는 감각", Ti:"논리로 따져보는 힘", Te:"일을 밀어붙여 끝내는 추진력", Fi:"내 가치관을 지키는 마음", Fe:"주변 사람을 살피는 마음" };
const ADVICE = {
  Ni:{s:"복잡한 상황에서도 ‘결국 이렇게 흘러가겠다’는 큰 방향을 잘 잡아요. 핵심을 빨리 짚는 편이에요.",c:"한번 확신하면 밀어붙이는 경향이 있어요. 중요한 결정 전엔 다른 가능성도 한 번 열어두면 좋아요."},
  Ne:{s:"새로운 아이디어가 잘 떠오르고, 이것저것 연결해 새로운 걸 시작하는 데 강해요.",c:"관심이 여러 곳으로 흩어져 끝맺음이 약해질 수 있어요. 벌인 일 중 하나는 끝까지 마무리해 보세요."},
  Si:{s:"해야 할 걸 빠뜨리지 않고 꼼꼼히 챙겨요. 검증된 방식으로 안정감 있게 해내는 게 강점이에요.",c:"익숙한 방식만 고집하다 변화가 늦어질 수 있어요. 가끔은 새로운 방법도 시도해 보세요."},
  Se:{s:"지금 벌어지는 일에 빠르게 반응하고 바로 움직여요. 순발력과 현장 대처가 좋아요.",c:"눈앞의 것에 끌려 즉흥적으로 결정할 때가 있어요. 큰 일은 잠깐 멈춰 생각하고 정하면 좋아요."},
  Ti:{s:"‘왜 그런지’ 원리를 파고들어 논리적으로 이해해요. 문제의 허점을 잘 찾아내요.",c:"생각이 길어져 실행이 늦어질 수 있어요. 완벽하지 않아도 일단 시작하는 연습을 해보세요."},
  Te:{s:"목표가 정해지면 효율적으로 밀어붙여 결과를 만들어내요. 계획하고 실행하는 힘이 강해요.",c:"효율을 챙기다 사람 감정을 놓칠 때가 있어요. 정답보다 공감이 필요한 순간을 살펴보세요."},
  Fi:{s:"무엇이 옳고 소중한지 자기 기준이 뚜렷해서 남에게 쉽게 휩쓸리지 않아요.",c:"속마음을 잘 표현하지 않아 혼자 담아두다 멀어질 수 있어요. 불편한 건 그때그때 말해보세요."},
  Fe:{s:"분위기와 상대의 기분을 잘 읽어서 사람들과 두루 잘 지내요. 관계를 부드럽게 만들어요.",c:"남을 챙기다 정작 내 마음은 뒤로 밀릴 수 있어요. 내가 뭘 원하는지도 챙겨주세요."} };
const poles = (t)=>{ let p,j; for(const fn of STACK[t].slice(0,2)) F[fn][2]==="p"?(p=fn):(j=fn); return [p,j]; };
const ei = (t)=> F[STACK[t][0]][1]==="e"?"E":"I";
const bucket = (x,y)=>{ const sl=F[x][0]===F[y][0], so=F[x][1]===F[y][1]; return sl&&so?"ALIGN":sl&&!so?"KIN":!sl&&so?"CONTRAST":"COMPLEMENT"; };
const BY = { ALIGN:{이해:92,보완:25,긴장:18,자율:22},KIN:{이해:78,보완:45,긴장:22,자율:48},COMPLEMENT:{이해:50,보완:92,긴장:50,자율:32},CONTRAST:{이해:32,보완:38,긴장:78,자율:82} };
const TL = { 이해:"이해형",보완:"보완형",긴장:"긴장형",자율:"독립형" };
const t2a = (t)=>({ EI:t[0]==="E"?1:-1, NS:t[1]==="N"?1:-1, TF:t[2]==="T"?1:-1, JP:t[3]==="J"?1:-1 });
const tfa = (a)=> (a.EI>=0?"E":"I")+(a.NS>=0?"N":"S")+(a.TF>=0?"T":"F")+(a.JP>=0?"J":"P");
function chemi(va, vb){
  const ta=tfa(va), tb=tfa(vb), [pa,ja]=poles(ta), [pb,jb]=poles(tb), bp=bucket(pa,pb), bj=bucket(ja,jb), o={};
  const wP=(Math.abs(va.NS)+Math.abs(vb.NS))/2, wJ=(Math.abs(va.TF)+Math.abs(vb.TF))/2;
  for(const k of ["이해","보완","긴장","자율"]) o[k]=((50+(BY[bp][k]-50)*wP)+(50+(BY[bj][k]-50)*wJ))/2;
  const wE=(Math.abs(va.EI)+Math.abs(vb.EI))/2;
  if(ei(ta)!==ei(tb)) o["보완"]=Math.min(100,o["보완"]+6*wE); else o["이해"]=Math.min(100,o["이해"]+6*wE);
  const comp=o["이해"]*.3+o["보완"]*.4+o["자율"]*.15+(100-o["긴장"])*.15;
  const disp=Math.round(55+comp*.45);
  const label=["이해","보완","긴장","자율"].reduce((m,k)=>o[k]>o[m]?k:m);
  return { scores:Object.fromEntries(Object.entries(o).map(([k,v])=>[k,Math.round(v)])), chemi:disp, type:TL[label] };
}
/* 가중치 반영 설명 (밴드 60/30, 경계축이면 인접유형 언급) */
const AXIS_LETTERS = { EI:["E","I"], NS:["N","S"], TF:["T","F"], JP:["J","P"] };
function clarityOf(axes){ const o={}; for(const k in axes) o[k]=Math.round(Math.abs(axes[k])*100); return o; }
function domAxis(fn){ return (F[fn][0]==="N"||F[fn][0]==="S")?"NS":"TF"; }
function blendNote(mbti, axes){
  const cl=clarityOf(axes); let worst=null;
  for(const k of ["EI","NS","TF","JP"]) if(cl[k]<30 && (!worst||cl[k]<cl[worst])) worst=k;
  if(!worst) return null;
  const idx={EI:0,NS:1,TF:2,JP:3}[worst];
  const cur=mbti[idx], other=AXIS_LETTERS[worst][0]===cur?AXIS_LETTERS[worst][1]:AXIS_LETTERS[worst][0];
  const alt=mbti.slice(0,idx)+other+mbti.slice(idx+1);
  return `${cur}/${other}가 뚜렷하지 않아, ${alt} 성향도 조금 섞여 있어요.`;
}
function hasBatchim(w){ const c=(w||"").slice(-1).charCodeAt(0); return c>=0xAC00 && c<=0xD7A3 ? (c-0xAC00)%28!==0 : false; }
function J(w,withB,noB){ return w + (hasBatchim(w)?withB:noB); }
function buildAdvice(mbti, axes){
  const s=STACK[mbti], cl=axes?clarityOf(axes):{EI:100,NS:100,TF:100,JP:100};
  const domCl = cl[domAxis(s[0])];
  const emph = domCl>=60 ? " (특히 이 성향이 뚜렷해요)" : (domCl<30 ? " (다만 아주 강한 편은 아니에요)" : "");
  const strengths=[
    `핵심 강점: ${ADVICE[s[0]].s}${emph}`,
    `받쳐주는 힘: ${ADVICE[s[1]].s}`,
    `당신다운 점: 한마디로 ${FLOW[mbti]}이에요. ${ROLE[s[0]]}에 ${ROLE[s[1]]}이 더해져, 방향을 잡고 실제로 해내는 흐름이 자연스러워요.`,
    `숨은 무기: ${ADVICE[s[2]].s} 평소엔 잘 안 드러나지만, 잘 살리면 강점이 돼요.`,
    `종합하면: ${NICK[mbti]} 스타일이에요. ${FLOW[mbti]}이라는 점이 가장 큰 자산이에요.` ];
  const weaknesses=[
    `강점의 그림자: ${ADVICE[s[0]].c}`,
    `함께 주의할 점: ${ADVICE[s[1]].c}`,
    `아직 서툰 부분: ${ROLE[s[2]]}은 아직 덜 익은 편이에요. ${ADVICE[s[2]].c}`,
    `지칠 때 나오는 모습: 스트레스가 쌓이면 평소 잘 안 쓰던 ${ROLE[s[3]]}이 서툴게 튀어나올 수 있어요. ${ADVICE[s[3]].c}`,
    `성장 포인트: 잘하는 것에만 기대지 말고, ${ROLE[s[3]]}을 조금씩 의식하면 훨씬 균형이 잡혀요.` ];
  return { strengths, weaknesses, clarity:cl, blend:axes?blendNote(mbti,axes):null };
}
const FN_KO = { Ni:"내향 직관(Ni)", Ne:"외향 직관(Ne)", Si:"내향 감각(Si)", Se:"외향 감각(Se)", Ti:"내향 사고(Ti)", Te:"외향 사고(Te)", Fi:"내향 감정(Fi)", Fe:"외향 감정(Fe)" };
const POS_KO = ["주기능(가장 강함)","부기능(보조)","3차기능(성장 중)","열등기능(가장 약함)"];
function buildPrompt(mbti, axes, name){
  const s = STACK[mbti], cl = axes?clarityOf(axes):{EI:100,NS:100,TF:100,JP:100};
  const band = (k)=> cl[k]>=60?"뚜렷함":cl[k]>=30?"보통":"유연함(경계)";
  const stackLines = s.map((fn,i)=>`  ${i+1}. ${FN_KO[fn]} — ${POS_KO[i]}`).join("\n");
  const axisLines = [["EI","외향/내향"],["NS","직관/감각"],["TF","사고/감정"],["JP","판단/인식"]]
    .map(([k,label])=>`  - ${label}: ${cl[k]}/100 (${band(k)})`).join("\n");
  const mode = axes ? "12문항 테스트로 측정한 실제 선호 강도" : "유형 전형(스테레오타입) 기준";
  return `당신은 MBTI 인지기능(8기능) 전문 분석가입니다. 아래 사람의 성향을 인지기능 스택 관점에서 아주 상세하고 구체적으로 분석해 주세요.

[대상]
- 이름/별명: ${name||"사용자"}
- MBTI 유형: ${mbti} (${NICK[mbti]})
- 인지기능 스택:
${stackLines}
- 선호 강도(${mode}):
${axisLines}

[분석 요청 — 각 항목을 문단으로 자세히]
1. 인지기능 스택 해설: 주·부·3차·열등 기능이 이 사람 안에서 어떻게 상호작용하는지. 특히 주기능이 부기능을 어떻게 쓰는지.
2. 강점 5가지: 각 기능이 만들어내는 구체적 강점을, 실제 상황 예시와 함께.
3. 약점·맹점 5가지: 주기능 과용의 그림자, 3차기능의 미숙함, 열등기능이 스트레스 상황에서 어떻게 튀어나오는지.
4. 선호 강도 반영: 위 강도 수치에서 '뚜렷함'인 축은 그 성향을 강하게, '유연함(경계)'인 축은 반대 성향도 섞여 있음을 반영해 설명(인접 유형 언급 가능).
5. 관계에서의 특징: 어떤 사람과 잘 맞고(보완/이해), 어떤 사람과 부딪히는지(긴장), 그 이유를 기능 관점에서.
6. 성장 방향: 열등기능을 건강하게 발달시키는 현실적 조언 3가지.

전문적이되 따뜻하고 이해하기 쉬운 말투로, 이 사람만을 위한 개인화된 분석으로 작성해 주세요.`;
}
const ONE = { 보완형:"같이 하면 내가 놓친 쪽을 이 사람이 채워줘요 — 결정할 때 특히 든든해요.",
  이해형:"설명 안 해도 통하는 사이 — 세상 보는 결이 비슷해서 편해요.",
  긴장형:"생각이 자주 부딪히지만, 그만큼 서로를 자극해 키워주는 사이예요.",
  독립형:"사는 결이 서로 달라요 — 각자 존중하면 오히려 편한 거리감이 생겨요." };
const CARE = { 보완형:"방식이 서로 달라 처음엔 ‘왜 저러지’ 싶어 답답할 수 있어요. 이럴 땐 틀린 게 아니라 ‘나한테 없는 걸 가진 사람’이라고 보면, 마찰이 배울 점으로 바뀌어요.",
  이해형:"잘 통해서 편한 만큼, 둘 다 똑같은 지점을 놓치기 쉬워요. 서로 못 보는 사각을 지적해 줄 사람이 없어 실수가 커질 수 있죠. 중요한 결정일수록 일부러 반대 의견을 꺼내 서로 점검해 주세요.",
  긴장형:"판단 기준이 정반대라, 급할 때 부딪히면 감정 소모가 커요. 함께 정하기 전에 ‘이번엔 뭘 우선할지’를 먼저 맞춰두면 충돌이 자극으로 바뀌어요.",
  독립형:"성향이 달라 깊은 속마음까진 잘 안 닿을 수 있어요. 서로를 바꾸려 들면 지치기 쉬우니, 각자의 방식을 인정하는 게 이 관계를 오래 편하게 만들어요." };
const LEGEND = { 이해형:"같은 방식으로 이해하는 관계 — 나를 가장 잘 이해하는 사람.",보완형:"내가 못 보는 걸 보여주는 관계 — 나에게 없는 걸 가진 사람.",긴장형:"서로를 강하게 자극하는 관계 — 나를 가장 많이 자극하는 사람.",독립형:"서로 다른 세계를 존중하는 관계 — 각자의 세계를 지키는 사람." };
const DOM_ORDER=["보완","이해","긴장","자율"]; const LEGEND_ORDER=["보완형","이해형","긴장형","독립형"];
const DOMAIN_EXPLAIN = { 이해:"서로의 사고방식을 얼마나 쉽게 알아듣는가예요. 높을수록 설명 안 해도 통하고, 낮으면 서로 ‘왜 저렇게 생각하지?’ 싶어져요.",
  보완:"서로의 부족한 부분을 얼마나 채워주는가예요. 높을수록 내가 약한 영역을 상대가 메워줘요. 결이 다를 때 올라가요.",
  긴장:"핵심 가치나 방식이 얼마나 부딪히는가예요. 높을수록 자주 충돌하지만 그만큼 서로를 자극해요. 판단 기준이 정반대일 때 올라가요.",
  자율:"서로 다른 세계를 얼마나 독립적으로 유지하는가예요. 높을수록 각자 편하지만, 너무 높으면 거리감이 생겨요." };

/* ═══ 문항 ═══ */
const ITEMS = [
  {id:"EI1",ax:"EI",dir:1,stem:"처음 보는 사람과도 금방 대화를 시작하는 편이다."},
  {id:"NS1",ax:"NS",dir:1,stem:"눈앞의 사실보다 그 뒤에 숨은 의미나 가능성이 먼저 궁금하다."},
  {id:"TF1",ax:"TF",dir:1,stem:"결정할 때 감정보다 논리와 근거를 먼저 따진다."},
  {id:"JP1",ax:"JP",dir:1,stem:"계획을 세우고 그대로 지켜질 때 마음이 편하다."},
  {id:"EI3",ax:"EI",dir:-1,stem:"혼자 있는 시간이 있어야 에너지가 회복된다."},
  {id:"NS3",ax:"NS",dir:-1,stem:"검증된 방법과 구체적인 사실을 더 신뢰한다."},
  {id:"TF3",ax:"TF",dir:-1,stem:"힘들어하는 사람에겐 해결책보다 공감을 먼저 건넨다."},
  {id:"JP3",ax:"JP",dir:-1,stem:"상황에 따라 즉흥적으로 움직이는 것을 즐긴다."},
  {id:"EI2",ax:"EI",dir:1,stem:"여러 사람과 오래 어울리고 나면 오히려 기운이 차오른다."},
  {id:"NS2",ax:"NS",dir:1,stem:"새로운 아이디어나 비유로 생각이 자주 뻗어나간다."},
  {id:"TF2",ax:"TF",dir:1,stem:"틀린 점은 분위기가 불편해져도 짚고 넘어가는 편이다."},
  {id:"JP2",ax:"JP",dir:1,stem:"할 일은 미리 끝내 두어야 안심이 된다."} ];
const LIKERT = [["전혀",1],["아니다",2],["보통",3],["그렇다",4],["매우",5]];
function scoreVector(res){ const raw={EI:0,NS:0,TF:0,JP:0},cnt={EI:0,NS:0,TF:0,JP:0};
  ITEMS.forEach(it=>{cnt[it.ax]++; if(res[it.id]) raw[it.ax]+=it.dir*(res[it.id]-3);});
  const a={}; Object.keys(raw).forEach(ax=>a[ax]=raw[ax]/(cnt[ax]*2)); return a; }

/* ═══ 로깅 · 영속 ═══ */
const K = { owner:"psymatch:owner", conn:"psymatch:conn", log:"psymatch:log", last:"psymatch:last", myid:"psymatch:myid" };
const hasLS = (typeof window!=="undefined") && (()=>{ try{ window.localStorage.setItem("__t","1"); window.localStorage.removeItem("__t"); return true; }catch{ return false; } })();
async function sget(k){
  try{ if(hasLS){ const v=window.localStorage.getItem(k); return v==null?null:JSON.parse(v); } }catch{}
  try{ if(typeof window!=="undefined" && window.storage){ const r=await window.storage.get(k,false); return r?JSON.parse(r.value):null; } }catch{}
  return null;
}
async function sset(k,v){
  try{ if(hasLS){ window.localStorage.setItem(k, JSON.stringify(v)); return; } }catch{}
  try{ if(typeof window!=="undefined" && window.storage){ await window.storage.set(k, JSON.stringify(v), false); } }catch{}
}
/* 백엔드 API (배포 시). window.__PSYMATCH_API__ 없으면 로컬 폴백 */
const API_BASE = (typeof window!=="undefined" && window.__PSYMATCH_API__) || "";
async function apiGet(p){ try{ const r=await fetch(API_BASE+p); return r.ok?await r.json():null; }catch{ return null; } }
async function apiPost(p,b){ try{ const r=await fetch(API_BASE+p,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(b)}); return r.ok?await r.json():null; }catch{ return null; } }
function amp(event,props){ try{ if(typeof window!=="undefined" && window.amplitude && window.amplitude.track) window.amplitude.track(event,props); }catch{} }
function ga(event,props){ try{ if(typeof window!=="undefined" && window.gtag) window.gtag("event",event,props); }catch{} }
/* 공유 링크에 src·sid 태깅 */
function buildShareUrl(ownerId, channel){
  const base = (ownerId && typeof location!=="undefined") ? `${location.origin}/?owner=${ownerId}` : "https://psymatch.app";
  const sid = Math.random().toString(36).slice(2,8);
  const join = base.includes("?") ? "&" : "?";
  return { url:`${base}${join}src=${channel}&sid=${sid}`, sid };
}
function uid(){ return Math.random().toString(36).slice(2,10); }
// 예시 데이터 없음 — 실제 /add 합류로만 채워짐

/* ═══ 공통 UI ═══ */
const Btn = ({children,onClick,disabled,kind="navy"})=>(
  <button onClick={onClick} disabled={disabled} className="w-full rounded-xl py-4 text-sm font-bold transition-transform active:scale-95"
    style={{ background: disabled?C.soft:kind==="navy"?C.navy:"transparent", color: disabled?C.faint:kind==="navy"?"#FBF6EC":C.indigo, border: kind==="ghost"?`1px solid ${C.line}`:"none" }}>{children}</button>);
const DomBar = ({k,v})=>(
  <div className="flex items-center gap-2"><span className="text-xs w-8" style={{color:C.sub}}>{k}</span>
    <div className="flex-1 h-2 rounded-full" style={{background:C.soft}}><div className="h-2 rounded-full" style={{width:v+"%",background:domColor[k]}}/></div>
    <span className="text-xs w-7 text-right font-mono" style={{color:C.ink}}>{v}</span></div>);
function AxisStrength({axes}){ const cl=clarityOf(axes);
  const rows=[["EI","E","I"],["NS","N","S"],["TF","T","F"],["JP","J","P"]];
  return (<div className="space-y-2">{rows.map(([ax,l,r])=>{ const v=axes[ax]; const pos=50+v*50; const strong=Math.abs(v)>=0.6;
    return (<div key={ax}><div className="flex justify-between text-xs mb-0.5" style={{color:C.faint}}>
      <span style={{color:v<0?C.ink:C.faint,fontWeight:v<0?700:400}}>{r}</span>
      <span>{cl[ax]>=60?"뚜렷":cl[ax]>=30?"보통":"유연"}</span>
      <span style={{color:v>0?C.ink:C.faint,fontWeight:v>0?700:400}}>{l}</span></div>
      <div className="relative h-2 rounded-full" style={{background:C.soft}}>
        <div className="absolute top-0 bottom-0 w-px" style={{left:"50%",background:C.line}}/>
        <div className="absolute top-0 h-2 rounded-full" style={{background:strong?C.indigo:C.faint, left:v>=0?"50%":pos+"%", width:Math.abs(v)*50+"%"}}/></div></div>);})}</div>);
}

/* ═══ 화면: 랜딩 ═══ */
function Landing({name,setName,d,setD,onTest,onDirect}){
  const mbti=`${d.ei}${d.sn}${d.tf}${d.jp}`; const full=mbti.length===4&&STACK[mbti];
  const Row=({field,left,right})=>(<div className="flex gap-2 mb-2">{[left,right].map(([lab,v])=>(
    <button key={v} onClick={()=>setD({...d,[field]:v})} className="flex-1 rounded-xl py-2.5 text-sm font-semibold"
      style={{background:d[field]===v?C.navy:C.panel2,color:d[field]===v?"#FBF6EC":C.sub,border:`1px solid ${C.line}`}}>{lab}</button>))}</div>);
  return (<div className="mx-auto max-w-md px-4 py-8">
    <div className="text-center mb-6"><img src={HERO} alt="MBTI 케미" className="mx-auto mb-3" style={{width:148,height:148}}/>
      <h1 className="font-serif text-3xl mb-1" style={{color:C.ink}}>MBTI 케미</h1>
      <p className="text-sm" style={{color:C.sub}}>내 성향을 알아보고, 사람들과의 케미를 지도로 모아요</p></div>
    <div className="rounded-3xl p-5" style={{background:C.panel,border:`1px solid ${C.line}`,boxShadow:"0 2px 8px rgba(44,40,35,0.06)"}}>
      <input value={name} onChange={e=>setName(e.target.value)} placeholder="이름 또는 별명"
        className="w-full rounded-xl px-4 py-3 mb-4 text-sm outline-none" style={{background:C.panel2,color:C.ink,border:`1px solid ${C.line}`}}/>
      <p className="text-xs mb-2" style={{color:C.faint}}>MBTI를 알면 골라주세요 (몰라도 괜찮아요)</p>
      <Row field="ei" left={["E · 외향","E"]} right={["I · 내향","I"]}/>
      <Row field="sn" left={["N · 직관","N"]} right={["S · 감각","S"]}/>
      <Row field="tf" left={["T · 사고","T"]} right={["F · 감정","F"]}/>
      <Row field="jp" left={["J · 계획","J"]} right={["P · 즉흥","P"]}/>
      <div className="mt-4 space-y-2"><Btn onClick={onTest}>12문항 테스트로 정확하게 (30초)</Btn>
        <p className="text-center text-xs" style={{color:C.faint}}>테스트하면 케미가 훨씬 정확해져요 · 안 해도 대략은 볼 수 있어요</p>
        <Btn kind="ghost" onClick={()=>full&&onDirect(mbti)} disabled={!(name.trim()&&full)}>{full?`${mbti}로 바로 보기 (맛보기)`:"MBTI 골랐다면 바로 보기"}</Btn></div></div>
    <p className="text-center text-xs mt-5" style={{color:C.faint}}>재미로 보는 MBTI 케미 · 재미로만 즐겨주세요!</p></div>);
}

/* ═══ 화면: 테스트 ═══ */
function Test({onDone,onAnswer}){ const [res,setRes]=useState({}); const answered=Object.keys(res).length;
  return (<div><div className="sticky top-0 z-10 px-4 pt-4 pb-3" style={{background:C.bg}}><div className="mx-auto max-w-md">
    <div className="flex justify-between text-xs mb-1" style={{color:C.sub}}><span>나를 알아보는 12문항</span><span>{answered}/{ITEMS.length}</span></div>
    <div className="h-1.5 rounded-full" style={{background:C.soft}}><div className="h-1.5 rounded-full" style={{width:(answered/ITEMS.length*100)+"%",background:C.indigo}}/></div></div></div>
    <div className="mx-auto max-w-md px-4 pb-28">{ITEMS.map((it,i)=>(
      <div key={it.id} className="rounded-2xl p-4 mb-3" style={{background:res[it.id]?C.panel2:C.panel,border:`1px solid ${res[it.id]?C.indigo:C.line}`}}>
        <p className="text-sm mb-3" style={{color:C.ink}}><span style={{color:C.faint}}>{i+1}. </span>{it.stem}</p>
        <div className="flex gap-1.5">{LIKERT.map(([lab,v])=>(<button key={v} onClick={()=>{setRes(p=>({...p,[it.id]:v})); if(onAnswer)onAnswer(it.id,v);}}
          className="flex-1 rounded-lg py-2 text-xs font-semibold" style={{background:res[it.id]===v?C.indigo:C.soft,color:res[it.id]===v?"#FBF6EC":C.sub}}>{lab}</button>))}</div></div>))}</div>
    <div className="fixed left-0 right-0 bottom-0 px-4 py-3" style={{background:C.bg,borderTop:`1px solid ${C.line}`}}><div className="mx-auto max-w-md">
      <Btn onClick={()=>onDone(scoreVector(res))} disabled={answered<ITEMS.length}>{answered>=ITEMS.length?"결과 보기":`${ITEMS.length-answered}문항 남았어요`}</Btn></div></div></div>);
}

/* ═══ 화면: 카드 ═══ */
function Card({name,mbti,axes,tested,onShare,onPrompt,onSynergy,onTest}){
  const {strengths,weaknesses,blend}=buildAdvice(mbti,axes);
  return (<div className="mx-auto max-w-md px-4 py-6">
    <div className="rounded-3xl p-6 mb-4 text-center" style={{background:C.panel,border:`1px solid ${C.line}`,boxShadow:"0 2px 8px rgba(44,40,35,0.06)"}}>
      <p className="text-sm mb-1" style={{color:C.faint}}>{name||"당신"}님은</p>
      <div className="font-serif text-4xl mb-1" style={{color:C.indigo}}>{mbti}</div>
      <p className="text-base font-bold" style={{color:C.ink}}>🧭 {NICK[mbti]}형</p>
      <p className="text-sm mt-1" style={{color:C.sub}}>{FLOW[mbti]}</p>
      {blend&&<p className="text-xs mt-2" style={{color:C.faint}}>{blend}</p>}</div>
    {!tested&&(<div className="rounded-2xl p-4 mb-3" style={{background:C.panel2,border:`1px dashed ${C.indigo}`}}>
      <p className="text-sm font-semibold mb-1" style={{color:C.ink}}>🎯 테스트하면 케미가 정확해져요</p>
      <p className="text-xs mb-3" style={{color:C.sub}}>지금은 <b style={{color:C.ink}}>{mbti} 전형</b>으로 잡은 대략치예요. 30초 테스트로 <b style={{color:C.ink}}>내 선호가 얼마나 강한지</b>까지 재면 나만의 정확한 케미가 나와요.</p>
      <button onClick={onTest} className="w-full rounded-xl py-2.5 text-sm font-bold" style={{background:C.indigo,color:"#FBF6EC"}}>30초 테스트로 정확하게</button></div>)}
    {tested&&(<div className="rounded-2xl p-4 mb-3" style={{background:C.panel,border:`1px solid ${C.line}`}}>
      <p className="text-sm font-bold mb-3" style={{color:C.ink}}>내 성향 강도</p><AxisStrength axes={axes}/>
      <p className="text-xs mt-2" style={{color:C.faint}}>막대가 길수록 그 성향이 뚜렷해요. 이 강도가 케미 계산에 반영돼요.</p></div>)}
    <div className="rounded-2xl p-4 mb-3" style={{background:C.panel,border:`1px solid ${C.line}`}}>
      <p className="text-sm font-bold mb-2" style={{color:C.green}}>이런 게 강점이에요</p>
      {strengths.map((t,i)=><p key={i} className="text-sm leading-relaxed mb-2" style={{color:C.ink}}><span style={{color:C.green}}>{i+1}. </span>{t}</p>)}</div>
    <div className="rounded-2xl p-4 mb-4" style={{background:C.panel,border:`1px solid ${C.line}`}}>
      <p className="text-sm font-bold mb-2" style={{color:C.red}}>이건 살짝 조심하면 좋아요</p>
      {weaknesses.map((t,i)=><p key={i} className="text-sm leading-relaxed mb-2" style={{color:C.sub}}><span style={{color:C.red}}>{i+1}. </span>{t}</p>)}</div>
    <Btn onClick={onSynergy}>사람들과의 MBTI 케미 보기</Btn>
    <div className="h-2"/><Btn kind="ghost" onClick={onShare}>내 지도 공유하기</Btn>
    <div className="h-2"/><button onClick={onPrompt} className="w-full rounded-xl py-4 text-sm font-bold" style={{background:C.panel2,color:C.indigo,border:`1px solid ${C.indigo}`}}>🔎 내 성향 상세 분석 프롬프트 복사</button>
    <p className="text-center text-xs mt-2" style={{color:C.faint}}>복사해서 ChatGPT·Claude에 붙여넣으면 8기능 기반 상세 분석을 받아요</p></div>);
}

/* ═══ 화면: 관계 지도 ═══ */
function layout(ownerAxes, people){
  const scored=people.map(p=>({...p,...chemi(ownerAxes,t2a(p.mbti))})).sort((a,b)=>b.chemi-a.chemi);
  const n=scored.length||1;
  return scored.map((p,i)=>{ const norm=Math.max(0,Math.min(1,(p.chemi-60)/35)); const r=40-norm*22;
    const ang=(i/n)*Math.PI*2-Math.PI/2+(i%2?0.25:-0.15);
    return {...p,x:50+r*Math.cos(ang),y:50+r*Math.sin(ang),size:5+norm*4}; });
}
function OrbitMap({nodes,selected,onSelect,me}){
  return (<div className="rounded-3xl overflow-hidden" style={{background:C.mapBg,border:`1px solid ${C.line}`}}>
    <div className="px-4 pt-4 pb-1 flex items-center justify-between"><span className="text-sm font-bold" style={{color:"#EDEFFA"}}>관계 지도 · {nodes.length}명</span>
      <span className="text-xs" style={{color:"#8A93BE"}}>가운데(나)에 가까울수록 케미 ↑</span></div>
    <svg viewBox="0 0 100 100" className="w-full" style={{display:"block"}}>
      {[18,30,42].map(r=><circle key={r} cx="50" cy="50" r={r} fill="none" stroke={C.mapRing} strokeWidth="0.3" strokeDasharray="1 1.5"/>)}
      {[...Array(40)].map((_,i)=>{const a=(i*137.5)*Math.PI/180,rr=6+(i%7)*6;return <circle key={i} cx={50+rr*Math.cos(a)} cy={50+rr*Math.sin(a)} r="0.25" fill={C.star}/>;})}
      {nodes.map(p=><line key={"l"+p.name} x1="50" y1="50" x2={p.x} y2={p.y} stroke={selected===p.name?TYPE_COLOR[p.type]:C.mapRing} strokeWidth={selected===p.name?"0.5":"0.3"} opacity="0.8"/>)}
      <circle cx="50" cy="50" r="8" fill={C.gold} opacity="0.18"/><circle cx="50" cy="50" r="5.5" fill={C.gold}/>
      <text x="50" y="50.7" textAnchor="middle" fontSize="2.4" fontWeight="700" fill={C.navy}>{me||"나"}</text>
      {nodes.map(p=>(<g key={p.name} onClick={()=>onSelect(p.name)} style={{cursor:"pointer"}} className="orbit-node">
        <circle cx={p.x} cy={p.y} r={p.size+2} fill={TYPE_COLOR[p.type]} opacity={selected===p.name?0.28:0.14}/>
        <circle cx={p.x} cy={p.y} r={p.size} fill={TYPE_COLOR[p.type]} stroke={selected===p.name?"#fff":"none"} strokeWidth="0.4"/>
        <text x={p.x} y={p.y+0.9} textAnchor="middle" fontSize="2.2" fontWeight="700" fill="#fff">{p.mbti.slice(0,2)}</text>
        <text x={p.x} y={p.y+p.size+3} textAnchor="middle" fontSize="2.3" fill="#C7CCE8">{p.name}</text></g>))}</svg>
    <p className="text-center text-xs pb-3" style={{color:"#6E77A0"}}>노드를 누르면 아래에서 그 사람 케미가 열려요</p></div>);
}
function Counts({nodes}){ const by={보완형:0,이해형:0,긴장형:0,독립형:0}; nodes.forEach(p=>by[p.type]++);
  return (<div className="grid grid-cols-4 gap-2 my-3">{Object.keys(by).map(t=>(
    <div key={t} className="rounded-2xl py-2 text-center" style={{background:C.panel,border:`1px solid ${C.line}`}}>
      <div className="font-serif text-xl" style={{color:TYPE_COLOR[t]}}>{by[t]}</div><div className="text-xs" style={{color:C.sub}}>{TYPE_ICON[t]} {t}</div></div>))}</div>);
}
function ExplainBox({onOpen}){ const [open,setOpen]=useState(false);
  return (<div className="rounded-2xl mt-3" style={{background:C.panel,border:`1px solid ${C.line}`}}>
    <button onClick={()=>setOpen(v=>{ if(!v&&onOpen)onOpen(); return !v; })} className="w-full flex items-center justify-between p-4 text-left">
      <span className="text-sm font-bold" style={{color:C.ink}}>보완·이해·긴장·자율이 뭐예요? <span style={{color:C.indigo}}>제대로 알아보기</span></span>
      <span className="text-sm" style={{color:C.faint}}>{open?"▲":"▼"}</span></button>
    {open&&(<div className="px-4 pb-4">{DOM_ORDER.map(k=>(
      <p key={k} className="text-sm leading-relaxed mb-2" style={{color:C.sub}}><b style={{color:domColor[k]}}>{k}</b> · {DOMAIN_EXPLAIN[k]}</p>))}
      <p className="text-xs leading-relaxed mt-1" style={{color:C.faint}}>케미 점수는 이해·보완을 크게, 긴장을 비용으로 반영해 계산돼요.</p></div>)}</div>);
}
function LegendBox(){
  return (<div className="rounded-2xl p-4 mt-4" style={{background:C.panel,border:`1px solid ${C.line}`}}>
    <p className="text-sm font-bold mb-2" style={{color:C.ink}}>관계 유형은 무슨 뜻인가요?</p>
    {LEGEND_ORDER.map(t=><p key={t} className="text-sm leading-relaxed mb-1.5" style={{color:C.sub}}><b style={{color:TYPE_COLOR[t]}}>{TYPE_ICON[t]} {t}</b> · {LEGEND[t]}</p>)}</div>);
}
function ListItem({p,rank,open,onToggle,onDelete}){
  return (<div className="rounded-2xl p-4" style={{background:C.panel,border:`1px solid ${open?TYPE_COLOR[p.type]:C.line}`}}>
    <button onClick={onToggle} className="w-full flex items-center gap-3 text-left">
      <span className="text-sm w-5 text-center font-bold" style={{color:rank<3?C.gold:C.faint}}>{rank+1}</span>
      <span className="w-9 h-9 rounded-full flex items-center justify-center font-mono text-xs font-bold text-white" style={{background:TYPE_COLOR[p.type]}}>{p.mbti.slice(0,2)}</span>
      <span className="flex-1"><span className="block text-sm font-bold" style={{color:C.ink}}>{p.name} <span className="font-normal" style={{color:C.faint}}>· {p.mbti}</span></span>
        <span className="block text-xs" style={{color:TYPE_COLOR[p.type]}}>{TYPE_ICON[p.type]} {p.type} · {NICK[p.mbti]}형</span></span>
      <span className="font-serif text-2xl" style={{color:C.gold}}>{p.chemi}</span></button>
    <p className="text-sm leading-relaxed mt-2" style={{color:C.ink}}>{ONE[p.type]}</p>
    {open&&(<div className="mt-3 pt-3" style={{borderTop:`1px solid ${C.line}`}}>
      <div className="flex gap-1.5 mb-3">{DOM_ORDER.map(k=>(
        <div key={k} className="flex-1 text-center rounded-lg py-1.5" style={{background:C.panel2}}><div className="text-xs" style={{color:C.faint}}>{k}</div>
          <div className="font-mono text-sm font-bold" style={{color:C.ink}}>{p.scores[k]}</div></div>))}</div>
      <p className="text-sm leading-relaxed mb-3" style={{color:C.sub}}><b style={{color:C.red}}>조심할 점 · </b>{CARE[p.type]}</p>
      <button onClick={onDelete} className="text-xs" style={{color:C.faint}}>지도에서 지우기</button></div>)}</div>);
}
function MapScreen({owner,connections,onSelectLog,onDelete,onShare,onAdd,onExplain,onPrompt}){
  const nodes=layout(owner.axes,connections); const [selected,setSelected]=useState(null);
  return (<div className="mx-auto max-w-md px-4 py-6">
    <style>{`.orbit-node{animation:floaty 6s ease-in-out infinite}.orbit-node:nth-child(2n){animation-duration:7.5s}.orbit-node:nth-child(3n){animation-duration:5.5s}@keyframes floaty{0%,100%{transform:translateY(0)}50%{transform:translateY(-0.6px)}}`}</style>
    <OrbitMap nodes={nodes} selected={selected} me={owner.name} onSelect={n=>setSelected(selected===n?null:n)}/>
    <Counts nodes={nodes}/><ExplainBox onOpen={onExplain}/>
    <div className="flex items-center justify-between mt-4 mb-2"><h2 className="text-base font-bold" style={{color:C.ink}}>MBTI 케미 · 잘 맞는 순</h2>
      <span className="text-xs" style={{color:C.faint}}>이름을 누르면 조심할 점도 나와요</span></div>
    {nodes.length===0 ? (<div className="rounded-2xl p-6 text-center" style={{background:C.panel,border:`1px dashed ${C.line}`}}><p className="text-sm" style={{color:C.sub}}>아직 아무도 없어요. 친구에게 공유하면 여기에 케미가 쌓여요.</p></div>) : (
    <div className="space-y-2">{nodes.map((p,i)=>(<ListItem key={p.name} p={p} rank={i} open={selected===p.name}
      onToggle={()=>{const ns=selected===p.name?null:p.name; setSelected(ns); if(ns) onSelectLog(p);}} onDelete={()=>onDelete(p.name)}/>))}</div>)}
    <LegendBox/>
    <div className="rounded-2xl p-4 mt-4 text-center" style={{background:C.panel2,border:`1px dashed ${C.gold}`}}>
      <p className="text-sm font-semibold mb-1" style={{color:C.ink}}>🧡 친구에게 공유해보세요</p>
      <p className="text-xs mb-3" style={{color:C.sub}}>친구가 MBTI만 넣으면 {owner.name}님과 어떤 케미인지 지도에 나타나요.<br/>지금 {nodes.length}명이 올라왔어요.</p>
      <Btn onClick={onShare}>링크 공유하기</Btn>
      <div className="h-2"/><Btn kind="ghost" onClick={onAdd}>친구 입장에서 참여해보기 (데모)</Btn></div>
    <div className="h-2"/><button onClick={onPrompt} className="w-full rounded-xl py-4 text-sm font-bold" style={{background:C.panel2,color:C.indigo,border:`1px solid ${C.indigo}`}}>🔎 내 성향 상세 분석 프롬프트 복사</button>
    <p className="text-center text-xs mt-5" style={{color:C.faint}}>재미로 보는 MBTI 케미 · 재미로만 즐겨주세요!</p></div>);
}

/* ═══ 화면: /add 게스트 합류 ═══ */
function AddScreen({owner,onSubmit,onBack,guest,onMakeMine}){
  const [name,setName]=useState(""); const [d,setD]=useState({ei:"",sn:"",tf:"",jp:""}); const [result,setResult]=useState(null);
  const mbti=`${d.ei}${d.sn}${d.tf}${d.jp}`; const full=mbti.length===4&&STACK[mbti];
  const Row=({field,left,right})=>(<div className="flex gap-2 mb-2">{[left,right].map(([lab,v])=>(
    <button key={v} onClick={()=>setD({...d,[field]:v})} className="flex-1 rounded-xl py-2.5 text-sm font-semibold"
      style={{background:d[field]===v?C.navy:C.panel2,color:d[field]===v?"#FBF6EC":C.sub,border:`1px solid ${C.line}`}}>{lab}</button>))}</div>);
  const submit=()=>{ if(!(name.trim()&&full))return; const gaxes=t2a(mbti); const r={name:name.trim(),mbti,gaxes,...chemi(owner.axes,gaxes)}; setResult(r); onSubmit(r); };
  const ownerInf=STACK[owner.mbti][3];
  return (<div className="mx-auto max-w-md px-4 py-6">
    <div className="rounded-3xl p-6 mb-5 text-center" style={{background:C.panel,border:`1px solid ${C.line}`,boxShadow:"0 2px 8px rgba(44,40,35,0.06)"}}>
      <p className="text-sm mb-1" style={{color:C.faint}}>{owner.name}님의 관계 지도</p>
      <h1 className="font-serif text-2xl mb-1" style={{color:C.ink}}>🧭 {NICK[owner.mbti]}형</h1>
      <p className="text-sm mb-3" style={{color:C.sub}}>{FLOW[owner.mbti]}</p>
      <p className="text-sm leading-relaxed" style={{color:C.faint}}>🎯 {owner.name}님은 {ROLE[ownerInf]} 쪽이 약한 편이라, 그걸 채워주는 사람이 특히 귀해요.</p></div>
    {result?(<div className="rounded-3xl p-6" style={{background:C.panel,border:`1px solid ${C.line}`}}>
      <p className="text-sm mb-1" style={{color:C.faint}}>{result.name} · {result.mbti}</p>
      <div className="flex items-end gap-2 mb-1"><span className="font-serif leading-none" style={{fontSize:56,color:C.gold}}>{result.chemi}</span>
        <span className="mb-2 text-sm px-2 py-0.5 rounded-full" style={{background:C.panel2,color:C.indigo,border:`1px solid ${C.line}`}}>{result.type}</span></div>
      <p className="text-sm leading-relaxed mb-4" style={{color:C.ink}}>{ONE[result.type]}</p>
      <div className="space-y-2 mb-4">{DOM_ORDER.map(k=><DomBar key={k} k={k} v={result.scores[k]}/>)}</div>
      <p className="text-sm leading-relaxed mb-4" style={{color:C.sub}}><b style={{color:C.red}}>조심할 점 · </b>{CARE[result.type]}</p>
      <p className="text-sm mb-3" style={{color:C.sub}}>{owner.name}님 지도에 올라갔어요.</p>
      {guest?(<><Btn onClick={onMakeMine}>🔎 내 케미 지도 만들어보기</Btn><p className="text-center text-xs mt-2" style={{color:C.faint}}>{owner.name}님이 내 지도에도 자동으로 올라가 있어요</p></>):(<Btn onClick={onBack}>지도로 돌아가기</Btn>)}</div>):(
    <div className="rounded-3xl p-5" style={{background:C.panel,border:`1px solid ${C.line}`}}>
      <h2 className="text-base font-bold mb-1" style={{color:C.ink}}>🙋 나는 {owner.name}님에게 어떤 사람일까?</h2>
      <p className="text-sm mb-4" style={{color:C.sub}}>내 MBTI만 고르면 케미가 바로 나와요.</p>
      <input value={name} onChange={e=>setName(e.target.value)} placeholder="이름 또는 별명"
        className="w-full rounded-xl px-4 py-3 mb-4 text-sm outline-none" style={{background:C.panel2,color:C.ink,border:`1px solid ${C.line}`}}/>
      <Row field="ei" left={["E · 외향","E"]} right={["I · 내향","I"]}/><Row field="sn" left={["N · 직관","N"]} right={["S · 감각","S"]}/>
      <Row field="tf" left={["T · 사고","T"]} right={["F · 감정","F"]}/><Row field="jp" left={["J · 계획","J"]} right={["P · 즉흥","P"]}/>
      <div className="mt-4"><Btn onClick={submit} disabled={!(name.trim()&&full)}>지도에 이름 올리기</Btn></div></div>)}
    {result&&(<><ExplainBox/><LegendBox/></>)}
    <p className="text-center text-xs mt-5" style={{color:C.faint}}>재미로 보는 MBTI 케미 · 재미로만 즐겨주세요!</p></div>);
}

/* ═══ 상단 네비게이션 ═══ */
function NavBar({active,onGo}){
  const tabs=[["card","내 성향"],["map","MBTI 케미"]];
  return (<div className="sticky top-0 z-30" style={{background:C.bg,borderBottom:`1px solid ${C.line}`}}>
    <div className="mx-auto max-w-md px-4 py-2 flex gap-2">{tabs.map(([k,label])=>(
      <button key={k} onClick={()=>onGo(k)} className="flex-1 rounded-xl py-2 text-sm font-bold transition-colors"
        style={{background:active===k?C.navy:"transparent",color:active===k?"#FBF6EC":C.sub,border:`1px solid ${active===k?C.navy:C.line}`}}>{label}</button>))}</div></div>);
}

/* ═══ 개발용 로그 패널 ═══ */
function LogPanel({events,onClose,onClear,onReset}){
  return (<div className="fixed inset-0 z-50 flex items-end" style={{background:"rgba(0,0,0,0.4)"}} onClick={onClose}>
    <div className="w-full overflow-auto rounded-t-3xl p-4" style={{background:C.panel,maxHeight:"70vh"}} onClick={e=>e.stopPropagation()}>
      <div className="flex items-center justify-between mb-3"><span className="text-sm font-bold" style={{color:C.ink}}>세션 로그 · {events.length}건</span>
        <div className="flex gap-2"><button onClick={onReset} className="text-xs px-2 py-1 rounded" style={{color:"#FBF6EC",background:C.red}}>처음부터(전체 리셋)</button><button onClick={onClear} className="text-xs px-2 py-1 rounded" style={{color:C.red}}>로그만 지우기</button>
          <button onClick={onClose} className="text-xs px-2 py-1 rounded" style={{color:C.faint}}>닫기</button></div></div>
      {[...events].reverse().map((e,i)=>(<div key={i} className="text-xs font-mono py-1" style={{color:C.sub,borderBottom:`1px solid ${C.line}`}}>
        <span style={{color:C.indigo}}>{e.event}</span> <span style={{color:C.faint}}>{new Date(e.ts).toLocaleTimeString()}</span>
        {Object.keys(e).filter(k=>k!=="event"&&k!=="ts").length>0&&<span> · {JSON.stringify(Object.fromEntries(Object.entries(e).filter(([k])=>k!=="event"&&k!=="ts")))}</span>}</div>))}</div></div>);
}

/* ═══ 루트 ═══ */
export default function App(){
  const [step,_setStep]=useState("landing");
  const setStep=(s)=>{ _setStep(s); if((s==="card"||s==="map")) sset(K.last,s); };
  const [name,setName]=useState(""); const [d,setD]=useState({ei:"",sn:"",tf:"",jp:""});
  const [owner,setOwner]=useState(null); const [tested,setTested]=useState(false);
  const [connections,setConnections]=useState([]); const [events,setEvents]=useState([]);
  const [showLog,setShowLog]=useState(false); const [ready,setReady]=useState(false);
  const [mode,setMode]=useState("owner"); const [targetOwner,setTargetOwner]=useState(null);
  const [toast,setToast]=useState(""); const [guestId,setGuestId]=useState(null); const [helpOpen,setHelpOpen]=useState(false);
  const [devMode] = useState(()=> (typeof location!=="undefined") && new URLSearchParams(location.search).get("debug")==="1");
  const q=(id)=> "?owner="+id+(devMode?"&debug=1":"");

  const track=useCallback((event,props={})=>{ amp(event,props); ga(event,props); setEvents(prev=>{ const ev={event,ts:Date.now(),...props}; const next=[...prev,ev].slice(-100); sset(K.log,next); return next; }); },[]);

  useEffect(()=>{ (async()=>{
    const lg=await sget(K.log); if(lg) setEvents(lg);
    const params=(typeof location!=="undefined")?new URLSearchParams(location.search):new URLSearchParams();
    const ownerParam=params.get("owner"); const refSrc=params.get("src")||null; const refSid=params.get("sid")||null;
    const myId=await sget(K.myid);
    track("session_start",{returning:!!myId,src:refSrc,sid:refSid});
    const restore=async(oid,asOwner)=>{ const m=await apiGet(`/api/map?owner=${oid}`); if(!(m&&m.owner))return false;
      if(asOwner){ const o={...m.owner,id:oid}; setOwner(o); setName(o.name||""); setConnections(m.connections||[]); sset(K.owner,o); sset(K.conn,m.connections||[]);
        if(typeof history!=="undefined") history.replaceState(null,"",q(oid));
        const last=await sget(K.last); setReady(true); _setStep(last==="card"?"card":"map"); track((last==="card"?"card_view":"map_view"),{returning:true}); }
      else { setTargetOwner({...m.owner,id:oid}); setConnections(m.connections||[]); setMode("guest"); setReady(true); track("add_view",{owner:oid,src:refSrc,sid:refSid}); setStep("add"); }
      return true; };
    // 남의 지도 링크 → 게스트 (초대 링크는 절대 내 지도로 튕기지 않음)
    if(ownerParam && ownerParam!==myId){ if(await restore(ownerParam,false)) return;
      setReady(true); track("landing_view",{src:refSrc,sid:refSid}); return; }
    // 내 지도 복귀 (내 링크로 왔거나 기본 주소지만 내 id 저장됨)
    const myOid=(ownerParam && ownerParam===myId)?ownerParam:myId;
    if(myOid){ if(await restore(myOid,true)) return; }
    // 백엔드 실패 시 로컬 폴백
    const o=await sget(K.owner), cs=await sget(K.conn);
    if(o){ setOwner(o); setName(o.name||""); if(cs) setConnections(cs); const last=await sget(K.last); setReady(true); _setStep(last==="card"?"card":"map"); track((last==="card"?"card_view":"map_view"),{returning:true}); return; }
    setReady(true); track("landing_view",{src:refSrc,sid:refSid});
  })(); },[]);

  const makeOwner=async(mbti,axes,isTested)=>{ const base={name:name.trim()||"나",mbti,axes};
    const res=await apiPost("/api/owner",base); const id=(res&&res.ownerId)||uid(); const o={...base,id};
    setOwner(o); sset(K.owner,o); sset(K.myid,id); setTested(isTested);
    if(res && res.ownerId && typeof history!=="undefined") history.replaceState(null,"",q(id));
    track("card_view",{mbti,tested:isTested}); setStep("card"); };
  const finishTest=(v)=>{ track("test_complete",{type:tfa(v)}); makeOwner(tfa(v),v,true); };
  const direct=(t)=>{ track("direct_pick",{type:t}); makeOwner(t,t2a(t),false); };
  const goSynergy=()=>{ track("map_view",{n:connections.length}); setStep("map"); };
  const addConn=async(r)=>{ const next=[...connections.filter(c=>c.name!==r.name),r]; setConnections(next); sset(K.conn,next);
    const oid=(mode==="guest"?(targetOwner&&targetOwner.id):(owner&&owner.id));
    if(oid){ const gExisting=await sget(K.myid);
      const resp=await apiPost("/api/connection",{owner:oid,conn:r,guestOwnerId:gExisting||null,guestSelf:(mode==="guest"?{axes:r.gaxes||null}:null)});
      if(mode==="guest" && resp && resp.guestOwnerId){ sset(K.myid,resp.guestOwnerId); setGuestId(resp.guestOwnerId); } }
    track("add_submit",{mbti:r.mbti,chemi:r.chemi}); };
  const delConn=(nm)=>{ const next=connections.filter(c=>c.name!==nm); setConnections(next); sset(K.conn,next); track("connection_delete",{}); };
  const share=async(surface)=>{ const oid=owner&&owner.id; const {url,sid}=buildShareUrl(oid,"link");
    track("share_click",{surface,sid});
    try{ if(typeof navigator!=="undefined"&&navigator.clipboard){ await navigator.clipboard.writeText(url); }
      else if(typeof window!=="undefined"&&window.prompt){ window.prompt("이 링크를 복사하세요", url); } }catch(e){}
    setToast("링크를 복사했어요!"); setTimeout(()=>setToast(""),2000); track("share_done",{surface,sid}); };
  const copyPrompt=async(surface)=>{ const who=(mode==="guest"?targetOwner:owner); if(!who)return;
    const text=buildPrompt(who.mbti, who.axes, who.name); track("prompt_copy",{surface,mbti:who.mbti});
    try{ if(typeof navigator!=="undefined"&&navigator.clipboard){ await navigator.clipboard.writeText(text); }
      else if(typeof window!=="undefined"&&window.prompt){ window.prompt("프롬프트를 복사하세요", text); } }catch(e){}
    setToast("프롬프트를 복사했어요! ChatGPT·Claude에 붙여넣어 보세요"); setTimeout(()=>setToast(""),2600); };
  const clearAll=()=>{ setEvents([]); sset(K.log,[]); };
  const resetAll=()=>{ try{ Object.values(K).forEach(k=>{ if(hasLS) window.localStorage.removeItem(k); }); }catch{}
    setEvents([]); setOwner(null); setTargetOwner(null); setConnections([]); setGuestId(null); setTested(false); setMode("owner"); setName(""); setD({ei:"",sn:"",tf:"",jp:""}); setShowLog(false);
    if(typeof history!=="undefined") history.replaceState(null,"",location.pathname+"?debug=1"); _setStep("landing"); track("debug_reset",{}); };

  if(!ready) return <div className="min-h-screen" style={{background:C.bg}}/>;
  return (<div className="min-h-screen w-full" style={{background:C.bg,color:C.ink}}>
    {step==="landing"&&<Landing name={name} setName={setName} d={d} setD={setD} onTest={()=>{track("test_start");setStep("test");}} onDirect={direct}/>}
    {step==="test"&&<Test onDone={finishTest} onAnswer={(q,v)=>track("quiz_answer",{q,v})}/>}
    {(step==="card"||step==="map")&&owner&&mode!=="guest"&&<NavBar active={step} onGo={(k)=>{ if(k==="map"){track("map_view",{n:connections.length});} else {track("card_view",{mbti:owner.mbti,tested});} setStep(k); }}/>}
    {step==="card"&&owner&&<Card name={owner.name} mbti={owner.mbti} axes={owner.axes} tested={tested} onShare={()=>share("card")} onPrompt={()=>copyPrompt("card")} onSynergy={goSynergy} onTest={()=>{track("nudge_test_click");setStep("test");}}/>}
    {step==="map"&&owner&&<MapScreen owner={owner} connections={connections} onSelectLog={p=>track("connection_open",{mbti:p.mbti,chemi:p.chemi})} onDelete={delConn} onShare={()=>share("map")} onPrompt={()=>copyPrompt("map")} onExplain={()=>track("explain_open")} onAdd={()=>{track("add_view");setStep("add");}}/>}
    {step==="add"&&(mode==="guest"?targetOwner:owner)&&<AddScreen owner={mode==="guest"?targetOwner:owner} guest={mode==="guest"} onSubmit={addConn}
      onMakeMine={async()=>{ track("guest_make_own",{}); const gid=guestId||await sget(K.myid);
        if(gid){ const mine=await apiGet(`/api/map?owner=${gid}`);
          if(mine&&mine.owner){ const o={...mine.owner,id:gid}; setOwner(o); setName(o.name||""); setConnections(mine.connections||[]); sset(K.owner,o); sset(K.conn,mine.connections||[]);
            if(typeof history!=="undefined") history.replaceState(null,"",q(gid));
            setMode("owner"); setTargetOwner(null);
            if(o.axes){ setTested(false); setStep("card"); } else { setStep("map"); } return; } }
        setMode("owner"); setTargetOwner(null); setConnections([]); setOwner(null); setStep("landing"); }}
      onBack={()=> mode==="guest" ? (track("guest_make_own",{}),setMode("owner"),setTargetOwner(null),setConnections([]),setOwner(null),setStep("landing")) : setStep("map")}/>}
    {toast&&(<div className="fixed left-1/2 bottom-16 -translate-x-1/2 px-4 py-2 rounded-full text-sm z-50" style={{background:C.ink,color:C.bg}}>{toast}</div>)}
    <button onClick={()=>{setHelpOpen(true);track("help_open",{});}} aria-label="문의하기"
      className="fixed right-3 top-3 z-40 w-9 h-9 rounded-full flex items-center justify-center text-lg font-bold"
      style={{background:C.panel,color:C.indigo,border:`1px solid ${C.line}`}}>?</button>
    {helpOpen&&(<div className="fixed inset-0 z-50 flex items-center justify-center p-3" style={{background:"rgba(44,40,35,0.5)"}} onClick={()=>setHelpOpen(false)}>
      <div className="w-full max-w-md rounded-3xl overflow-hidden" style={{background:C.panel,border:`1px solid ${C.line}`}} onClick={e=>e.stopPropagation()}>
        <div className="flex items-center justify-between px-4 py-3" style={{borderBottom:`1px solid ${C.line}`}}>
          <h3 className="text-base font-bold" style={{color:C.ink}}>문의 · 의견 보내기</h3>
          <button onClick={()=>setHelpOpen(false)} className="text-sm" style={{color:C.faint}}>✕</button></div>
        <iframe title="문의 폼" src={FORM_URL} className="w-full" style={{height:"70vh",border:0,background:"#fff"}} loading="lazy">로드 중…</iframe>
      </div></div>)}
    {devMode&&<button onClick={()=>setShowLog(true)} className="fixed left-3 bottom-3 z-40 text-xs px-2 py-1 rounded-full" style={{background:C.navy,color:"#FBF6EC",opacity:0.8}}>🐞 {events.length}</button>}
    {showLog&&<LogPanel events={events} onClose={()=>setShowLog(false)} onClear={clearAll} onReset={resetAll}/>}
  </div>);
}
