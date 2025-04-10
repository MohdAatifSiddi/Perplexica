import { Embeddings } from '@langchain/core/embeddings';
import { BaseChatModel } from '@langchain/core/language_models/chat_models';
import { loadOpenAIChatModels, loadOpenAIEmbeddingModels } from './openai';
import {
  getCustomOpenaiApiKey,
  getCustomOpenaiApiUrl,
  getCustomOpenaiModelName,
} from '../config';
import { ChatOpenAI, OpenAIEmbeddings } from '@langchain/openai';
import { loadOllamaChatModels, loadOllamaEmbeddingModels } from './ollama';
import { loadGroqChatModels } from './groq';
import { loadAnthropicChatModels } from './anthropic';
import { loadGeminiChatModels, loadGeminiEmbeddingModels } from './gemini';
import { loadTransformersEmbeddingsModels } from './transformers';
import { loadDeepseekChatModels } from './deepseek';

export interface ChatModel {
  displayName: string;
  model: BaseChatModel;
}

export interface EmbeddingModel {
  displayName: string;
  model: Embeddings;
}

export const chatModelProviders: Record<
  string,
  () => Promise<Record<string, ChatModel>>
> = {
  openai: loadOpenAIChatModels,
  ollama: loadOllamaChatModels,
  groq: loadGroqChatModels,
  anthropic: loadAnthropicChatModels,
  gemini: loadGeminiChatModels,
  deepseek: loadDeepseekChatModels,
};

export const embeddingModelProviders: Record<
  string,
  () => Promise<Record<string, EmbeddingModel>>
> = {
  openai: loadOpenAIEmbeddingModels,
  ollama: loadOllamaEmbeddingModels,
  gemini: loadGeminiEmbeddingModels,
  transformers: loadTransformersEmbeddingsModels,
};

export const getAvailableChatModelProviders = async () => {
  const chatModels: Record<string, Record<string, ChatModel>> = {};

  // Load custom OpenAI model first
  const customOpenAiApiKey = getCustomOpenaiApiKey();
  const customOpenAiApiUrl = getCustomOpenaiApiUrl();
  const customOpenAiModelName = getCustomOpenaiModelName();

  if (customOpenAiApiKey && customOpenAiApiUrl && customOpenAiModelName) {
    try {
      const deploymentName = customOpenAiModelName.split('/').pop() || customOpenAiModelName;
      
      chatModels['custom-openai'] = {
        [customOpenAiModelName]: {
          displayName: `Custom OpenAI (${customOpenAiModelName})`,
          model: new ChatOpenAI({
            openAIApiKey: customOpenAiApiKey,
            modelName: deploymentName,
            temperature: 0.7,
            configuration: {
              baseURL: `${customOpenAiApiUrl}/openai/deployments/${deploymentName}`,
              defaultQuery: { 'api-version': '2024-02-15-preview' },
              defaultHeaders: { 'api-key': customOpenAiApiKey }
            },
          }) as unknown as BaseChatModel,
        }
      };
    } catch (error) {
      console.error('Error initializing custom OpenAI model:', error);
    }
  }

  // Load other providers
  for (const [provider, loader] of Object.entries(chatModelProviders)) {
    try {
      const models = await loader();
      if (models && Object.keys(models).length > 0) {
        chatModels[provider] = models;
      }
    } catch (error) {
      console.error(`Error loading ${provider} models:`, error);
    }
  }

  return chatModels;
};

export const getAvailableEmbeddingModelProviders = async () => {
  const models: Record<string, Record<string, EmbeddingModel>> = {};

  // Load custom OpenAI embeddings first
  const customOpenAiApiKey = getCustomOpenaiApiKey();
  const customOpenAiApiUrl = getCustomOpenaiApiUrl();

  if (customOpenAiApiKey && customOpenAiApiUrl) {
    try {
      const deploymentName = 'text-embedding-3-small';
      
      models['custom-openai'] = {
        [deploymentName]: {
          displayName: 'Custom OpenAI Embeddings',
          model: new OpenAIEmbeddings({
            openAIApiKey: customOpenAiApiKey,
            modelName: deploymentName,
            configuration: {
              baseURL: `${customOpenAiApiUrl}/openai/deployments/${deploymentName}`,
              defaultQuery: { 'api-version': '2024-02-15-preview' },
              defaultHeaders: { 'api-key': customOpenAiApiKey }
            },
          }) as unknown as Embeddings,
        }
      };
    } catch (error) {
      console.error('Error initializing custom OpenAI embeddings:', error);
    }
  }

  // Load other providers
  for (const [provider, loader] of Object.entries(embeddingModelProviders)) {
    try {
      const providerModels = await loader();
      if (providerModels && Object.keys(providerModels).length > 0) {
        models[provider] = providerModels;
      }
    } catch (error) {
      console.error(`Error loading ${provider} embeddings:`, error);
    }
  }

  return models;
};
