<script setup>
import { ref, watch } from "vue";
import CopiedBlock from "@/components/CopiedBlock.vue";

const selectedType = ref("base64");
const selectedMethod = ref("encode");

const userString = ref("");
const resultString = ref("");
let errorMessage = ref("");
let typeDescription = ref("");

const types = [
  {
    type: "base64",
    label: "Base64",
    description: "Handles both ASCII and Unicode (UTF-8).",
  },
  {
    type: "url",
    label: "URL",
    description: "Encodes characters for URI safety. Convert all characters except: A-Z a-z 0-9 - _ . ! ~ * ' ()",
  },
];

watch(
  [selectedType, selectedMethod],
  ([type]) => {
    const target = types.find((t) => t.type === type);
    typeDescription.value = target ? target.description : "";
  },
  { immediate: true },
);

watch([userString, selectedType, selectedMethod], ([userInput]) => {
  if (!userString.value) {
    resultString.value = "";
    errorMessage.value = "";
    return;
  }
  try {
    if (selectedType.value === "base64") {
      if (selectedMethod.value === "encode") {
        resultString.value = btoa(
          encodeURIComponent(userInput).replace(/%([0-9A-F]{2})/g, function toSolidBytes(match, p1) {
            return String.fromCharCode("0x" + p1);
          }),
        );
      } else {
        resultString.value = decodeURIComponent(
          atob(userInput)
            .split("")
            .map(function (c) {
              return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join(""),
        );
      }
    } else if (selectedType.value === "url") {
      if (selectedMethod.value === "encode") {
        resultString.value = encodeURIComponent(userInput);
      } else {
        resultString.value = decodeURIComponent(userInput);
      }
    }
    errorMessage.value = "";
  } catch (e) {
    errorMessage.value = e.message;
  }
});
</script>

<template>
  <div class="tool-container">
    <section class="control-panel">
      <div class="control-flex-wrapper">
        <div class="control-main-area">
          <div class="control-group">
            <label class="group-label">1. Select Type</label>
            <div class="segmented-control">
              <button
                v-for="t in types"
                :key="t.type"
                :class="{ active: selectedType === t.type }"
                @click="selectedType = t.type"
              >
                {{ t.label }}
              </button>
            </div>
          </div>

          <div class="control-group">
            <label class="group-label">2. Select Method</label>
            <div class="segmented-control">
              <button :class="{ active: selectedMethod === 'encode' }" @click="selectedMethod = 'encode'">
                Encode
              </button>
              <button :class="{ active: selectedMethod === 'decode' }" @click="selectedMethod = 'decode'">
                Decode
              </button>
            </div>
          </div>
        </div>

        <div class="control-side-area">
          <div class="desc-card">
            <div class="desc-header">
              <font-awesome-icon :icon="['fas', 'circle-check']" class="desc-icon" />
              <span class="desc-title">{{ selectedType.toUpperCase() }} Description</span>
            </div>
            <p class="desc-content">{{ typeDescription }}</p>
          </div>
        </div>
      </div>
    </section>

    <div class="workspace">
      <div class="editor-pane">
        <div class="pane-header">
          <span class="pane-title">INPUT</span>
          <button class="clear-btn" @click="userString = ''" v-if="userString">Clear</button>
        </div>
        <textarea v-model="userString" v-focus placeholder="Type here..." class="custom-textarea"></textarea>
      </div>

      <div class="editor-pane">
        <div class="pane-header"><span class="pane-title">RESULT</span></div>
        <div class="result-wrapper">
          <CopiedBlock :content="errorMessage || resultString">
            <div v-if="errorMessage" class="error-text">
              <font-awesome-icon :icon="['fas', 'triangle-exclamation']" />
              {{ errorMessage }}
            </div>
            <div v-else class="output-text">{{ resultString }}</div>
          </CopiedBlock>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tool-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  min-height: 100%;
  padding-bottom: 10px;
}

.control-panel {
  background: var(--surface-1);
  padding: 24px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-subtle);
  flex-shrink: 0;
}

.control-flex-wrapper {
  display: flex;
  gap: 32px;
  align-items: stretch;
}

/* 按鈕區 */
.control-main-area {
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.group-label {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--text-secondary);
  text-transform: uppercase;
}

.segmented-control {
  display: flex;
  background: var(--surface-2);
  padding: 4px;
  border-radius: 10px;
}

.segmented-control button {
  flex: 1;
  padding: 10px;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  font-size: 0.9rem;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.2s;
}

.segmented-control button.active {
  background: var(--surface-1);
  color: var(--brand-color);
  box-shadow: var(--shadow-sm);
}

/* 描述區 */
.control-side-area {
  flex: 1;
  display: flex;
}

.desc-card {
  width: 100%;
  background: var(--brand-color-soft);
  border-radius: var(--radius-md);
  padding: 16px;
  border: 1px solid rgba(96, 182, 153, 0.15);
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.desc-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  color: var(--brand-color);
}

.desc-icon {
  color: var(--brand-color);
}

.desc-title {
  font-size: 0.85rem;
  font-weight: 800;
}

.desc-content {
  font-size: 0.85rem;
  color: var(--text-secondary);
  line-height: 1.5;
}

/* workspace */
.workspace {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  min-height: 500px;
}

.editor-pane {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}

.pane-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pane-title {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--text-secondary);
}

.clear-btn {
  background: transparent;
  border: none;
  color: var(--brand-color);
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
}

.custom-textarea {
  flex: 1;
  min-height: 250px;
  background: var(--surface-1);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  padding: 16px;
  color: var(--text-primary);
  font-size: 0.95rem;
  resize: none;
  outline: none;
}

.custom-textarea:focus {
  border-color: var(--brand-color);
}

.result-wrapper {
  flex: 1;
  min-height: 0;
}

.error-text {
  color: #ef4444;
  line-height: 1.6;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

.output-text {
  word-break: break-all;
  white-space: pre-wrap; /* 保留空格並換行 */
}

@media (max-width: 1024px) {
  .tool-container {
    overflow-y: auto;
  }
  .control-panel {
    flex-direction: column;
    align-items: stretch;
  }
  .control-flex-wrapper {
    flex-direction: column;
    gap: 20px;
  }
  .workspace {
    grid-template-columns: 1fr;
    min-height: auto;
  }
  .custom-textarea {
    min-height: 200px;
  }
}

@media (max-width: 768px) {
  .control-panel {
    padding: 16px;
  }
  .control-group {
    min-width: 100%;
    text-align: center;
  }
  .segmented-control {
    justify-content: center;
  }
}
</style>
