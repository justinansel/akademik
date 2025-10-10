// TypeScript interfaces for Interactive Learning Homepage

// State machine types
export type SubmissionState = 'initial' | 'loading' | 'ready';

// Core entities
export interface LearningTopic {
  text: string;
  submittedAt?: Date;
}

export interface HomepageState {
  state: SubmissionState;
  currentTopic: LearningTopic | null;
  inputValue: string;
}

// Component prop interfaces
export interface InputSectionProps {
  onSubmit: (topic: string) => void;
  disabled: boolean;
  value: string;
  onChange: (value: string) => void;
}

export interface TopicInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
  maxLength: number;
  minLength: number;
  placeholder?: string;
  ariaLabel?: string;
}

export interface SubmitButtonProps {
  disabled: boolean;
  onClick: () => void;
  label?: string;
  ariaLabel?: string;
}

export interface AudioPlayerSectionProps {
  visible: boolean;
  loading: boolean;
  topic: string;
  content?: string;  // Generated content from API
  error?: string | null;  // Error message
  onRetry?: () => void;  // Retry callback
  audioUrl?: string;  // URL of mixed audio track
  isGenerating?: boolean;  // Audio generation in progress
  audioError?: string;  // Audio generation error
  generationStatus?: 'idle' | 'generating-voice' | 'generating-music' | 'mixing' | 'ready' | 'error';  // Audio generation phase
}

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  ariaLabel?: string;
}

export interface MockAudioPlayerProps {
  topic: string;
  disabled: boolean;
}

