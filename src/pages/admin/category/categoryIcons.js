// Selectable category icons (shared by CategoryCreate / CategoryEdit).
import cat1 from "../../../assets/services/cat1.svg";
import cat2 from "../../../assets/services/cat2.svg";
import cat3 from "../../../assets/services/cat3.svg";
import cat4 from "../../../assets/services/cat4.svg";
import cat5 from "../../../assets/services/cat5.svg";
import cat6 from "../../../assets/services/cat6.svg";
import cat7 from "../../../assets/services/cat7.svg";
import cat8 from "../../../assets/services/cat8.svg";
import cat9 from "../../../assets/services/cat9.svg";
import cat10 from "../../../assets/services/cat10.svg";
import cat11 from "../../../assets/services/cat11.svg";
import cat12 from "../../../assets/services/cat12.svg";
import cat13 from "../../../assets/services/cat13.svg";
import cat14 from "../../../assets/services/cat14.svg";
import cat15 from "../../../assets/services/cat15.svg";
import cat16 from "../../../assets/services/cat16.svg";
import cat17 from "../../../assets/services/cat17.svg";
import cat18 from "../../../assets/services/cat18.svg";

export const CATEGORY_ICONS = [cat1, cat2, cat3, cat4, cat5, cat6, cat7, cat8, cat9, cat10, cat11, cat12, cat13, cat14, cat15, cat16, cat17, cat18];

/** Fetches a bundled icon as a Blob so it can be uploaded as `categoryImage`. */
export const getIconBlob = async (url) => (await fetch(url)).blob();
