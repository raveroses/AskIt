"use client";
import { useRef, useCallback, useState } from "react";

export const useWaveform = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const secondCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const historyRef = useRef<number[]>([]);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    const dataArray = dataArrayRef.current;
    if (!canvas || !analyser || !dataArray) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    historyRef.current = [];

    let frameCount = 0;

    const render = () => {
      rafIdRef.current = requestAnimationFrame(render);
      frameCount++;

      const width = canvas.width;
      const height = canvas.height;

      analyser.getByteTimeDomainData(dataArray as Uint8Array<ArrayBuffer>);

      if (frameCount % 2 === 0) {
        let peak = 0;
        for (let i = 0; i < dataArray.length; i++) {
          const value = Math.abs(dataArray[i] - 128) / 128;
          if (value > peak) peak = value;
        }
        historyRef.current.push(peak);
      }

      ctx.clearRect(0, 0, width, height);

      const barWidth = 3;
      const gap = 2;
      const maxVisibleBars = Math.floor(width / (barWidth + gap));
      const history = historyRef.current;
      const visibleBars = history.slice(-maxVisibleBars);

      visibleBars.forEach((value, i) => {
        const barHeight = Math.max(3, value * height * 0.9);
        const x = i * (barWidth + gap);
        const y = (height - barHeight) / 2;

        ctx.fillStyle = "#f59e0b";
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, 1.5);
        ctx.fill();
      });
    };

    render();
  }, []);

  const setup = useCallback(
    async (stream?: MediaStream) => {
      // Clean up any previous session first (safe even if nothing to clean up)
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
        await audioCtxRef.current.close();
      }
      audioCtxRef.current = null;

      const localStream =
        stream ?? (await navigator.mediaDevices.getUserMedia({ audio: true }));
      streamRef.current = localStream;

      const audioCtx = new AudioContext();
      audioCtxRef.current = audioCtx;

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.8;

      const source = audioCtx.createMediaStreamSource(localStream);
      source.connect(analyser);

      analyserRef.current = analyser;
      dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount);

      draw();
    },
    [draw],
  );

  const playBack = useCallback(
    (playbackTime = currentTime, playbackDuration = duration) => {
      const canvas = secondCanvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;

      const barWidth = 3;
      const gap = 2;

      const maxVisibleBars = Math.floor(canvas.width / (barWidth + gap));
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const history = historyRef.current;

      const sampledBars: number[] = [];
      for (let i = 0; i < maxVisibleBars; i++) {
        const srcIndex = Math.floor((i / maxVisibleBars) * history.length);
        sampledBars.push(history[srcIndex] ?? 0);
      }

      const progress =
        playbackDuration > 0 ? playbackTime / playbackDuration : 0;
      const playedBars = Math.floor(sampledBars.length * progress);

      sampledBars.forEach((value, i) => {
        const barHeight = Math.max(3, value * canvas.height * 0.9);
        const x = i * (barWidth + gap);
        const y = (canvas.height - barHeight) / 2;

        ctx.fillStyle = i < playedBars ? "#f59e0b" : "#22242a";
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, 1.5);
        ctx.fill();
      });
    },
    [currentTime, duration],
  );

  // Snapshot the recorded loudness history — call this right when
  // recording stops, so it can be saved alongside the audio Blob.
  const getHistory = useCallback(() => {
    return [...historyRef.current];
  }, []);

  const stop = useCallback(() => {
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }

    // Guard against closing an already-closed AudioContext
    if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
      audioCtxRef.current.close();
    }
    audioCtxRef.current = null;

    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  return {
    canvasRef,
    secondCanvasRef,
    setup,
    stop,
    getHistory,
    currentTime,
    setCurrentTime,
    duration,
    setDuration,
    playBack,
  };
};