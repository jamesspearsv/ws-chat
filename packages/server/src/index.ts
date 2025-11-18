import { serve } from "@hono/node-server";
import { createNodeWebSocket } from "@hono/node-ws";
import type {
  ClientMessage,
  ConnectionInfo,
  Broadcast,
  WebSocketRes,
} from "@packages/lib";
import { Hono } from "hono";
import { nanoid } from "nanoid";
import { handleMessageData } from "./action.js";

const app = new Hono();
const { upgradeWebSocket, injectWebSocket, wss } = createNodeWebSocket({ app });

const chat_thread: Broadcast[] = [];

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.get(
  "/chat",
  upgradeWebSocket(() => {
    return {
      onOpen: (_, ws) => {
        console.log("### Client connected");

        ws.send(
          JSON.stringify({
            action: "open",
            message: { user_id: nanoid(), chat_thread },
          } satisfies WebSocketRes<ConnectionInfo>),
        );
      },
      onClose: () => {},
      onMessage: (e, ws) => {
        const broadcast = handleMessageData(JSON.parse(e.data as string));

        console.log(broadcast);

        if (broadcast) {
          chat_thread.push(broadcast);

          wss.clients.forEach((client: WebSocket) => {
            client.send(
              JSON.stringify({
                action: "broadcast",
                message: broadcast,
              } satisfies WebSocketRes<Broadcast>),
            );
          });
        }
      },
      onError: () => {},
    };
  }),
);

const server = serve(
  {
    fetch: app.fetch,
    port: 3000,
    hostname: "0.0.0.0",
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);

injectWebSocket(server);
