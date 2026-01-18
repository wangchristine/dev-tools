<script setup>
import { ref, watch, onUnmounted, onMounted } from "vue";
import CopiedBlock from "@/components/CopiedBlock.vue";
import JsonTree from "@/components/JsonTree.vue";
import SwitchCheckbox from "@/components/SwitchCheckbox.vue";

const jsonString = ref("");
const jsonObj = ref();
let errorMessage = ref("");

const selectExample = (event) => {
  switch (event.target.value) {
    // Default
    case "0":
      isQuotationChecked.value = false;
      isUnicodeChecked.value = false;
      jsonString.value = "";
      break;
    case "1":
      // All types
      isQuotationChecked.value = false;
      isUnicodeChecked.value = true;
      jsonString.value = String.raw`{"null":null,"boolean":[true,false],"number":[0, 1,4.8,2e6,-123],"string":{"any characters":"Dev Tools is very useful. Dev Tools is very useful. Dev Tools is very useful. Dev Tools is very useful. Dev Tools is very useful.","quotation \"":"\\","backslash \\\\":"\\\\","slash \\/":"\\/","backspace \\b":"\\b","form feed \\f":"\\f","new line \\n":"\\n","carriage return \\r":"\\r","tab \\t":"\\t","hexadeci\u006Dal":"\u004A-\u005A"}}`;
      break;
    case "2":
      // GCP log
      isQuotationChecked.value = false;
      isUnicodeChecked.value = true;
      jsonString.value = String.raw`{"logType":"net-info","method":"GET","direction":"OUT","type":"RESPONSE","url":"\/flight\/v2\/flight-status?date=2022-07-31","labels":[],"meta":[],"statusCode":200,"payload":{"time":1658883879,"headers":{"cache-control":["no-cache, private"],"date":["Wed, 27 Jul 2022 01:04:39 GMT"],"content-type":["application\/json"],"access-control-allow-origin":["*"],"access-control-allow-methods":["GET,POST,PUT,DELETE,OPTIONS"],"access-control-allow-headers":["Content-Type, X-Auth-Token, Origin"]},"body":"{\"data\":{\"flights\":[{\"depAirport\":\"TPE\",\"depCity\":\"\\u81fa\\u5317\",\"arrCity\":\"\\u65b0\\u52a0\\u5761\"}]}}"}}`;
      break;
    case "3":
      // Multi-level
      isQuotationChecked.value = false;
      isUnicodeChecked.value = false;
      jsonString.value = String.raw`[{"a": 1, "b": [2,{"c": [{"a": 1, "b": [2,{"c": ["d"]}]}]}]}]`;
      break;
    case "4":
      // Json string
      isQuotationChecked.value = true;
      isUnicodeChecked.value = true;
      jsonString.value = String.raw`"{\"data\":{\"timetable\":[{\"aircraftModel\":\"A321neo\",\"operatingAirlineCode\":\"JX\",\"depTerminal\":\"1\",\"depCity\":\"\\u81fa\\u5317\",\"depAirportName\":\"\\u81fa\\u7063\\u6843\\u5712\\u570b\\u969b\\u6a5f\\u5834\",\"arrAirport\":\"MFM\",\"arrCity\":\"\\u6fb3\\u9580\",\"arrAirportName\":\"\\u6fb3\\u9580\\u570b\\u969b\\u6a5f\\u5834\",\"duration\":105,\"arrivalDaysDifference\":0}]}}"`;
      break;
    case "5":
      // Unicode
      isQuotationChecked.value = true;
      isUnicodeChecked.value = true;
      jsonString.value = String.raw`"\"\\u6fb3\\u9580\\u570b\\u969b\\u6a5f\\u5834\""`;
      break;
  }
};

let isQuotationChecked = ref(false);
const switchInQuotes = (isChecked) => {
  isQuotationChecked.value = isChecked;
  if (isChecked && jsonString.value === "") {
    jsonString.value = '""';
  } else {
    renderResult(jsonString.value);
  }
};

let isAllOpen = ref(true);
const setIsAllOpen = (allOpen) => {
  isAllOpen.value = allOpen;
};

let isUnicodeChecked = ref(false);
const switchUnicode = (isChecked) => {
  isUnicodeChecked.value = isChecked;
  renderResult(jsonString.value);
};

watch(jsonString, (userInput) => {
  setIsAllOpen(true);
  renderResult(userInput);
});

const renderResult = (userInput) => {
  try {
    if (isQuotationChecked.value) {
      if (userInput.length >= 2 && userInput.startsWith('"') && userInput.endsWith('"')) {
        const content = userInput.slice(1, -1).replaceAll('\\"', '"');

        jsonObj.value = content
          ? JSON.parse(isUnicodeChecked.value ? content.replaceAll(/\\\\u/g, "\\u") : content)
          : undefined;
        errorMessage.value = "";
      } else {
        jsonObj.value = undefined;
        errorMessage.value = 'Input must be wrapped by quotation marks("").';
      }
    } else {
      if (userInput === "") {
        jsonObj.value = undefined;
      } else {
        if (isUnicodeChecked.value) {
          jsonObj.value = JSON.parse(userInput.replaceAll(/\\\\u/g, "\\u"));
        } else {
          jsonObj.value = JSON.parse(userInput.replaceAll(/(?<=[^\\])\\u/g, "\\\\u"));
        }
      }
      errorMessage.value = "";
    }
  } catch (e) {
    jsonObj.value = undefined;
    errorMessage.value = e.message;
  }
};

let isDragging = ref(false);
let lastMouseX = ref(0); // 按下當下 x 位置

// DOM
const userBlock = ref(null);
const resultBlock = ref(null);
let userBlockWidth = ref(0);
let resultBlockWidth = ref(0);

const handleMouseDown = (e) => {
  isDragging.value = true;
  lastMouseX.value = e.clientX;

  userBlockWidth.value = userBlock.value.clientWidth;
  resultBlockWidth.value = resultBlock.value.clientWidth;
};

onMounted(() => {
  window.addEventListener("mousemove", handleMousemove);
  window.addEventListener("mouseup", handleMouseup);
});

onUnmounted(() => {
  window.removeEventListener("mousemove", handleMousemove);
  window.removeEventListener("mouseup", handleMouseup);
});

const handleMousemove = (e) => {
  if (!isDragging.value) return;
  const delta = e.clientX - lastMouseX.value;
  userBlock.value.style.width = `${userBlockWidth.value + delta}px`;
  resultBlock.value.style.width = `${resultBlockWidth.value - delta}px`;
};

const handleMouseup = () => {
  isDragging.value = false;
};
</script>

<template>
  <div class="tool-container">
    <section class="control-panel">
      <div class="control-flex-wrapper">
        <div class="control-main-area">
          <div class="control-row-group">
            <div class="control-item">
              <label class="group-label">Quick Examples</label>
              <select class="custom-select" @change="selectExample($event)">
                <option value="0">- Select Example -</option>
                <option value="1">All Data Types</option>
                <option value="2">GCP JSON Log</option>
                <option value="3">Multi-level Nesting</option>
                <option value="4">JSON String</option>
                <option value="5">Unicode String</option>
              </select>
            </div>
            <div class="control-item">
              <label class="group-label">Tree Controls</label>
              <div class="btn-group">
                <button class="icon-btn" @click="setIsAllOpen(true)" :disabled="isAllOpen === true" title="Expand All">
                  <font-awesome-icon :icon="['fas', 'expand']" /> Expand
                </button>
                <button
                  class="icon-btn"
                  @click="setIsAllOpen(false)"
                  :disabled="isAllOpen === false"
                  title="Collapse All"
                >
                  <font-awesome-icon :icon="['fas', 'compress']" /> Collapse
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="control-side-area">
          <div class="settings-grid">
            <div class="setting-row">
              <span class="setting-label">In Quotes ("")?</span>
              <SwitchCheckbox :is-checked="isQuotationChecked" @switch-checked="switchInQuotes" />
            </div>
            <div class="setting-row">
              <span class="setting-label">Parse Unicode?</span>
              <SwitchCheckbox :is-checked="isUnicodeChecked" @switch-checked="switchUnicode" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <div class="workspace">
      <div class="editor-pane" ref="userBlock">
        <div class="pane-header">
          <span class="pane-title">JSON INPUT</span>
          <button class="clear-btn" @click="jsonString = ''" v-if="jsonString">Clear</button>
        </div>
        <textarea v-model.trim="jsonString" v-focus placeholder="Type JSON here..." class="custom-textarea"></textarea>
      </div>

      <div class="drag-handle" @mousedown="handleMouseDown">
        <font-awesome-icon :icon="['fas', 'grip-vertical']" />
      </div>

      <div class="editor-pane" ref="resultBlock">
        <div class="pane-header">
          <span class="pane-title">TREE VIEW</span>
        </div>
        <div class="result-wrapper">
          <CopiedBlock
            :content="jsonObj !== undefined ? jsonObj : errorMessage"
            :type="jsonObj !== undefined ? 'json' : 'string'"
          >
            <JsonTree
              v-if="jsonObj !== undefined"
              :json="jsonObj"
              :trans-unicode="isUnicodeChecked"
              :is-all-open="isAllOpen"
              @manual-open="setIsAllOpen(null)"
            />
            <p v-else class="error-text">
              <font-awesome-icon v-if="errorMessage" :icon="['fas', 'circle-exclamation']" />{{ errorMessage }}
            </p>
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
  height: 100%;
}

.control-panel {
  background: var(--surface-1);
  padding: 20px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-subtle);
  flex-shrink: 0;
}

.control-flex-wrapper {
  display: flex;
  gap: 30px;
  flex-wrap: wrap;
}

/* Setting Left */
.control-main-area {
  flex: 2;
}

.control-row-group {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
}

.group-label {
  display: block;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--text-secondary);
  margin-bottom: 8px;
  text-transform: uppercase;
}

.custom-select {
  padding: 8px 12px;
  border-radius: 8px;
  background: var(--surface-2);
  border: 1px solid var(--border-subtle);
  color: var(--text-primary);
  width: 100%;
}

.btn-group {
  display: flex;
  gap: 8px;
}

.icon-btn {
  padding: 8px 12px;
  background: var(--surface-2);
  border: 1px solid var(--border-subtle);
  border-radius: 6px;
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 0.85rem;
  transition: 0.2s;
}

.icon-btn:hover:not(:disabled) {
  border-color: var(--brand-color);
  color: var(--brand-color);
}

.icon-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Setting Right */
.control-side-area {
  flex: 1;
  min-width: 200px;
}

.settings-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: var(--surface-2);
  padding: 12px 16px;
  border-radius: var(--radius-md);
}

.setting-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.setting-label {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

/* Content */
.workspace {
  display: flex;
  flex: 1;
  min-height: 500px;
  gap: 0;
  overflow: hidden;
}

.editor-pane {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 200px;
}

.editor-pane:first-child {
  width: 45%;
}
.editor-pane:last-child {
  flex: 1;
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
  background: var(--surface-1);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  padding: 16px;
  color: var(--text-primary);
  resize: none;
  outline: none;
}

.custom-textarea:focus {
  border-color: var(--brand-color);
}

.drag-handle {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: col-resize;
  width: 12px;
  background: var(--surface-2);
  color: var(--text-secondary);
}

.drag-handle:hover {
  color: var(--brand-color);
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

@media (max-width: 768px) {
  .workspace {
    flex-direction: column;
    gap: 12px;
  }
  .drag-handle {
    display: none;
  }
  .editor-pane {
    width: 100% !important;
    height: 400px;
  }
  .control-flex-wrapper {
    flex-direction: column;
  }
}
</style>
