<script setup>
defineProps({
  invitationText: {
    type: String,
    required: true,
  },
  couplePhoto: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <section id="invitation" class="section invitation">
    <div class="section-heart section-heart-right" aria-hidden="true"></div>
    <div class="invitation-grid">
      <div class="invitation-copy reveal">
        <h2 class="invitation-heading">Будем рады видеть вас рядом.</h2>
        <p class="invitation-text">
          {{ invitationText }}
        </p>
      </div>

      <div class="invitation-visual reveal">
        <figure class="invitation-photo">
          <div class="invitation-photo-frame">
            <img :src="couplePhoto" alt="Анастасия и Николай" />
          </div>
        </figure>
      </div>
    </div>
  </section>
</template>
