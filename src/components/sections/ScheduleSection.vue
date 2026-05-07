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
    <SectionHeading eyebrow="Программа дня" title="Программа торжества" />

    <div class="schedule-layout schedule-layout-simple">
      <ol class="timeline">
        <li v-for="item in timeline" :key="item.time" class="timeline-item reveal">
          <div class="timeline-dot"></div>
          <div class="timeline-card">
            <p class="timeline-time">{{ item.time }}</p>
            <h3>{{ item.title }}</h3>
            <p>{{ item.text }}</p>
          </div>
        </li>
      </ol>
    </div>
  </section>
</template>
