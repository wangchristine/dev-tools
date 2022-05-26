<script setup>
import { reactive } from "vue";

const jsonObj = reactive({
  // "Array": [4, 5, 6],
  // "Array": [{"aa": 12, "cc": 78}, {"bb": [34,56]}],
  Array: { bb: [{ aa: 12 }] },
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
      resultHtml += "<span>[</span>" + "<ul>";
      jsonObj.forEach((value, key) => {
        resultHtml += "<li>";
        traverse(value);
        if (jsonObj.length !== key + 1) {
          resultHtml += ", ";
        }
        resultHtml += "</li>";
      });
      resultHtml += "</ul>" + "<span>]</span>";
    } else {
      resultHtml += "<span>{</span>" + "<ul>";
      let tmpCount = 0;
      Object.entries(jsonObj).forEach(([key, value]) => {
        tmpCount++;
        resultHtml += "<li>" + '"' + key + '": ';
        traverse(value);
        if (Object.keys(jsonObj).length !== tmpCount) {
          resultHtml += ", ";
        }
        resultHtml += "</li>";
      });
      resultHtml += "</ul>" + "<span>}</span>";
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

<style>
/* scoped ? */

ul {
  list-style-type: none;
  padding: 0 0 0 20px;
}

/* down: 25B6 */
/* right: 25BC */
/* .aa::after {
  content: "\25BC"
} */
</style>
