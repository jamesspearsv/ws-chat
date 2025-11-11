import { serve } from "@hono/node-server";
import { createNodeWebSocket } from "@hono/node-ws";
import { Hono } from "hono";

const app = new Hono();
const { upgradeWebSocket, injectWebSocket, wss } = createNodeWebSocket({ app });

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.get(
  "/chat",
  upgradeWebSocket((c) => {
    return {
      onOpen: (event) => {
        console.log(event);
        console.log("### Client connected");
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
