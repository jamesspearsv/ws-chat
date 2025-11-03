export default function App() {
  return (
    <>
      <h1>Learning WebSockets</h1>
      <p>
        WebSocket Connection: <span id="ws_status">Closed</span>
      </p>
      <p>
        Data Recievd:
        <span>
          <pre id="ws_counter"></pre>
        </span>
      </p>
      <section>
        <form id="ws_message_form">
          <input type="text" name="message" />
          <input type="submit" value="Submit" />
        </form>
      </section>
    </>
  );
}
