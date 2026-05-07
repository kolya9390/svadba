<script setup>
import SectionHeading from "../shared/SectionHeading.vue";

defineProps({
  palette: {
    type: Array,
    required: true,
  },
});
</script>

<template>
  <section id="dress-code" class="section dress-code">
    <SectionHeading eyebrow="Дресс-код" title="Поддержите палитру нашего торжества" />

    <div class="palette-strip reveal" aria-label="Палитра дресс-кода">
      <div
        v-for="swatch in palette"
        :key="swatch.label"
        class="palette-block"
        :style="{ '--swatch': swatch.color }"
      >
        <span class="palette-swatch" aria-hidden="true"></span>
        <span class="palette-label">{{ swatch.label }}</span>
      </div>
    </div>
    <p class="dress-note reveal">
      Белый цвет, пожалуйста, оставьте невесте. Во всём остальном ориентируйтесь на тёплые
      коричневые, пудровые и приглушённые зелёные оттенки из палитры.
    </p>
  </section>
</template>
