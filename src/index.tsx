import { serve } from "@hono/node-server";
import { createNodeWebSocket } from "@hono/node-ws";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import Layout from "./ui/layout.js";
import App from "./ui/app.js";
import { serveStatic } from "@hono/node-server/serve-static";

const app = new Hono();
const ws = createNodeWebSocket({
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
  "/socket",
  ws.upgradeWebSocket((c) => {
    return {
      onOpen() {
        console.log("Client connected");
      },
      async onMessage(event, ws) {
        console.log(`Message from client: ${event.data}`);
        ws.send(
          JSON.stringify({
            message: "Hello from server!",
            total_messages: await JSON.parse(event.data as string)
              .total_messages!,
          }),
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
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);

ws.injectWebSocket(server);
