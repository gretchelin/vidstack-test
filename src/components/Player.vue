<script setup>
import { ref, toRefs, watch, computed, useTemplateRef, onBeforeUnmount } from 'vue';
import 'vidstack/bundle';
import 'vidstack/player/styles/default/theme.css';
import 'vidstack/player/styles/default/layouts/video.css';
import { VidstackPlayer, VidstackPlayerLayout } from 'vidstack/global/player';

const props = defineProps({
  url: String,
});

const { url } = toRefs(props);
const player = ref();
const targetRef = useTemplateRef('target');
const providerRef = useTemplateRef('provider');

const embedLink = computed(() => {
  let youtubeId = '';

  if(url.value){
    const urlObj = new URL(url.value);

    if(url.value?.includes('watch?v=')) {
      youtubeId = new URLSearchParams(urlObj.search).get('v');
    }
    if(url.value?.includes('/live/') || url.value?.includes('/embed/') || urlObj.host === 'youtu.be'){
      youtubeId = url.value.split('/')?.at(-1);
    }
  }

  return `https://www.youtube.com/embed/${youtubeId}`;
})

let playTimeout;
let unsub;

const loadPlayer = async () => {
  player.value?.destroy();

  player.value = await VidstackPlayer.create({
    target: targetRef.value,
    src: url.value,
    layout: new VidstackPlayerLayout({}),
  });


unsub = player.value.subscribe(({ paused, playing, error, canLoad, canPlay, canSeek, ended, started, waiting }) => {
  // Callback will fire when accessed state props update.
  console.log('subscribed', {paused, playing, error, canLoad, canPlay, canSeek, ended, started, waiting});
});

  // autoplay has successfully started.
targetRef.value.addEventListener('auto-play', (event) => {
  const requestEvent = event.request;
  console.log('auto-play req', requestEvent);
});

// autoplay has failed.
targetRef.value.addEventListener('auto-play-fail', (event) => {
  const requestEvent = event.request;
  console.log('auto-play-fail', event.detail);
});

targetRef.value.addEventListener('can-play', (event) => {
  console.log('can-play', event.detail);
  playTimeout = setTimeout(() => {
    if(player.value) {
      player.value.play();
    }
  }, 200);
})

player.value.addEventListener('error', (event) => {
  console.log('error', event.detail);
  jsContent.error = event.detail;
})

  console.log({player});
}

watch(
  [url, targetRef],
  ([value, target]) => {

    if(value && target){
      loadPlayer();
    }
  },
  {
    immediate: true,
    deep: true,
  }
);

onBeforeUnmount(() => {
  clearTimeout(playTimeout);
  if(unsub) {unsub();}
  player.value?.destroy();
})
</script>

<template>
  <div v-if="url" class="wrapper">
    <label class="label">EmbedCode</label>
    <iframe
      width="642"
      height="361"
      :src="embedLink"
      title="Embed Code"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowfullscreen
    ></iframe>
  </div>

  <div v-if="url" class="wrapper">
    <label class="label">Javascript</label>
    <div ref="target"></div>
  </div>

  <div v-if="url" class="wrapper">
    <label class="label">WebComponent</label>
    <media-player class="media-player" :src="url" autoplay>
      <media-provider ref="provider"></media-provider>
      <media-audio-layout></media-audio-layout>
      <media-video-layout></media-video-layout>
    </media-player>
  </div>
</template>

<style scoped>
.wrapper {
  width: 100%;
  margin: 10px 0;
  aspect-ratio: 16/9;
  border: solid 1px gainsboro;
  position: relative;

  > .label {
    position: absolute;
    top: 0;
    left: 0;
    background: black;
    color: white;
    padding: 4px 10px;
    font-size: 10px;
    z-index: 50;
  }
}

.media-player {
  width: 100%;
  height: 100%;
  background: #efefef;
  display: block;
}

.media-provider {
}
</style>
