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
import {defineComponent} from 'vue'
import EText from '../components/EText.vue'
export default defineComponent({
  name: 'components-list',
  props: {
    list: {
      type: Array,
      required: true,
    },
  },
  components: {
    EText,
  },
  emits: ['on-item-click'],
  setup(props, context) {
    const onItemClick = (data: any) => {
      context.emit('on-item-click', data)
    }
    return {onItemClick}
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
