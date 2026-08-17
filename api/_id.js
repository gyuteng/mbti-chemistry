// 의존성 없는 짧은 id 생성 (nanoid 대체)
export function shortId(n = 8) {
  const abc = "abcdefghijklmnopqrstuvwxyz0123456789";
  let s = "";
  for (let i = 0; i < n; i++) s += abc[Math.floor(Math.random() * abc.length)];
  return s;
}
