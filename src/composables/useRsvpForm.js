import { computed, reactive, ref, watch } from "vue";

const googleFormViewUrl =
  "https://docs.google.com/forms/d/e/1FAIpQLSfDCL43fHnsH7Dp5m3Srq1U6IdWpV62eRMziE1JGSQ3xhwT6w/viewform?usp=dialog";
const giftCollectionUrl = "https://www.tbank.ru/cf/7T7iS0cYJfk";
const RSVP_STORAGE_KEY = "svadba-rsvp-submitted";
const GOOGLE_FORM_SUBMIT_TIMEOUT_MS = 1400;

const googleFormsConfig = {
  actionUrl:
    "https://docs.google.com/forms/d/e/1FAIpQLSfDCL43fHnsH7Dp5m3Srq1U6IdWpV62eRMziE1JGSQ3xhwT6w/formResponse",
  fields: {
    fullName: "entry.2147483642",
    attendance: "entry.913409654",
    guestsCount: "entry.919115456",
    transfer: "entry.379240082",
    drinks: "entry.753478909",
    notes: "entry.3661868",
  },
};

function appendHiddenInput(form, name, value) {
  const input = document.createElement("input");
  input.type = "hidden";
  input.name = name;
  input.value = value;
  form.append(input);
}

function submitToGoogleForms(formData) {
  return new Promise((resolve) => {
    const formId = `google-form-submit-${Date.now()}`;
    const iframe = document.createElement("iframe");
    const form = document.createElement("form");

    iframe.name = formId;
    iframe.style.display = "none";
    iframe.setAttribute("aria-hidden", "true");

    form.method = "POST";
    form.action = googleFormsConfig.actionUrl;
    form.target = formId;
    form.style.display = "none";

    formData.forEach((value, name) => {
      appendHiddenInput(form, name, value);
    });

    document.body.append(iframe, form);
    form.submit();

    window.setTimeout(() => {
      form.remove();
      iframe.remove();
      resolve();
    }, GOOGLE_FORM_SUBMIT_TIMEOUT_MS);
  });
}

export function useRsvpForm() {
  const submitState = ref("idle");
  const submittedGuestName = ref("");
  const lastSubmittedAt = ref("");
  const isProgrammaticFormReset = ref(false);

  const rsvpForm = reactive({
    fullName: "",
    attendance: "С удовольствием приду",
    guestsCount: "Только я",
    transfer: "Доберусь сам(а)",
    drinks: [],
    notes: "",
  });

  const canSubmitToGoogleForms = computed(() => {
    return Boolean(
      googleFormsConfig.actionUrl &&
        googleFormsConfig.fields.fullName &&
        googleFormsConfig.fields.attendance &&
        googleFormsConfig.fields.guestsCount &&
        googleFormsConfig.fields.transfer &&
        googleFormsConfig.fields.drinks
    );
  });

  const hasSubmittedRsvp = computed(() => submitState.value === "success" && Boolean(submittedGuestName.value));
  const hasGiftCollectionLink = computed(() => Boolean(giftCollectionUrl));

  function hydrateRsvpState() {
    const savedSubmission = window.localStorage.getItem(RSVP_STORAGE_KEY);
    if (!savedSubmission) {
      return;
    }

    try {
      const parsedSubmission = JSON.parse(savedSubmission);
      if (parsedSubmission?.name) {
        submittedGuestName.value = parsedSubmission.name;
        lastSubmittedAt.value = parsedSubmission.timestamp || "";
        submitState.value = "success";
      }
    } catch {
      window.localStorage.removeItem(RSVP_STORAGE_KEY);
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
    rsvpForm.transfer = "Доберусь сам(а)";
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

    if (!rsvpForm.fullName.trim() || rsvpForm.drinks.length === 0) {
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

      await submitToGoogleForms(formData);

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
    } catch {
      submitState.value = "error";
    }
  }

  return {
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
  };
}
