// TypeScript interfaces for AI content generation

export interface GeneratedContent {
  text: string;
  topic: string;
  generatedAt: Date;
  status: 'success' | 'error' | 'empty';
}

export interface GenerationRequest {
  topic: string;
  startedAt: Date;
  abortController: AbortController;
}

export interface GenerationState {
  isGenerating: boolean;
  content: GeneratedContent | null;
  error: string | null;
  currentRequest: GenerationRequest | null;
}

// API Request/Response types
export interface GenerateRequest {
  topic: string;
}

export interface GenerateResponse {
  content: string;
  topic: string;
}

export interface ErrorResponse {
  error: string;
  code?: string;
}

