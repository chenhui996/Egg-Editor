<template>
  <div class="icon-template" @click.prevent="handleClick">
    <a-tooltip placement="top" :title="tip">
      <a-button :type="checked ? 'primary' : 'default'">
        <template v-slot:icon><component :is="iconName" /></template>
      </a-button>
    </a-tooltip>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import {
  BoldOutlined,
  ItalicOutlined,
  UnderlineOutlined,
} from '@ant-design/icons-vue'
export default defineComponent({
  components: {
    BoldOutlined,
    ItalicOutlined,
    UnderlineOutlined,
  },
  props: {
    iconName: {
      type: String,
      required: true,
    },
    checked: {
      type: Boolean,
      default: false,
    },
    tip: {
      type: String,
    },
  },
  emit: ['change'],
  setup(props, context) {
    const handleClick = () => {
      context.emit('change', !props.checked)
    }

    return {handleClick}
  },
})
</script>

<style>
.icon-template {
  float: left;
  margin-right: 16px;
}
.icon-template button {
  border-radius: 100%;
}
</style>
