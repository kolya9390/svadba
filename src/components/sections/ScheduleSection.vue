<script setup>
import SectionHeading from "../shared/SectionHeading.vue";

defineProps({
  timeline: {
    type: Array,
    required: true,
  },
});
</script>

<template>
  <section id="schedule" class="section schedule">
    <SectionHeading title="Программа торжества" />

    <div class="schedule-layout">
      <ol class="timeline timeline-list">
        <li v-for="(item, index) in timeline" :key="item.time" class="timeline-item reveal">
          <div class="timeline-marker" aria-hidden="true">
            <span>{{ String(index + 1).padStart(2, "0") }}</span>
          </div>
          <time class="timeline-time">{{ item.time }}</time>
          <div class="timeline-copy">
            <h3>{{ item.title }}</h3>
            <p v-if="item.text">{{ item.text }}</p>
          </div>
        </li>
      </ol>
    </div>
  </section>
</template>
