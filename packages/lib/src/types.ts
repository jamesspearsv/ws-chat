import z from 'zod';
import * as schemas from './schemas';

export type Message = z.infer<typeof schemas.Message>;
export type ConnectionInfo = z.infer<typeof schemas.ConnectionInfo>;
export type ClientMessage = z.infer<typeof schemas.ClientMessage>;

// TODO: Add response generic type
export interface WebSocketRes<T = unknown> {
  action: 'open' | 'broadcast' | 'message';
  message: T;
}
