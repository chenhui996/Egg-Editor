<template>
  <div class="create-component-list">
    <div
      v-for="(item, index) in list"
      :key="index"
      class="component-item"
      @click="onItemClick(item)"
    >
      <e-text v-bind="item"></e-text>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, PropType} from 'vue'
import EText from './EText.vue'
import {TextComponentProps} from '../defaultProps'
export default defineComponent({
  props: {
    list: {
      type: Array as PropType<TextComponentProps[]>,
      required: true,
    },
  },
  emits: ['on-item-click'],
  name: 'components-list',
  components: {
    EText,
  },
  setup(props, context) {

    const onItemClick = (data: Partial<TextComponentProps>) => {
      console.log('data', data)

      context.emit('on-item-click', data)
    }
    return {
      onItemClick,
    }
  },
})
</script>

<style>
/* .create-component-list {
  margin: 0 auto;
} */
.component-item {
  width: 100px;
  margin: 0 auto;
  margin-bottom: 15px;
}
</style>
