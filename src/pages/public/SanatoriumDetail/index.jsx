import { useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { BedDouble, Check, Crown, HeartPulse, MapPin, Phone, ShieldCheck, Sofa } from "lucide-react";
import {
    useGetAllSanatoriumQuery,
    useGetSanatoriumByIdQuery,
    usePostContactSanatoriumMutation,
} from "../../../api/userApi.js";
import { SANATORIUM_CARD_IMAGES, SANATORIUM_IMAGES } from "../../../config/mediaUrls.js";
import { getLocalizedText } from "../../../i18n/getLocalizedText.js";
import PageHeader from "../../../components/ui/PageHeader/index.jsx";
import SanatoriumCard from "../../../components/cards/SanatoriumCard/index.jsx";
import EnquiryForm from "../Contact/EnquiryForm.jsx";
import CtaBand from "../Contact/CtaBand.jsx";
import { EmptyState } from "../Tours/ListingStates.jsx";
import MediaGallery from "../TourDetail/MediaGallery.jsx";
import VideoGrid from "../TourDetail/VideoGrid.jsx";
import { toParagraphs } from "../TourDetail/carMessage.js";
import "../Tours/listing.scss";
import "../TourDetail/detailShared.scss";
import "./index.scss";

const SERVICES_PREVIEW = 8;

function SanatoriumDetail() {
    const { id } = useParams();
    const { t } = useTranslation();
    const { data, isLoading, isError } = useGetSanatoriumByIdQuery(id);
    const { data: allData } = useGetAllSanatoriumQuery();
    const [postSanatoriumContact] = usePostContactSanatoriumMutation();
    const [showAllServices, setShowAllServices] = useState(false);
    const formRef = useRef(null);

    const sanatorium = data?.data;
    const name = getLocalizedText(sanatorium, "name");
    const location = getLocalizedText(sanatorium, "location");
    const paragraphs = toParagraphs(getLocalizedText(sanatorium, "description"));
    const services = sanatorium?.services || [];
    const visibleServices = showAllServices ? services : services.slice(0, SERVICES_PREVIEW);
    const videos = sanatorium?.videos || [];
    const phone = t("contact.contactCard.mobile.value");

    const images = useMemo(() => {
        const list = (sanatorium?.images || []).map((img) => SANATORIUM_IMAGES + img);
        if (sanatorium?.sanatoriumCardImage) list.unshift(SANATORIUM_CARD_IMAGES + sanatorium.sanatoriumCardImage);
        return list;
    }, [sanatorium]);

    const rooms = [
        { key: "standard", icon: BedDouble, label: t("sanatoriumDetail.rooms.standard", "Standard room") },
        { key: "comfort", icon: Sofa, label: t("sanatoriumDetail.rooms.comfort", "Comfort room") },
        { key: "vip", icon: Crown, label: t("sanatoriumDetail.rooms.vip", "VIP room") },
    ]
        .map((r) => ({ ...r, text: getLocalizedText(sanatorium, `${r.key}RoomDescription`) }))
        .filter((r) => r.text);

    const related = (allData?.data || []).filter((s) => s.id !== id).slice(0, 4);

    const scrollToForm = () => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

    if (!isLoading && (isError || !sanatorium)) {
        return (
            <div className="sanatorium-detail">
                <PageHeader title={t("navbar.sanatorium")} crumbs={[{ label: t("navbar.sanatoriums"), to: "/sanatoriums" }]} />
                <div className="container detail-page">
                    <EmptyState
                        title={t("common.noData", "No data")}
                        action={<Link to="/sanatoriums" className="btn btn--primary">{t("navbar.sanatoriums")}</Link>}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="sanatorium-detail">
            <PageHeader
                title={name || " "}
                crumbs={[{ label: t("sanatoriumDetail.breadcrumb.sanatoriums"), to: "/sanatoriums" }, { label: name }]}
            >
                {location && (
                    <span className="sanatorium-detail__location">
                        <MapPin size={16} strokeWidth={2} aria-hidden="true" />
                        {location}
                    </span>
                )}
            </PageHeader>

            <div className="container detail-page">
                <div className="detail-layout">
                    <div className="detail-layout__gallery">
                        <MediaGallery images={images} alt={name} badge={t("navbar.sanatorium")} />
                    </div>

                    <aside className="detail-layout__aside" aria-label={t("tourDetail.bookingAria", "Booking summary")}>
                        <div className="booking-card">
                            <span className="eyebrow booking-card__eyebrow">{t("navbar.sanatorium")}</span>
                            <h2 className="booking-card__title">{name}</h2>

                            <ul className="fact-list">
                                {location && (
                                    <li>
                                        <span className="fact-list__icon"><MapPin size={20} strokeWidth={1.75} /></span>
                                        <span className="fact-list__text">
                                            <small>{t("sanatoriumDetail.locationLabel", "Location")}</small>
                                            <span>{location}</span>
                                        </span>
                                    </li>
                                )}
                                {services.length > 0 && (
                                    <li>
                                        <span className="fact-list__icon"><HeartPulse size={20} strokeWidth={1.75} /></span>
                                        <span className="fact-list__text">
                                            <small>{t("navbar.services")}</small>
                                            <span>{t("sanatoriumDetail.servicesCount", "{{count}} treatments & services", { count: services.length })}</span>
                                        </span>
                                    </li>
                                )}
                                {rooms.length > 0 && (
                                    <li>
                                        <span className="fact-list__icon"><BedDouble size={20} strokeWidth={1.75} /></span>
                                        <span className="fact-list__text">
                                            <small>{t("sanatoriumDetail.rooms.title", "Room types")}</small>
                                            <span>{rooms.map((r) => r.label).join(" · ")}</span>
                                        </span>
                                    </li>
                                )}
                            </ul>

                            <div className="booking-card__actions">
                                <button type="button" className="btn btn--primary btn--lg btn--block" onClick={scrollToForm}>
                                    {t("toursPage.applyButton")}
                                </button>
                                <a href={`tel:${phone.replace(/\s+/g, "")}`} className="btn btn--secondary btn--block">
                                    <Phone size={18} strokeWidth={2} aria-hidden="true" />
                                    <span dir="ltr">{phone}</span>
                                </a>
                            </div>
                            <p className="booking-card__note">
                                <ShieldCheck size={18} strokeWidth={2} aria-hidden="true" />
                                {t("tourDetail.freeConsultation", "Free consultation, no obligation")}
                            </p>
                        </div>
                    </aside>

                    <div className="detail-layout__main">
                        {isLoading && (
                            <div className="detail-skeleton" aria-hidden="true">
                                <div className="skeleton detail-skeleton__title" />
                                <div className="skeleton detail-skeleton__line" />
                                <div className="skeleton detail-skeleton__line" />
                                <div className="skeleton detail-skeleton__line detail-skeleton__line--short" />
                            </div>
                        )}

                        {paragraphs.length > 0 && (
                            <section className="detail-section">
                                <div className="detail-section__head">
                                    <h2>{t("tourDetail.overview", "Overview")}</h2>
                                </div>
                                <div className="prose">
                                    {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
                                </div>
                            </section>
                        )}

                        {rooms.length > 0 && (
                            <section className="detail-section">
                                <div className="detail-section__head">
                                    <h2>{t("sanatoriumDetail.rooms.title", "Room types")}</h2>
                                </div>
                                <div className="room-grid">
                                    {rooms.map(({ key, icon: Icon, label, text }) => (
                                        <article className="room-card" key={key}>
                                            <span className="room-card__icon"><Icon size={22} strokeWidth={1.75} /></span>
                                            <h3>{label}</h3>
                                            <p>{text}</p>
                                        </article>
                                    ))}
                                </div>
                            </section>
                        )}

                        {!isLoading && (
                            <section className="detail-section">
                                <div className="detail-section__head">
                                    <div>
                                        <h2>{t("sanatoriumDetail.services.title")}</h2>
                                        <p>{t("sanatoriumDetail.services.description")}</p>
                                    </div>
                                </div>
                                {services.length > 0 ? (
                                    <>
                                        <ul className="include-list">
                                            {visibleServices.map((item) => (
                                                <li key={item.id}>
                                                    <span className="include-list__icon"><Check size={14} strokeWidth={3} /></span>
                                                    {getLocalizedText(item, "name")}
                                                </li>
                                            ))}
                                        </ul>
                                        {services.length > SERVICES_PREVIEW && (
                                            <div className="show-more">
                                                <button
                                                    type="button"
                                                    className="btn btn--secondary"
                                                    onClick={() => setShowAllServices((v) => !v)}
                                                    aria-expanded={showAllServices}
                                                >
                                                    {showAllServices
                                                        ? t("common.showLess", "Show less")
                                                        : `${t("clinicDetail.services.button")} (${services.length})`}
                                                </button>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <p className="text-secondary">{t("common.noData", "No data")}</p>
                                )}
                            </section>
                        )}

                        {videos.length > 0 && (
                            <section className="detail-section">
                                <div className="detail-section__head">
                                    <h2>{t("sanatoriumDetail.videos.title")}</h2>
                                </div>
                                <VideoGrid videos={videos} title={name} />
                            </section>
                        )}

                        <section className="detail-section detail-section--card" ref={formRef} id="enquiry">
                            <EnquiryForm
                                title={t("contact.form.title")}
                                subtitle={t("sanatoriumDetail.formSubtitle", "Ask about availability, treatment programmes and prices — we will get back to you shortly.")}
                                onSubmit={(values) => postSanatoriumContact({ ...values, sanatoriumId: id }).unwrap()}
                            />
                        </section>
                    </div>
                </div>
            </div>

            {related.length > 0 && (
                <section className="section section--subtle sanatorium-detail__related">
                    <div className="container">
                        <div className="listing-toolbar">
                            <div>
                                <h2>{t("sanatoriumDetail.related.title")}</h2>
                                <p>{t("sanatoriumDetail.related.description")}</p>
                            </div>
                            <Link to="/sanatoriums" className="btn btn--secondary btn--sm">
                                {t("blogDetail.viewAll")}
                            </Link>
                        </div>
                        <div className="listing-grid listing-grid--4">
                            {related.map((item) => (
                                <SanatoriumCard key={item.id} item={item} />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            <div className="sanatorium-detail__cta">
                <CtaBand />
            </div>
        </div>
    );
}

export default SanatoriumDetail;
