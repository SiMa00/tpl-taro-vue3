<template>
  <view class="index">
    <Counter />
    <nut-button type="primary">nutui-but</nut-button>
    <view>{{ state }}</view>
  </view>
</template>

<script lang="ts" setup>
import './index.less'
import Counter from '../../components/Counter.vue'

const state = reactive({
  msg: '欢迎使用 NutUI4.0 开发小程序',
  msg2: '你成功了～',
  type: 'text',
  show: false,
  cover: false
});
</script>
