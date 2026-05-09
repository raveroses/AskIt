"use client";
import { useRef, useCallback, useState } from "react";
// import useGlobal from "./useSecondGlobal";
// import { useRecorder } from "./useRecorder";
export const useWaveform = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  // const secondCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const historyRef = useRef<number[]>([]); // 👈 stores bar height history
  // const barStoreRef = useRef<number[] | null>(null);
  // const { isRecording } = useGlobal();

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    // const secondCanvas = secondCanvasRef.current;
    const analyser = analyserRef.current;
    const dataArray = dataArrayRef.current;
    if (!canvas || !analyser || !dataArray) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const barWidth = 3;
    const gap = 2;
    const totalBars = Math.floor(canvas.width / (barWidth + gap));
    // prefill history with zeros (silence)
    historyRef.current = new Array(totalBars).fill(0);

    let frameCount = 0;

    const render = () => {
      rafIdRef.current = requestAnimationFrame(render);
      frameCount++;

      const width = canvas.width;
      const height = canvas.height;

      analyser.getByteFrequencyData(dataArray as Uint8Array<ArrayBuffer>);

      // every 2 frames, push a new volume sample into history
      if (frameCount % 2 === 0) {
        // average the frequency data into one volume value
        const avg = dataArray.reduce((sum, v) => sum + v, 0) / dataArray.length;
        const normalized = avg / 255;

        historyRef.current.push(normalized);

        if (historyRef.current.length > totalBars) {
          historyRef.current.shift(); // remove oldest bar
        }
      }

      ctx.clearRect(0, 0, width, height);

      historyRef.current.forEach((value, i) => {
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

  const setup = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    streamRef.current = stream;

    const audioCtx = new AudioContext();
    audioCtxRef.current = audioCtx;

    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = 0.8;

    const source = audioCtx.createMediaStreamSource(stream);
    source.connect(analyser);

    analyserRef.current = analyser;
    dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount);

    draw();
  }, [draw]);

  const stop = useCallback(() => {
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
    audioCtxRef.current?.close();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    historyRef.current = [];
  }, []);

  return { canvasRef, setup, stop };
};
