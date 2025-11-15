import axios from 'axios';
import env from '../config/env';
import {
  AIDetectionResult,
  AIGeneratedListing,
  ApiResponse,
  OpenRouterRequest,
  OpenRouterResponse,
} from '../types';
import { getImageDataUrl } from '../utils/imageUtils';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

class OpenRouterService {
  private apiKey: string;
  private model: string;

  constructor() {
    if (!env.OPENROUTER_API_KEY) {
      throw new Error('OpenRouter API key is not configured');
    }
    this.apiKey = env.OPENROUTER_API_KEY;
    // Use model from env, fallback to Gemini Flash (free tier with vision support)
    this.model = env.OPENROUTER_MODEL || 'google/gemini-2.0-flash-exp:free';
  }

  private async makeRequest(request: OpenRouterRequest): Promise<ApiResponse<OpenRouterResponse>> {
    try {
      const response = await axios.post<OpenRouterResponse>(OPENROUTER_API_URL, request, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://hotpotato.app',
          'X-Title': 'HotPotato',
        },
      });

      return { success: true, data: response.data };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          success: false,
          error: error.response?.data?.error?.message || error.message,
        };
      }
      return {
        success: false,
        error: error instanceof Error ? error.message : 'OpenRouter request failed',
      };
    }
  }

  async detectItem(imageUri: string): Promise<ApiResponse<AIDetectionResult>> {
    try {
      // Convert image to base64 (platform-aware)
      const imageUrl = await getImageDataUrl(imageUri);

      const request: OpenRouterRequest = {
        model: this.model,
        messages: [
          {
            role: 'system',
            content:
              'You are an expert at identifying items in images for online marketplace listings. Analyze the image and identify the main item being sold. Be specific and accurate.',
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'What is the main item in this image? Provide a specific, concise name for the item (e.g., "iPhone 13 Pro", "Wooden Coffee Table", "Nike Air Jordan Sneakers"). Also rate your confidence from 0-100.',
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageUrl,
                },
              },
            ],
          },
        ],
        max_tokens: 150,
        temperature: 0.3,
      };

      const response = await this.makeRequest(request);

      if (!response.success || !response.data) {
        return { success: false, error: response.error || 'Failed to detect item' };
      }

      const content = response.data.choices[0]?.message?.content;
      if (!content) {
        return { success: false, error: 'No response from AI' };
      }

      // Parse the response to extract item name and confidence
      // This is a simplified parser - you might want to improve this
      const detectedItem = content.split('\n')[0].replace(/^(Item:|The item is:)\s*/i, '').trim();
      const confidence = content.match(/confidence.*?(\d+)/i)?.[1] || '80';

      return {
        success: true,
        data: {
          detectedItem,
          confidence: parseInt(confidence, 10),
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Item detection failed',
      };
    }
  }

  async generateListing(
    itemName: string,
    imageUri: string
  ): Promise<ApiResponse<AIGeneratedListing>> {
    try {
      // Convert image to base64 (platform-aware)
      const imageUrl = await getImageDataUrl(imageUri);

      const request: OpenRouterRequest = {
        model: this.model,
        messages: [
          {
            role: 'system',
            content:
              'You are an expert at creating compelling marketplace listings. Based on the item name and image, generate an attractive title, detailed description, and suggest a fair price. Format your response as JSON with keys: title, description, suggestedPrice.',
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Create a marketplace listing for this ${itemName}. Include:\n1. An attractive, SEO-friendly title (under 80 characters)\n2. A detailed description highlighting key features, condition, and benefits (150-300 words)\n3. A suggested price in USD (just the number)\n\nFormat as JSON: {"title": "...", "description": "...", "suggestedPrice": 0}`,
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageUrl,
                },
              },
            ],
          },
        ],
        max_tokens: 500,
        temperature: 0.7,
      };

      const response = await this.makeRequest(request);

      if (!response.success || !response.data) {
        return { success: false, error: response.error || 'Failed to generate listing' };
      }

      const content = response.data.choices[0]?.message?.content;
      if (!content) {
        return { success: false, error: 'No response from AI' };
      }

      try {
        // Extract JSON from response (handle potential markdown code blocks)
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          throw new Error('No JSON found in response');
        }

        const listing = JSON.parse(jsonMatch[0]);

        return {
          success: true,
          data: {
            title: listing.title,
            description: listing.description,
            suggestedPrice: listing.suggestedPrice,
            detectedItem: itemName,
          },
        };
      } catch (parseError) {
        return {
          success: false,
          error: 'Failed to parse AI response',
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Listing generation failed',
      };
    }
  }
}

export default new OpenRouterService();
