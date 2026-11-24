/**
 * Camada de abstração preparada para futura integração direta com APIs de IA
 * (ex.: Google Gemini API, OpenAI API, Anthropic Claude API).
 *
 * No MVP atual, o aplicativo opera 100% no cliente sem exigir chave de API,
 * gerando prompts estruturados prontos para copiar e utilizar em qualquer LLM.
 */

export interface AIGenerationRequest {
  prompt: string;
  model?: string;
  temperature?: number;
  maxOutputTokens?: number;
}

export interface AIGenerationResponse {
  content: string;
  provider: string;
  model: string;
  generatedAt: string;
  usage?: {
    inputTokensEstimate: number;
    outputTokensEstimate: number;
  };
}

export interface AIProvider {
  readonly id: string;
  readonly displayName: string;
  readonly isConfigured: boolean;
  generate(request: AIGenerationRequest): Promise<AIGenerationResponse>;
}

export class FutureGeminiProvider implements AIProvider {
  readonly id = 'gemini-api';
  readonly displayName = 'Google Gemini API (Integração Futura)';
  private readonly apiKey?: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey;
  }

  get isConfigured(): boolean {
    return Boolean(this.apiKey && this.apiKey.trim().length > 0);
  }

  async generate(_request: AIGenerationRequest): Promise<AIGenerationResponse> {
    if (!this.isConfigured) {
      throw new Error(
        'Modo sem API ativo: copie o prompt gerado ou configure VITE_GEMINI_API_KEY / backend proxy para execução direta.'
      );
    }

    throw new Error(
      'Endpoint de proxy de IA não conectado nesta versão MVP. Utilize a interface AIProvider para integrar um backend seguro.'
    );
  }
}

export const defaultAIProvider: AIProvider = new FutureGeminiProvider();
