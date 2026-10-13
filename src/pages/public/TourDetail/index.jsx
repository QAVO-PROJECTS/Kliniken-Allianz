import { useId, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { BedDouble, CarFront, ExternalLink, FileCheck2, ImageOff, MapPin, Plane, Star } from "lucide-react";
import { useGetToursByIdQuery, usePostContactTourMutation } from "../../../api/userApi.js";
import { CAR_CARD_IMAGES, OTEL_CARD_IMAGES, TOUR_CARD_IMG, TOUR_IMAGES } from "../../../config/mediaUrls.js";
import { getLocalizedText } from "../../../i18n/getLocalizedText.js";
import PageHeader from "../../../components/ui/PageHeader/index.jsx";
import EnquiryForm from "../Contact/EnquiryForm.jsx";
import { EmptyState } from "../Tours/ListingStates.jsx";
import MediaGallery from "./MediaGallery.jsx";
import VideoGrid from "./VideoGrid.jsx";
import { BookingCard, DetailSkeleton, IncludeList, SectionHead, ShowMore } from "./DetailParts.jsx";
import { carEnquiryMessage, toParagraphs } from "./carMessage.js";
import "./detailShared.scss";

const CARS_PREVIEW = 6;

const uniqueById = (list = []) => [...new Map(list.map((x) => [x.id, x])).values()];

function StarRating({ rating = 0 }) {
    const value = Math.round(Number(rating) || 0);
    if (!value) return null;
    return (
        <span className="star-rating" role="img" aria-label={`${value} / 5`}>
            {[1, 2, 3, 4, 5].map((s) => (
                <Star
                    key={s}
                    size={14}
                    strokeWidth={1.75}
                    fill="currentColor"
                    className={s <= value ? "" : "is-empty"}
                    aria-hidden="true"
                />
            ))}
        </span>
    );
}

/** Thumbnail that falls back to a quiet icon tile when the file is missing. */
function Thumb({ src, alt }) {
    const [failed, setFailed] = useState(false);
    if (!src || failed) {
        return (
            <span className="thumb-fallback" aria-hidden="true">
                <ImageOff size={24} strokeWidth={1.75} />
            </span>
        );
    }
    return <img src={src} alt={alt} width="400" height="300" loading="lazy" decoding="async" onError={() => setFailed(true)} />;
}

function TourDetail() {
    const { id } = useParams();
    const { t } = useTranslation();
    const uid = useId();
    const { data, isLoading, isError } = useGetToursByIdQuery(id);
    const tour = data?.data;
    const [postContact] = usePostContactTourMutation();
    const [presetMessage, setPresetMessage] = useState("");
    const [allCars, setAllCars] = useState(false);
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
    const visibleCars = allCars ? cars : cars.slice(0, CARS_PREVIEW);

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

    const facts = [
        {
            icon: BedDouble,
            label: t("tourCard.hotel"),
            value: hotels.length
                ? t("tourDetail.hotelsCount", "{{count}} hotels to choose from", { count: hotels.length })
                : t("tourDetail.included", "Included"),
        },
        { icon: FileCheck2, label: t("tourCard.visa"), value: t("tourDetail.visaSupport", "Visa support") },
        { icon: Plane, label: t("tourCard.flight"), value: t("tourDetail.flightBooking", "Flight booking assistance") },
    ];
    if (cars.length) {
        facts.push({
            icon: CarFront,
            label: t("tourDetail.cars.title"),
            value: t("tourDetail.carsCount", "{{count}} vehicles available", { count: cars.length }),
        });
    }

    return (
        <div className="tour-detail">
            <PageHeader
                title={name || " "}
                crumbs={[{ label: t("navbar.tours"), to: "/tours" }, { label: name }]}
            />

            <div className="container detail-page">
                <div className="detail-layout">
                    <div className="detail-layout__gallery">
                        <MediaGallery images={images} alt={name} loading={isLoading} />
                    </div>

                    <div className="detail-layout__aside">
                        <BookingCard
                            title={name}
                            price={tour?.price ? String(tour.price) : ""}
                            priceSuffix="AZN"
                            facts={isLoading ? [] : facts}
                            onApply={scrollToForm}
                        />
                    </div>

                    <div className="detail-layout__main">
                        {isLoading && <DetailSkeleton />}

                        {paragraphs.length > 0 && (
                            <section className="detail-section" aria-labelledby={`${uid}-overview`} data-reveal>
                                <SectionHead id={`${uid}-overview`} title={t("tourDetail.overview", "Overview")} />
                                <div className="prose">
                                    {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
                                </div>
                            </section>
                        )}

                        {services.length > 0 && (
                            <section className="detail-section" aria-labelledby={`${uid}-included`} data-reveal>
                                <SectionHead id={`${uid}-included`} title={t("tourDetail.includedTitle", "What's included")} />
                                <IncludeList items={services} getLabel={(srv) => getLocalizedText(srv, "name")} />
                            </section>
                        )}

                        {hotels.length > 0 && (
                            <section className="detail-section" aria-labelledby={`${uid}-hotels`} data-reveal>
                                <SectionHead id={`${uid}-hotels`} title={t("tourDetail.otels.title")} />
                                <ul className="hotel-grid">
                                    {hotels.map((otel) => {
                                        const otelName = getLocalizedText(otel, "name");
                                        const place = getLocalizedText(otel, "location") || getLocalizedText(otel, "country");
                                        return (
                                            <li className="hotel-card" key={otel.id}>
                                                <div className="hotel-card__media">
                                                    <Thumb src={otel.cardImage && OTEL_CARD_IMAGES + otel.cardImage} alt={otelName} />
                                                </div>
                                                <div className="hotel-card__body">
                                                    <h3 className="hotel-card__title">{otelName}</h3>
                                                    <div className="hotel-card__meta">
                                                        {place && (
                                                            <span>
                                                                <MapPin size={14} strokeWidth={1.75} aria-hidden="true" />
                                                                {place}
                                                            </span>
                                                        )}
                                                        <StarRating rating={otel.raiting} />
                                                    </div>
                                                    {otel.otelLink && (
                                                        <a
                                                            href={otel.otelLink}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="hotel-card__link"
                                                        >
                                                            {t("tourDetail.otels.visit")}
                                                            <ExternalLink size={14} strokeWidth={1.75} aria-hidden="true" />
                                                        </a>
                                                    )}
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </section>
                        )}

                        {cars.length > 0 && (
                            <section className="detail-section" aria-labelledby={`${uid}-cars`} data-reveal>
                                <SectionHead id={`${uid}-cars`} title={t("tourDetail.cars.title")} />
                                <ul className="car-list" id={`${uid}-car-list`}>
                                    {visibleCars.map((car) => {
                                        const carName = getLocalizedText(car, "name");
                                        return (
                                            <li className="car-row" key={car.id}>
                                                <div className="car-row__media">
                                                    <Thumb src={car.cardImage && CAR_CARD_IMAGES + car.cardImage} alt="" />
                                                </div>
                                                <div className="car-row__body">
                                                    <h3 className="car-row__title">
                                                        <Link to={`/cars/${car.id}`}>{carName}</Link>
                                                    </h3>
                                                    <p className="car-row__meta">
                                                        {car.type && <span>{car.type}</span>}
                                                        {car.price && (
                                                            <span className="car-row__price">
                                                                <span dir="ltr">{car.price} AZN</span> / {t("carDetail.perDay")}
                                                            </span>
                                                        )}
                                                    </p>
                                                    <button
                                                        type="button"
                                                        className="btn btn--secondary btn--sm car-row__apply"
                                                        onClick={() => applyForCar(car)}
                                                    >
                                                        {t("tourDetail.cars.apply")}
                                                    </button>
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ul>
                                {cars.length > CARS_PREVIEW && (
                                    <ShowMore
                                        expanded={allCars}
                                        onToggle={() => setAllCars((v) => !v)}
                                        controls={`${uid}-car-list`}
                                        total={cars.length}
                                    />
                                )}
                            </section>
                        )}

                        {videos.length > 0 && (
                            <section className="detail-section" aria-labelledby={`${uid}-videos`} data-reveal>
                                <SectionHead id={`${uid}-videos`} title={t("sanatoriumDetail.videos.title")} />
                                <VideoGrid videos={videos} title={name} />
                            </section>
                        )}

                        <section className="detail-section detail-section--form" ref={formRef} id="enquiry">
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
        </div>
    );
}

export default TourDetail;
