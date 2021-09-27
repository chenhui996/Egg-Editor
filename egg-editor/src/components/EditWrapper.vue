<template>
  <div class="edit-wrapper" @click="onItemClick(id)" :class="{active: active}">
    <slot></slot>
    <div v-if="active" class="close-item" @click="onItemDeleteClick(id)">-</div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
export default defineComponent({
  props: {
    id: {
      type: String,
      required: true,
    },
    active: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['set-active', 'on-delete'],
  setup(props, context) {
    const onItemClick = (id: string) => {
      console.log('in-set-active')
      context.emit('set-active', id)
    }
    const onItemDeleteClick = (id: string) => {
      console.log('in-on-delete')
      context.emit('on-delete', id)
    }
    return {
      onItemClick,
      onItemDeleteClick,
    }
  },
})
</script>

<style>
.edit-wrapper {
  padding: 0px;
  cursor: pointer;
  border: 1px solid transparent;
  user-select: none;
  position: relative;
}
.edit-wrapper:hover {
  border: 1px dashed #ccc;
}
.edit-wrapper.active {
  border: 1px solid #1890ff;
  user-select: none;
  z-index: 1500;
}
.close-item {
  width: 14px;
  height: 14px;
  z-index: 100;
  background-color: #9d001d;
  position: absolute;
  right: 3px;
  top: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 100%;
  color: #fff;
  transition: all 0.3s;
}
.close-item:hover {
  background-color: #e3193e;
}
</style>
