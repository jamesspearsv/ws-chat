import { serve } from "@hono/node-server";
import { createNodeWebSocket } from "@hono/node-ws";
import type { ConnectionRes, Message } from "@packages/types";
import { Hono } from "hono";
import { nanoid } from "nanoid";

const app = new Hono();
const { upgradeWebSocket, injectWebSocket, wss } = createNodeWebSocket({ app });

const chat_thread: Message[] = [];

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.get(
  "/chat",
  upgradeWebSocket((c) => {
    return {
      onOpen: (_, ws) => {
        console.log("### Client connected");

        ws.send(
          JSON.stringify({
            action: "open",
            user_id: nanoid(),
            content: chat_thread,
          } satisfies ConnectionRes),
        );
      },
      onClose: () => {},
      onMessage: () => {},
      onError: () => {},
    };
  }),
);

const server = serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);

injectWebSocket(server);
