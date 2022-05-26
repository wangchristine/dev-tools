<script setup>
import { reactive } from "vue";

const jsonObj = reactive({
  Array: [{ aa: 12 }],
  Boolean: true,
  Null: null,
  Number: 123,
  Object: { a: "b", c: "d" },
  String: "Hello World",
});

let resultHtml = reactive("");
const traverse = (jsonObj) => {
  if (jsonObj !== null && typeof jsonObj == "object") {
    if (jsonObj.constructor.name === "Array") {
      resultHtml += "[";
      jsonObj.forEach((value, key) => {
        // resultHtml += key + ": ";
        traverse(value);
        if (jsonObj.length !== key + 1) {
          resultHtml += ", ";
        }
      });
      resultHtml += "]";
    } else {
      resultHtml += "{";
      let tmpCount = 0;
      Object.entries(jsonObj).forEach(([key, value]) => {
        tmpCount++;
        resultHtml += '"' + key + '": ';
        traverse(value);
        if (Object.keys(jsonObj).length !== tmpCount) {
          resultHtml += ", ";
        }
      });
      resultHtml += "}";
    }
  } else {
    // jsonObj is a number or string or bool ...
    if (typeof jsonObj === "string") {
      resultHtml += '"' + jsonObj + '"';
    } else {
      resultHtml += jsonObj;
    }
  }
  console.log(resultHtml);
  return resultHtml;
};

resultHtml = traverse(jsonObj);
</script>

<template>
  <main>
    <p>init</p>
    <div>{{ jsonObj }}</div>
    <p>result</p>
    <div v-html="resultHtml"></div>
  </main>
</template>

<style></style>
