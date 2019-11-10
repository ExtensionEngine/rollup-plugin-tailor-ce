<template>
  <div class="tce-example">
    <textarea v-if="isFocused" v-model="content"></textarea>
    <!-- eslint-disable-next-line vue/no-v-html -->
    <div v-else v-html="content"></div>
  </div>
</template>

<script>
export default {
  name: 'tce-example',
  props: {
    element: { type: Object, required: true }
  },
  data() {
    const { data = {} } = this.element;
    const { content = '' } = data;
    return { content };
  }
};
</script>
