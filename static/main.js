const ws_status = document.getElementById("ws_status");
const ws_message_form = document.getElementById("ws_message_form");
const ws_counter = document.getElementById("ws_counter");

let ws = null;
let counter = 0;

window.addEventListener("pageshow", () => {
  ws = new WebSocket("ws://localhost:3000/socket");

  // Handle successful websocket connection
  ws.addEventListener("open", () => {
    console.log("CONNECTION OPEN");
    ws_status.textContent = "Open";

    ping_interval = setInterval(() => {
      ws.send(
        JSON.stringify({
          message: "ping",
          total_messages: counter,
        }),
      );
    }, 1000);
  });

  ws.addEventListener("close", () => {
    log("DISCONNECTED");
    clearInterval(pingInterval);
  });

  ws.addEventListener("message", (e) => {
    console.log(e.data);
    counter++;
    ws_counter.innerText = String(e.data);
  });

  ws_message_form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (e.target instanceof HTMLFormElement) {
      const formData = new FormData(e.target);

      const message = formData.get("message");
      ws.send(message);
    }
  });
});

window.addEventListener("pagehide", () => {
  if (ws) {
    console.log("CLOSING WEBSOCKET CONNECTION");
    ws.close();
    ws = null;
    window.clearInterval(ping_interval);
  }
});
