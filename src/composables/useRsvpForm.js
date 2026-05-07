import { computed, reactive, ref, watch } from "vue";

const googleFormViewUrl =
  "https://docs.google.com/forms/d/e/1FAIpQLSfDCL43fHnsH7Dp5m3Srq1U6IdWpV62eRMziE1JGSQ3xhwT6w/viewform?usp=pp_url";
const giftCollectionUrl = "https://www.tbank.ru/cf/7T7iS0cYJfk";
const RSVP_STORAGE_KEY = "svadba-rsvp-submitted";

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

export function useRsvpForm() {
  const submitState = ref("idle");
  const submittedGuestName = ref("");
  const lastSubmittedAt = ref("");
  const isProgrammaticFormReset = ref(false);

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

