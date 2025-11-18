import { ClientMessageSchema, type Broadcast } from "@packages/lib";

// todo -- Extract WS actions from ./index.ts into functions

export function handleMessageData(data: unknown) {
  // parse data using client message schema
  const safeData = ClientMessageSchema.safeParse(data);

  if (safeData.success) {
    return {
      user: safeData.data.user_id,
      message: safeData.data.message,
      timestamp: Date.now(),
    } satisfies Broadcast;
  }

  return null;
}
