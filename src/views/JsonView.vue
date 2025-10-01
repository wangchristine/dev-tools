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
  } else if (!isChecked && jsonString.value === '""') {
    jsonString.value = "";
  } else {
    setIsAllOpen(true);
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
      if (userInput.length >= 2 && userInput.slice(0, 1) === '"' && userInput.slice(userInput.length - 1) === '"') {
        if (userInput.slice(1, userInput.length - 1).replaceAll('\\"', '"') !== "") {
          if (isUnicodeChecked.value) {
            jsonObj.value = JSON.parse(
              userInput
                .slice(1, userInput.length - 1)
                .replaceAll('\\"', '"')
                .replaceAll(/\\\\u/g, "\\u"),
            );
          } else {
            jsonObj.value = JSON.parse(userInput.slice(1, userInput.length - 1).replaceAll('\\"', '"'));
          }
        } else {
          jsonObj.value = undefined;
        }
        errorMessage.value = "";
      } else {
        jsonObj.value = undefined;
        errorMessage.value = 'Input data must wrap by quotation marks("").';
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
const container = ref(null);
const userBlock = ref(null);
const resultBlock = ref(null);

let containerWidth = ref(0);
let userBlockWidth = ref(0);
let resultBlockWidth = ref(0);

const handleMouseDown = (e) => {
  console.log("down");
  e.preventDefault();

  isDragging.value = true;
  lastMouseX.value = e.clientX;

  userBlockWidth.value = userBlock.value.clientWidth;
  resultBlockWidth.value = resultBlock.value.clientWidth;
};

onMounted(() => {
  containerWidth.value = container.value.clientWidth;
  window.addEventListener("mousemove", handleMousemove);
  window.addEventListener("mouseup", handleMouseup);
  window.addEventListener("resize", handleResize);
});
onUnmounted(() => {
  window.removeEventListener("mousemove", handleMousemove);
  window.removeEventListener("mouseup", handleMouseup);
  window.removeEventListener("resize", handleResize);
});

const handleMousemove = (e) => {
  if (isDragging.value) {
    userBlock.value.style.width = userBlockWidth.value + (e.clientX - lastMouseX.value) + "px";
    resultBlock.value.style.width = resultBlockWidth.value - (e.clientX - lastMouseX.value) + "px";
  }
};

const handleMouseup = () => {
  isDragging.value = false;
};

const handleResize = () => {
  if (window.innerWidth >= 768) {
    let resizeDiff = container.value.clientWidth - containerWidth.value;
    userBlock.value.style.width = userBlock.value.clientWidth + Math.floor(resizeDiff / 2) + "px";
    resultBlock.value.style.width = container.value.clientWidth - userBlock.value.clientWidth - 12 + "px";
    containerWidth.value = container.value.clientWidth;
  } else {
    userBlock.value.style.width = "100%";
    resultBlock.value.style.width = "100%";
  }
};
</script>

<template>
  <div class="container" ref="container">
    <div class="user-block" id="user-block" ref="userBlock">
      <div class="title-block">
        <div class="title">Input</div>
        <div class="action">
          <select name="example" class="example" @change="selectExample($event)">
            <option value="0" selected>-Examples-</option>
            <option value="1">Data types</option>
            <option value="2">GCP log</option>
            <option value="3">Multi-level</option>
            <option value="4">Json string</option>
            <option value="5">Unicode</option>
          </select>
          <div class="radio-block">
            <div class="title">In quotes("")?</div>
            <!-- Wrap by quotation("")? -->
            <SwitchCheckbox :is-checked="isQuotationChecked" @switch-checked="switchInQuotes" />
          </div>
        </div>
      </div>
      <textarea
        v-focus
        name="userInput"
        class="user-json"
        placeholder="Type here to convert to json tree..."
        v-model.trim="jsonString"
      ></textarea>
    </div>
    <div class="drag-block" id="drag-block" @mousedown="handleMouseDown">
      <FontAwesomeIcon :icon="['fa', 'grip-vertical']" size="sm" />
    </div>

    <div class="result-block" id="result-block" ref="resultBlock">
      <div class="title-block">
        <div class="title">Result</div>
        <div class="action">
          <button
            class="all-open-control"
            data-text="Expand All"
            @click="setIsAllOpen(true)"
            :disabled="isAllOpen === true"
          >
            <FontAwesomeIcon :icon="['fas', 'plus']" size="sm" />
          </button>
          <button
            class="all-open-control"
            data-text="Collapse All"
            @click="setIsAllOpen(false)"
            :disabled="isAllOpen === false"
          >
            <FontAwesomeIcon :icon="['fas', 'minus']" size="sm" />
          </button>
          <div class="radio-block">
            <div class="title">Parse Unicode?</div>
            <SwitchCheckbox :is-checked="isUnicodeChecked" @switch-checked="switchUnicode" />
          </div>
        </div>
      </div>
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
        <p v-else class="error-message">{{ errorMessage }}</p>
      </CopiedBlock>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  justify-content: space-around;
  height: 100%;
}

.user-block {
  width: 45%;
  min-width: 270px;
}

.drag-block {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 12px;
  z-index: 3;
  cursor: col-resize;
}

.result-block {
  width: calc(55% - 12px);
  min-width: 270px;
}

.title-block {
  display: flex;
  align-items: center;
  font-size: 20px;
  height: 40px;
  width: 100%;
  border: var(--color-block-text1) 1px solid;
  background-color: var(--color-block-background2);
}

.title-block > .title {
  padding: 0 10px;
  border-right: solid 1px;
}

.title-block .action {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 0 5px;
  width: 100%;
  height: 100%;
}

.title-block .action .example {
  padding: 2px 0;
  border-radius: 3px;
  max-width: 95px;
}

.title-block .action .radio-block {
  font-size: 16px;
  line-height: 1;
  text-align: center;
}

.title-block .action .radio-block > .title {
  font-size: 14px;
}

.all-open-control {
  position: relative;
  padding: 2px 5px;
  font-size: 14px;
  font-weight: bold;
  margin-left: 2px;
}

.all-open-control::before {
  position: absolute;
  top: -32px;
  left: 0;
  z-index: 1;
  width: 100px;
  background-color: var(--color-block-background1);
  border: 1px solid #888;
  border-radius: 2px;
  color: var(--color-text);
  content: attr(data-text);
  padding: 6px 10px;
  border-radius: 5px;
  display: none;
}

.all-open-control:hover::before {
  display: block;
}

.user-json {
  padding: 10px;
  border: var(--color-block-text1) 1px solid;
  width: 100%;
  height: calc(100% - 40px);
  min-height: 100px;
  overflow-y: auto;
  resize: none;
  font-size: 16px;
  background-color: var(--color-block-background1);
  color: var(--color-block-text1);
}

.tree-json {
  position: absolute;
  padding: 10px 10px 10px 20px;
  width: 100%;
  height: 100%;
  overflow-y: scroll;
}

.error-message {
  color: #d02451;
  font-weight: bold;
}

@media (max-width: 768px) {
  .container {
    justify-content: flex-start;
    flex-direction: column;
  }

  .user-block {
    width: 100%;
  }

  .user-json {
    height: 400px;
  }

  .drag-block {
    display: none;
  }

  .result-block {
    width: 100%;
    margin-top: 20px;
    padding-bottom: 30px;
  }

  .result-div {
    height: 400px;
  }
}
</style>
