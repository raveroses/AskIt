"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import useIsMobile from "../../../../hooks/useIsMobile";
function base64ToBlobUrl(base64: string, mimeType = "audio/webm") {
    const [header, encodedData] = base64.split(",", 2);
    const data = encodedData ?? header;
    const detectedMimeType = encodedData
        ? header.match(/^data:([^;]+);base64$/)?.[1] ?? mimeType
        : mimeType;
    const byteCharacters = atob(data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: detectedMimeType });
    return URL.createObjectURL(blob);
}

export default function AudioMessage({
    base64,
    waveform = [],
}: {
    base64: string;
    waveform?: number[];
}) {
    const audioRef = useRef<HTMLAudioElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null); // own canvas — not shared
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const isMobile = useIsMobile()

    // Only recompute the blob URL when the base64 actually changes
    const audioSrc = useMemo(() => {
        try {
            return base64ToBlobUrl(base64);
        } catch (error) {
            console.error("Could not decode voice message", error);
            return "";
        }
    }, [base64]);

    // Clean up the object URL when it's replaced or the component unmounts
    useEffect(() => {
        return () => URL.revokeObjectURL(audioSrc);
    }, [audioSrc]);

    const drawWaveform = (progress: number) => {
        const canvas = canvasRef.current;
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

        const sampledBars: number[] = [];
        for (let i = 0; i < maxVisibleBars; i++) {
            const srcIndex = Math.floor((i / maxVisibleBars) * waveform.length);
            sampledBars.push(waveform[srcIndex] ?? 0);
        }

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
    };

    // Redraw whenever playback progresses, or once metadata loads / waveform changes
    useEffect(() => {
        drawWaveform(duration > 0 ? currentTime / duration : 0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentTime, duration, waveform]);

    const togglePlay = async () => {
        const audio = audioRef.current;
        if (!audio) return;

        try {
            if (isPlaying) {
                audio.pause();
                setIsPlaying(false);
            } else {
                await audio.play();
                setIsPlaying(true);
            }
        } catch (err) {
            console.error("Playback failed", err);
            setIsPlaying(false);
        }
    };

    const formatTime = (t: number) => {
        const m = Math.floor(t / 60);
        const s = Math.floor(t % 60)
            .toString()
            .padStart(2, "0");
        return `${m}:${s}`;
    };

    return (
        <div className="flex items-center gap-2  justify-end  ">
            <audio
                ref={audioRef}
                src={audioSrc}
                preload="metadata"
                onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)}
                onLoadedMetadata={() =>
                    setDuration(audioRef.current?.duration || 0)
                }
                onError={() => console.error("Voice message could not be loaded", audioRef.current?.error)}
                onEnded={() => setIsPlaying(false)}
            />

            <button onClick={togglePlay} className="text-amber-400 shrink-0">
                {isPlaying ? (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                        <rect x="6" y="4" width="4" height="16" rx="1" />
                        <rect x="14" y="4" width="4" height="16" rx="1" />
                    </svg>
                ) : (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z" />
                    </svg>
                )}
            </button>

            <canvas
                ref={canvasRef}
                width={isMobile ? 100 : 300}
                height={isMobile ? 20 : 40}
                className="flex-1 h-10 block rounded"
            />

            <span className="text-xs text-slate-400 shrink-0 font-mono">
                {formatTime(currentTime)} / {formatTime(duration)}
            </span>
        </div>
    );
}