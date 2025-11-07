import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { createNodeWebSocket } from "@hono/node-ws";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import App from "./ui/app.js";
import Layout from "./ui/layout.js";
import { nanoid } from "nanoid";
import type { ClientMessage, ServerMessage } from "./lib/types.js";

const app = new Hono();
const node_ws = createNodeWebSocket({
  app,
});

app.use(
  "/static/*",
  serveStatic({
    root: "./",
    onNotFound: (path, c) => {
      console.log(`Unable to find path: ${path}`);
    },
  }),
);

app.use(
  "/*",
  jsxRenderer(
    ({ children }) => {
      return <Layout>{children}</Layout>;
    },
    { docType: true },
  ),
);

app.get(
  "/chat",
  node_ws.upgradeWebSocket(() => {
    return {
      onOpen(_, ws) {
        console.log("Client connected");
        const user_id = nanoid();
        ws.send(
          JSON.stringify({
            action: "connect",
            message: user_id,
          } satisfies ServerMessage),
        );
      },
      async onMessage(event, ws) {
        console.log(`Message from client: ${event.data}`);
        const { user_id, message } = JSON.parse(
          event.data as string,
        ) as ClientMessage;

        node_ws.wss.clients.forEach((client) => {
          client.send(
            JSON.stringify({
              action: "broadcast",
              user_id,
              message,
            }),
          );
        });

        // Return a success response to the original client
        ws.send(
          JSON.stringify({
            action: "success",
            message: "Message shared successfully",
          } satisfies ServerMessage),
        );
      },
      onClose: () => {
        console.log("Client disconnected");
      },
    };
  }),
);

app.get("/", (c) => {
  return c.render(<App />);
});

const server = serve(
  {
    fetch: app.fetch,
    hostname: "0.0.0.0",
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);

node_ws.injectWebSocket(server);
