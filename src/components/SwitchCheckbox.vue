<script setup>
import { ref } from "vue";

const props = defineProps({
  isChecked: {
    type: [Boolean],
    required: true,
  },
  disable: {
    type: [Boolean],
    required: false,
    default: false,
  },
});
const emit = defineEmits(["switchChecked"]);

// dom
let checkbox = ref(null);

const toggleCheckbox = () => {
  if (!props.disable) {
    checkbox.value.checked = !checkbox.value.checked;
    emit("switchChecked", checkbox.value.checked);
  }
};
</script>

<template>
  <input type="checkbox" ref="checkbox" :checked="props.isChecked" />
  <label class="switchToggle" @click="toggleCheckbox"> </label>
</template>

<style scoped>
input[type="checkbox"] {
  height: 0;
  width: 0;
  visibility: hidden;
}

.switchToggle {
  cursor: pointer;
  width: 40px;
  height: 20px;
  background: #b5b5b5;
  border-radius: 20px;
  position: relative;
  display: inline-block;
  vertical-align: middle;
}

.switchToggle:after {
  content: "";
  position: absolute;
  top: 2px;
  left: 2px;
  width: 16px;
  height: 16px;
  background: #fff;
  border-radius: 16px;
  transition: 0.3s;
}

input:checked + .switchToggle {
  background-color: var(--color-main-theme);
}

.switchToggle:active:after {
  width: 26px;
}

input:checked + .switchToggle:after {
  left: calc(100% - 2px);
  transform: translateX(-100%);
}
</style>
