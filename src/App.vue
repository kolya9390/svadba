<script setup>
import { onMounted } from "vue";
import childhoodPhoto from "./assets/childhood-photo-optimized.png";
import couplePhoto from "./assets/couple-photo-optimized.png";
import HeroSection from "./components/sections/HeroSection.vue";
import InvitationSection from "./components/sections/InvitationSection.vue";
import ScheduleSection from "./components/sections/ScheduleSection.vue";
import LocationSection from "./components/sections/LocationSection.vue";
import DressCodeSection from "./components/sections/DressCodeSection.vue";
import RsvpSection from "./components/sections/RsvpSection.vue";
import { navItems, invitationText, timeline, palette, drinkOptions } from "./content/siteContent";
import { usePageChrome } from "./composables/usePageChrome";
import { useLocationMap } from "./composables/useLocationMap";
import { useRsvpForm } from "./composables/useRsvpForm";

const { menuOpen, activeSection, navRef, menuButtonRef, closeMenu } = usePageChrome();
const { mapLoadFailed, copiedCoordinates, yandexMapUrl, yandexStaticMapUrl, handleMapError, copyCoordinates } =
  useLocationMap();
const {
  rsvpForm,
  submitState,
  submittedGuestName,
  lastSubmittedAt,
  googleFormViewUrl,
  giftCollectionUrl,
  hasSubmittedRsvp,
  hasGiftCollectionLink,
  submitRsvp,
  startNewResponse,
  hydrateRsvpState,
} = useRsvpForm();

onMounted(() => {
  hydrateRsvpState();
});
</script>

<template>
  <div class="page-shell">
    <div class="romantic-pattern page-pattern" aria-hidden="true">
      <span class="pattern-heart pattern-heart-left"></span>
      <span class="pattern-heart pattern-heart-loop"></span>
      <span class="pattern-heart pattern-heart-right"></span>
      <span class="pattern-heart pattern-heart-small-left"></span>
      <span class="pattern-heart pattern-heart-small-right"></span>
      <span class="pattern-heart pattern-heart-center"></span>
      <span class="pattern-dot pattern-dot-left"></span>
      <span class="pattern-dot pattern-dot-mid"></span>
      <span class="pattern-dot pattern-dot-right"></span>
      <span class="pattern-dot pattern-dot-soft-left"></span>
      <span class="pattern-dot pattern-dot-soft-right"></span>
    </div>

    <header class="topbar">
      <a class="brand" href="#hero">Н&amp;А</a>
      <button
        ref="menuButtonRef"
        class="menu-toggle"
        type="button"
        :aria-expanded="menuOpen ? 'true' : 'false'"
        :aria-label="menuOpen ? 'Закрыть меню' : 'Открыть меню'"
        aria-controls="site-nav"
        @click="menuOpen = !menuOpen"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
      <nav ref="navRef" id="site-nav" class="nav" :class="{ 'is-open': menuOpen }">
        <a
          v-for="item in navItems"
          :key="item.href"
          :href="item.href"
          :class="{ 'is-active': item.href === `#${activeSection}` }"
          @click="closeMenu"
        >
          {{ item.label }}
        </a>
      </nav>
    </header>

    <main>
      <HeroSection :childhood-photo="childhoodPhoto" />

      <section class="ticker" aria-label="Приглашение">
        <div class="ticker-marquee">
          <div class="ticker-track">
            <span>вы приглашены</span>
            <span>вы приглашены</span>
            <span>вы приглашены</span>
            <span>вы приглашены</span>
            <span>вы приглашены</span>
            <span>вы приглашены</span>
          </div>
          <div class="ticker-track" aria-hidden="true">
            <span>вы приглашены</span>
            <span>вы приглашены</span>
            <span>вы приглашены</span>
            <span>вы приглашены</span>
            <span>вы приглашены</span>
            <span>вы приглашены</span>
          </div>
        </div>
      </section>

      <InvitationSection :invitation-text="invitationText" :couple-photo="couplePhoto" />
      <ScheduleSection :timeline="timeline" />
      <LocationSection
        :map-load-failed="mapLoadFailed"
        :yandex-map-url="yandexMapUrl"
        :yandex-static-map-url="yandexStaticMapUrl"
        :copied-coordinates="copiedCoordinates"
        @map-error="handleMapError"
        @copy-coordinates="copyCoordinates"
      />
      <DressCodeSection :palette="palette" />
      <RsvpSection
        :has-submitted-rsvp="hasSubmittedRsvp"
        :submitted-guest-name="submittedGuestName"
        :last-submitted-at="lastSubmittedAt"
        :has-gift-collection-link="hasGiftCollectionLink"
        :gift-collection-url="giftCollectionUrl"
        :rsvp-form="rsvpForm"
        :submit-state="submitState"
        :drink-options="drinkOptions"
        :google-form-view-url="googleFormViewUrl"
        @submit="submitRsvp"
        @start-new-response="startNewResponse"
      />
    </main>
  </div>
</template>
