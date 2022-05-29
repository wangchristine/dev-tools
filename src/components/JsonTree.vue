<script>
import { ref } from "vue";
export default {
  name: "JsonTree",
  props: {
    json: [Array, Object, String, Number, Boolean],
    objectKey: String,
  },
  setup(props) {
    const open = ref(true);

    let count = ref("null");
    if (props.json !== null && typeof props.json == "object") {
      if (props.json.constructor.name === "Array") {
        count.value = props.json.length.toString();
      } else {
        count.value = Object.keys(props.json).length.toString();
      }
    }
    console.log(count.value);
    return {
      // eslint-disable-next-line vue/no-dupe-keys
      json: props.json,
      open: open,
      // eslint-disable-next-line vue/no-dupe-keys
      objectKey: props.objectKey,
      count: JSON.stringify(
        count.value + (count.value === "1" ? " item" : " items")
      ),
    };
  },
};
</script>

<template>
  <span v-if="objectKey" class="object-key" @click.stop="open = !open"
    >"{{ objectKey }}":
  </span>
  <template v-if="json !== null && typeof json == 'object'">
    <template v-if="json.constructor.name === 'Array'">
      <span
        :class="['array-bracket', { close: !open }]"
        @click.stop="open = !open"
        >[</span
      >
      <span class="count"></span>
      <ul v-show="open">
        <li v-for="(child, key) in json" :key="key">
          <JsonTree :json="child" />
          <span v-if="json.length !== key + 1">, </span>
        </li>
      </ul>
      <span>]</span>
    </template>
    <template v-else>
      <span
        :class="['object-bracket', { close: !open }]"
        @click.stop="open = !open"
        >{</span
      >
      <span class="count"></span>
      <ul v-show="open">
        <li v-for="(child, key) in json" :key="key">
          <JsonTree :objectKey="key" :json="child" />
          <span v-if="key !== Object.keys(json)[Object.keys(json).length - 1]"
            >,
          </span>
        </li>
      </ul>
      <span>}</span>
    </template>
  </template>
  <template v-else>
    <span v-if="typeof json === 'string'" :class="typeof json"
      >"{{ json }}"</span
    >
    <span v-else-if="typeof json === 'object'" class="null">null</span>
    <span v-else :class="typeof json">{{ json }}</span>
  </template>
</template>

<style scoped>
ul {
  list-style-type: none;
  padding: 0 0 0 20px;
}

.string {
  color: #29ab29;
}

.number {
  color: #f04242;
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
  border-left: #e8e8e8 1.5px solid;
}

.array-bracket:hover ~ ul,
.object-key:hover ~ ul,
.object-bracket:hover ~ ul {
  border-left: #b586b5 1.5px solid;
}

.close::after {
  content: " ... ";
  color: #918888;
}

.count::after {
  content: v-bind(count);
  background-color: #c3b5f4;
  color: #fefefe;
  border-radius: 4px;
  padding: 0 4px;
  margin: auto 5px;
  font-size: 95%;
}
</style>
