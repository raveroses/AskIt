// "use client";
// import { create } from "zustand";
// import { Record } from "@/app/components/types";
// let recognition: SpeechRecognition | null = null;
// let audioCtx: AudioContext | null = null;
// let analyser: AnalyserNode | null = null;
// let bufferLength: number = 0;

// let dataArray = new Uint8Array(bufferLength) as Uint8Array<ArrayBuffer>;
// let canvas: HTMLCanvasElement | null = null;
// let ctx: CanvasRenderingContext2D | null = null;

// if (typeof window !== "undefined") {
//   // AudioContext - safe here
//   audioCtx = new AudioContext();
//   analyser = audioCtx.createAnalyser();
//   analyser.connect(audioCtx.destination);
//   analyser.fftSize = 2048;
//   bufferLength = analyser.frequencyBinCount;
//   dataArray = new Uint8Array(bufferLength);
//   analyser.getByteTimeDomainData(dataArray);

//   // canvas - safe here
//   canvas = document.getElementById("canvas") as HTMLCanvasElement;
//   ctx = canvas?.getContext("2d"); // ✅ ?. means "only if canvas exists"
// }

// if (typeof window !== "undefined") {
//   const SpeechRecognition =
//     window.SpeechRecognition || window.webkitSpeechRecognition;
//   recognition = new SpeechRecognition();
//   recognition.continuous = true;
//   recognition.interimResults = true;
//   recognition.lang = "en-US";
// }
// let mediaRecorder: MediaRecorder | null = null;
// const chunks: Blob[] = [];

// const useGlobal = create<Record>((set, get) => ({
//   interviewMode: "audio",
//   isTranscriptionOn: false,
//   isRecording: false,
//   audioUrl: null,
//   transcription: "",

//   onInterviewMode: (event) => {
//     const { value } = event.target;
//     set({ interviewMode: value });
//     console.log(value);
//   },

//   onVoiceRecord: () => {
//     const waveInvocation = get().waveFrequencyCreated;
//     // const currentInterviewMode = get().interviewMode.slice(2).toLowerCase();
//     if (!analyser || !audioCtx) return;
//     if (!navigator.mediaDevices) {
//       console.log("Browser does not support audio");
//       return;
//     }
//     const constraints = { audio: true };

//     navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
//       mediaRecorder = new MediaRecorder(stream);

//       const source = audioCtx.createMediaStreamSource(stream);
//       source.connect(analyser);

//       mediaRecorder.ondataavailable = (e) => {
//         chunks.push(e.data);
//       };

//       mediaRecorder.onstop = () => {
//         const audioBlob = new Blob(chunks, { type: "audio/webm" });
//         const audioUrl = URL.createObjectURL(audioBlob);
//         set({ audioUrl });
//       };
//       mediaRecorder.start();
//       set({ isRecording: true });

//       requestAnimationFrame(waveInvocation);
//       console.log("Recording started");
//     });
//   },

//   waveFrequencyCreated: () => {
//     if (!analyser || !dataArray || !ctx) return;
//     analyser.getByteTimeDomainData(dataArray);
//     // Fill solid color
//     if (ctx !== null) {
//       // ctx.fillStyle = "rgb(200 200 200)";
//       ctx.fillRect(0, 0, 200, 100);
//       // Begin the path
//       ctx.lineWidth = 2;
//       ctx.strokeStyle = "rgb(200 200 200)";
//       ctx.beginPath();
//       // Draw each point in the waveform
//       const sliceWidth = 200 / bufferLength;
//       let x = 0;
//       for (let i = 0; i < bufferLength; i++) {
//         const v = dataArray[i] / 128.0;
//         const y = v * (100 / 2);

//         if (i === 0) {
//           ctx.moveTo(x, y);
//         } else {
//           ctx.lineTo(x, y);
//         }

//         x += sliceWidth;
//       }

//       // Finish the line
//       ctx.lineTo(200, 100 / 2);
//       ctx.stroke();
//     }
//   },

//   onStopVoiceRecording: () => {
//     if (mediaRecorder) {
//       mediaRecorder.stop();
//       set({ isRecording: false });
//       console.log("Recording stopped");
//     }
//   },
//   onVoiceTranscriptRecord: () => {
//     if (recognition !== null) {
//       recognition.start();

//       recognition.onresult = (event) => {
//         let fullTranscript = "";

//         for (let i = 0; i < event.results.length; i++) {
//           for (let t = 0; t < event.results[i].length; t++) {
//             fullTranscript += event.results[i][t].transcript + " ";
//           }
//         }

//         set({ transcription: fullTranscript });
//         set({ isTranscriptionOn: true });
//       };
//     }
//   },
//   onStopVoiceTranscriptRecording: () => {
//     if (recognition !== null) {
//       recognition.stop();
//       recognition.onresult = null;
//     }
//     set({ isTranscriptionOn: false });
//   },

//   onQuestionChange: (event) => {
//     const { value } = event.target;
//     set({ transcription: value });
//   },
// }));

// export default useGlobal;

// //   const increment = useCountStore((state) => state.increment)
