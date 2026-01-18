<script>
import { ref, computed, watch } from "vue";

export default {
  name: "JsonTree",
  props: {
    json: { type: [Array, Object, String, Number, Boolean], default: null },
    objectKey: { type: String, default: null },
    transUnicode: Boolean,
    isAllOpen: Boolean,
  },
  emits: ["manualOpen"],
  setup(props, context) {
    const open = ref(true);
    let isAllOpen = ref(props.isAllOpen);

    watch(
      () => props.isAllOpen,
      (isAllOpen) => {
        if (isAllOpen !== null) {
          open.value = isAllOpen;
        }
      },
    );

    const manualOpen = () => {
      isAllOpen.value = null;
      context.emit("manualOpen");
    };

    const count = computed(() => {
      if (props.json !== null && typeof props.json == "object") {
        if (props.json.constructor.name === "Array") {
          return props.json.length;
        } else {
          return Object.keys(props.json).length;
        }
      }
      return null;
    });
    const content = computed(() => {
      return `"${count.value} item${count.value > 1 ? "s" : ""}"`;
    });

    return {
      props,
      open: open,
      manualOpen,
      count,
      content,
    };
  },
};
</script>

<template>
  <span
    v-if="props.objectKey"
    class="object-key"
    @click.stop="
      open = !open;
      manualOpen();
    "
  >
    "{{ props.objectKey }}":
  </span>
  <template v-if="props.json !== null && typeof props.json == 'object'">
    <template v-if="props.json.constructor.name === 'Array'">
      <span
        :class="['array-bracket', { close: !open }]"
        @click.stop="
          open = !open;
          manualOpen();
        "
        >[
      </span>
      <span class="count"></span>
      <ul v-show="open">
        <li v-for="(child, key) in props.json" :key="key">
          <JsonTree
            :json="child"
            :trans-unicode="props.transUnicode"
            :is-all-open="isAllOpen"
            @manual-open="manualOpen"
          />
          <span v-if="props.json.length !== key + 1">, </span>
        </li>
      </ul>
      <span>]</span>
    </template>
    <template v-else>
      <span
        :class="['object-bracket', { close: !open }]"
        @click.stop="
          open = !open;
          manualOpen();
        "
        >{
      </span>
      <span class="count"></span>
      <ul v-show="open">
        <li v-for="(child, key) in props.json" :key="key">
          <JsonTree
            :object-key="key"
            :json="child"
            :trans-unicode="props.transUnicode"
            :is-all-open="isAllOpen"
            @manual-open="manualOpen"
          />
          <span v-if="key !== Object.keys(props.json)[Object.keys(props.json).length - 1]">, </span>
        </li>
      </ul>
      <span>}</span>
    </template>
  </template>
  <template v-else>
    <span v-if="typeof props.json === 'string'" :class="typeof props.json">"{{ props.json }}" </span>
    <span v-else-if="typeof props.json === 'object'" class="null">null</span>
    <span v-else :class="typeof props.json">{{ props.json }}</span>
  </template>
</template>

<style scoped>
ul {
  list-style-type: none;
  padding: 0 0 0 20px;
}

.string {
  color: #ce9178;
}

.number {
  color: #569cd6;
}

.boolean {
  color: #e69809;
}

.null {
  color: #bf7dbf;
  font-style: italic;
}

.array-bracket,
.object-key,
.object-bracket {
  cursor: pointer;
}

.array-bracket ~ ul,
.object-bracket ~ ul {
  border-left: var(--border-subtle) 1.5px solid;
}

.array-bracket:hover ~ ul,
.object-key:hover ~ ul,
.object-bracket:hover ~ ul {
  border-left: var(--brand-color) 1.5px solid;
}

.close::after {
  content: " ... ";
  color: #918888;
}

.count::after {
  content: v-bind(content);
  background-color: var(--brand-color-soft);
  color: var(--brand-color);
  border-radius: 4px;
  padding: 0 6px;
  margin: auto 5px;
  font-size: 95%;
}
</style>
