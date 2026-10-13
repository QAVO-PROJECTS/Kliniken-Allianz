import { useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
    ArrowRight, BedDouble, CarFront, Check, ExternalLink, FileCheck2, MapPin, Phone, Plane, ShieldCheck, Star,
} from "lucide-react";
import { useGetToursByIdQuery, usePostContactTourMutation } from "../../../api/userApi.js";
import { CAR_CARD_IMAGES, OTEL_CARD_IMAGES, TOUR_CARD_IMG, TOUR_IMAGES } from "../../../config/mediaUrls.js";
import { getLocalizedText } from "../../../i18n/getLocalizedText.js";
import PageHeader from "../../../components/ui/PageHeader/index.jsx";
import EnquiryForm from "../Contact/EnquiryForm.jsx";
import CtaBand from "../Contact/CtaBand.jsx";
import { EmptyState } from "../Tours/ListingStates.jsx";
import MediaGallery from "./MediaGallery.jsx";
import VideoGrid from "./VideoGrid.jsx";
import { carEnquiryMessage, toParagraphs } from "./carMessage.js";
import "./detailShared.scss";
import "./index.scss";

const uniqueById = (list = []) => [...new Map(list.map((x) => [x.id, x])).values()];

function StarRating({ rating = 0 }) {
    const value = Math.round(Number(rating) || 0);
    return (
        <span className="mini-card__stars" aria-label={`${value} / 5`}>
            {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} size={14} strokeWidth={0} fill="currentColor" className={s <= value ? "" : "is-empty"} />
            ))}
        </span>
    );
}

function TourDetail() {
    const { id } = useParams();
    const { t } = useTranslation();
    const { data, isLoading, isError } = useGetToursByIdQuery(id);
    const tour = data?.data;
    const [postContact] = usePostContactTourMutation();
    const [presetMessage, setPresetMessage] = useState("");
    const formRef = useRef(null);

    const name = getLocalizedText(tour, "name");
    const paragraphs = toParagraphs(getLocalizedText(tour, "description"));
    const cars = useMemo(() => uniqueById(tour?.cars), [tour]);
    const hotels = useMemo(() => uniqueById(tour?.otels), [tour]);
    const services = tour?.services || [];
    const videos = tour?.tourVideos || [];
    const images = useMemo(() => {
        const list = (tour?.tourImages || []).map((img) => TOUR_IMAGES + img);
        if (!list.length && tour?.cardImage) list.push(TOUR_CARD_IMG + tour.cardImage);
        return list;
    }, [tour]);
    const phone = t("contact.contactCard.mobile.value");

    const scrollToForm = () => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

    const applyForCar = (car) => {
        setPresetMessage(carEnquiryMessage(getLocalizedText(car, "name")));
        scrollToForm();
    };

    if (!isLoading && (isError || !tour)) {
        return (
            <div className="tour-detail">
                <PageHeader title={t("toursPage.title")} crumbs={[{ label: t("navbar.tours"), to: "/tours" }]} />
                <div className="container detail-page">
                    <EmptyState
                        title={t("common.noData", "No data")}
                        action={<Link to="/tours" className="btn btn--primary">{t("navbar.tours")}</Link>}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="tour-detail">
            <PageHeader
                title={name || " "}
                crumbs={[{ label: t("navbar.tours"), to: "/tours" }, { label: name }]}
            />

            <div className="container detail-page">
                <div className="detail-layout">
                    <div className="detail-layout__gallery">
                        <MediaGallery images={images} alt={name} badge={t("tourDetail.badge", "Tour package")} />
                    </div>

                    <aside className="detail-layout__aside" aria-label={t("tourDetail.bookingAria", "Booking summary")}>
                        <div className="booking-card">
                            <span className="eyebrow booking-card__eyebrow">{t("tourDetail.badge", "Tour package")}</span>
                            <h2 className="booking-card__title">{name}</h2>

                            <div className={`booking-card__price${tour?.price ? "" : " booking-card__price--request"}`}>
                                <small>{t("tourDetail.priceLabel", "Price")}</small>
                                {tour?.price ? (
                                    <>
                                        <strong>{tour.price}</strong>
                                        <span>AZN</span>
                                    </>
                                ) : (
                                    <strong>{t("tourDetail.priceOnRequest", "Price on request")}</strong>
                                )}
                            </div>

                            <ul className="fact-list">
                                <li>
                                    <span className="fact-list__icon"><BedDouble size={20} strokeWidth={1.75} /></span>
                                    <span className="fact-list__text">
                                        <small>{t("tourCard.hotel")}</small>
                                        <span>
                                            {hotels.length
                                                ? t("tourDetail.hotelsCount", "{{count}} hotels to choose from", { count: hotels.length })
                                                : t("tourDetail.included", "Included")}
                                        </span>
                                    </span>
                                </li>
                                <li>
                                    <span className="fact-list__icon"><FileCheck2 size={20} strokeWidth={1.75} /></span>
                                    <span className="fact-list__text">
                                        <small>{t("tourCard.visa")}</small>
                                        <span>{t("tourDetail.visaSupport", "Visa support")}</span>
                                    </span>
                                </li>
                                <li>
                                    <span className="fact-list__icon"><Plane size={20} strokeWidth={1.75} /></span>
                                    <span className="fact-list__text">
                                        <small>{t("tourCard.flight")}</small>
                                        <span>{t("tourDetail.flightBooking", "Flight booking assistance")}</span>
                                    </span>
                                </li>
                                {cars.length > 0 && (
                                    <li>
                                        <span className="fact-list__icon"><CarFront size={20} strokeWidth={1.75} /></span>
                                        <span className="fact-list__text">
                                            <small>{t("tourDetail.cars.title")}</small>
                                            <span>{t("tourDetail.carsCount", "{{count}} vehicles available", { count: cars.length })}</span>
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

                        {services.length > 0 && (
                            <section className="detail-section">
                                <div className="detail-section__head">
                                    <h2>{t("tourDetail.includedTitle", "What's included")}</h2>
                                </div>
                                <ul className="include-list">
                                    {services.map((srv, i) => (
                                        <li key={srv.id || i}>
                                            <span className="include-list__icon"><Check size={14} strokeWidth={3} /></span>
                                            {getLocalizedText(srv, "name")}
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}

                        {hotels.length > 0 && (
                            <section className="detail-section">
                                <div className="detail-section__head">
                                    <h2>{t("tourDetail.otels.title")}</h2>
                                </div>
                                <div className="mini-grid">
                                    {hotels.map((otel) => (
                                        <article className="mini-card" key={otel.id}>
                                            <div className="mini-card__media">
                                                {otel.cardImage && (
                                                    <img
                                                        src={OTEL_CARD_IMAGES + otel.cardImage}
                                                        alt={getLocalizedText(otel, "name")}
                                                        loading="lazy"
                                                        decoding="async"
                                                    />
                                                )}
                                            </div>
                                            <div className="mini-card__body">
                                                <h3 className="mini-card__title">{getLocalizedText(otel, "name")}</h3>
                                                <div className="mini-card__meta">
                                                    <span>
                                                        <MapPin size={14} strokeWidth={2} aria-hidden="true" />
                                                        {getLocalizedText(otel, "location") || getLocalizedText(otel, "country")}
                                                    </span>
                                                    <StarRating rating={otel.raiting} />
                                                </div>
                                                {otel.otelLink && (
                                                    <div className="mini-card__footer">
                                                        <a
                                                            href={otel.otelLink}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="btn btn--ghost btn--sm"
                                                        >
                                                            {t("tourDetail.otels.visit")}
                                                            <ExternalLink size={14} strokeWidth={2} aria-hidden="true" />
                                                        </a>
                                                    </div>
                                                )}
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            </section>
                        )}

                        {cars.length > 0 && (
                            <section className="detail-section">
                                <div className="detail-section__head">
                                    <h2>{t("tourDetail.cars.title")}</h2>
                                </div>
                                <div className="mini-grid">
                                    {cars.map((car) => {
                                        const carName = getLocalizedText(car, "name");
                                        return (
                                            <article className="mini-card mini-card--linked" key={car.id}>
                                                <div className="mini-card__media">
                                                    {car.cardImage && (
                                                        <img
                                                            src={CAR_CARD_IMAGES + car.cardImage}
                                                            alt={carName}
                                                            loading="lazy"
                                                            decoding="async"
                                                        />
                                                    )}
                                                    {car.type && <span className="mini-card__tag">{car.type}</span>}
                                                </div>
                                                <div className="mini-card__body">
                                                    <h3 className="mini-card__title">
                                                        <Link to={`/cars/${car.id}`}>{carName}</Link>
                                                    </h3>
                                                    {car.price && (
                                                        <span className="mini-card__price">
                                                            {car.price} AZN <small>/ {t("carDetail.perDay")}</small>
                                                        </span>
                                                    )}
                                                    <div className="mini-card__footer">
                                                        <button
                                                            type="button"
                                                            className="btn btn--secondary btn--sm"
                                                            onClick={() => applyForCar(car)}
                                                        >
                                                            {t("tourDetail.cars.apply")}
                                                        </button>
                                                        <span className="tour-detail__car-more" aria-hidden="true">
                                                            <ArrowRight size={18} strokeWidth={2} />
                                                        </span>
                                                    </div>
                                                </div>
                                            </article>
                                        );
                                    })}
                                </div>
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
                                subtitle={t("tourDetail.formSubtitle", "Leave your details and our travel coordinator will contact you about this tour.")}
                                presetMessage={presetMessage}
                                onSubmit={(values) => postContact({ ...values, tourId: id }).unwrap()}
                            />
                        </section>
                    </div>
                </div>
            </div>

            <CtaBand />
        </div>
    );
}

export default TourDetail;
