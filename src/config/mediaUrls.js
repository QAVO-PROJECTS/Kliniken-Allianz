// All uploaded media is served by the API under /files/<folder>/.
// Override the base with VITE_FILES_URL (see .env.example).
export const FILES_URL = (import.meta.env.VITE_FILES_URL || 'https://api.kliniken-allianz.com/files').replace(/\/+$/, '');

const files = (folder) => `${FILES_URL}/${folder}/`;

export const CLINIC_CARD_IMAGES = files('clinic_card_images');
export const CLINIC_IMAGES = files('clinic_images');
export const CLINIC_SERT_IMAGES = files('clinic_sertificates');
export const CERT_CLINIC_URL = CLINIC_SERT_IMAGES;
export const CATEGORY_IMAGES = files('category_images');
export const SERVICE_CARD_IMAGES = files('service_card_images');
export const SERVICE_IMAGES = files('service_images');
export const TOUR_CARD_IMG = files('tour_card_images');
export const TOUR_IMAGES = files('tour_images');
export const DOCTOR_IMG_URL = files('doctor_images');
export const CERT_DOKTOR_URL = files('doctor_sertificates');
export const OTEL_CARD_IMAGES = files('otel_card_images');
export const VIEW_CARD_IMAGES = files('view_card_images');
export const SANATORIUM_CARD_IMAGES = files('sanatorium_card');
export const SANATORIUM_IMAGES = files('sanatorium_images');
export const CAR_CARD_IMAGES = files('car/card_images');
export const CAR_IMAGES = files('car');
export const NEWSPAPER_IMAGES = files('newspaper');
