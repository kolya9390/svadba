<script setup>
import SectionHeading from "../shared/SectionHeading.vue";

defineProps({
  hasSubmittedRsvp: {
    type: Boolean,
    required: true,
  },
  submittedGuestName: {
    type: String,
    default: "",
  },
  lastSubmittedAt: {
    type: String,
    default: "",
  },
  hasGiftCollectionLink: {
    type: Boolean,
    required: true,
  },
  giftCollectionUrl: {
    type: String,
    default: "",
  },
  rsvpForm: {
    type: Object,
    required: true,
  },
  submitState: {
    type: String,
    required: true,
  },
  drinkOptions: {
    type: Array,
    required: true,
  },
  googleFormViewUrl: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["submit", "start-new-response"]);
</script>

<template>
  <section id="rsvp" class="section cta">
    <SectionHeading
      :title="hasSubmittedRsvp ? 'Спасибо, будем ждать вас.' : 'Подтвердите присутствие'"
    />

    <div v-if="hasSubmittedRsvp" class="rsvp-success-inline" role="status" aria-live="polite">
      <div v-if="hasGiftCollectionLink" class="rsvp-gift-inline">
        <p class="rsvp-gift-inline-text">
          Если захотите сделать подарок, можно перейти по кнопке ниже.
        </p>
        <a class="button" :href="giftCollectionUrl" target="_blank" rel="noreferrer"> Подарок молодым </a>
      </div>
      <div class="rsvp-success-actions">
        <a class="text-link" :href="googleFormViewUrl" target="_blank" rel="noreferrer">
          Открыть Google Form
        </a>
      </div>
    </div>

    <form v-if="!hasSubmittedRsvp" class="rsvp-form reveal" @submit.prevent="emit('submit')">
      <div class="rsvp-form-head field-full">
        <p class="rsvp-form-lead">После ответа мы покажем следующий шаг.</p>
      </div>

      <label class="field field-full">
        <span>Ваше имя и фамилия</span>
        <input
          v-model="rsvpForm.fullName"
          type="text"
          name="fullName"
          autocomplete="name"
          maxlength="120"
          required
        />
      </label>

      <div class="field field-full segmented" role="radiogroup" aria-labelledby="attendance-title">
        <p id="attendance-title" class="field-title">Сможете прийти?</p>
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
      </div>

      <label class="field field-full">
        <span>Сколько гостей будет с вами?</span>
        <select v-model="rsvpForm.guestsCount" name="guestsCount">
          <option value="Только я">Только я</option>
          <option value="+1">+1</option>
        </select>
      </label>

      <div class="field field-full segmented segmented-secondary" role="radiogroup" aria-labelledby="transfer-title">
        <p id="transfer-title" class="field-title">Нужен ли трансфер до места проведения мероприятия?</p>
        <div class="segmented-options">
          <label>
            <input v-model="rsvpForm.transfer" type="radio" value="Да, буду рад(а)" name="transfer" />
            <span>Да, буду рад(а)</span>
          </label>
          <label>
            <input v-model="rsvpForm.transfer" type="radio" value="Доберусь сам(а)" name="transfer" />
            <span>Доберусь сам(а)</span>
          </label>
          <label>
            <input v-model="rsvpForm.transfer" type="radio" value="Сообщу позже" name="transfer" />
            <span>Сообщу позже</span>
          </label>
        </div>
      </div>

      <div class="field field-full checklist" role="group" aria-labelledby="drinks-title" aria-required="true">
        <p id="drinks-title" class="field-title">Что вам ближе из напитков?</p>
        <div class="check-options">
          <label v-for="drink in drinkOptions" :key="drink">
            <input v-model="rsvpForm.drinks" type="checkbox" :value="drink" name="drinks" />
            <span>{{ drink }}</span>
          </label>
        </div>
      </div>

      <label class="field field-full">
        <span>Ваши пожелания или комментарии для Николая и Анастасии</span>
        <textarea
          v-model="rsvpForm.notes"
          name="notes"
          rows="5"
          maxlength="500"
        ></textarea>
      </label>

      <div class="form-footer field-full">
        <button class="button submit-button" type="submit" :disabled="submitState === 'submitting'">
          {{ submitState === "submitting" ? "Отправляем..." : "Отправить ответ" }}
        </button>
        <p class="form-disclaimer">
          После отправки мы покажем подтверждение на этой странице. Если захотите перестраховаться,
          анкету всегда можно открыть напрямую в Google Forms.
        </p>

        <p v-if="submitState === 'validation_error'" class="form-message">Пожалуйста, заполните обязательные поля.</p>
        <p v-else-if="submitState === 'integration_pending'" class="form-message">
          Анкета почти готова к отправке. Пока можно открыть её напрямую в Google Forms.
        </p>
        <p v-else-if="submitState === 'success'" class="form-message form-message-success">
          Похоже, всё получилось. Мы сохранили подтверждение в этом браузере.
        </p>
        <p v-else-if="submitState === 'error'" class="form-message">
          Не получилось отправить форму. Попробуйте ещё раз чуть позже или откройте анкету напрямую.
        </p>
        <details class="form-fallback">
          <p>
            <a class="text-link form-fallback-link" :href="googleFormViewUrl" target="_blank" rel="noreferrer">
              откройте анкету напрямую в Google Form
            </a>
          </p>
        </details>
      </div>
    </form>
  </section>
</template>
