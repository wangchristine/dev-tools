<script setup>
import { ref, watch } from "vue";
import CopiedBlock from "@/components/CopiedBlock.vue";

const selectedType = ref("base64");
const selectedMethod = ref("encode");

const userString = ref("");
const resultString = ref("");
let errorMessage = ref("");
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
        <p class="title"><FontAwesomeIcon :icon="['fas', 'screwdriver-wrench']" /> Description</p>
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
        <CopiedBlock
          :content="errorMessage === '' ? resultString : errorMessage"
          type="string"
        >
          <p v-if="errorMessage === ''">{{ resultString }}</p>
          <p v-else class="error-message">{{ errorMessage }}</p>
        </CopiedBlock>
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
  font-weight: bold;
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
  min-height: 100px;
  overflow-y: scroll;
  resize: none;
  font-size: 16px;
  background-color: var(--color-block-background1);
  color: var(--color-block-text1);
}

.string-block {
  color: var(--color-block-text3);
  border: black 1px solid;
  height: calc(100% - 52px);
  background-color: var(--color-block-background1);
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

@media (max-width: 768px) {
  .container {
    flex-wrap: wrap;
  }

  .select-block {
    margin: 0;
    width: 90%;
    text-align: center;
  }

  .user-block {
    height: 300px;
  }

  .result-block {
    height: 300px;
    padding-bottom: 20px;
  }
}
</style>
