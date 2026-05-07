import { computed, ref } from "vue";

export function useLocationMap() {
  const mapLoadFailed = ref(false);
  const copiedCoordinates = ref(false);

  const yandexShortUrl = "https://yandex.com/maps/-/CPWcmB10";
  const mapCoordinates = {
    lat: 52.945448,
    lng: 91.488506,
  };

  const yandexMapUrl = computed(() => yandexShortUrl);

  const yandexStaticMapUrl = computed(() => {
    const { lat, lng } = mapCoordinates;
    return `https://static-maps.yandex.ru/1.x/?ll=${lng},${lat}&size=650,420&z=15&l=map&pt=${lng},${lat},pm2rdl`;
  });

  const formattedCoordinates = computed(() => {
    return `${mapCoordinates.lat}, ${mapCoordinates.lng}`;
  });

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
    } catch {
      copiedCoordinates.value = false;
    }
  }

  return {
    mapLoadFailed,
    copiedCoordinates,
    yandexMapUrl,
    yandexStaticMapUrl,
    handleMapError,
    copyCoordinates,
  };
}

