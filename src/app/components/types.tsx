export interface Record {
  interviewMode: string;
  isRecording: boolean;
  transcription: string;
  audioUrl: string | null;
  onInterviewMode: (mode: string) => void;
  onRecord: () => void;
  onStopRecording: () => void;
  onQuestionChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}
