export type Message = {
  user: string;
  text: string;
  timestamp: number;
};

// TODO: Add response generic type
export interface GenericResponse<Action, Content> {
  action: Action;
  content: Content;
}

export interface ConnectionRes extends GenericResponse<"open", Message[]> {
  user_id: string;
}
