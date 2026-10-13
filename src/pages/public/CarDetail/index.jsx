import { useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, CarFront, Phone, ShieldCheck, Wallet } from "lucide-react";
import { useGetCarByIdQuery, usePostContactMutation } from "../../../api/userApi.js";
import { CAR_CARD_IMAGES, CAR_IMAGES } from "../../../config/mediaUrls.js";
import { getLocalizedText } from "../../../i18n/getLocalizedText.js";
import PageHeader from "../../../components/ui/PageHeader/index.jsx";
import EnquiryForm from "../Contact/EnquiryForm.jsx";
import CtaBand from "../Contact/CtaBand.jsx";
import { EmptyState } from "../Tours/ListingStates.jsx";
import MediaGallery from "../TourDetail/MediaGallery.jsx";
import VideoGrid from "../TourDetail/VideoGrid.jsx";
import { carEnquiryMessage, toParagraphs } from "../TourDetail/carMessage.js";
import "../TourDetail/detailShared.scss";

function CarDetail() {
    const { id } = useParams();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const routerLocation = useLocation();
    const { data, isLoading, isError } = useGetCarByIdQuery(id);
    const [postContact] = usePostContactMutation();
    const [presetMessage, setPresetMessage] = useState("");
    const formRef = useRef(null);

    const car = data?.data;
    const name = getLocalizedText(car, "name").trim();
    const paragraphs = toParagraphs(getLocalizedText(car, "description"));
    const videos = car?.carVideos || [];
    const phone = t("contact.contactCard.mobile.value");
    const images = useMemo(() => {
        const list = (car?.carImages || []).map((img) => CAR_IMAGES + img);
        if (!list.length && car?.cardImage) list.push(CAR_CARD_IMAGES + car.cardImage);
        return list;
    }, [car]);

    // There is no /cars listing — go back to wherever the visitor came from (usually a tour).
    const goBack = () => {
        if (routerLocation.key !== "default") navigate(-1);
        else navigate("/tours");
    };

    const scrollToForm = () => {
        if (name) setPresetMessage(carEnquiryMessage(name));
        formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    // The generic contact endpoint has no carId field, so make sure the admin can
    // tell which car the enquiry is about by tagging the message with its name.
    const submitEnquiry = (values) => {
        const tag = car?.name?.trim() || name;
        const description = values.description.includes(tag) || (name && values.description.includes(name))
            ? values.description
            : `[${tag}] ${values.description}`;
        return postContact({ ...values, description }).unwrap();
    };

    if (!isLoading && (isError || !car)) {
        return (
            <div className="car-detail">
                <PageHeader title={t("carsPage.title")} crumbs={[{ label: t("navbar.tours"), to: "/tours" }]} />
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
        <div className="car-detail">
            <PageHeader
                title={name || " "}
                crumbs={[{ label: t("navbar.tours"), to: "/tours" }, { label: name }]}
            />

            <div className="container detail-page">
                <div className="detail-topbar">
                    <button type="button" className="back-link" onClick={goBack}>
                        <ArrowLeft size={18} strokeWidth={2} aria-hidden="true" />
                        {t("carDetail.back", "Back")}
                    </button>
                </div>

                <div className="detail-layout">
                    <div className="detail-layout__gallery">
                        <MediaGallery images={images} alt={name} badge={car?.type} />
                    </div>

                    <aside className="detail-layout__aside" aria-label={t("tourDetail.bookingAria", "Booking summary")}>
                        <div className="booking-card">
                            <span className="eyebrow booking-card__eyebrow">{t("carDetail.eyebrow", "Vehicle")}</span>
                            <h2 className="booking-card__title">{name}</h2>

                            <div className={`booking-card__price${car?.price ? "" : " booking-card__price--request"}`}>
                                <small>{t("tourDetail.priceLabel", "Price")}</small>
                                {car?.price ? (
                                    <>
                                        <strong>{car.price}</strong>
                                        <span>AZN / {t("carDetail.perDay")}</span>
                                    </>
                                ) : (
                                    <strong>{t("tourDetail.priceOnRequest", "Price on request")}</strong>
                                )}
                            </div>

                            <ul className="fact-list">
                                {car?.type && (
                                    <li>
                                        <span className="fact-list__icon"><CarFront size={20} strokeWidth={1.75} /></span>
                                        <span className="fact-list__text">
                                            <small>{t("carDetail.type", "Body type")}</small>
                                            <span>{car.type}</span>
                                        </span>
                                    </li>
                                )}
                                <li>
                                    <span className="fact-list__icon"><Wallet size={20} strokeWidth={1.75} /></span>
                                    <span className="fact-list__text">
                                        <small>{t("carDetail.pricing", "Pricing")}</small>
                                        <span>{t("carDetail.pricingNote", "Daily price range — exact quote on request")}</span>
                                    </span>
                                </li>
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
                                subtitle={t("carDetail.formSubtitle", "Tell us your dates and route — we will confirm availability and the final price.")}
                                presetMessage={presetMessage}
                                onSubmit={submitEnquiry}
                            />
                        </section>
                    </div>
                </div>
            </div>

            <CtaBand />
        </div>
    );
}

export default CarDetail;
