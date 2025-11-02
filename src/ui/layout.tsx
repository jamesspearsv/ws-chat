import type { PropsWithChildren } from "hono/jsx";

export default function Layout(props: PropsWithChildren) {
  return (
    <html>
      <head>
        <title>WebSocket Learning</title>
        <link rel="stylesheet" href="/static/styles.css" />
        <script src="/static/main.js" />
      </head>
      <body>
        <main>{props.children}</main>
      </body>
    </html>
  );
}
