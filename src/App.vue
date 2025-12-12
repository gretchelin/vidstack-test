<script setup>
import Player from './components/Player.vue';
import { ref, useTemplateRef, watch } from 'vue';

const url = ref();
const playerRef = useTemplateRef('player');
const playerKey = ref(1);

watch(playerRef, (newVal, oldVal) => {
  console.log('player ref: ', newVal);
});

const onSubmit = (evt) => {
  evt.preventDefault();

  const form = evt.target;
  const fd = new FormData(form);

  url.value = fd.get('url')?.trim();
};

const copy = async (event) => {
  const target = event?.target;
  const text = target?.innerText;

  try {
    await navigator.clipboard.writeText(text);
  } catch (error) {
    console.error(error.message);
  }
}
</script>

<template>
  <div>
  sample live links: <br/>
  <span @click="copy" title="click to copy">https://youtu.be/vYIYIVmOo3Q</span><br/>
  <span @click="copy" title="click to copy">https://www.youtube.com/watch?v=p7rUqNRXRB0</span><br/>
  <span @click="copy" title="click to copy">https://www.youtube.com/live/yNKvkPJl-tg</span>
  </div>
  <form @submit.prevent="onSubmit" class="flex gap-4 w-full">
    <input
      type="text"
      placeholder="youtube url"
      name="url"
      class="bg-white px-2 py-1"
    />
    <button type="submit">Change URL</button>
  </form>

  <button type="button" @click="playerKey += 1">Change player key</button>
  <button type="button" @click="url = ''">Clear URL</button>

  <Player :url="url" :key="playerKey" />
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
