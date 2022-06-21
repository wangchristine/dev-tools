<script setup>
import { ref, watch, onUnmounted } from "vue";

const selectedType = ref("base64");
const selectedMethod = ref("encode");

const userString = ref("");
const resultString = ref("");
let errorMessage = ref("");
let copyText = ref("Copy");
let typeDescription = ref("");

watch(
  [selectedType, selectedMethod],
  ([type]) => {
    userString.value = "";
    switch (type) {
      case "base64":
        typeDescription.value =
          "This base64 tool can be deal with ASCII and Unicode.";
        break;
      case "url":
        typeDescription.value =
          "This url tool will convert all characters except: A-Z a-z 0-9 - _ . ! ~ * ' ()";
        break;
    }
  },
  { immediate: true }
);

watch(userString, (userInput) => {
  try {
    switch (selectedType.value) {
      case "base64":
        if (selectedMethod.value === "encode") {
          resultString.value = btoa(
            encodeURIComponent(userInput).replace(
              /%([0-9A-F]{2})/g,
              function toSolidBytes(match, p1) {
                return String.fromCharCode("0x" + p1);
              }
            )
          );
        } else {
          resultString.value = decodeURIComponent(
            atob(userInput)
              .split("")
              .map(function (c) {
                return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
              })
              .join("")
          );
        }
        break;
      case "url":
        if (selectedMethod.value === "encode") {
          resultString.value = encodeURIComponent(userInput);
        } else {
          resultString.value = decodeURIComponent(userInput);
        }
        break;
    }
    errorMessage.value = "";
  } catch (e) {
    errorMessage.value = e.message;
  }
});
let timer = null;
// DOM
const copy = ref(null);
const copyToClipboard = () => {
  clearTimeout(timer);
  let clipboardText = ref("");
  if (resultString.value !== "") {
    clipboardText.value = resultString.value;
  } else {
    if (errorMessage.value !== "") {
      clipboardText.value = errorMessage.value;
    }
  }
  console.log(clipboardText.value);
  navigator.clipboard
    .writeText(clipboardText.value)
    .then(() => {
      copyText.value = "Copied!";
      copy.value.style.backgroundColor = "#ed6b6b";
      console.log("Copied to clipboard.");
      timer = setTimeout(() => {
        copyText.value = "Copy";
        copy.value.style.backgroundColor = "#bb8e8e";
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
  <div class="container">
    <div class="select-block">
      <p>Please select one item of each block.</p>
      <div class="list-block">
        <p>Type</p>
        <input
          type="radio"
          name="type"
          id="type-base64"
          value="base64"
          v-model="selectedType"
          checked
        />
        <label for="type-base64">base64</label>
        <input
          type="radio"
          name="type"
          id="type-url"
          value="url"
          v-model="selectedType"
        />
        <label for="type-url">url</label>

        <p>Encode/Decode</p>
        <input
          type="radio"
          name="method"
          id="method-encode"
          value="encode"
          v-model="selectedMethod"
          checked
        />
        <label for="method-encode">encode</label>
        <input
          type="radio"
          name="method"
          id="method-decode"
          value="decode"
          v-model="selectedMethod"
        />
        <label for="method-decode">decode</label>
      </div>
      <div class="detail-block">
        <p class="title">🛠 Description</p>
        <p>{{ typeDescription }}</p>
      </div>
    </div>
    <div class="right-block">
      <div class="user-block" id="user-block" ref="userBlock">
        <p class="block-title">Input</p>
        <textarea
          v-focus
          name="userInput"
          class="user-string"
          placeholder="Type here to encode/decode..."
          v-model.trim="userString"
        ></textarea>
      </div>
      <div class="result-block" id="result-block" ref="resultBlock">
        <p class="block-title">Result</p>
        <div class="string-block" id="string-block">
          <div class="result-string">
            <p v-if="errorMessage === ''">{{ resultString }}</p>
            <p v-else class="error-message">{{ errorMessage }}</p>
          </div>
          <button class="copy" ref="copy" @click="copyToClipboard()">
            {{ copyText }} 📄
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  justify-content: space-around;
  height: 100%;
}

.select-block {
  width: 300px;
  margin: 30px 10px 0 0;
  padding: 10px;
}

.list-block {
  color: var(--color-block-text1);
}

.list-block > p {
  font-size: 18px;
  margin-top: 20px;
}

.list-block > label {
  font-size: 16px;
  padding: 5px 10px;
  margin-right: 10px;
}

.detail-block {
  margin-top: 20px;
  font-size: 16px;
  border: 2px var(--color-block-text1) dashed;
  padding: 8px 10px;
}

.detail-block .title {
  font-size: 18px;
}

.right-block {
  flex-grow: 1;
  display: flex;
  flex-wrap: wrap;
}

.user-block {
  width: 100%;
  min-height: 50%;
}

.result-block {
  width: 100%;
  min-height: 50%;
}

.block-title {
  padding: 10px;
  font-size: 20px;
  text-align: center;
}

.user-string {
  padding: 10px;
  border: black 1px solid;
  width: 100%;
  height: calc(100% - 52px);
  overflow-y: scroll;
  resize: none;
  font-size: 16px;
  background-color: var(--color-block-background);
  color: var(--color-block-text1);
}

.string-block {
  color: var(--color-block-text3);
  border: black 1px solid;
  height: calc(100% - 52px);
  background-color: var(--color-block-background);
}

.result-string {
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
  right: 16px;
  background-color: #bb8e8e;
  color: white;
  border: 0;
  padding: 8px 12px;
  font-size: 14px;
  cursor: pointer;
  z-index: 999;
}
</style>
