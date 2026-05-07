import { onBeforeUnmount, onMounted, ref } from "vue";

export function usePageChrome() {
  const menuOpen = ref(false);
  const activeSection = ref("hero");
  const navRef = ref(null);
  const menuButtonRef = ref(null);
  let revealObserver = null;
  let activeSectionObserver = null;

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

  return {
    menuOpen,
    activeSection,
    navRef,
    menuButtonRef,
    closeMenu,
  };
}

