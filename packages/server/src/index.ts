import { serve } from '@hono/node-server';
import { createNodeWebSocket } from '@hono/node-ws';
import { cors } from 'hono/cors';
import type {
  ClientMessage,
  ConnectionInfo,
  Message,
  WebSocketRes,
} from '@packages/types';
import { Hono } from 'hono';
import { nanoid } from 'nanoid';

const app = new Hono();
const { upgradeWebSocket, injectWebSocket, wss } = createNodeWebSocket({ app });

const chat_thread: Message[] = [];

app.use(cors());

app.get('/', (c) => {
  return c.text('Hello Hono!');
});

app.get(
  '/chat',
  upgradeWebSocket((c) => {
    return {
      onOpen: (_, ws) => {
        console.log('### Client connected');

        ws.send(
          JSON.stringify({
            action: 'open',
            message: { user_id: nanoid(), chat_thread },
          } satisfies WebSocketRes<ConnectionInfo>)
        );
      },
      onClose: () => {},
      onMessage: (e, ws) => {
        const jsonData = JSON.parse(e.data as string);
        const message = jsonData as ClientMessage;

        const broadcast_message = {
          user: message.user_id,
          text: message.message,
          timestamp: Date.now(),
        } satisfies Message;

        chat_thread.push(broadcast_message);

        wss.clients.forEach((client) => {
          client.send(
            JSON.stringify({
              action: 'broadcast',
              message: broadcast_message,
            } satisfies WebSocketRes<Message>)
          );
        });
      },
      onError: () => {},
    };
  })
);

const server = serve(
  {
    fetch: app.fetch,
    port: 3000,
    hostname: '0.0.0.0',
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);

injectWebSocket(server);
