import type { PropsWithChildren } from "hono/jsx";

export default function Layout(props: PropsWithChildren) {
  return (
    <html>
      <head>
        <title>WebSocket Playground</title>
        <link rel="stylesheet" href="/static/styles.css" />
        <script src="/static/client.js" defer />
      </head>
      <body>
        <main>{props.children}</main>
      </body>
    </html>
  );
}
