// Database Types
export interface User {
  id: string;
  email: string;
  created_at: string;
  updated_at?: string;
}

export interface Listing {
  id: string;
  user_id: string;
  title: string;
  description: string;
  price: number;
  image_url: string;
  detected_item: string;
  confidence?: number;
  created_at: string;
  updated_at?: string;
}

// AI Types
export interface AIDetectionResult {
  detectedItem: string;
  confidence: number;
  alternativeItems?: string[];
}

export interface AIGeneratedListing {
  title: string;
  description: string;
  suggestedPrice: number;
  detectedItem: string;
}

// Screen Params
export type RootStackParamList = {
  Auth: undefined;
  Login: undefined;
  Signup: undefined;
  Main: undefined;
  Home: undefined;
  Camera: undefined;
  ItemDetection: {
    imageUri: string;
  };
  ListingCreation: {
    imageUri: string;
    detectedItem: string;
    aiGeneratedData: AIGeneratedListing;
  };
  History: undefined;
};

// Image Types
export interface ImageAsset {
  uri: string;
  width: number;
  height: number;
  base64?: string;
}

// API Response Types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
}

// OpenRouter Types
export interface OpenRouterMessage {
  role: 'user' | 'assistant' | 'system';
  content: string | Array<{
    type: 'text' | 'image_url';
    text?: string;
    image_url?: {
      url: string;
    };
  }>;
}

export interface OpenRouterRequest {
  model: string;
  messages: OpenRouterMessage[];
  max_tokens?: number;
  temperature?: number;
}

export interface OpenRouterResponse {
  id: string;
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}
