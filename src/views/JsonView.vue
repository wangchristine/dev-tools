<script setup>
import { ref, watch, onUnmounted, onMounted } from "vue";
import JsonTree from "@/components/JsonTree.vue";

// const jsonObj = reactive({"null":null,"boolean":[true,false],"number":[0,2.1,2e8,-123456780123456780,2.1,2e8,-123456780,2.1,2e8,-123456780,2.1,2e8,-123456780,2.1,2e8,-123456780,2.1,2e8,-123456780,2.1,2e8,-123456780,2.1,2e8,-123456780,2.1,2e8,-123456780,2.1,2e8,-123456780,2.1,2e8,-123456780,2.1,2e8,-123456780,2.1,2e8,-123456780,2.1,2e8,-123456780,2.1,2e8,-123456780,2.1,2e8,-123456780,2.1,2e8,-123456780,2.1,2e8,-123456780,2.1,2e8,-123456780],"string":{"any characters":"abc def abc def abc def abc def abc def abc def abc def abc def abc def abc def abc def abc def abc def abc def abc def abc def abc def abc def abc def abc def abc def abc def abc def abc def abc def abc def abc def abc def abc def abc def abc def","quotation \"":"\\","backslash \\\\":"\\\\","slash \\/":"\\/","backspace \\b":"\\b","form feed \\f":"\\f","new line \\n":"\\n","carriage return \\r":"\\r","tab \\t":"\\t","hexadeci\\u006Dal":"\\u004A-\\u005A"}});
// const jsonObj = reactive(["a", "b", { "c": 1 }]);
// const jsonObj = reactive({"a": 1, "b": [2,3,4]});
// const jsonObj = reactive([2,3,4]);
// const jsonObj = reactive({"a": 1, "b": [2,{"c": ["d"]}]});
// const jsonObj = reactive([{"a": 1, "b": [2,{"c": ["d"]}]}]);
// const jsonObj = reactive([{"a": 1, "b": [2,{"c": [{"a": 1, "b": [2,{"c": ["d"]}]}]}]}]);
// let jsonObj = reactive();

// const jsonString = ref("[{\"a\": 1, \"b\": [2,{\"c\": [{\"a\": 1, \"b\": [2,{\"c\": [\"d\"]}]}]}]}]");
const jsonString = ref("");
// const jsonString = reactive("[]");
const jsonObj = ref();
let errorMessage = ref("");
let copyText = ref("Copy");

watch(jsonString, (userInput) => {
  try {
    if (userInput === "") {
      jsonObj.value = undefined;
    } else {
      jsonObj.value = JSON.parse(userInput);
    }
    errorMessage.value = "";
  } catch (e) {
    jsonObj.value = undefined;
    errorMessage.value = e.message;
  }
});

let timer = null;
const copyToClipboard = () => {
  clearTimeout(timer);
  let jsonFormat = ref("");

  if (jsonObj.value !== undefined) {
    jsonFormat.value = JSON.stringify(jsonObj.value, null, 2);
  } else {
    if (errorMessage.value !== "") {
      jsonFormat.value = errorMessage.value;
    }
  }

  navigator.clipboard
    .writeText(jsonFormat.value)
    .then(() => {
      copyText.value = "Copied!";
      console.log("Copied to clipboard.");
      timer = setTimeout(() => {
        copyText.value = "Copy";
      }, 1000);
    })
    .catch((err) => {
      console.log("Can't copy!", err);
    });
};

let isDragging = ref(false);
let lastMouseX = ref(0); // 按下當下 x 位置

// DOM
const userBlock = ref(null);
const resultBlock = ref(null);

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
  window.addEventListener("mousemove", handleMousemove);
  window.addEventListener("mouseup", handleMouseup);
});
onUnmounted(() => {
  clearTimeout(timer);
  window.removeEventListener("mousemove", handleMousemove);
  window.removeEventListener("mouseup", handleMouseup);
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
</script>

<template>
  <div class="user-block" id="user-block" ref="userBlock">
    <p class="block-title">Input</p>
    <textarea
      v-focus
      name="userInput"
      class="user-json"
      placeholder="Type here to convert to json tree..."
      v-model.trim="jsonString"
    ></textarea>
  </div>
  <div class="result-block" id="result-block" ref="resultBlock">
    <div class="drag-block" id="drag-block" @mousedown="handleMouseDown"></div>

    <p class="block-title">Result</p>
    <div class="result-json" id="result-json">
      <div class="tree-json">
        <JsonTree v-if="jsonObj !== undefined" :json="jsonObj" />
        <p v-else class="error-message">{{ errorMessage }}</p>
      </div>
      <button class="copy" @click="copyToClipboard()">{{ copyText }} 📄</button>
    </div>
  </div>
</template>

<style scoped>
.user-block {
  width: 45%;
  /*width: calc(45% - 10px);*/
  /* margin-right: 5px; */
  min-width: 150px;
}

.result-block {
  /*width: 55%;*/
  width: calc(55% - 2px);
  /* margin-left: 5px; */
  min-width: 150px;
}

.drag-block {
  position: absolute;
  left: -4px;
  height: 100%;
  width: 4px;
  background-color: transparent;
  z-index: 999;
  cursor: col-resize;
}

.drag-block:hover {
  border: solid #b7b7b7;
  border-width: 0 3px;
}

.block-title {
  padding: 10px;
  font-size: 20px;
  text-align: center;
}

.user-json {
  padding: 10px;
  border: black 1px solid;
  width: 100%;
  height: calc(100% - 60px);
  overflow-y: scroll;
  resize: none;
  font-size: 16px;
}

.result-json {
  color: #456aa1;
  border: black 1px solid;
  height: calc(100% - 60px);
  background-color: #ffffff;
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

.copy {
  position: absolute;
  top: 0;
  right: 18px;
  background-color: #bb8e8e;
  color: white;
  border: 0;
  padding: 8px 12px;
  font-size: 14px;
  cursor: pointer;
  z-index: 999;
}
</style>
