import * as z from 'zod';

export const MessageSchema = z.object({
  user: z.string(),
  text: z.string(),
  timestamp: z.number(),
});

export const ConnectionInfoSchema = z.object({
  user_id: z.string(),
  chat_thread: z.array(MessageSchema),
});

export const ClientMessageSchema = z.object({
  user_id: z.string(),
  message: z.string(),
});
