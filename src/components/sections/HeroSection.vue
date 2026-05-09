<script setup>
defineProps({
  childhoodPhoto: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <section id="hero" class="hero">
    <div class="hero-blush hero-blush-right" aria-hidden="true"></div>
    <div class="hero-copy hero-static">
      <h1>
        <span>Мы давно идём к этому.</span>
        <span class="hero-title-small">Очень давно.</span>
      </h1>
      <div class="hero-rule" aria-hidden="true">
        <span></span>
      </div>
      <p class="hero-meta">
        <span>24 июля 2026</span>
        <span>База отдыха Кибик</span>
      </p>
    </div>

    <div class="hero-visual hero-static">
      <div class="photo-card childhood">
        <div class="photo-frame">
          <img class="photo-image photo-image-childhood" :src="childhoodPhoto" alt="Детская фотография пары" />
        </div>
        <div class="hero-names" aria-hidden="true">
          <span class="hero-name hero-name-left">Анастасия</span>
          <span class="hero-name hero-name-right">Николай</span>
        </div>
      </div>
    </div>
  </section>
</template>
