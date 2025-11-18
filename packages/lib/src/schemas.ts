import * as z from "zod";

export const BroadcastSchema = z.object({
  user: z.string(),
  message: z.string(),
  timestamp: z.number(),
});

export const ConnectionInfoSchema = z.object({
  user_id: z.string(),
  chat_thread: z.array(BroadcastSchema),
});

export const ClientMessageSchema = z.object({
  user_id: z.string(),
  message: z.string(),
});
