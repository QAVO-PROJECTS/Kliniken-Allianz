import "./index.scss";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight } from "lucide-react";
import HotelCard from "../../../../components/cards/HotelCard/index.jsx";
import SectionTitle from "../../../../components/ui/SectionTitle/index.jsx";

/** Hotels near a clinic: horizontal scroll-snap strip with prev/next buttons. */
function ClinicHotels({ otels }) {
    const { t } = useTranslation();
    const trackRef = useRef(null);
    const hotels = Array.isArray(otels) ? otels : [];

    if (hotels.length === 0) return null;

    const scroll = (dir) => {
        const track = trackRef.current;
        if (!track) return;
        const rtl = document.documentElement.dir === "rtl" ? -1 : 1;
        const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
        track.scrollBy({ left: dir * rtl * track.clientWidth * 0.9, behavior: reduce ? "auto" : "smooth" });
    };

    return (
        <section className="md-section clinic-hotels" aria-labelledby="clinic-hotels-title">
            <div className="container">
                <div className="md-section-head">
                    <SectionTitle
                        align="start"
                        title={<span id="clinic-hotels-title">{t("homeHotel.title")}</span>}
                        desc={t("homeHotel.desc")}
                    />
                    {hotels.length > 1 && (
                        <div className="clinic-hotels__nav">
                            <button type="button" onClick={() => scroll(-1)} aria-label={t("homeClinic.prevButton")}>
                                <ChevronLeft size={20} strokeWidth={1.75} className="md-flip-rtl" aria-hidden="true" />
                            </button>
                            <button type="button" onClick={() => scroll(1)} aria-label={t("homeClinic.nextButton")}>
                                <ChevronRight size={20} strokeWidth={1.75} className="md-flip-rtl" aria-hidden="true" />
                            </button>
                        </div>
                    )}
                </div>
                <ul className="clinic-hotels__track" ref={trackRef}>
                    {hotels.map((item) => (
                        <li className="clinic-hotels__slide" key={item.id}>
                            <HotelCard item={item} bare />
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}

export default ClinicHotels;
