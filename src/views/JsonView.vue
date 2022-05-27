<script setup>
import { reactive } from "vue";
import JsonTree from "@/components/JsonTree.vue";

// const jsonObj = reactive({"null":null,"boolean":[true,false],"number":[0,2.1,2e8,-123456780123456780,2.1,2e8,-123456780,2.1,2e8,-123456780,2.1,2e8,-123456780,2.1,2e8,-123456780,2.1,2e8,-123456780,2.1,2e8,-123456780,2.1,2e8,-123456780,2.1,2e8,-123456780,2.1,2e8,-123456780,2.1,2e8,-123456780,2.1,2e8,-123456780,2.1,2e8,-123456780,2.1,2e8,-123456780,2.1,2e8,-123456780,2.1,2e8,-123456780,2.1,2e8,-123456780,2.1,2e8,-123456780,2.1,2e8,-123456780],"string":{"any characters":"abc def abc def abc def abc def abc def abc def abc def abc def abc def abc def abc def abc def abc def abc def abc def abc def abc def abc def abc def abc def abc def abc def abc def abc def abc def abc def abc def abc def abc def abc def abc def","quotation \"":"\\","backslash \\\\":"\\\\","slash \\/":"\\/","backspace \\b":"\\b","form feed \\f":"\\f","new line \\n":"\\n","carriage return \\r":"\\r","tab \\t":"\\t","hexadeci\\u006Dal":"\\u004A-\\u005A"}});
// const jsonObj = reactive(["a", "b", { "c": 1 }]);
// const jsonObj = reactive({"a": 1, "b": [2,3]});
// const jsonObj = reactive({"a": 1, "b": [2,{"c": ["d"]}]});
const jsonObj = reactive([{ a: 1, b: [2, { c: ["d"] }] }]);
</script>

<template>
  <div className="user-block">
    <p className="block-title">Input</p>
    <div className="user-json">{{ jsonObj }}</div>
  </div>
  <div className="result-block">
    <p className="block-title">Result</p>
    <div className="result-json">
      <JsonTree :json="jsonObj" />
    </div>
  </div>
</template>

<style scoped>
.user-block {
  width: 50%;
}

.result-block {
  width: 50%;
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
  overflow: scroll;
}

.result-json {
  color: #456aa1;
  padding: 10px 10px 10px 20px;
  border: black 1px solid;
  margin-left: 5px;
  height: calc(100vh - 80px);
  overflow: scroll;
}

</style>
