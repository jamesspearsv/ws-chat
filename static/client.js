const chat_form = document.getElementById("chat_form");
const chat_thread = document.getElementById("chat_thread");
const chat_status = document.getElementById("chat_status");
const chatbox = document.getElementById("chatbox");

let ws = null;

window.addEventListener("pageshow", () => {
  ws = new WebSocket("/chat");

  ws.onopen = () => {
    chat_status.classList.add("connected");
  };

  ws.onerror = () => {
    chat_status.innerHTML = "Error";
  };

  ws.onmessage = (e) => {
    const res = JSON.parse(e.data);

    switch (res.action) {
      case "connect":
        chat_status.innerHTML = `Connected with ID ${res.message}`;
        localStorage.setItem("ws_user_id", res.message);
        break;
      case "broadcast":
        const chat = document.createElement("li");
        chat.classList.add("chat");

        const message = document.createElement("span");
        message.innerHTML = res.message;

        const user_id = document.createElement("span");
        user_id.innerHTML = res.user_id;

        chat.appendChild(message);
        chat.appendChild(user_id);

        chat_thread.appendChild(chat);
        break;
      case "success":
        console.log(e.data);
        chatbox.value = "";
    }
  };
});

chat_form.addEventListener("submit", (e) => {
  e.preventDefault();

  if (e.target instanceof HTMLFormElement && ws instanceof WebSocket) {
    const user_id = localStorage.getItem("ws_user_id");

    if (!user_id) return;

    const form_data = new FormData(e.target);
    const message = form_data.get("message");
    ws.send(
      JSON.stringify({
        user_id,
        message,
      }),
    );
  }
});

// window.addEventListener("pageshow", () => {
//   ws = new WebSocket("ws://localhost:3000/socket");

//   // Handle successful websocket connection
//   ws.addEventListener("open", () => {
//     console.log("CONNECTION OPEN");
//     ws_status.textContent = "Open";

//     ping_interval = setInterval(() => {
//       ws.send(
//         JSON.stringify({
//           message: "ping",
//           total_messages: counter,
//         }),
//       );
//     }, 1000);
//   });

//   ws.addEventListener("close", () => {
//     log("DISCONNECTED");
//     clearInterval(pingInterval);
//   });

//   ws.addEventListener("message", (e) => {
//     console.log(e.data);
//     counter++;
//     ws_counter.innerText = String(e.data);
//   });

//   ws_message_form.addEventListener("submit", (e) => {
//     e.preventDefault();

//     if (e.target instanceof HTMLFormElement) {
//       const formData = new FormData(e.target);

//       const message = formData.get("message");
//       ws.send(message);
//     }
//   });
// });

// window.addEventListener("pagehide", () => {
//   if (ws) {
//     console.log("CLOSING WEBSOCKET CONNECTION");
//     ws.close();
//     ws = null;
//     window.clearInterval(ping_interval);
//   }
// });
