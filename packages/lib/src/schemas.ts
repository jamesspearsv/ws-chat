import * as z from 'zod';

export const Message = z.object({
  user: z.string(),
  text: z.string(),
  timestamp: z.number(),
});

export const ConnectionInfo = z.object({
  user_id: z.string(),
  chat_thread: z.array(Message),
});

export const ClientMessage = z.object({
  user_id: z.string(),
  message: z.string(),
});
