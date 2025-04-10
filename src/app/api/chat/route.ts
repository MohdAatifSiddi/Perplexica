import prompts from '@/lib/prompts';
import MetaSearchAgent from '@/lib/search/metaSearchAgent';
import crypto from 'crypto';
import { AIMessage, BaseMessage, HumanMessage } from '@langchain/core/messages';
import { EventEmitter } from 'stream';
import {
  chatModelProviders,
  embeddingModelProviders,
  getAvailableChatModelProviders,
  getAvailableEmbeddingModelProviders,
} from '@/lib/providers';
import db from '@/lib/db';
import { chats, messages as messagesSchema } from '@/lib/db/schema';
import { and, eq, gt } from 'drizzle-orm';
import { getFileDetails } from '@/lib/utils/files';
import { BaseChatModel } from '@langchain/core/language_models/chat_models';
import { ChatOpenAI } from '@langchain/openai';
import {
  getCustomOpenaiApiKey,
  getCustomOpenaiApiUrl,
  getCustomOpenaiModelName,
} from '@/lib/config';
import { searchHandlers } from '@/lib/search';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Message = {
  messageId: string;
  chatId: string;
  content: string;
};

type ChatModel = {
  provider: string;
  name: string;
};

type EmbeddingModel = {
  provider: string;
  name: string;
};

type Body = {
  message: Message;
  optimizationMode: 'speed' | 'balanced' | 'quality';
  focusMode: string;
  history: Array<[string, string]>;
  files: Array<string>;
  chatModel: ChatModel;
  embeddingModel: EmbeddingModel;
  systemInstructions: string;
};

const handleEmitterEvents = async (
  stream: EventEmitter,
  writer: WritableStreamDefaultWriter,
  encoder: TextEncoder,
  aiMessageId: string,
  chatId: string,
) => {
  let recievedMessage = '';
  let sources: any[] = [];
  let isStreamClosed = false;

  const closeStream = async () => {
    if (!isStreamClosed) {
      isStreamClosed = true;
      try {
        await writer.close();
      } catch (error) {
        console.error('Error closing stream:', error);
      }
    }
  };

  stream.on('data', async (data) => {
    try {
      const parsedData = JSON.parse(data);
      if (parsedData.type === 'response') {
        await writer.write(
          encoder.encode(
            JSON.stringify({
              type: 'message',
              data: parsedData.data,
              messageId: aiMessageId,
            }) + '\n',
          ),
        );

        recievedMessage += parsedData.data;
      } else if (parsedData.type === 'sources') {
        await writer.write(
          encoder.encode(
            JSON.stringify({
              type: 'sources',
              data: parsedData.data,
              messageId: aiMessageId,
            }) + '\n',
          ),
        );

        sources = parsedData.data;
      }
    } catch (error) {
      console.error('Error processing stream data:', error);
      await closeStream();
    }
  });

  stream.on('end', async () => {
    try {
      await writer.write(
        encoder.encode(
          JSON.stringify({
            type: 'messageEnd',
            messageId: aiMessageId,
          }) + '\n',
        ),
      );

      await db.insert(messagesSchema)
        .values({
          content: recievedMessage,
          chatId: chatId,
          messageId: aiMessageId,
          role: 'assistant',
          metadata: JSON.stringify({
            createdAt: new Date(),
            ...(sources && sources.length > 0 && { sources }),
          }),
        })
        .execute();

      await closeStream();
    } catch (error) {
      console.error('Error handling stream end:', error);
      await closeStream();
    }
  });

  stream.on('error', async (error) => {
    console.error('Stream error:', error);
    try {
      await writer.write(
        encoder.encode(
          JSON.stringify({
            type: 'error',
            data: error.message || 'An error occurred while processing the request',
          }) + '\n',
        ),
      );
    } catch (writeError) {
      console.error('Error writing error message:', writeError);
    }
    await closeStream();
  });
};

const handleHistorySave = async (
  message: Message,
  humanMessageId: string,
  focusMode: string,
  files: string[],
) => {
  const chat = await db.query.chats.findFirst({
    where: eq(chats.id, message.chatId),
  });

  if (!chat) {
    await db
      .insert(chats)
      .values({
        id: message.chatId,
        title: message.content,
        createdAt: new Date().toString(),
        focusMode: focusMode,
        files: files.map(getFileDetails),
      })
      .execute();
  }

  const messageExists = await db.query.messages.findFirst({
    where: eq(messagesSchema.messageId, humanMessageId),
  });

  if (!messageExists) {
    await db
      .insert(messagesSchema)
      .values({
        content: message.content,
        chatId: message.chatId,
        messageId: humanMessageId,
        role: 'user',
        metadata: JSON.stringify({
          createdAt: new Date(),
        }),
      })
      .execute();
  } else {
    await db
      .delete(messagesSchema)
      .where(
        and(
          gt(messagesSchema.id, messageExists.id),
          eq(messagesSchema.chatId, message.chatId),
        ),
      )
      .execute();
  }
};

export const GET = async (req: Request) => {
  try {
    const [chatModelProviders, embeddingModelProviders] = await Promise.all([
      getAvailableChatModelProviders(),
      getAvailableEmbeddingModelProviders(),
    ]);

    return Response.json({
      status: 'ok',
      message: 'Chat API is running',
      availableModels: {
        chat: chatModelProviders,
        embedding: embeddingModelProviders,
      },
    });
  } catch (error) {
    console.error('Error in GET /api/chat:', error);
    return Response.json(
      { error: 'Failed to get available models' },
      { status: 500 },
    );
  }
};

export const POST = async (req: Request) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => {
    controller.abort();
    console.error('Request timeout after 30 seconds');
  }, 30000);

  try {
    const body = (await req.json()) as Body;
    const { message, optimizationMode, focusMode, history, files, chatModel, embeddingModel, systemInstructions } = body;

    if (!message.content) {
      return Response.json(
        { status: 'error', message: 'Message content is required' },
        { status: 400 },
      );
    }

    const stream = new TransformStream();
    const writer = stream.writable.getWriter();
    const encoder = new TextEncoder();

    const humanMessageId = crypto.randomUUID();
    const aiMessageId = crypto.randomUUID();

    await handleHistorySave(message, humanMessageId, focusMode, files);

    const llm = chatModelProviders[chatModel.provider]?.[chatModel.name];
    const embeddings = embeddingModelProviders[embeddingModel.provider]?.[embeddingModel.name];

    if (!llm || !embeddings) {
      throw new Error('Invalid model configuration');
    }

    const searchAgent = new MetaSearchAgent({
      searchWeb: true,
      rerank: optimizationMode !== 'speed',
      summarizer: optimizationMode === 'quality',
      rerankThreshold: 0.7,
      queryGeneratorPrompt: prompts[focusMode as keyof typeof prompts].retriever,
      responsePrompt: prompts[focusMode as keyof typeof prompts].response,
      activeEngines: searchHandlers[focusMode as keyof typeof searchHandlers].engines,
    });

    const langchainHistory = history.map(([role, content]) => {
      if (role === 'user') {
        return new HumanMessage(content);
      }
      return new AIMessage(content);
    });

    const emitter = await searchAgent.searchAndAnswer(
      message.content,
      langchainHistory,
      llm,
      embeddings,
      optimizationMode,
      files,
      systemInstructions,
    );

    handleEmitterEvents(emitter, writer, encoder, aiMessageId, message.chatId);

    clearTimeout(timeout);

    return new Response(stream.readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    clearTimeout(timeout);
    console.error('Error in POST /api/chat:', error);
    return Response.json(
      { status: 'error', message: 'Internal server error' },
      { status: 500 },
    );
  }
};
