<template>
  <p>Hello {{ name }}!</p>
</template>

<script>
export default {
  name: 'greet',
  props: {
    name: { type: String, required: true }
  }
};
</script>
