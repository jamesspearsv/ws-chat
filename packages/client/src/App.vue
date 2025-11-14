<script setup lang="ts">
import { computed, onMounted, ref, useTemplateRef, watch } from 'vue';
import type {
  ClientMessage,
  ConnectionInfo,
  Message,
  WebSocketRes,
} from '@packages/types';

const websocket = ref<WebSocket | null>(null);
const user_id = ref('');
const chat_thread = ref<Message[]>([]);
const chat_len = computed(() => chat_thread.value.length);
const chat_window = useTemplateRef('chat_window');
const message = defineModel<string>('');

function handleFormSubmit() {
  if (!message.value) return;
  const client_message = {
    user_id: user_id.value,
    message: message.value,
  } satisfies ClientMessage;

  websocket.value?.send(JSON.stringify(client_message));

  message.value = '';
}

watch(
  chat_len,
  () => {
    console.log('chat_len changed');
    if (!chat_window.value) return;

    const scroll_height = chat_window.value.scrollHeight;

    chat_window.value.scrollTop = scroll_height;
  },
  { immediate: true }
);

onMounted(() => {
  const ws = new WebSocket('http://192.168.0.90:3000/chat');
  ws.onopen = () => {
    console.log('### Client connected');
    websocket.value = ws;
  };

  ws.onmessage = (e) => {
    const res = JSON.parse(e.data) as WebSocketRes;

    if (res.action === 'open') {
      const { message } = res as WebSocketRes<ConnectionInfo>;

      user_id.value = message.user_id;
      chat_thread.value = message.chat_thread;
    }

    if (res.action === 'broadcast') {
      const { message } = res as WebSocketRes<Message>;

      chat_thread.value.push(message);
    }

    if (res.action === 'message') {
    }
  };
});
</script>

<template>
  <main>
    <h1>Hello, Chat App!</h1>
    <p>{{ user_id ? `Connected with ID ${user_id}` : 'Not connected' }}</p>
    <ul ref="chat_window" class="chat_window">
      <li v-for="message in chat_thread" class="message">
        <p class="message_text">
          <span>{{ message.text }}</span>
        </p>
        <div class="message_details">
          <span>{{ message.user }}</span>
          <span>{{ new Date(message.timestamp).toLocaleString() }}</span>
        </div>
      </li>
    </ul>
    <section class="chat_box">
      <form @submit.prevent="handleFormSubmit">
        <input
          type="text"
          placeholder="Start typing here..."
          v-model="message"
        />
        <input type="submit" value="Send" />
      </form>
    </section>
  </main>
</template>
<style scoped>
h1 {
  margin-block: 0.5rem;
}

.chat_window {
  border: var(--border-style);
  border-radius: var(--border-radius);
  padding: var(--spacing-00);
  width: 100%;
  height: 50dvh;
  overflow-x: scroll;
  scroll-behavior: smooth;
  margin-block: 1rem;
}

ul {
  list-style: none;
}

.message {
  margin-bottom: 0.5rem;
  margin-inline-start: 0.5rem;
}

.message_text {
  display: flex;
  justify-content: space-between;
}

.message_details {
  display: flex;
  gap: 1rem;
  font-size: 0.75rem;
  font-style: italic;
  opacity: 0.5;
}

.scroll {
  background-color: rebeccapurple;
}
</style>
