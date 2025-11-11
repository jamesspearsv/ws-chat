<script setup lang="ts">
import { onMounted } from "vue";

const msg = defineModel("");

function handleFormSubmit() {}

onMounted(() => {
    const ws = new WebSocket("/chat");
    ws.onopen = (event) => {
        console.log(event);
    };
});
</script>

<template>
    <main>
        <h1>Hello, Chat App!</h1>
        <section class="chat_window">
            <ul></ul>
        </section>
        <section class="chat_box">
            <form @submit.prevent="handleFormSubmit">
                <input
                    type="text"
                    placeholder="Start typing here..."
                    v-model="msg"
                />
                <input type="submit" value="Send" />
            </form>
        </section>
    </main>
</template>
<style scoped>
.chat_window {
    border: var(--border-style);
    border-radius: var(--border-radius);
    padding: var(--spacing-00);
    width: 100%;
    height: 60vh;
    overflow-x: scroll;
}
</style>
