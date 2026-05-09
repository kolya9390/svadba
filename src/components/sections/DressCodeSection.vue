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
    <SectionHeading title="Дресс-код "/>

    <div class="palette-strip reveal" aria-label="Палитра дресс-кода">
      <div
        v-for="swatch in palette"
        :key="swatch.label"
        class="palette-block"
        :style="{ '--swatch': swatch.color }"
        :aria-label="swatch.label"
      >
        <span class="palette-swatch" aria-hidden="true"></span>
        <span class="palette-label">{{ swatch.label }}</span>
      </div>
    </div>
    <p class="dress-note reveal">
      Белый цвет оставьте невесте. Остальное — тёплые коричневые, пудровые и приглушённые зелёные
      оттенки из палитры.
    </p>
  </section>
</template>
