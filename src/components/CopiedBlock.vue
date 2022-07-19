<script setup>
import { ref, onUnmounted } from "vue";

const props = defineProps({
  content: {
    type: [String, Number, Boolean, Array, Object],
    required: false,
  },
  type: {
    // content type: json, string
    type: [String],
    required: false,
    default: "string",
  },
});

let copyText = ref("Copy");
let timer = null;
// DOM
const copy = ref(null);
const copyToClipboard = () => {
  clearTimeout(timer);
  let clipboardText = ref("");
  if (props.content !== undefined) {
    if (props.type === "string") {
      clipboardText.value = props.content;
    } else {
      clipboardText.value = JSON.stringify(props.content, null, 2);
    }
  }

  navigator.clipboard
    .writeText(clipboardText.value)
    .then(() => {
      copyText.value = "Copied!";
      copy.value.style.backgroundColor = "#ed6b6b";
      console.log("Copied to clipboard.");
      timer = setTimeout(() => {
        copyText.value = "Copy";
        copy.value.style.backgroundColor = "#bb8e8e";
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
      {{ copyText }} 📄
    </button>
  </div>
</template>

<style scoped>
.result-div {
  color: var(--color-block-text3);
  border: black 1px solid;
  height: calc(100% - 60px);
  background-color: var(--color-block-background);
}
.result-content {
  position: absolute;
  padding: 10px 10px 10px 20px;
  width: 100%;
  height: 100%;
  overflow-y: scroll;
}
.copy {
  position: absolute;
  top: 0;
  right: 0;
  background-color: #bb8e8e;
  color: white;
  border: 0;
  padding: 8px 12px;
  font-size: 14px;
  cursor: pointer;
  z-index: 2;
  opacity: 0.5;
}
.result-div:hover > .copy {
  opacity: 1;
}
</style>
