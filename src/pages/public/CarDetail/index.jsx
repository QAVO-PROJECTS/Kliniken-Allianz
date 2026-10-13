import { useId, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, CarFront, Wallet } from "lucide-react";
import { useGetCarByIdQuery, usePostContactMutation } from "../../../api/userApi.js";
import { CAR_CARD_IMAGES, CAR_IMAGES } from "../../../config/mediaUrls.js";
import { getLocalizedText } from "../../../i18n/getLocalizedText.js";
import PageHeader from "../../../components/ui/PageHeader/index.jsx";
import EnquiryForm from "../Contact/EnquiryForm.jsx";
import { EmptyState } from "../Tours/ListingStates.jsx";
import MediaGallery from "../TourDetail/MediaGallery.jsx";
import VideoGrid from "../TourDetail/VideoGrid.jsx";
import { BookingCard, DetailSkeleton, SectionHead } from "../TourDetail/DetailParts.jsx";
import { carEnquiryMessage, toParagraphs } from "../TourDetail/carMessage.js";
import "../Tours/listing.scss";
import "../TourDetail/detailShared.scss";

function CarDetail() {
    const { id } = useParams();
    const { t } = useTranslation();
    const uid = useId();
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
    const images = useMemo(() => {
        const list = (car?.carImages || []).map((img) => CAR_IMAGES + img);
        if (!list.length && car?.cardImage) list.push(CAR_CARD_IMAGES + car.cardImage);
        return list;
    }, [car]);

    // There is no /cars listing: go back to wherever the visitor came from (usually a tour).
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

    const facts = [];
    if (car?.type) facts.push({ icon: CarFront, label: t("carDetail.type", "Body type"), value: car.type });
    facts.push({
        icon: Wallet,
        label: t("carDetail.pricing", "Pricing"),
        value: t("carDetail.pricingNote", "Daily price range, exact quote on request"),
    });

    return (
        <div className="car-detail">
            <PageHeader
                title={name || " "}
                crumbs={[{ label: t("navbar.tours"), to: "/tours" }, { label: name }]}
            />

            <div className="container detail-page">
                <div className="detail-topbar">
                    <button type="button" className="back-link" onClick={goBack}>
                        <ArrowLeft size={18} strokeWidth={1.75} aria-hidden="true" />
                        {t("carDetail.back", "Back")}
                    </button>
                </div>

                <div className="detail-layout">
                    <div className="detail-layout__gallery">
                        <MediaGallery images={images} alt={name} loading={isLoading} />
                    </div>

                    <div className="detail-layout__aside">
                        <BookingCard
                            title={name}
                            price={car?.price ? String(car.price) : ""}
                            priceSuffix={`AZN / ${t("carDetail.perDay")}`}
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

                        {videos.length > 0 && (
                            <section className="detail-section" aria-labelledby={`${uid}-videos`} data-reveal>
                                <SectionHead id={`${uid}-videos`} title={t("sanatoriumDetail.videos.title")} />
                                <VideoGrid videos={videos} title={name} />
                            </section>
                        )}

                        <section className="detail-section detail-section--form" ref={formRef} id="enquiry">
                            <EnquiryForm
                                title={t("contact.form.title")}
                                subtitle={t(
                                    "carDetail.formSubtitle",
                                    "Tell us your dates and route. We will confirm availability and the final price."
                                )}
                                presetMessage={presetMessage}
                                onSubmit={submitEnquiry}
                            />
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CarDetail;
