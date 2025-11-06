export type ClientMessage = {
  action: string;
  message: string;
};

export type ServerMessage = {
  action: "connect" | "broadcast" | "message";
  message: string;
};
