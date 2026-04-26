(() => {
  const display = document.getElementById("display");
  const status = document.getElementById("status");
  const hoursInput = document.getElementById("hours");
  const minutesInput = document.getElementById("minutes");
  const secondsInput = document.getElementById("seconds");
  const startBtn = document.getElementById("startBtn");
  const pauseBtn = document.getElementById("pauseBtn");
  const resetBtn = document.getElementById("resetBtn");
  const inputs = [hoursInput, minutesInput, secondsInput];

  let endTime = null;
  let remainingMs = 0;
  let intervalId = null;

  const pad = (n) => String(n).padStart(2, "0");

  const formatMs = (ms) => {
    const totalSec = Math.max(0, Math.ceil(ms / 1000));
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    return `${pad(h)}:${pad(m)}:${pad(s)}`;
  };

  const readInputsMs = () => {
    const h = clampInt(hoursInput.value, 0, 23);
    const m = clampInt(minutesInput.value, 0, 59);
    const s = clampInt(secondsInput.value, 0, 59);
    return ((h * 60 + m) * 60 + s) * 1000;
  };

  const clampInt = (v, min, max) => {
    const n = parseInt(v, 10);
    if (Number.isNaN(n)) return min;
    return Math.min(max, Math.max(min, n));
  };

  const render = (ms) => {
    display.textContent = formatMs(ms);
  };

  const setInputsDisabled = (disabled) => {
    inputs.forEach((i) => (i.disabled = disabled));
  };

  const tick = () => {
    const now = Date.now();
    const ms = endTime - now;
    if (ms <= 0) {
      finish();
      return;
    }
    render(ms);
  };

  const start = () => {
    if (intervalId) return;
    if (remainingMs <= 0) {
      remainingMs = readInputsMs();
    }
    if (remainingMs <= 0) {
      status.textContent = "時間を設定してください。";
      return;
    }
    endTime = Date.now() + remainingMs;
    intervalId = setInterval(tick, 200);
    setInputsDisabled(true);
    startBtn.disabled = true;
    pauseBtn.disabled = false;
    display.classList.remove("finished");
    status.textContent = "計測中…";
    render(remainingMs);
  };

  const pause = () => {
    if (!intervalId) return;
    clearInterval(intervalId);
    intervalId = null;
    remainingMs = Math.max(0, endTime - Date.now());
    startBtn.disabled = false;
    startBtn.textContent = "再開";
    pauseBtn.disabled = true;
    status.textContent = "一時停止中";
  };

  const reset = () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
    remainingMs = 0;
    endTime = null;
    setInputsDisabled(false);
    startBtn.disabled = false;
    startBtn.textContent = "スタート";
    pauseBtn.disabled = true;
    display.classList.remove("finished");
    status.textContent = "";
    render(readInputsMs());
  };

  const finish = () => {
    clearInterval(intervalId);
    intervalId = null;
    remainingMs = 0;
    endTime = null;
    render(0);
    display.classList.add("finished");
    setInputsDisabled(false);
    startBtn.disabled = false;
    startBtn.textContent = "スタート";
    pauseBtn.disabled = true;
    status.textContent = "時間になりました！";
    beep();
  };

  const beep = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.65);
      osc.onended = () => ctx.close();
    } catch (_) {
      // ignore audio errors
    }
  };

  inputs.forEach((input) => {
    input.addEventListener("input", () => {
      if (!intervalId && remainingMs === 0) {
        render(readInputsMs());
      }
    });
    input.addEventListener("blur", () => {
      input.value = clampInt(input.value, parseInt(input.min, 10), parseInt(input.max, 10));
      if (!intervalId && remainingMs === 0) render(readInputsMs());
    });
  });

  startBtn.addEventListener("click", start);
  pauseBtn.addEventListener("click", pause);
  resetBtn.addEventListener("click", reset);

  render(readInputsMs());
})();
