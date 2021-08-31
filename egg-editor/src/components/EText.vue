<template>
  <component :is="tag" :style="styleProps" class="e-text-component">{{
    text
  }}</component>
</template>

<script lang="ts">
import {defineComponent, computed} from 'vue'
import {pick} from 'lodash-es'
export default defineComponent({
  name: 'e-text',
  props: {
    text: {
      type: String,
    },
    fontSize: {
      type: String,
    },
    tag: {
      type: String,
      default: 'div',
    },
  },
  setup(props) {
    const styleProps = computed(() => pick(props, ['fontSize']))
    return {
      styleProps,
    }
  },
})
</script>

<style scoped>
h2.e-text-component,
p.e-text-component {
  margin-bottom: 0;
}
button.e-text-component {
  padding: 5px 10px;
  cursor: pointer;
}
.e-text-component {
  box-sizing: border-box;
  white-space: pre-wrap;
}
</style>
