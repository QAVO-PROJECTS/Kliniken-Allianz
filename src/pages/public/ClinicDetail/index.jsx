import "./index.scss";
import { Link, useParams } from "react-router-dom";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowRight, Award, Building2, MapPin, Phone, Stethoscope, UserRound } from "lucide-react";
import {
    useGetAllCategoryQuery,
    useGetClinicByIdQuery,
    usePostContactClinicMutation,
} from "../../../api/userApi.js";
import { CERT_CLINIC_URL, CLINIC_CARD_IMAGES, CLINIC_IMAGES } from "../../../config/mediaUrls.js";
import { getLocalizedText } from "../../../i18n/getLocalizedText.js";
import PageHeader from "../../../components/ui/PageHeader/index.jsx";
import SectionTitle from "../../../components/ui/SectionTitle/index.jsx";
import DoctorCard from "../../../components/cards/DoctorCard/index.jsx";
import ClinicHotels from "./ClinicHotels/index.jsx";
import MediaGallery from "../Clinics/shared/MediaGallery.jsx";
import CertificateGallery from "../Clinics/shared/CertificateGallery.jsx";
import InquiryForm from "../Clinics/shared/InquiryForm.jsx";
import { EmptyState, SkeletonBlock } from "../Clinics/shared/Feedback.jsx";
import { tx } from "../Clinics/shared/texts.js";

const GROUPS_PREVIEW = 6;
const DOCTORS_PREVIEW = 8;

/** Services grouped by their category, in the API's category order; unknown categories go last. */
function useServiceGroups(services) {
    const { t, i18n } = useTranslation();
    const { data: categoryData } = useGetAllCategoryQuery(undefined, { skip: services.length === 0 });

    return useMemo(() => {
        const categories = categoryData?.data || [];
        const byId = new Map(categories.map((c, i) => [c.id, { category: c, order: i }]));
        const groups = new Map();
        for (const service of services) {
            const known = byId.get(service.categoryId);
            const key = known ? service.categoryId : "__other";
            if (!groups.has(key)) {
                groups.set(key, {
                    key,
                    order: known ? known.order : Number.MAX_SAFE_INTEGER,
                    title: known ? getLocalizedText(known.category, "name") : tx(t, "medicalPages.otherServices"),
                    categoryId: known ? service.categoryId : null,
                    items: [],
                });
            }
            groups.get(key).items.push(service);
        }
        return [...groups.values()].sort((a, b) => a.order - b.order || b.items.length - a.items.length);
        // i18n.language: group titles are localized
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [services, categoryData, i18n.language]);
}

function ClinicDetailSkeleton({ t }) {
    return (
        <div className="clinic-detail">
            <PageHeader title={" "} crumbs={[{ label: t("navbar.clinics"), to: "/clinics" }, { label: "…" }]} />
            <section className="md-section md-section--flush-top">
                <div className="container md-layout">
                    <div className="md-main">
                        <SkeletonBlock variant="hero" />
                        <div className="clinic-detail__skel-lines">
                            <SkeletonBlock height={22} width="32%" />
                            <SkeletonBlock height={14} />
                            <SkeletonBlock height={14} width="88%" />
                            <SkeletonBlock height={14} width="64%" />
                        </div>
                    </div>
                    <SkeletonBlock height={360} variant="block" />
                </div>
            </section>
        </div>
    );
}

function ClinicDetail() {
    const { id } = useParams();
    const { t } = useTranslation();
    const { data, isLoading, isError } = useGetClinicByIdQuery(id);
    const [postClinicContact] = usePostContactClinicMutation();
    const [showAllGroups, setShowAllGroups] = useState(false);
    const [showAllDoctors, setShowAllDoctors] = useState(false);

    const clinic = data?.data;
    // The API can return the same service twice (duplicate ClinicService rows), so de-dupe by id.
    const services = useMemo(
        () => [...new Map((clinic?.services || []).map((s) => [s.id, s])).values()],
        [clinic]
    );
    const groups = useServiceGroups(services);

    if (isLoading) return <ClinicDetailSkeleton t={t} />;

    const isGerman = clinic?.location === "Almaniya";
    const listCrumb = isGerman
        ? { label: t("navbar.germanyClinics"), to: "/germany-clinics" }
        : { label: t("navbar.clinics"), to: "/clinics" };

    if (!clinic || isError) {
        return (
            <div className="clinic-detail">
                <PageHeader title={t("navbar.clinics")} crumbs={[listCrumb]} />
                <section className="md-section">
                    <div className="container">
                        <EmptyState icon={Building2} title={tx(t, "medicalPages.notFound")}>
                            <Link to={listCrumb.to} className="btn btn--secondary btn--sm">
                                {listCrumb.label}
                            </Link>
                        </EmptyState>
                    </div>
                </section>
            </div>
        );
    }

    const name = getLocalizedText(clinic, "name");
    const location = getLocalizedText(clinic, "location");
    const description = getLocalizedText(clinic, "description");
    const images = [
        clinic.clinicCardImage && CLINIC_CARD_IMAGES + clinic.clinicCardImage,
        ...(clinic.clinicImages || []).map((img) => CLINIC_IMAGES + img),
    ].filter(Boolean);
    const certificates = (clinic.clinicSertificates || []).map((img) => CERT_CLINIC_URL + img);
    const doctors = clinic.doctors || [];
    const visibleGroups = showAllGroups ? groups : groups.slice(0, GROUPS_PREVIEW);
    const hiddenServices = groups.slice(GROUPS_PREVIEW).reduce((n, g) => n + g.items.length, 0);
    const visibleDoctors = showAllDoctors ? doctors : doctors.slice(0, DOCTORS_PREVIEW);
    const phone = t("contact.contactCard.mobile.value");

    return (
        <div className="clinic-detail">
            <PageHeader title={name} subtitle={location} crumbs={[listCrumb, { label: name }]} />

            {/* Overview: hero gallery + description, sticky info card */}
            <section className="md-section md-section--flush-top">
                <div className="container md-layout">
                    <div className="md-main">
                        <MediaGallery images={images} alt={name} />
                        {description && (
                            <div className="md-block" data-reveal>
                                <h2>{tx(t, "medicalPages.overview")}</h2>
                                <p className="md-prose">{description}</p>
                            </div>
                        )}
                    </div>

                    <aside className="md-aside" aria-label={name}>
                        <div className="md-contact-card">
                            <div className="md-contact-card__head">
                                <h2>{tx(t, "medicalPages.consultTitle")}</h2>
                                <p>{tx(t, "medicalPages.consultText")}</p>
                            </div>
                            <ul className="md-facts">
                                {location && (
                                    <li>
                                        <MapPin size={18} strokeWidth={1.75} className="md-facts__icon" aria-hidden="true" />
                                        <span>{location}</span>
                                    </li>
                                )}
                                {services.length > 0 && (
                                    <li>
                                        <Stethoscope size={18} strokeWidth={1.75} className="md-facts__icon" aria-hidden="true" />
                                        <a href="#clinic-services"><strong>{services.length}</strong> {t("navbar.services")}</a>
                                    </li>
                                )}
                                {doctors.length > 0 && (
                                    <li>
                                        <UserRound size={18} strokeWidth={1.75} className="md-facts__icon" aria-hidden="true" />
                                        <a href="#clinic-doctors"><strong>{doctors.length}</strong> {t("navbar.doctors")}</a>
                                    </li>
                                )}
                                {certificates.length > 0 && (
                                    <li>
                                        <Award size={18} strokeWidth={1.75} className="md-facts__icon" aria-hidden="true" />
                                        <a href="#clinic-certificates"><strong>{certificates.length}</strong> {t("clinicDetail.certificates.title")}</a>
                                    </li>
                                )}
                            </ul>
                            <hr className="md-divider" />
                            <div className="md-actions">
                                <a className="btn btn--primary btn--block" href="#clinic-inquiry">
                                    {t("navbar.contact")}
                                    <ArrowRight size={18} strokeWidth={1.75} className="md-flip-rtl" aria-hidden="true" />
                                </a>
                                <a className="btn btn--secondary btn--block" href={`tel:${phone.replace(/\s/g, "")}`}>
                                    <Phone size={18} strokeWidth={1.75} aria-hidden="true" />
                                    <span dir="ltr" className="md-num">{phone}</span>
                                </a>
                            </div>
                        </div>
                    </aside>
                </div>
            </section>

            {/* Services: grouped by category as link clusters (long list) */}
            {services.length > 0 && (
                <section className="md-section md-section--subtle" id="clinic-services" aria-labelledby="clinic-services-title">
                    <div className="container">
                        <SectionTitle
                            align="start"
                            title={<span id="clinic-services-title">{t("clinicDetail.services.title")}</span>}
                            desc={t("clinicDetail.services.description")}
                        />
                        <div className="md-groups" id="clinic-service-groups">
                            {visibleGroups.map((group) => (
                                <div className="md-group" key={group.key} data-reveal>
                                    <div className="md-group__head">
                                        <h3>
                                            {group.categoryId ? (
                                                <Link to={`/category/${group.categoryId}`}>{group.title}</Link>
                                            ) : (
                                                group.title
                                            )}
                                        </h3>
                                        <span className="md-group__count">{group.items.length}</span>
                                    </div>
                                    <ul className="md-group__links">
                                        {group.items.map((service) => (
                                            <li key={service.id}>
                                                <Link className="md-link-chip" to={`/category/${service.id}`}>
                                                    {getLocalizedText(service, "name")}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                        {groups.length > GROUPS_PREVIEW && (
                            <div className="md-more">
                                <button
                                    type="button"
                                    className="btn btn--secondary"
                                    aria-expanded={showAllGroups}
                                    aria-controls="clinic-service-groups"
                                    onClick={() => setShowAllGroups((v) => !v)}
                                >
                                    {showAllGroups ? (
                                        tx(t, "medicalPages.showLess")
                                    ) : (
                                        <>
                                            {t("clinicDetail.services.button")}
                                            <span className="md-num">+{hiddenServices}</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* Doctors: portrait card grid */}
            {doctors.length > 0 && (
                <section className="md-section" id="clinic-doctors" aria-labelledby="clinic-doctors-title">
                    <div className="container">
                        <SectionTitle
                            align="start"
                            title={<span id="clinic-doctors-title">{t("clinicDetail.doctors.title")}</span>}
                            desc={t("clinicDetail.doctors.subtitle")}
                        />
                        <div className="md-grid md-grid--sm">
                            {visibleDoctors.map((doc, i) => (
                                <div key={doc.id} className="md-grid__item" data-reveal style={{ "--reveal-delay": `${(i % 4) * 60}ms` }}>
                                    <DoctorCard item={doc} bare />
                                </div>
                            ))}
                        </div>
                        {doctors.length > DOCTORS_PREVIEW && (
                            <div className="md-more">
                                <button
                                    type="button"
                                    className="btn btn--secondary"
                                    aria-expanded={showAllDoctors}
                                    onClick={() => setShowAllDoctors((v) => !v)}
                                >
                                    {showAllDoctors ? tx(t, "medicalPages.showLess") : t("clinicDetail.doctors.button")}
                                </button>
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* Certificates: compact thumbnail wall */}
            {certificates.length > 0 && (
                <section className="md-section md-section--subtle" id="clinic-certificates" aria-labelledby="clinic-certs-title">
                    <div className="container">
                        <SectionTitle align="start" title={<span id="clinic-certs-title">{t("clinicDetail.certificates.title")}</span>} />
                        <CertificateGallery images={certificates} />
                    </div>
                </section>
            )}

            {/* Hotels: horizontal scroll-snap strip */}
            <ClinicHotels otels={clinic.otels} />

            {/* Inquiry: form card + map */}
            <section className="md-section md-section--subtle clinic-detail__inquiry" id="clinic-inquiry" aria-labelledby="clinic-inquiry-title">
                <div className="container">
                    <div className="clinic-detail__inquiry-grid">
                        <div className="md-contact-card clinic-detail__form-card">
                            <div className="md-contact-card__head">
                                <h2 id="clinic-inquiry-title">{t("contact.form.title")}</h2>
                                <p>{tx(t, "medicalPages.consultText")}</p>
                            </div>
                            <InquiryForm submit={postClinicContact} extra={{ clinicId: id }} />
                        </div>
                        <div className="clinic-detail__map">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3603.5460616273745!2d49.85555347640196!3d40.41115175597831!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40307d003436b447%3A0xb8c6c13c52985f63!2sQAVO%20MMC!5e1!3m2!1sen!2saz!4v1745930590256!5m2!1sen!2saz"
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Kliniken Allianz: Google Map"
                            />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default ClinicDetail;
