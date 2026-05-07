<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from "vue";
import childhoodPhoto from "./assets/childhood-photo-optimized.png";
import couplePhoto from "./assets/couple-photo-optimized.png";
import HeroSection from "./components/sections/HeroSection.vue";
import InvitationSection from "./components/sections/InvitationSection.vue";
import ScheduleSection from "./components/sections/ScheduleSection.vue";
import LocationSection from "./components/sections/LocationSection.vue";
import DressCodeSection from "./components/sections/DressCodeSection.vue";
import RsvpSection from "./components/sections/RsvpSection.vue";

const menuOpen = ref(false);
const activeSection = ref("hero");
const submitState = ref("idle");
const submittedGuestName = ref("");
const lastSubmittedAt = ref("");
const mapLoadFailed = ref(false);
const copiedCoordinates = ref(false);
const isProgrammaticFormReset = ref(false);
let revealObserver = null;
let activeSectionObserver = null;
const navRef = ref(null);
const menuButtonRef = ref(null);
const yandexShortUrl = "https://yandex.com/maps/-/CPWcmB10";
const googleFormViewUrl =
  "https://docs.google.com/forms/d/e/1FAIpQLSfDCL43fHnsH7Dp5m3Srq1U6IdWpV62eRMziE1JGSQ3xhwT6w/viewform?usp=pp_url";
const giftCollectionUrl = "https://www.tbank.ru/cf/7T7iS0cYJfk";
const RSVP_STORAGE_KEY = "svadba-rsvp-submitted";

const mapCoordinates = {
  lat: 52.945448,
  lng: 91.488506,
};

const googleFormsConfig = {
  actionUrl:
    "https://docs.google.com/forms/d/e/1FAIpQLSfDCL43fHnsH7Dp5m3Srq1U6IdWpV62eRMziE1JGSQ3xhwT6w/formResponse",
  fields: {
    fullName: "entry.597433237",
    attendance: "entry.1483761790",
    guestsCount: "entry.1068058553",
    transfer: "entry.1933568808",
    drinks: "entry.1243951679",
    notes: "entry.1647716882",
  },
};

const navItems = [
  { href: "#invitation", label: "Приглашение" },
  { href: "#schedule", label: "Программа" },
  { href: "#location", label: "Локация" },
  { href: "#dress-code", label: "Дресс-код" },
];

const invitationText =
  "С радостью приглашаем вас разделить с нами день, с которого начнётся новая глава нашей семьи.";

const timeline = [
  {
    time: "15:30",
    title: "Встреча гостей",
    text: "Прием гостей и фуршет.",
  },
  {
    time: "16:00",
    title: "Церемония",
    text: "Торжественная регистрация брака.",
  },
  {
    time: "17:00",
    title: "Праздничный ужин",
    text: "Развлекательная программа и танцы.",
  },
  {
    time: "23:00",
    title: "Завершение вечера",
    text: "Праздничный вечер подходит к концу.",
  },
];

const palette = [
  { color: "#694632", label: "Тёмный коричневый" },
  { color: "#AB8777", label: "Мокко" },
  { color: "#BE8483", label: "Пыльная роза" },
  { color: "#FCD3D9", label: "Светло-розовый" },
  { color: "#D9CDB5", label: "Бежевый" },
  { color: "#EDE2CF", label: "Кремовый" },
  { color: "#B5C4A5", label: "Зелёный" },
  { color: "#CAD5B2", label: "Светло-зелёный" },
];

const rsvpForm = reactive({
  fullName: "",
  attendance: "С удовольствием приду",
  guestsCount: "Только я",
  transfer: "Доберусь сам",
  drinks: [],
  notes: "",
});

const canSubmitToGoogleForms = computed(() => {
  return Boolean(
    googleFormsConfig.actionUrl &&
      googleFormsConfig.fields.fullName &&
      googleFormsConfig.fields.attendance &&
      googleFormsConfig.fields.guestsCount &&
      googleFormsConfig.fields.transfer
  );
});

const hasSubmittedRsvp = computed(() => submitState.value === "success" && Boolean(submittedGuestName.value));
const hasGiftCollectionLink = computed(() => Boolean(giftCollectionUrl));

const drinkOptions = [
  "Крепкий алкоголь",
  "Красное вино",
  "Белое вино",
  "Безалкогольные напитки",
];

const yandexMapUrl = computed(() => {
  return yandexShortUrl;
});

const yandexStaticMapUrl = computed(() => {
  const { lat, lng } = mapCoordinates;
  return `https://static-maps.yandex.ru/1.x/?ll=${lng},${lat}&size=650,420&z=15&l=map&pt=${lng},${lat},pm2rdl`;
});

const formattedCoordinates = computed(() => {
  return `${mapCoordinates.lat}, ${mapCoordinates.lng}`;
});

const handleDocumentClick = (event) => {
  const target = event.target;
  if (
    menuOpen.value &&
    navRef.value &&
    menuButtonRef.value &&
    target &&
    !navRef.value.contains(target) &&
    !menuButtonRef.value.contains(target)
  ) {
    menuOpen.value = false;
  }
};

const handleEscape = (event) => {
  if (event.key === "Escape") {
    menuOpen.value = false;
  }
};

onMounted(() => {
  const revealNodes = document.querySelectorAll(".reveal");
  const sectionNodes = document.querySelectorAll("main section[id]");
  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -48px 0px",
    }
  );

  revealNodes.forEach((node) => revealObserver.observe(node));

  activeSectionObserver = new IntersectionObserver(
    (entries) => {
      const visibleEntry = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (visibleEntry?.target?.id) {
        activeSection.value = visibleEntry.target.id;
      }
    },
    {
      threshold: [0.2, 0.35, 0.6],
      rootMargin: "-18% 0px -58% 0px",
    }
  );

  sectionNodes.forEach((node) => activeSectionObserver.observe(node));

  document.addEventListener("click", handleDocumentClick);
  document.addEventListener("keydown", handleEscape);

  const savedSubmission = window.localStorage.getItem(RSVP_STORAGE_KEY);
  if (savedSubmission) {
    try {
      const parsedSubmission = JSON.parse(savedSubmission);
      if (parsedSubmission?.name) {
        submittedGuestName.value = parsedSubmission.name;
        lastSubmittedAt.value = parsedSubmission.timestamp || "";
        submitState.value = "success";
      }
    } catch (error) {
      window.localStorage.removeItem(RSVP_STORAGE_KEY);
    }
  }
});

onBeforeUnmount(() => {
  revealObserver?.disconnect();
  activeSectionObserver?.disconnect();
  document.removeEventListener("click", handleDocumentClick);
  document.removeEventListener("keydown", handleEscape);
});

function closeMenu() {
  menuOpen.value = false;
}

function handleMapError() {
  mapLoadFailed.value = true;
}

async function copyCoordinates() {
  try {
    await navigator.clipboard.writeText(formattedCoordinates.value);
    copiedCoordinates.value = true;
    window.setTimeout(() => {
      copiedCoordinates.value = false;
    }, 2200);
  } catch (error) {
    copiedCoordinates.value = false;
  }
}

function resetSubmitState() {
  if (submitState.value !== "submitting") {
    submitState.value = "idle";
  }
}

function resetRsvpForm() {
  isProgrammaticFormReset.value = true;
  rsvpForm.fullName = "";
  rsvpForm.attendance = "С удовольствием приду";
  rsvpForm.guestsCount = "Только я";
  rsvpForm.transfer = "Доберусь сам";
  rsvpForm.drinks = [];
  rsvpForm.notes = "";
  window.setTimeout(() => {
    isProgrammaticFormReset.value = false;
  }, 0);
}

function startNewResponse() {
  submittedGuestName.value = "";
  lastSubmittedAt.value = "";
  submitState.value = "idle";
  window.localStorage.removeItem(RSVP_STORAGE_KEY);
  resetRsvpForm();
}

watch(
  () => [rsvpForm.fullName, rsvpForm.attendance, rsvpForm.guestsCount, rsvpForm.transfer, rsvpForm.notes, rsvpForm.drinks.join("|")],
  () => {
    if (isProgrammaticFormReset.value) {
      return;
    }
    resetSubmitState();
  }
);

async function submitRsvp() {
  if (submitState.value === "submitting") {
    return;
  }

  if (!rsvpForm.fullName.trim()) {
    submitState.value = "validation_error";
    return;
  }

  if (!canSubmitToGoogleForms.value) {
    submitState.value = "integration_pending";
    return;
  }

  submitState.value = "submitting";

  try {
    const formData = new FormData();
    formData.append(googleFormsConfig.fields.fullName, rsvpForm.fullName);
    formData.append(googleFormsConfig.fields.attendance, rsvpForm.attendance);
    formData.append(googleFormsConfig.fields.guestsCount, rsvpForm.guestsCount);
    formData.append(googleFormsConfig.fields.transfer, rsvpForm.transfer);

    if (googleFormsConfig.fields.drinks) {
      rsvpForm.drinks.forEach((drink) => {
        formData.append(googleFormsConfig.fields.drinks, drink);
      });
    }

    if (googleFormsConfig.fields.notes) {
      formData.append(googleFormsConfig.fields.notes, rsvpForm.notes);
    }

    await fetch(googleFormsConfig.actionUrl, {
      method: "POST",
      mode: "no-cors",
      body: formData,
    });

    const trimmedName = rsvpForm.fullName.trim();
    submitState.value = "success";
    submittedGuestName.value = trimmedName;
    lastSubmittedAt.value = new Intl.DateTimeFormat("ru-RU", {
      dateStyle: "long",
      timeStyle: "short",
    }).format(new Date());
    window.localStorage.setItem(
      RSVP_STORAGE_KEY,
      JSON.stringify({
        name: trimmedName,
        timestamp: lastSubmittedAt.value,
      })
    );
    resetRsvpForm();
  } catch (error) {
    submitState.value = "error";
  }
}
</script>

<template>
  <div class="page-shell">
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
