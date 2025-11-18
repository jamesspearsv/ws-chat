import z from 'zod';
import * as schemas from './schemas';

export type Message = z.infer<typeof schemas.MessageSchema>;
export type ConnectionInfo = z.infer<typeof schemas.ConnectionInfoSchema>;
export type ClientMessage = z.infer<typeof schemas.ClientMessageSchema>;

// TODO: Add response generic type
export interface WebSocketRes<T = unknown> {
  action: 'open' | 'broadcast' | 'message';
  message: T;
}
