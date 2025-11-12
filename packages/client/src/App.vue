<script setup lang="ts">
import { onMounted } from "vue";
import { GenericResponse } from "@types/packages";

const msg = defineModel("");

function handleFormSubmit() {}

onMounted(() => {
    const ws = new WebSocket("http://localhost:3000/chat");
    ws.onopen = () => console.log("### Connected to server");

    ws.onmessage = (e) => {
        const res = JSON.parse(e.data) as GenericResponse;
        console.log(res);

        switch (res.action) {
            case "open":
                console.log(res);
                break;
        }
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
