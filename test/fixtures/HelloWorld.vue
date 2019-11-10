<template>
  <p>Hello {{ name }}!</p>
</template>

<script>
export default {
  name: 'hello-world',
  props: {
    name: { type: String, required: true }
  }
};
</script>
