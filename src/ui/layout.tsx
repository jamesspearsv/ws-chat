import type { PropsWithChildren } from "hono/jsx";

export default function Layout(props: PropsWithChildren) {
  return (
    <html>
      <head>
        <title>WebSocket Learning</title>
      </head>
      <body>{props.children}</body>
    </html>
  );
}
