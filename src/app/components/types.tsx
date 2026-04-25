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
}
