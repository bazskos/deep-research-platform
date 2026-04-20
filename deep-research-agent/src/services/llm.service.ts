import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Groq from 'groq-sdk';

interface GenerationConfig {
  temperature?: number;
  maxTokens?: number;
}

@Injectable()
export class LlmService {
  private readonly logger = new Logger(LlmService.name);
  private readonly client: Groq;
  private readonly model = 'llama-3.3-70b-versatile';

  private readonly defaultConfig: GenerationConfig = {
    temperature: 0.7,
    maxTokens: 8192,
  };

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.getOrThrow<string>('GROQ_API_KEY');
    this.client = new Groq({ apiKey });
  }

  async generate(prompt: string, temperature?: number): Promise<string> {
    this.logger.debug(`Generating response for prompt: ${prompt.slice(0, 80)}...`);

    const response = await this.client.chat.completions.create({
      model: this.model,
      temperature: temperature ?? this.defaultConfig.temperature,
      max_tokens: this.defaultConfig.maxTokens,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = response.choices[0]?.message?.content ?? '';
    this.logger.debug(`Generated ${text.length} characters`);
    return text;
  }

  async generateWithConfig(
    prompt: string,
    config: Partial<GenerationConfig>,
  ): Promise<string> {
    this.logger.debug('Generating with custom config');

    const response = await this.client.chat.completions.create({
      model: this.model,
      temperature: config.temperature ?? this.defaultConfig.temperature,
      max_tokens: config.maxTokens ?? this.defaultConfig.maxTokens,
      messages: [{ role: 'user', content: prompt }],
    });

    return response.choices[0]?.message?.content ?? '';
  }
}