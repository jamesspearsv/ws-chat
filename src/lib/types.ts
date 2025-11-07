export type ClientMessage = {
  user_id: string;
  message: string;
};

export type ServerMessage = {
  action: "connect" | "broadcast" | "message" | "success";
  message: string;
};
