"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

const PRESETS = [
  { label: "1分", seconds: 60 },
  { label: "3分", seconds: 180 },
  { label: "5分", seconds: 300 },
  { label: "10分", seconds: 600 },
];

function formatTime(totalSeconds: number) {
  const safe = Math.max(0, totalSeconds);
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export default function Home() {
  const [duration, setDuration] = useState(180);
  const [remaining, setRemaining] = useState(180);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!isRunning) return;

    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          setIsFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const handleStart = () => {
    if (remaining === 0) return;
    setIsFinished(false);
    setIsRunning(true);
  };

  const handlePause = () => setIsRunning(false);

  const handleReset = () => {
    setIsRunning(false);
    setIsFinished(false);
    setRemaining(duration);
  };

  const handlePreset = (seconds: number) => {
    setIsRunning(false);
    setIsFinished(false);
    setDuration(seconds);
    setRemaining(seconds);
  };

  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50 px-6 py-16 font-sans dark:bg-black">
      <main className="flex w-full max-w-md flex-col items-center gap-10">
        <header className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
            シンプルタイマー
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            プリセットを選んで Start を押してください
          </p>
        </header>

        <div
          className={`flex h-56 w-56 items-center justify-center rounded-full border-4 transition-colors ${
            isFinished
              ? "border-red-500 bg-red-50 dark:bg-red-950/30"
              : "border-zinc-900 bg-white dark:border-zinc-100 dark:bg-zinc-900"
          }`}
          aria-live="polite"
        >
          <span className="font-mono text-5xl font-semibold tabular-nums text-black dark:text-zinc-50">
            {formatTime(remaining)}
          </span>
        </div>

        {isFinished && (
          <p className="text-sm font-medium text-red-600 dark:text-red-400">
            時間になりました
          </p>
        )}

        <div className="flex flex-wrap justify-center gap-2">
          {PRESETS.map((preset) => (
            <Button
              key={preset.seconds}
              variant={duration === preset.seconds ? "default" : "outline"}
              size="sm"
              onClick={() => handlePreset(preset.seconds)}
            >
              {preset.label}
            </Button>
          ))}
        </div>

        <div className="flex w-full justify-center gap-3">
          {isRunning ? (
            <Button size="lg" onClick={handlePause} className="min-w-28">
              Pause
            </Button>
          ) : (
            <Button
              size="lg"
              onClick={handleStart}
              disabled={remaining === 0}
              className="min-w-28"
            >
              Start
            </Button>
          )}
          <Button
            size="lg"
            variant="outline"
            onClick={handleReset}
            className="min-w-28"
          >
            Reset
          </Button>
        </div>
      </main>
    </div>
  );
}
