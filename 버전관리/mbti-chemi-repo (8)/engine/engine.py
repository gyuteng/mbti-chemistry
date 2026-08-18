#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""psymatch 엔진 — 정적 스키마(functions/types/rules)만으로 매칭 payload를 생성.
수기 데이터 = functions 8원자 + types 16스택/해석문 + rules. 그 외 전부 계산."""

import json, itertools, sys
from pathlib import Path

BASE = Path(__file__).parent
F = json.loads((BASE / "functions.json").read_text(encoding="utf-8"))   # L1 원자
T = json.loads((BASE / "types.json").read_text(encoding="utf-8"))       # L2/L3 유형
R = json.loads((BASE / "rules.json").read_text(encoding="utf-8"))       # 규칙·문구
TYPES = list(T.keys())

# ── 파생 헬퍼 (계산) ─────────────────────────────────────────────
def poles(tp):
    """상위 2기능에서 지각극(P)·판단극(J) 추출. 항상 각 1개."""
    p = j = None
    for fn in T[tp]["stack"][:2]:
        if F[fn]["axis"] == "perceiving": p = fn
        else: j = fn
    return p, j

def ei(tp):
    """E/I = 주기능 방향."""
    return "E" if F[T[tp]["stack"][0]]["orient"] == "e" else "I"

def bucket(x, y):
    """L4·L5 통합 규칙 — 문자·방향 2비트 비교."""
    sl = F[x]["letter"] == F[y]["letter"]
    so = F[x]["orient"] == F[y]["orient"]
    if sl and so:       return "ALIGN"
    if sl and not so:   return "KIN"        # 대립축 (Ni,Ne) = L4
    if not sl and so:   return "CONTRAST"
    return "COMPLEMENT"                      # 상호작용 (Ni,Se)/(Te,Fi) = L5

def tensions(tp):
    """스택 내부 긴장 = pos1↔pos4, pos2↔pos3 (항상 COMPLEMENT). 약점 발생원."""
    s = T[tp]["stack"]
    out = []
    for a, b in [(s[0], s[3]), (s[1], s[2])]:
        out.append({"pair": [a, b], "axis": F[a]["axis"], "bucket": bucket(a, b)})
    return out

def cards(tp):
    """개인 페이지 4카드 — 위치→티어, 기능→전면/후면."""
    out = []
    for i, fn in enumerate(T[tp]["stack"], start=1):
        out.append({"pos": i, "func": fn, "tier": R["tier_by_pos"][str(i)],
                    "front": F[fn]["front"], "back": F[fn]["back"]})
    return out

def grade_of(score):
    for th, g in R["grade"]:
        if score >= th: return g
    return "C"

# ── 테스트 채점: 응답 → 부호·강도 벡터 ─────────────────────────
Q = json.loads((BASE / "questions.json").read_text(encoding="utf-8"))

def score_vector(responses):
    """responses: {item_id: 1..5}. 지표별 raw → p∈[-1,1] (문항수×2로 정규화)."""
    raw = {ax: 0 for ax in Q["axes"]}
    cnt = {ax: 0 for ax in Q["axes"]}
    for it in Q["items"]:
        cnt[it["axis"]] += 1
        r = responses.get(it["id"])
        if r is None: continue
        raw[it["axis"]] += it["dir"] * (r - Q["scale"]["center"])   # dir·(r-3)
    axes = {ax: round(raw[ax] / (cnt[ax] * 2), 3) for ax in raw}    # 최대 ±(문항수×2)
    letters = ("E" if axes["EI"] >= 0 else "I") + ("N" if axes["NS"] >= 0 else "S") \
            + ("T" if axes["TF"] >= 0 else "F") + ("J" if axes["JP"] >= 0 else "P")
    clarity = {ax: round(abs(v) * 100) for ax, v in axes.items()}    # 선호 뚜렷함 %
    return {"axes": axes, "type": letters, "clarity": clarity}

def type_from_axes(axes):
    return ("E" if axes["EI"] >= 0 else "I") + ("N" if axes["NS"] >= 0 else "S") \
         + ("T" if axes["TF"] >= 0 else "F") + ("J" if axes["JP"] >= 0 else "P")

def chemi_from_vectors(va, vb):
    """부호로 버킷 결정 + 강도로 기여를 중립(50)에서 연속 조절 → 연속 케미."""
    ta, tb = type_from_axes(va), type_from_axes(vb)
    pa, ja = poles(ta); pb, jb = poles(tb)
    bp, bj = bucket(pa, pb), bucket(ja, jb)
    D = R["domains"]
    wP = (abs(va["NS"]) + abs(vb["NS"])) / 2     # 지각(N/S) 선호 강도 평균
    wJ = (abs(va["TF"]) + abs(vb["TF"])) / 2     # 판단(T/F) 선호 강도 평균
    o = {}
    for lab in D["labels"]:
        cp = 50 + (D["by_bucket"][bp][lab] - 50) * wP   # 약한 선호일수록 중립으로 수렴
        cj = 50 + (D["by_bucket"][bj][lab] - 50) * wJ
        o[lab] = (cp + cj) / 2
    ea = "E" if va["EI"] >= 0 else "I"; eb = "E" if vb["EI"] >= 0 else "I"
    wE = (abs(va["EI"]) + abs(vb["EI"])) / 2
    if ea != eb: o["보완"] = min(100, o["보완"] + 6 * wE)
    else:        o["이해"] = min(100, o["이해"] + 6 * wE)
    w = D["composite"]
    comp = (o["이해"]*w["이해"] + o["보완"]*w["보완"] + o["자율"]*w["자율"] + (100-o["긴장"])*w["긴장_inv"])
    disp = round(D["display_curve"]["base"] + comp * D["display_curve"]["scale"])
    tlab = max(D["labels"], key=lambda l: o[l])
    return {"scores": {k: round(v) for k, v in o.items()}, "chemi": disp,
            "type": ta, "guestType": tb, "compatType": D["type_label"][tlab]}

# ── 4영역 점수 (이해·보완·긴장·자율) ────────────────────────────
def domains(a, b):
    pa, ja = poles(a); pb, jb = poles(b)
    D = R["domains"]
    bp, bj = bucket(pa, pb), bucket(ja, jb)
    out = {}
    for lab in D["labels"]:
        out[lab] = (D["by_bucket"][bp][lab] + D["by_bucket"][bj][lab]) / 2
    mode = "mixed" if ei(a) != ei(b) else "same"
    for lab, add in D["energy_adjust"][mode].items():
        out[lab] = min(100, out[lab] + add)
    w = D["composite"]
    comp = (out["이해"]*w["이해"] + out["보완"]*w["보완"]
            + out["자율"]*w["자율"] + (100-out["긴장"])*w["긴장_inv"])
    disp = round(D["display_curve"]["base"] + comp * D["display_curve"]["scale"])
    tlab = max(D["labels"], key=lambda l: out[l])
    return {"scores": {k: round(v) for k, v in out.items()},
            "chemi": disp, "type": D["type_label"][tlab],
            "type_desc": D["type_desc"][D["type_label"][tlab]]}

# ── 매칭 ────────────────────────────────────────────────────────
def match(a, b):
    pa, ja = poles(a); pb, jb = poles(b)
    reactions = []
    for order, (axis, x, y) in enumerate([("perceiving", pa, pb), ("judging", ja, jb)], 1):
        bk = bucket(x, y)
        bd = R["buckets"][bk]
        tpl = R["templates"][f"{axis}.{bk}"]
        reactions.append({
            "order": order, "axis": axis, "a": x, "b": y, "bucket": bk,
            "synergy": bd["synergy"], "friction": bd["friction"],
            "line": bd["line"], "synergyText": tpl["synergy"], "cautionText": tpl["caution"],
        })
    ea, eb = ei(a), ei(b)
    mode = "mixed" if ea != eb else "same"
    bonus = R["energy"][mode]
    score = round((reactions[0]["synergy"] + reactions[1]["synergy"]) / 2 + bonus)
    dom = domains(a, b)
    # 가장 마찰 큰 축을 대표 주의 카드로
    worst = max(reactions, key=lambda r: r["friction"])
    best  = max(reactions, key=lambda r: r["synergy"])
    return {
        "matchId": f"{a.lower()}_x_{b.lower()}",
        "score": score, "grade": grade_of(score),
        "chemi": dom["chemi"], "compatType": dom["type"],
        "compatDesc": dom["type_desc"], "domains": dom["scores"],
        "people": [
            {"slot": "A", "type": a, "rarity": T[a]["rarity"], "cards": cards(a)},
            {"slot": "B", "type": b, "rarity": T[b]["rarity"], "cards": cards(b)},
        ],
        "reactions": reactions,
        "energy": {"a": ea, "b": eb, "mode": mode, "bonus": bonus},
        "verdict": {
            "synergyCard": {"title": best["synergyText"],
                            "body": f"{best['a']}·{best['b']} — {R['buckets'][best['bucket']]['line']['style']}"},
            "cautionCard": {"title": worst["cautionText"],
                            "body": f"{worst['a']}·{worst['b']} 충돌 (마찰 {worst['friction']})"},
        },
    }

# ── 출력 루틴 ───────────────────────────────────────────────────
def show_payload(a, b):
    print(f"\n{'='*60}\n[샘플 payload] {a} × {b}\n{'='*60}")
    print(json.dumps(match(a, b), ensure_ascii=False, indent=2))

def matrix():
    print(f"\n{'='*60}\n[16×16 점수 매트릭스]\n{'='*60}")
    print("     " + " ".join(f"{t[:4]:>4}" for t in TYPES))
    for a in TYPES:
        row = " ".join(f"{match(a, b)['score']:>4}" for b in TYPES)
        print(f"{a:>4} {row}")

def synergy_ranking(n=10):
    pairs = [(a, b, match(a, b)) for a, b in itertools.combinations(TYPES, 2)]
    pairs.sort(key=lambda x: -x[2]["score"])
    print(f"\n{'='*60}\n[시너지 상위 {n}쌍]\n{'='*60}")
    for a, b, m in pairs[:n]:
        r = m["reactions"]
        print(f"  {m['score']}({m['grade']}) {a}×{b:<4} | "
              f"P:{r[0]['a']}·{r[0]['b']} {r[0]['bucket']:<10} "
              f"J:{r[1]['a']}·{r[1]['b']} {r[1]['bucket']:<10} E:{m['energy']['mode']}")
    print(f"\n[상극 하위 5쌍]")
    for a, b, m in pairs[-5:]:
        r = m["reactions"]
        print(f"  {m['score']}({m['grade']}) {a}×{b:<4} | "
              f"P:{r[0]['bucket']:<10} J:{r[1]['bucket']:<10} → 주의: {r[1]['cautionText'][:30]}")

def synergy_detail(a, b):
    m = match(a, b)
    print(f"\n{'='*60}\n[시너지 조합 상세] {a} × {b} = {m['score']}점 ({m['grade']})\n{'='*60}")
    for r in m["reactions"]:
        print(f"  {r['axis']:<10} {r['a']} ─{r['line']['style']:>9}({r['line']['color']})─ {r['b']}"
              f"  [{r['bucket']}] 시너지{r['synergy']}/마찰{r['friction']}")
        print(f"             ✓ {r['synergyText']}")
        print(f"             ⚠ {r['cautionText']}")
    e = m["energy"]
    print(f"  energy     {e['a']}+{e['b']} = {e['mode']} (보정 +{e['bonus']})")

# ── 검증 ────────────────────────────────────────────────────────
def validate():
    print(f"\n{'='*60}\n[검증]\n{'='*60}")
    ok = True
    def check(name, cond, extra=""):
        nonlocal ok
        ok = ok and cond
        print(f"  [{'PASS' if cond else 'FAIL'}] {name} {extra}")

    # 1) 극 추출: 모든 유형이 P·J 정확히 1개씩
    good = all(None not in poles(t) for t in TYPES)
    check("극 추출 — 전 유형 P·J 각 1개", good)

    # 2) 대칭성
    sym = all(match(a, b)["score"] == match(b, a)["score"] for a, b in itertools.combinations(TYPES, 2))
    check("점수 대칭 score(A,B)=score(B,A)", sym)

    # 3) 앵커: INTJ×ENFP = 88
    v = match("INTJ", "ENFP")["score"]
    check("앵커 INTJ×ENFP", v == 88, f"= {v}")

    # 4) 점수 범위 [40,98]
    allsc = [match(a, b)["score"] for a in TYPES for b in TYPES]
    rng = min(allsc), max(allsc)
    check("점수 범위 40~98", 40 <= rng[0] and rng[1] <= 98, f"= {rng}")

    # 5) 동일유형쌍 = 55 (ALIGN/ALIGN, same E/I)
    self55 = all(match(t, t)["score"] == 55 for t in TYPES)
    check("동일유형쌍 = 55", self55)

    # 6) 버킷 규칙 결정성 (문자·방향 → 유일 버킷)
    fns = list(F.keys())
    det = all(bucket(x, y) == bucket(y, x) for x in fns for y in fns)
    check("버킷 규칙 대칭·결정적", det)

    # 7) 스택 내부 긴장 = 항상 COMPLEMENT (L5)
    l5 = all(t2["bucket"] == "COMPLEMENT" for t in TYPES for t2 in tensions(t))
    check("스택 내부 긴장 = COMPLEMENT (L5)", l5)

    # 8) boost = 주기능의 complement
    bo = all(F[T[t]["stack"][0]]["complement"] for t in TYPES)
    check("boost 파생 가능(주기능 complement)", bo)

    print(f"\n  => {'전체 통과' if ok else '실패 존재'}")
    return ok

def domain_demo(owner, guests):
    """나(owner) 중심 관계 지도 — 게스트들을 케미순으로 나래비."""
    print(f"\n{'='*60}\n[나 중심 관계 지도] 나 = {owner}\n{'='*60}")
    rows = [(g, domains(owner, g)) for g in guests]
    rows.sort(key=lambda x: -x[1]["chemi"])
    for g, d in rows:
        s = d["scores"]
        print(f"  케미 {d['chemi']}  {g:<4} [{d['type']}]  "
              f"이해{s['이해']:>3} 보완{s['보완']:>3} 긴장{s['긴장']:>3} 자율{s['자율']:>3}")

def domain_checks():
    print(f"\n[4영역 검증]")
    for a, b in [("INTJ","ENFP"),("INTJ","INTJ"),("INTJ","ISFJ"),("INTJ","ESFP")]:
        d = domains(a, b)
        print(f"  {a}×{b:<4} 케미{d['chemi']:>3} [{d['type']}] {d['scores']}")

def test_demo():
    print(f"\n{'='*60}\n[테스트 채점 → 벡터 → 케미]\n{'='*60}")
    # 강한 INTJ 응답 (정방향 5/역방향 1 등으로 극단)
    strong_intj = {"EI1":1,"EI2":1,"EI3":5,"EI4":5,"NS1":5,"NS2":5,"NS3":1,"NS4":1,
                   "TF1":5,"TF2":5,"TF3":1,"TF4":1,"JP1":5,"JP2":5,"JP3":1,"JP4":1}
    strong_enfp = {"EI1":5,"EI2":5,"EI3":1,"EI4":1,"NS1":5,"NS2":5,"NS3":1,"NS4":1,
                   "TF1":1,"TF2":1,"TF3":5,"TF4":5,"JP1":1,"JP2":1,"JP3":5,"JP4":5}
    # 미온적 ENFP (T/F·J/P 애매)
    mild_enfp  = {"EI1":4,"EI2":4,"EI3":2,"EI4":2,"NS1":5,"NS2":5,"NS3":1,"NS4":1,
                  "TF1":3,"TF2":3,"TF3":4,"TF4":4,"JP1":3,"JP2":3,"JP3":4,"JP4":3}
    va = score_vector(strong_intj); vb = score_vector(strong_enfp); vc = score_vector(mild_enfp)
    print(f"  A 채점: {va['type']} axes={va['axes']} clarity={va['clarity']}")
    print(f"  B 채점: {vb['type']} axes={vb['axes']}")
    print(f"  C 채점: {vc['type']} axes={vc['axes']} (T/F·J/P 미온적)")
    r1 = chemi_from_vectors(va["axes"], vb["axes"])
    r2 = chemi_from_vectors(va["axes"], vc["axes"])
    d0 = domains("INTJ", "ENFP")
    print(f"  강한 INTJ×강한 ENFP  케미 {r1['chemi']} [{r1['compatType']}] {r1['scores']}")
    print(f"  (유형만 쓰는 기존 엔진 domains(INTJ,ENFP) 케미 {d0['chemi']} [{d0['type']}] {d0['scores']})  ← 강한 선호면 일치")
    print(f"  강한 INTJ×미온 ENFP  케미 {r2['chemi']} [{r2['compatType']}] {r2['scores']}  ← 강도 낮으니 연속 하락")

if __name__ == "__main__":
    show_payload("INTJ", "ENFP")
    synergy_ranking(10)
    domain_demo("INTJ", ["ENFP","INTJ","ISFJ","ESFP","ENTP","INFJ","ESTJ"])
    domain_checks()
    test_demo()
    validate()
