<script setup>
import SectionHeading from "../shared/SectionHeading.vue";

defineProps({
  mapLoadFailed: {
    type: Boolean,
    required: true,
  },
  yandexMapUrl: {
    type: String,
    required: true,
  },
  yandexStaticMapUrl: {
    type: String,
    required: true,
  },
  copiedCoordinates: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["map-error", "copy-coordinates"]);
</script>

<template>
  <section id="location" class="section location">
    <SectionHeading eyebrow="Локация" title="Место проведения торжества" />

    <div class="location-layout reveal">
      <div class="location-card">
        <a
          class="location-photo map-link-card"
          :href="yandexMapUrl"
          target="_blank"
          rel="noreferrer"
          aria-label="Открыть локацию в Яндекс Картах"
        >
          <img
            v-if="!mapLoadFailed"
            class="map-frame"
            :src="yandexStaticMapUrl"
            alt="Карта локации свадьбы"
            loading="lazy"
            @error="emit('map-error')"
          />
          <div v-else class="map-placeholder">
            <strong>Карта временно недоступна</strong>
            <span>Локацию всё равно можно открыть напрямую в Яндекс Картах.</span>
            <span class="map-placeholder-action">Открыть карту</span>
          </div>
          <div v-if="!mapLoadFailed" class="map-overlay">
            <span class="map-badge">Яндекс Карты</span>
            <span class="map-overlay-title">База отдыха Кибик</span>
          </div>
        </a>

        <div class="location-copy">
          <div class="location-meta">
            <span class="location-chip">24 июля 2026</span>
            <span class="location-chip">На природе</span>
            <span class="location-chip">Хакасия</span>
          </div>
          <p>
            Праздник пройдёт в загородной локации с тёплой атмосферой, природой вокруг и
            пространством, где можно спокойно выдохнуть и просто быть рядом.
          </p>
          <p class="location-note">
            Сохраните локацию заранее, чтобы в день свадьбы спокойно доехать без лишней суеты.
          </p>
          <div class="location-actions">
            <a class="button button-secondary" :href="yandexMapUrl" target="_blank" rel="noreferrer">
              Открыть в картах
            </a>
          </div>
          <div class="location-utility">
            <button class="text-link utility-button" type="button" @click="emit('copy-coordinates')">
              {{ copiedCoordinates ? "Координаты скопированы" : "Скопировать локацию" }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
