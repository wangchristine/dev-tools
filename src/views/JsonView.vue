<script setup>
import { reactive } from "vue";

const jsonObj = reactive({
  // "Array": [4, 5, 6],
  // "Array": [{"aa": 12, "cc": 78}, {"bb": [34,56]}],
  Array: { bb: [12, { aa: 12 }] },
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
      resultHtml += "<span class='array-bracket'>[</span>" + "<ul>";
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
      resultHtml += "<span class='object-bracket'>{</span>" + "<ul>";
      let tmpCount = 0;
      Object.entries(jsonObj).forEach(([key, value]) => {
        tmpCount++;
        resultHtml +=
          "<li><span class='object-key'>" + '"' + key + '": </span>';
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
    switch (typeof jsonObj) {
      case "string":
        resultHtml += "<span class='string'>" + '"' + jsonObj + '"' + "</span>";
        break;
      case "number":
        resultHtml += "<span class='number'>" + jsonObj + "</span>";
        break;
      case "boolean":
        resultHtml += "<span class='boolean'>" + jsonObj + "</span>";
        break;
      case "object":
        // this is "null" actually!
        resultHtml += "<span class='null'>" + jsonObj + "</span>";
        break;
      default:
        resultHtml += "<span>" + jsonObj + "</span>";
        break;
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
    <div class="result-json" v-html="resultHtml"></div>
  </main>
</template>

<style>
/* scoped ? */

.result-json {
  color: #456aa1;
}

.result-json ul {
  list-style-type: none;
  padding: 0 0 0 20px;
}

.result-json .string {
  color: #29ab29;
}

.result-json .number {
  color: #f04242;
}

.result-json .boolean {
  color: #e69809;
}

.result-json .null {
  color: #bf7dbf;
}

/* down: 25B6 */
/* right: 25BC */
/* .object-bracket::before {
  content: "\25BC";
  margin-right: 5px;
  color: #456aa1;
}

.array-bracket::before {
  content: "\25BC";
  margin-right: 5px;
  color: brown;
} */

.array-bracket,
.object-key,
.object-bracket {
  cursor: pointer;
}

.array-bracket + ul,
.object-bracket + ul {
  border-left: #e8e8e8 1.5px solid;
}

.array-bracket:hover + ul,
.object-key:hover ~ ul,
.object-bracket:hover + ul {
  /* ul:hover */

  border-left: #b586b5 1.5px solid;
}
</style>
