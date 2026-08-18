import React from "react";
import { createRoot } from "react-dom/client";
import * as amplitude from "@amplitude/analytics-browser";
import App from "./App.jsx";

/* 백엔드 API (same-origin /api/*) */
window.__PSYMATCH_API__ = "";

/* Amplitude */
const AMP_KEY = import.meta.env.VITE_AMPLITUDE_KEY;
if (AMP_KEY) {
  amplitude.init(AMP_KEY, { defaultTracking: { sessions: true, pageViews: true } });
  window.amplitude = amplitude;
}

/* GA4 (gtag) — VITE_GA4_ID 있으면 로드. 앱 track()이 window.gtag로도 전송 */
const GA4_ID = import.meta.env.VITE_GA4_ID;
if (GA4_ID) {
  const s = document.createElement("script");
  s.async = true; s.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`;
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag("js", new Date());
  window.gtag("config", GA4_ID);
}

/* 로컬 개발용 storage 폴리필 */
if (typeof window !== "undefined" && !window.storage) {
  window.storage = {
    async get(key) { const v = localStorage.getItem(key); return v == null ? null : { key, value: v, shared: false }; },
    async set(key, value) { localStorage.setItem(key, value); return { key, value, shared: false }; },
    async delete(key) { localStorage.removeItem(key); return { key, deleted: true, shared: false }; },
    async list(prefix = "") { const keys = Object.keys(localStorage).filter((k) => k.startsWith(prefix)); return { keys, prefix, shared: false }; },
  };
}
createRoot(document.getElementById("root")).render(<React.StrictMode><App /></React.StrictMode>);
