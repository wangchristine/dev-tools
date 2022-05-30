<script setup>
import { ref, watch } from "vue";
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
let isError = ref(false);
let errorMessage = ref("");

watch(jsonString, (userInput) => {
  try {
    if (userInput.trim() === "") {
      jsonObj.value = undefined;
    } else {
      jsonObj.value = JSON.parse(userInput);
    }
    isError.value = false;
    errorMessage.value = "";
  } catch (e) {
    jsonObj.value = undefined;
    isError.value = true;
    errorMessage.value = e.message;
  }
});
</script>

<template>
  <div class="user-block">
    <p class="block-title">Input</p>
    <!-- <div class="user-json">{{ jsonObj }}</div> -->

    <textarea
      name="userInput"
      class="user-json"
      v-model="jsonString"
    ></textarea>
  </div>
  <div class="result-block">
    <p class="block-title">Result</p>
    <div class="result-json">
      <JsonTree v-if="!isError" :json="jsonObj" />
      <p class="error-message" v-else>{{ errorMessage }}</p>
    </div>
  </div>
</template>

<style scoped>
.user-block {
  width: 45%;
}

.result-block {
  width: 55%;
}

.block-title {
  padding: 10px;
  font-size: 20px;
  text-align: center;
}

.user-json {
  padding: 10px;
  border: black 1px solid;
  margin-right: 5px;
  height: calc(100vh - 80px);
  width: 100%;
  overflow: scroll;
  resize: none;
}

.result-json {
  color: #456aa1;
  padding: 10px 10px 10px 20px;
  border: black 1px solid;
  margin-left: 5px;
  height: calc(100vh - 80px);
  overflow: scroll;
}

.error-message {
  color: #d02451;
  font-weight: bold;
}
</style>
