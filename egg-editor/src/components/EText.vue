<template>
  <component
    :is="tag"
    :style="styleProps"
    class="e-text-component"
    @click="handleClick"
    >{{ text }}</component
  >
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import useComponentCommon from '../hooks/useComponentCommon'
import {
  transformToComponentProps,
  textDefaultProps,
  textStylePropNames,
} from '../defaultProps'
// key value 的键值对
const defaultProps = transformToComponentProps(textDefaultProps)
export default defineComponent({
  name: 'e-text',
  props: {
    tag: {
      type: String,
      default: 'div',
    },
    ...defaultProps,
  },
  setup(props) {
    const {styleProps, handleClick} = useComponentCommon(
      props,
      textStylePropNames,
    )
    
    return {
      styleProps,
      handleClick,
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
  position: relative !important;
}
</style>
