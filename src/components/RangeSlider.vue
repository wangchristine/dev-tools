<script setup>
defineProps({
  value: {
    type: [Number],
    required: true,
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
  emit("slideRange", parseInt(e.target.value));
};
</script>

<template>
  <div class="range-slider" :class="{ disabled: disable }">
    <div class="slider-track">
      <input
        type="range"
        :min="min"
        :max="max"
        :value="value"
        :step="step"
        :disabled="disable"
        @input="slideRangeInputEvent"
      />
    </div>
    <div class="range-labels">
      <span class="limit">{{ min }}</span>
      <span class="current-value">{{ value }}</span>
      <span class="limit">{{ max }}</span>
    </div>
  </div>
</template>

<style scoped>
.range-slider {
  width: 100%;
  padding: 10px 0;
}

.slider-track {
  position: relative;
  width: 100%;
  height: 6px;
}

input[type="range"] {
  appearance: none;
  width: 100%;
  height: 6px;
  background: #e0e0e0;
  border-radius: 3px;
  outline: none;
}

input[type="range"]::-webkit-slider-thumb {
  appearance: none;
  width: 18px;
  height: 18px;
  background: var(--brand-color);
  border: 3px solid #fff;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.range-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.current-value {
  color: var(--brand-color);
  font-weight: 700;
  background: var(--brand-color-soft);
  padding: 2px 8px;
  border-radius: 10px;
}

.disabled {
  opacity: 0.6;
  pointer-events: none;
}
</style>
