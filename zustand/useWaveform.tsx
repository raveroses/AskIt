import { useRef } from "react";

export const useWaveform = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);

  const setup = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    const audioCtx = new AudioContext();
    audioCtxRef.current = audioCtx;

    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 2048;

    const source = audioCtx.createMediaStreamSource(stream);
    source.connect(analyser);

    analyserRef.current = analyser;

    const bufferLength = analyser.frequencyBinCount;
    dataArrayRef.current = new Uint8Array(bufferLength);

    draw();
  };

  const draw = () => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    const dataArray = dataArrayRef.current;

    if (!canvas || !analyser || !dataArray) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    const render = () => {
      requestAnimationFrame(render);

      analyser.getByteTimeDomainData(dataArray as Uint8Array<ArrayBuffer>);

      ctx.clearRect(0, 0, width, height);

      ctx.beginPath();

      const sliceWidth = width / dataArray.length;
      let x = 0;

      for (let i = 0; i < dataArray.length; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * height) / 2;

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);

        x += sliceWidth;
      }

      ctx.stroke();
    };

    render();
  };

  return { canvasRef, setup };
};
