import "./index.scss";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight } from "lucide-react";
import HotelCard from "../../../../components/cards/HotelCard/index.jsx";
import SectionTitle from "../../../../components/ui/SectionTitle/index.jsx";

/** Hotels near a clinic — horizontal scroll-snap carousel. */
function ClinicHotels({ otels }) {
    const { t } = useTranslation();
    const trackRef = useRef(null);
    const hotels = Array.isArray(otels) ? otels : [];

    if (hotels.length === 0) return null;

    const scroll = (dir) => {
        const track = trackRef.current;
        if (!track) return;
        const rtl = document.documentElement.dir === "rtl" ? -1 : 1;
        track.scrollBy({ left: dir * rtl * track.clientWidth * 0.9, behavior: "smooth" });
    };

    return (
        <section className="md-section clinic-hotels">
            <div className="container">
                <div className="md-section-head">
                    <SectionTitle align="start" title={t("homeHotel.title")} desc={t("homeHotel.desc")} />
                    {hotels.length > 1 && (
                        <div className="clinic-hotels__nav">
                            <button type="button" onClick={() => scroll(-1)} aria-label={t("homeClinic.prevButton")}>
                                <ChevronLeft size={20} className="md-flip-rtl" />
                            </button>
                            <button type="button" onClick={() => scroll(1)} aria-label={t("homeClinic.nextButton")}>
                                <ChevronRight size={20} className="md-flip-rtl" />
                            </button>
                        </div>
                    )}
                </div>
                <div className="clinic-hotels__track" ref={trackRef}>
                    {hotels.map((item) => (
                        <div className="clinic-hotels__slide" key={item.id}>
                            <HotelCard item={item} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default ClinicHotels;
