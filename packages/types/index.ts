export type Message = {
  user: string;
  text: string;
  timestamp: number;
};

// TODO: Add more response structure for other actions (e.g. broadcasting, message response, connection opening)

export type WSSResponse = {
  user_id: string;
  chat_thread: Message[];
};
