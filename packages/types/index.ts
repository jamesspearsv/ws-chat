export type Message = {
  user: string;
  text: string;
  timestamp: number;
};

export type ConnectionInfo = {
  user_id: string;
  chat_thread: Message[];
};

export type ClientMessage = {
  user_id: string;
  message: string;
};

// TODO: Add response generic type
export interface WebSocketRes<T = unknown> {
  action: 'open' | 'broadcast' | 'message';
  message: T;
}
