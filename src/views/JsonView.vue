<script setup>
import { ref, watch, onUnmounted, onMounted } from "vue";
import JsonTree from "@/components/JsonTree.vue";
import SwitchCheckbox from "@/components/SwitchCheckbox.vue";
import CopiedBlock from "@/components/CopiedBlock.vue";

// example json
// {"null":null,"boolean":[true,false],"number":[0,2.1,2e8,-123456780123456780,2.1,2e8,-123456780,2.1,2e8,-123456780,2.1,2e8],"string":{"any characters":"abc def abc def abc def abc def abc def abc def abc def abc def abc def abc def abc def abc def abc def abc def abc def abc def abc def abc def abc def abc def abc def abc def abc def abc def abc def abc def abc def abc def abc def abc def abc def","quotation \"":"\\","backslash \\\\":"\\\\","slash \\/":"\\/","backspace \\b":"\\b","form feed \\f":"\\f","new line \\n":"\\n","carriage return \\r":"\\r","tab \\t":"\\t","hexadeci\u006Dal":"\u004A-\u005A"}}
// ["a", "b", { "c": 1 }]
// {"a": 1, "b": [2,{"c": ["d"]}]}
// [{"a": 1, "b": [2,{"c": [{"a": 1, "b": [2,{"c": ["d"]}]}]}]}]
// example unicode
// {"payload":{"depCity":"\u81fa\u5317", "body":"{\"data\":{\"flights\":[{\"depAirport\":\"TPE\",\"depCity\":\"\\u81fa\\u5317\",\"arrCity\":\"\\u65b0\\u52a0\\u5761\"}]}}"}}
// "\"\\u6fb3\\u9580\\u570b\\u969b\\u6a5f\\u5834\""
// "{\"data\":{\"timetable\":[{\"aircraftModel\":\"A321neo\",\"operatingAirlineCode\":\"JX\",\"depTerminal\":\"1\",\"depCity\":\"\\u81fa\\u5317\",\"depAirportName\":\"\\u81fa\\u7063\\u6843\\u5712\\u570b\\u969b\\u6a5f\\u5834\",\"arrAirport\":\"MFM\",\"arrCity\":\"\\u6fb3\\u9580\",\"arrAirportName\":\"\\u6fb3\\u9580\\u570b\\u969b\\u6a5f\\u5834\",\"duration\":105,\"arrivalDaysDifference\":0}]}}"

const jsonString = ref("");
const jsonObj = ref();
let errorMessage = ref("");

let isQuotationChecked = ref(false);
const switchInQuotes = (isChecked) => {
  isQuotationChecked.value = isChecked;
  if (isChecked && jsonString.value === "") {
    jsonString.value = '""';
  } else if (!isChecked && jsonString.value === '""') {
    jsonString.value = "";
  } else {
    renderResult(jsonString.value);
  }
};

let isUnicodeChecked = ref(false);
const switchUnicode = (isChecked) => {
  isUnicodeChecked.value = isChecked;
  renderResult(jsonString.value);
};

watch(jsonString, (userInput) => {
  renderResult(userInput);
});

const renderResult = (userInput) => {
  try {
    if (isQuotationChecked.value) {
      if (
          userInput.length >= 2 &&
          userInput.slice(0, 1) === '"' &&
          userInput.slice(userInput.length - 1) === '"'
      ) {
        if (
            userInput.slice(1, userInput.length - 1).replaceAll('\\"', '"') !== ""
        ) {
          if (isUnicodeChecked.value) {
            jsonObj.value = JSON.parse(
                userInput
                    .slice(1, userInput.length - 1)
                    .replaceAll('\\"', '"')
                    .replaceAll(/\\\\u/g, "\\u")
            );
          } else {
            jsonObj.value = JSON.parse(
                userInput.slice(1, userInput.length - 1).replaceAll('\\"', '"')
            );
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
          jsonObj.value = JSON.parse(
              userInput.replaceAll(/(?<=[^\\])\\u/g, "\\\\u")
          );
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

  isDragging.value = true;
  lastMouseX.value = e.clientX;

  userBlockWidth.value = userBlock.value.clientWidth;
  resultBlockWidth.value = resultBlock.value.clientWidth;
};

onMounted(() => {
  containerWidth.value = container.value.clientWidth;
  window.addEventListener("mousemove", handleMousemove);
  window.addEventListener("mouseup", handleMouseup);
  window.addEventListener('resize', handleResize);
});
onUnmounted(() => {
  window.removeEventListener("mousemove", handleMousemove);
  window.removeEventListener("mouseup", handleMouseup);
  window.removeEventListener("resize", handleResize);
});

const handleMousemove = (e) => {
  if (isDragging.value) {
    userBlock.value.style.width =
        userBlockWidth.value + (e.clientX - lastMouseX.value) + "px";
    resultBlock.value.style.width =
        resultBlockWidth.value - (e.clientX - lastMouseX.value) + "px";
  }
};

const handleMouseup = () => {
  isDragging.value = false;
};

const handleResize = () => {
  let resizeDiff = container.value.clientWidth - containerWidth.value;
  userBlock.value.style.width = (userBlock.value.clientWidth + Math.floor(resizeDiff / 2)) + "px";
  resultBlock.value.style.width = (container.value.clientWidth - userBlock.value.clientWidth - 2) + "px";
  containerWidth.value = container.value.clientWidth;
}
</script>

<template>
  <div class="container" ref="container">
    <div class="user-block" id="user-block" ref="userBlock">
      <div class="block-title">
        Input
        <div class="radio-block">
          In quotes("")?
          <!-- Wrap by quotation("")? -->
          <SwitchCheckbox :isChecked="isQuotationChecked" v-on:switchChecked="switchInQuotes" />
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
    <div class="result-block" id="result-block" ref="resultBlock">
      <div
          class="drag-block"
          id="drag-block"
          @mousedown="handleMouseDown"
      ></div>

      <div class="block-title">
        Result
        <div class="radio-block">
          Parse Unicode?
          <SwitchCheckbox :isChecked="isUnicodeChecked" v-on:switchChecked="switchUnicode" />
        </div>
      </div>
      <CopiedBlock
          :content="jsonObj !== undefined ? jsonObj : errorMessage"
          :type="jsonObj !== undefined ? 'json' : 'string'"
      >
        <JsonTree
            v-if="jsonObj !== undefined"
            :json="jsonObj"
            :transUnicode="isUnicodeChecked"
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
  min-width: 160px;
}

.result-block {
  width: calc(55% - 2px);
  min-width: 175px;
}

.drag-block {
  position: absolute;
  left: -4px;
  height: 100%;
  width: 4px;
  background-color: transparent;
  z-index: 3;
  cursor: col-resize;
}

.drag-block:hover {
  border: solid #b7b7b7;
  border-width: 0 3px;
}

.block-title {
  padding: 0 10px;
  font-size: 20px;
  text-align: center;
  height: 60px;
}

.block-title .radio-block {
  font-size: 16px;
}

.user-json {
  padding: 10px;
  border: black 1px solid;
  width: 100%;
  height: calc(100% - 60px);
  overflow-y: scroll;
  resize: none;
  font-size: 16px;
  background-color: var(--color-block-background1);
  color: var(--color-block-text1);
}

.result-json {
  color: var(--color-block-text3);
  border: black 1px solid;
  height: calc(100% - 60px);
  background-color: var(--color-block-background1);
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
</style>
