<script setup>

const props = defineProps({
  value: {
    type: [Number],
    required: true
  },
  min: {
    type: [Number],
    required: false,
    default: 1,
  },
  max: {
    type: [Number],
    required: false,
    default: 100,
  },
  step: {
    type: [Number],
    required: false,
    default: 1,
  },
  disable: {
    type: [Boolean],
    required: false,
    default: false,
  },
});
const emit = defineEmits(["slideRange"]);

const slideRangeInputEvent = (e) => {
  if (!props.disable) {
    emit("slideRange", parseInt(e.target.value));
  }
};
</script>

<template>
  <div class="slider">
    <div class="range">
      <span class="min">{{ props.min }}</span>
      <span class="max">{{ props.max }}</span>
      <input type="range" :min="props.min" :max="props.max" :value="props.value" :step="props.step"
             :disabled="props.disable" @input="slideRangeInputEvent">
    </div>
    <span class="valueText">{{ props.value }}</span>
  </div>
</template>

<style scoped>
.slider {
  display: inline-block;
  width: 100%;
}

.range {
  display: inline-block;
  width: 80%;
  font-size: 16px;
}

.range > .max {
  position: absolute;
  right: 0;
}

input[type=range] {
  appearance: none;
  background: #b5b5b5;
  width: 100%;
  height: 12px;
  border-radius: 5px;
}

input[type=range]::-webkit-slider-thumb {
  appearance: none;
  background: var(--color-main-theme);
  border-radius: 50%;
  width: 20px;
  height: 20px;
}

input[type=range]::-moz-range-thumb {
  appearance: none;
  background: var(--color-main-theme);
  border-radius: 50%;
  width: 20px;
  height: 20px;
}

.valueText {
  position: absolute;
  right: 0;
  top: 40%;
}
</style>
