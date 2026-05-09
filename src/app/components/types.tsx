export interface Record {
  interviewMode: string;
  isRecording: boolean;
  isTranscriptionOn: boolean;
  transcription: string;
  audioUrl: string | null;
  onInterviewMode: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  onVoiceRecord: () => void;
  onStopVoiceRecording: () => void;
  onVoiceTranscriptRecord: () => void;
  onStopVoiceTranscriptRecording: () => void;
  onQuestionChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  waveFrequencyCreated: () => void;
}

type SpeechRecognition = any;

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}
