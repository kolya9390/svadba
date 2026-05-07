<script setup>
defineProps({
  eyebrow: {
    type: String,
    default: "",
  },
  title: {
    type: String,
    required: true,
  },
  reveal: {
    type: Boolean,
    default: true,
  },
});
</script>

<template>
  <div class="section-heading" :class="{ reveal }">
    <p v-if="eyebrow" class="eyebrow">{{ eyebrow }}</p>
    <h2>{{ title }}</h2>
  </div>
</template>
