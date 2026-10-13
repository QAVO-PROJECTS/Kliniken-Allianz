import { useId, useMemo, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight, BedDouble, Crown, HeartPulse, MapPin, Sofa } from "lucide-react";
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
import { EmptyState } from "../Tours/ListingStates.jsx";
import MediaGallery from "../TourDetail/MediaGallery.jsx";
import VideoGrid from "../TourDetail/VideoGrid.jsx";
import { BookingCard, DetailSkeleton, IncludeList, SectionHead } from "../TourDetail/DetailParts.jsx";
import { toParagraphs } from "../TourDetail/carMessage.js";
import "../Tours/listing.scss";
import "../TourDetail/detailShared.scss";
import "./index.scss";

function SanatoriumDetail() {
    const { id } = useParams();
    const { t } = useTranslation();
    const uid = useId();
    const { data, isLoading, isError } = useGetSanatoriumByIdQuery(id);
    const { data: allData } = useGetAllSanatoriumQuery();
    const [postSanatoriumContact] = usePostContactSanatoriumMutation();
    const formRef = useRef(null);

    const sanatorium = data?.data;
    const name = getLocalizedText(sanatorium, "name");
    const location = getLocalizedText(sanatorium, "location");
    const paragraphs = toParagraphs(getLocalizedText(sanatorium, "description"));
    const services = sanatorium?.services || [];
    const videos = sanatorium?.videos || [];

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

    const facts = [];
    if (location) facts.push({ icon: MapPin, label: t("sanatoriumDetail.locationLabel", "Location"), value: location });
    if (services.length) {
        facts.push({
            icon: HeartPulse,
            label: t("navbar.services"),
            value: t("sanatoriumDetail.servicesCount", "{{count}} treatments & services", { count: services.length }),
        });
    }
    if (rooms.length) {
        facts.push({
            icon: BedDouble,
            label: t("sanatoriumDetail.rooms.title", "Room types"),
            value: rooms.map((r) => r.label).join(", "),
        });
    }

    return (
        <div className="sanatorium-detail">
            <PageHeader
                title={name || " "}
                crumbs={[{ label: t("sanatoriumDetail.breadcrumb.sanatoriums"), to: "/sanatoriums" }, { label: name }]}
            >
                {location && (
                    <p className="sanatorium-detail__location">
                        <MapPin size={16} strokeWidth={1.75} aria-hidden="true" />
                        {location}
                    </p>
                )}
            </PageHeader>

            <div className="container detail-page">
                <div className="detail-layout">
                    <div className="detail-layout__gallery">
                        <MediaGallery images={images} alt={name} loading={isLoading} />
                    </div>

                    <div className="detail-layout__aside">
                        <BookingCard title={name} facts={isLoading ? [] : facts} onApply={scrollToForm} />
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

                        {rooms.length > 0 && (
                            <section className="detail-section" aria-labelledby={`${uid}-rooms`} data-reveal>
                                <SectionHead id={`${uid}-rooms`} title={t("sanatoriumDetail.rooms.title", "Room types")} />
                                <ul className="room-list">
                                    {rooms.map(({ key, icon: Icon, label, text }) => (
                                        <li className="room-list__item" key={key}>
                                            <span className="room-list__icon">
                                                <Icon size={22} strokeWidth={1.75} aria-hidden="true" />
                                            </span>
                                            <h3>{label}</h3>
                                            <p>{text}</p>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}

                        {!isLoading && (
                            <section className="detail-section" aria-labelledby={`${uid}-services`} data-reveal>
                                <SectionHead
                                    id={`${uid}-services`}
                                    title={t("sanatoriumDetail.services.title")}
                                    desc={t("sanatoriumDetail.services.description")}
                                />
                                {services.length > 0 ? (
                                    <IncludeList items={services} getLabel={(item) => getLocalizedText(item, "name")} preview={12} />
                                ) : (
                                    <p className="text-secondary">{t("common.noData", "No data")}</p>
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
                                subtitle={t(
                                    "sanatoriumDetail.formSubtitle",
                                    "Ask about availability, treatment programmes and prices. We will get back to you shortly."
                                )}
                                onSubmit={(values) => postSanatoriumContact({ ...values, sanatoriumId: id }).unwrap()}
                            />
                        </section>
                    </div>
                </div>
            </div>

            {related.length > 0 && (
                <section className="section section--subtle" aria-labelledby={`${uid}-related`}>
                    <div className="container">
                        <div className="listing-toolbar">
                            <div>
                                <h2 id={`${uid}-related`}>{t("sanatoriumDetail.related.title")}</h2>
                                <p>{t("sanatoriumDetail.related.description")}</p>
                            </div>
                            <Link to="/sanatoriums" className="btn btn--secondary btn--sm">
                                {t("blogDetail.viewAll")}
                                <ArrowRight size={16} strokeWidth={1.75} className="flip-rtl" aria-hidden="true" />
                            </Link>
                        </div>
                        <div className="listing-grid listing-grid--4" data-reveal>
                            {related.map((item) => (
                                <SanatoriumCard key={item.id} item={item} />
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}

export default SanatoriumDetail;
