<script>
export default {
  name: 'CodeBlock',
  props: {
    title: {
      type: String,
      required: true,
    },
    active: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<template>
  <div class="theme-code-block" :class="{ 'theme-code-block__active': active }">
    <slot />
  </div>
</template>

<style scoped>
.theme-code-block {
  display: none;
}
.theme-code-block__active {
  display: block;
}
.theme-code-block > pre {
  background-color: orange;
}
@media (max-width: 419px) {
  .theme-code-group div[class*='language-'] {
    margin: 0;
  }
}
</style>
