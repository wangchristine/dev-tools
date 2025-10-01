<script setup>
import { ref, onUnmounted } from "vue";

const props = defineProps({
  content: {
    type: [String, Number, Boolean, Array, Object],
    required: false,
    default: null,
  },
  type: {
    // content type: json, string
    type: [String],
    required: false,
    default: "string",
  },
});

const isCopied = ref(false);
let timer = null;

const copyToClipboard = () => {
  clearTimeout(timer);
  let clipboardText = ref("");
  if (props.content !== undefined) {
    if (props.type === "string") {
      clipboardText.value = props.content;
    } else {
      clipboardText.value = JSON.stringify(props.content, null, 2).replace(/\\"/g, '"').replaceAll(/\\\\/g, "\\");
    }
  }

  navigator.clipboard
    .writeText(clipboardText.value)
    .then(() => {
      isCopied.value = true;
      console.log("Copied to clipboard.");
      timer = setTimeout(() => {
        isCopied.value = false;
      }, 1000);
    })
    .catch((err) => {
      console.log("Can't copy!", err);
    });
};

onUnmounted(() => {
  clearTimeout(timer);
});
</script>

<template>
  <div class="result-div">
    <div class="result-content">
      <slot></slot>
    </div>
    <button class="copy" ref="copy" @click="copyToClipboard()">
      {{ isCopied ? "Copied!" : "Copy" }}
      <FontAwesomeIcon v-if="isCopied" :icon="['fas', 'check']" />
      <FontAwesomeIcon v-else :icon="['fas', 'file']" />
    </button>
  </div>
</template>

<style scoped>
.result-div {
  color: var(--color-block-text3);
  border: var(--color-block-text1) 1px solid;
  height: calc(100% - 40px);
  background-color: var(--color-block-background1);
  min-height: 100px;
}

.result-content {
  position: absolute;
  padding: 10px 10px 10px 20px;
  width: 100%;
  height: 100%;
  overflow-y: auto;
}

.copy {
  position: absolute;
  top: 12px;
  right: 20px;
  background-color: var(--color-main-theme);
  color: white;
  border: 0;
  border-radius: 5px;
  padding: 8px 12px;
  font-size: 14px;
  cursor: pointer;
  z-index: 2;
  opacity: 0.5;
}

.result-div:hover > .copy {
  opacity: 0.9;
}
</style>
