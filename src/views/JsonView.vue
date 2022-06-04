<script setup>
import { ref, watch, onUnmounted } from "vue";
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

onUnmounted(() => {
  clearTimeout(timer);
});
</script>

<template>
  <div class="user-block">
    <p class="block-title">Input</p>
    <!-- <div class="user-json">{{ jsonObj }}</div> -->

    <textarea
      v-focus
      name="userInput"
      class="user-json"
      placeholder="Type here to convert to json tree..."
      v-model.trim="jsonString"
    ></textarea>
  </div>
  <div class="result-block">
    <p class="block-title">Result</p>
    <div class="result-json" id="result-json">
      <JsonTree v-if="jsonObj !== undefined" :json="jsonObj" />
      <p v-else class="error-message">{{ errorMessage }}</p>
      <button class="copy" @click="copyToClipboard()">{{ copyText }} 📄</button>
    </div>
  </div>
</template>

<style scoped>
.user-block {
  width: 45%;
  margin-right: 5px;
}

.result-block {
  width: 55%;
  margin-left: 5px;
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
  overflow: scroll;
  resize: none;
  font-size: 16px;
}

.result-json {
  color: #456aa1;
  padding: 10px 10px 10px 20px;
  border: black 1px solid;
  height: calc(100% - 60px);
  overflow: scroll;
  background-color: #ffffff;
}

.error-message {
  color: #d02451;
  font-weight: bold;
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
}
</style>
