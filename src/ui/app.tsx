export default function App() {
  return (
    <>
      <section>
        <h1>WebSockets Playground</h1>
        <p>Basic Chatroom Example</p>
      </section>

      {/* Chat panel */}
      <section>
        <div>
          <p id="chat_status"></p>
          <ul id="chat_thread"></ul>
        </div>
      </section>

      {/* Chat form */}
      <section>
        <form id="chat_form">
          <input type="text" name="message" />
          <input type="submit" value="Submit" />
        </form>
      </section>
    </>
  );
}
