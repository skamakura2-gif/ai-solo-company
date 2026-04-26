"use client";

import { useEffect, useRef, useState } from "react";

const PRESETS = [
  { label: "1分", seconds: 60 },
  { label: "3分", seconds: 180 },
  { label: "5分", seconds: 300 },
  { label: "10分", seconds: 600 },
  { label: "25分", seconds: 1500 },
];

function format(totalMs: number) {
  const total = Math.max(0, Math.ceil(totalMs / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function Timer() {
  const [durationMs, setDurationMs] = useState(5 * 60 * 1000);
  const [remainingMs, setRemainingMs] = useState(5 * 60 * 1000);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const endAtRef = useRef<number | null>(null);

  useEffect(() => {
    if (!running) return;
    let raf = 0;
    const tick = () => {
      if (endAtRef.current == null) return;
      const left = endAtRef.current - Date.now();
      if (left <= 0) {
        setRemainingMs(0);
        setRunning(false);
        setFinished(true);
        endAtRef.current = null;
        try {
          const ctx = new (window.AudioContext ||
            (window as unknown as { webkitAudioContext: typeof AudioContext })
              .webkitAudioContext)();
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.type = "sine";
          o.frequency.value = 880;
          o.connect(g);
          g.connect(ctx.destination);
          g.gain.setValueAtTime(0.0001, ctx.currentTime);
          g.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + 0.02);
          g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.8);
          o.start();
          o.stop(ctx.currentTime + 0.85);
        } catch {
          // ignore
        }
        return;
      }
      setRemainingMs(left);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [running]);

  const start = () => {
    if (remainingMs <= 0) return;
    endAtRef.current = Date.now() + remainingMs;
    setFinished(false);
    setRunning(true);
  };
  const pause = () => {
    setRunning(false);
    endAtRef.current = null;
  };
  const reset = () => {
    setRunning(false);
    setFinished(false);
    endAtRef.current = null;
    setRemainingMs(durationMs);
  };
  const choosePreset = (sec: number) => {
    const ms = sec * 1000;
    setDurationMs(ms);
    setRemainingMs(ms);
    setRunning(false);
    setFinished(false);
    endAtRef.current = null;
  };

  const progress = durationMs > 0 ? 1 - remainingMs / durationMs : 0;

  return (
    <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur">
      <h1 className="mb-6 text-center text-sm font-medium tracking-widest text-slate-400 uppercase">
        Countdown Timer
      </h1>

      <div
        className={`relative mb-8 flex aspect-square items-center justify-center rounded-full border border-white/10 bg-slate-950/50 transition-colors ${
          finished ? "ring-4 ring-rose-500/60" : ""
        }`}
      >
        <div
          className="absolute inset-2 rounded-full"
          style={{
            background: `conic-gradient(rgb(99 102 241) ${progress * 360}deg, rgba(255,255,255,0.05) 0deg)`,
            mask: "radial-gradient(circle, transparent 58%, #000 60%)",
            WebkitMask:
              "radial-gradient(circle, transparent 58%, #000 60%)",
          }}
        />
        <div className="relative text-center">
          <div className="font-mono text-6xl font-semibold tabular-nums">
            {format(remainingMs)}
          </div>
          {finished && (
            <div className="mt-2 text-sm font-medium text-rose-300">
              時間になりました
            </div>
          )}
        </div>
      </div>

      <div className="mb-6 flex flex-wrap justify-center gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.seconds}
            onClick={() => choosePreset(p.seconds)}
            className={`rounded-full px-3 py-1 text-xs transition ${
              durationMs === p.seconds * 1000
                ? "bg-indigo-500 text-white"
                : "bg-white/5 text-slate-300 hover:bg-white/10"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="flex justify-center gap-3">
        {!running ? (
          <button
            onClick={start}
            disabled={remainingMs <= 0}
            className="rounded-full bg-indigo-500 px-6 py-2 text-sm font-semibold text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-40"
          >
            スタート
          </button>
        ) : (
          <button
            onClick={pause}
            className="rounded-full bg-amber-500 px-6 py-2 text-sm font-semibold text-white transition hover:bg-amber-400"
          >
            一時停止
          </button>
        )}
        <button
          onClick={reset}
          className="rounded-full border border-white/15 px-6 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
        >
          リセット
        </button>
      </div>
    </div>
  );
}
