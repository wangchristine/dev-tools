<script setup>
import { ref, onUnmounted } from "vue";

const props = defineProps({
  content: {
    type: [String, Number, Boolean, Array, Object],
    default: null,
  },
  type: {
    // content type: json, string
    type: [String],
    default: "string",
  },
});

const isCopied = ref(false);
let timer = null;

const copyToClipboard = () => {
  clearTimeout(timer);
  let clipboardText = "";
  if (props.content !== null) {
    if (props.type === "string") {
      clipboardText = props.content;
    } else {
      clipboardText = JSON.stringify(props.content, null, 2).replace(/\\"/g, '"').replaceAll(/\\\\/g, "\\");
    }
  }

  navigator.clipboard.writeText(clipboardText).then(() => {
    isCopied.value = true;
    timer = setTimeout(() => {
      isCopied.value = false;
    }, 1000);
  });
};

onUnmounted(() => {
  clearTimeout(timer);
});
</script>

<template>
  <div class="copied-block-wrapper">
    <div class="action-bar">
      <span class="format-tag">{{ type.toUpperCase() }}</span>
      <button class="copy-btn" :class="{ 'is-success': isCopied }" @click="copyToClipboard()">
        <font-awesome-icon :icon="['fas', isCopied ? 'check' : 'copy']" />
        <span>{{ isCopied ? "Copied!" : "Copy" }}</span>
      </button>
    </div>

    <div class="scroll-area">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.copied-block-wrapper {
  display: flex;
  flex-direction: column;
  background-color: var(--surface-1);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-subtle);
  height: 100%;
}

.action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background-color: var(--surface-2);
  border-bottom: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
}

.format-tag {
  font-size: 0.7rem;
  font-weight: 800;
  color: var(--text-secondary);
  background: var(--border-subtle);
  padding: 2px 6px;
  border-radius: 4px;
}

.copy-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  background: var(--surface-1);
  border: 1px solid var(--border-subtle);
  color: var(--brand-color);
  border-radius: 4px;
  font-size: 0.75rem;
  cursor: pointer;
}

.scroll-area {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  font-size: 0.95rem;
  line-height: 1.6;
}
</style>
