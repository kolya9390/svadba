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

    <div class="schedule-layout schedule-layout-simple">
      <ol class="timeline timeline-list">
        <li v-for="item in timeline" :key="item.time" class="timeline-item reveal">
          <p class="timeline-time">{{ item.time }}</p>
          <div class="timeline-copy">
            <h3>{{ item.title }}</h3>
            <p>{{ item.text }}</p>
          </div>
        </li>
      </ol>
    </div>
  </section>
</template>
