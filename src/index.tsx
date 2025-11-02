import { serve } from "@hono/node-server";
import { createNodeWebSocket } from "@hono/node-ws";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import Layout from "./ui/layout.js";
import Main from "./ui/main.js";
import { serveStatic } from "@hono/node-server/serve-static";

const app = new Hono();
const ws = createNodeWebSocket({
  app,
});

app.use("/static/*", serveStatic({ root: "./static" }));

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
  "/ws",
  ws.upgradeWebSocket((c) => {
    return {
      onMessage(event, ws) {
        console.log(`Message from client: ${event.data}`);
        ws.send("Hello from server!");
      },
      onClose: () => {
        console.log("Client disconnected");
      },
    };
  }),
);

app.get("/", (c) => {
  return c.render(<Main />);
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
