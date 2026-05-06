<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from "vue";
import childhoodPhoto from "./assets/childhood-photo-optimized.png";
import couplePhoto from "./assets/couple-photo-optimized.png";

const menuOpen = ref(false);
const submitState = ref("idle");
const submittedGuestName = ref("");
const lastSubmittedAt = ref("");
const mapLoadFailed = ref(false);
const copiedCoordinates = ref(false);
const isProgrammaticFormReset = ref(false);
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
    allergy: "entry.1225269545",
    notes: "entry.1647716882",
  },
};

const navItems = [
  { href: "#invitation", label: "Приглашение" },
  { href: "#schedule", label: "Программа" },
  { href: "#location", label: "Локация" },
  { href: "#dress-code", label: "Дресс-код" },
  { href: "#rsvp", label: "RSVP" },
];

const invitationLines = [
  "С радостью и волнением мы приглашаем вас",
  "разделить с нами один из самых значимых дней",
  "в нашей жизни - день нашей свадьбы.",
];

const weekdays = ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"];
const dates = ["20", "21", "22", "23", "24", "25", "26"];

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
  { color: "#edcdd4", label: "Пудрово-розовый" },
  { color: "#f0dfc5", label: "Крем-брюле" },
  { color: "#f6efe1", label: "Сливочный" },
  { color: "#c4909a", label: "Пыльная роза" },
  { color: "#7c4e30", label: "Мокко" },
  { color: "#3b2114", label: "Шоколадный" },
  { color: "#8faf86", label: "Сельдерейный" },
  { color: "#b5cab0", label: "Мятно-зелёный" },
];

const rsvpForm = reactive({
  fullName: "",
  attendance: "С удовольствием приду",
  guestsCount: "0 (Только я)",
  transfer: "Доберусь сам",
  drinks: [],
  allergy: "",
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

const yandexRouteUrl = computed(() => {
  const { lat, lng } = mapCoordinates;
  return `https://yandex.com/maps/?rtext=~${lat},${lng}&z=15&l=map&rtt=auto`;
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
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -48px 0px",
    }
  );

  revealNodes.forEach((node) => observer.observe(node));

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
  rsvpForm.guestsCount = "0 (Только я)";
  rsvpForm.transfer = "Доберусь сам";
  rsvpForm.drinks = [];
  rsvpForm.allergy = "";
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
  () => [rsvpForm.fullName, rsvpForm.attendance, rsvpForm.guestsCount, rsvpForm.transfer, rsvpForm.allergy, rsvpForm.notes, rsvpForm.drinks.join("|")],
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

    if (googleFormsConfig.fields.allergy) {
      formData.append(googleFormsConfig.fields.allergy, rsvpForm.allergy);
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
        <a v-for="item in navItems" :key="item.href" :href="item.href" @click="closeMenu">
          {{ item.label }}
        </a>
      </nav>
    </header>

    <main>
      <section id="hero" class="hero">
        <div class="hero-heart hero-heart-left" aria-hidden="true"></div>
        <div class="hero-blush hero-blush-right" aria-hidden="true"></div>
        <div class="hero-side-lines" aria-hidden="true">
          <span class="hero-side-line hero-side-line-left">Мы давно идём к этому.</span>
          <span class="hero-side-line hero-side-line-right">Очень давно.</span>
        </div>
        <div class="hero-copy hero-static">
          <p class="hero-kicker">Свадебное приглашение</p>
          <h1>
            <span>Мы давно идём к этому.</span>
            <span>Очень давно.</span>
          </h1>
          <p class="hero-subline">Настя и Коля</p>
          <div class="hero-rule" aria-hidden="true"></div>
          <p class="hero-meta">24 июля 2026 · База отдыха Кибик</p>
        </div>

        <div class="hero-visual hero-static">
          <div class="photo-card childhood">
            <div class="photo-frame">
              <img class="photo-image photo-image-childhood" :src="childhoodPhoto" alt="Детская фотография пары" />
            </div>
            <div class="hero-names" aria-hidden="true">
              <span class="hero-name hero-name-left">Настя</span>
              <span class="hero-name hero-name-right">Коля</span>
            </div>
          </div>
        </div>
      </section>

      <section class="ticker" aria-label="Приглашение">
        <div class="ticker-track">
          <span>вы приглашены</span>
          <span>вы приглашены</span>
          <span>вы приглашены</span>
          <span>вы приглашены</span>
        </div>
      </section>

      <section id="invitation" class="section invitation">
        <div class="section-heart section-heart-right" aria-hidden="true"></div>
        <div class="invitation-grid">
          <div class="invitation-copy reveal">
            <p class="eyebrow invitation-title">Дорогие Гости!</p>
            <h2 class="invitation-heading">
              <span v-for="line in invitationLines" :key="line">{{ line }}</span>
            </h2>
          </div>

          <div class="calendar reveal" aria-label="Дата свадьбы">
            <div class="calendar-month">
              <span></span>
              <strong>ИЮЛЬ</strong>
              <span></span>
            </div>
            <div class="calendar-weekdays">
              <span v-for="day in weekdays" :key="day">{{ day }}</span>
            </div>
            <div class="calendar-days">
              <span v-for="day in dates" :key="day" :class="{ 'active-day': day === '24' }">
                {{ day }}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section id="schedule" class="section schedule">
        <div class="section-heading reveal">
          <p class="eyebrow">Программа дня</p>
          <h2>ПРОГРАММА ДНЯ</h2>
        </div>

        <div class="schedule-layout">
          <ol class="timeline">
            <li v-for="item in timeline" :key="item.time" class="timeline-item reveal">
              <div class="timeline-dot"></div>
              <div>
                <h3>{{ item.time }} {{ item.title }}</h3>
                <p>{{ item.text }}</p>
              </div>
            </li>
          </ol>

          <div class="schedule-poster reveal" aria-hidden="true">
            <div class="poster-frame">
              <img class="poster-photo" :src="couplePhoto" alt="Портрет пары" />
            </div>
          </div>
        </div>
      </section>

      <section id="location" class="section location">
        <div class="section-heading reveal">
          <p class="eyebrow">Локация</p>
          <h2>Как нас найти</h2>
        </div>

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
                @error="handleMapError"
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
              <p class="location-kicker">Место проведения</p>
              <h3 class="location-title">База отдыха Кибик</h3>
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
                <a
                  class="button button-secondary"
                  :href="yandexMapUrl"
                  target="_blank"
                  rel="noreferrer"
                >
                  Открыть карту
                </a>
                <a
                  class="button button-secondary button-ghost"
                  :href="yandexRouteUrl"
                  target="_blank"
                  rel="noreferrer"
                >
                  Построить маршрут
                </a>
              </div>
              <div class="location-utility">
                <button class="text-link utility-button" type="button" @click="copyCoordinates">
                  {{ copiedCoordinates ? "Координаты скопированы" : "Скопировать локацию" }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="dress-code" class="section dress-code">
        <div class="section-heading reveal">
          <p class="eyebrow">Дресс-код</p>
          <h2>Мы будем благодарны, если вы поддержите цветовую гамму нашего торжества:</h2>
        </div>

        <div class="palette-strip reveal" aria-label="Палитра дресс-кода">
          <div
            v-for="swatch in palette"
            :key="swatch.label"
            class="palette-block"
            :style="{ '--swatch': swatch.color }"
          >
            <span class="palette-label">{{ swatch.label }}</span>
          </div>
        </div>
        <p class="dress-note reveal">
          Белый цвет, пожалуйста, оставьте невесте. Во всём остальном ориентируйтесь на мягкие
          пудровые, шоколадные и зелёные оттенки из палитры.
        </p>
      </section>

      <section id="rsvp" class="section cta">
        <div class="section-heading reveal">
          <p class="eyebrow">{{ hasSubmittedRsvp ? "Ответ получен" : "Анкета гостя" }}</p>
          <h2>
            {{
              hasSubmittedRsvp
                ? "Спасибо, мы будем ждать вас в этот день."
                : "Пожалуйста, подтвердите Ваше присутствие"
            }}
          </h2>
        </div>
        <p v-if="!hasSubmittedRsvp" class="cta-note reveal">
          Нам будет очень приятно, если вы заполните короткую форму и поможете нам всё подготовить
          заранее.
        </p>
        <p v-if="!hasSubmittedRsvp" class="cta-note cta-note-soft reveal">
          После подтверждения участия мы сразу откроем детали подарка.
        </p>
        <div v-if="hasSubmittedRsvp" class="rsvp-success-inline" role="status" aria-live="polite">
          <p class="rsvp-success-eyebrow">Подтверждение сохранено</p>
          <p class="rsvp-success-inline-text">
            Спасибо, {{ submittedGuestName }}. Мы записали ваш ответ{{
              lastSubmittedAt ? ` ${lastSubmittedAt}` : ""
            }}.
          </p>
          <div v-if="hasGiftCollectionLink" class="rsvp-gift-inline">
            <p class="rsvp-gift-inline-text">
              Если захотите порадовать нас дополнительно, можно сделать это сразу по кнопке ниже.
            </p>
            <a class="button" :href="giftCollectionUrl" target="_blank" rel="noreferrer">
              Бабло
            </a>
          </div>
          <div class="rsvp-success-actions">
            <button class="text-link" type="button" @click="startNewResponse">Заполнить заново</button>
          </div>
        </div>
        <form v-if="!hasSubmittedRsvp" class="rsvp-form reveal" @submit.prevent="submitRsvp">
          <label class="field field-full">
            <span>Ваше имя и фамилия</span>
            <input
              v-model="rsvpForm.fullName"
              type="text"
              name="fullName"
              autocomplete="name"
              maxlength="120"
              required
              placeholder="Например, Анна Иванова"
            />
          </label>

          <fieldset class="field field-full segmented">
            <legend>Сможете прийти?</legend>
            <span class="field-hint">Выберите один вариант</span>
            <div class="segmented-options">
              <label>
                <input
                  v-model="rsvpForm.attendance"
                  type="radio"
                  value="С удовольствием приду"
                  name="attendance"
                />
                <span>С удовольствием приду</span>
              </label>
              <label>
                <input
                  v-model="rsvpForm.attendance"
                  type="radio"
                  value="К сожалению, не смогу"
                  name="attendance"
                />
                <span>К сожалению, не смогу</span>
              </label>
            </div>
          </fieldset>

          <label class="field">
            <span>Сколько гостей будет с вами? (Не считая вас)</span>
            <select v-model="rsvpForm.guestsCount" name="guestsCount">
              <option value="0 (Только я)">0 (Только я)</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
          </label>

          <fieldset class="field field-full segmented segmented-secondary">
            <legend>Нужен ли трансфер до места проведения мероприятия?</legend>
            <span class="field-hint">Выберите один вариант</span>
            <div class="segmented-options">
              <label>
                <input
                  v-model="rsvpForm.transfer"
                  type="radio"
                  value="Да, буду рад"
                  name="transfer"
                />
                <span>Да, буду рад</span>
              </label>
              <label>
                <input
                  v-model="rsvpForm.transfer"
                  type="radio"
                  value="Доберусь сам"
                  name="transfer"
                />
                <span>Доберусь сам</span>
              </label>
              <label>
                <input
                  v-model="rsvpForm.transfer"
                  type="radio"
                  value="Сообщу позже"
                  name="transfer"
                />
                <span>Сообщу позже</span>
              </label>
            </div>
          </fieldset>

          <fieldset class="field field-full checklist">
            <legend>Ваши предпочтения по напиткам</legend>
            <span class="field-hint">Можно выбрать несколько</span>
            <div class="check-options">
              <label v-for="drink in drinkOptions" :key="drink">
                <input v-model="rsvpForm.drinks" type="checkbox" :value="drink" name="drinks" />
                <span>{{ drink }}</span>
              </label>
            </div>
          </fieldset>

          <label class="field field-full">
            <span>Аллергии или ограничения по питанию</span>
            <input
              v-model="rsvpForm.allergy"
              type="text"
              name="allergy"
              maxlength="180"
              placeholder="Орехи, глютен, морепродукты или оставьте пустым"
            />
          </label>

          <label class="field field-full">
            <span>Ваши пожелания или комментарии для Николая и Анастасии</span>
            <textarea
              v-model="rsvpForm.notes"
              name="notes"
              rows="5"
              maxlength="500"
              placeholder="Например, особенности питания, вопросы по размещению или что-то важное для нас"
            ></textarea>
          </label>

          <div class="form-footer field-full">
            <button class="button submit-button" type="submit" :disabled="submitState === 'submitting'">
              {{ submitState === "submitting" ? "Отправляем..." : "Отправить ответ" }}
            </button>
            <p class="form-disclaimer">
              После отправки мы покажем подтверждение на этой странице. Если понадобится запасной
              вариант, форму всегда можно открыть напрямую в Google Forms.
            </p>

            <p v-if="submitState === 'validation_error'" class="form-message">
              Пожалуйста, укажите ваше имя.
            </p>
            <p v-else-if="submitState === 'integration_pending'" class="form-message">
              Форма уже готова. Осталось подключить `Google Forms formResponse` и `entry`-id полей.
            </p>
            <p v-else-if="submitState === 'success'" class="form-message form-message-success">
              Спасибо. Ответ отправлен, а подтверждение сохранено в этом браузере.
            </p>
            <p v-else-if="submitState === 'error'" class="form-message">
              Не получилось отправить форму. Попробуйте ещё раз чуть позже или откройте Google
              Forms напрямую.
            </p>
            <a
              v-if="submitState === 'error' || submitState === 'integration_pending'"
              class="text-link"
              :href="googleFormViewUrl"
              target="_blank"
              rel="noreferrer"
            >
              Перейти к Google Form
            </a>
          </div>
        </form>
      </section>
    </main>
  </div>
</template>
