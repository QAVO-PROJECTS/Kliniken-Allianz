import "./index.scss";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Award, Building2, MapPin, Phone, Stethoscope, UserRound } from "lucide-react";
import { useGetClinicByIdQuery, usePostContactClinicMutation } from "../../../api/userApi.js";
import { CERT_CLINIC_URL, CLINIC_CARD_IMAGES, CLINIC_IMAGES } from "../../../config/mediaUrls.js";
import { getLocalizedText } from "../../../i18n/getLocalizedText.js";
import PageHeader from "../../../components/ui/PageHeader/index.jsx";
import SectionTitle from "../../../components/ui/SectionTitle/index.jsx";
import HomeServiceCard from "../../../components/cards/ServiceCard/index.jsx";
import DoctorCard from "../../../components/cards/DoctorCard/index.jsx";
import ClinicHotels from "./ClinicHotels/index.jsx";
import MediaGallery from "../Clinics/shared/MediaGallery.jsx";
import CertificateGallery from "../Clinics/shared/CertificateGallery.jsx";
import InquiryForm from "../Clinics/shared/InquiryForm.jsx";
import { EmptyState, SkeletonBlock } from "../Clinics/shared/Feedback.jsx";
import { tx } from "../Clinics/shared/texts.js";

const SERVICES_PREVIEW = 8;
const DOCTORS_PREVIEW = 8;

function ClinicDetail() {
    const { id } = useParams();
    const { t } = useTranslation();
    const { data, isLoading, isError } = useGetClinicByIdQuery(id);
    const [postClinicContact] = usePostContactClinicMutation();
    const [showAllServices, setShowAllServices] = useState(false);
    const [showAllDoctors, setShowAllDoctors] = useState(false);

    const clinic = data?.data;
    const isGerman = clinic?.location === "Almaniya";
    const listCrumb = isGerman
        ? { label: t("navbar.germanyClinics"), to: "/germany-clinics" }
        : { label: t("navbar.clinics"), to: "/clinics" };

    if (isLoading) {
        return (
            <div className="clinic-detail">
                <PageHeader title={" "} crumbs={[{ label: t("navbar.clinics"), to: "/clinics" }, { label: "…" }]} />
                <section className="md-section">
                    <div className="container md-layout">
                        <div className="md-main">
                            <SkeletonBlock height={0} className="clinic-detail__skel-hero" radius="var(--radius-xl)" />
                            <SkeletonBlock height={18} width="40%" />
                            <SkeletonBlock height={14} />
                            <SkeletonBlock height={14} width="85%" />
                        </div>
                        <SkeletonBlock height={320} radius="var(--radius-xl)" />
                    </div>
                </section>
            </div>
        );
    }

    if (!clinic || isError) {
        return (
            <div className="clinic-detail">
                <PageHeader title={t("navbar.clinics")} crumbs={[listCrumb]} />
                <section className="md-section">
                    <div className="container">
                        <EmptyState icon={Building2} title={tx(t, "medicalPages.notFound")} />
                    </div>
                </section>
            </div>
        );
    }

    const name = getLocalizedText(clinic, "name");
    const location = getLocalizedText(clinic, "location");
    const images = [
        clinic.clinicCardImage && CLINIC_CARD_IMAGES + clinic.clinicCardImage,
        ...(clinic.clinicImages || []).map((img) => CLINIC_IMAGES + img),
    ].filter(Boolean);
    const certificates = (clinic.clinicSertificates || []).map((img) => CERT_CLINIC_URL + img);
    // The API can return the same service twice (duplicate ClinicService rows), so de-dupe by id.
    const services = [...new Map((clinic.services || []).map((s) => [s.id, s])).values()];
    const doctors = clinic.doctors || [];
    const visibleServices = showAllServices ? services : services.slice(0, SERVICES_PREVIEW);
    const visibleDoctors = showAllDoctors ? doctors : doctors.slice(0, DOCTORS_PREVIEW);
    const phone = t("contact.contactCard.mobile.value");

    const scrollToForm = () =>
        document.getElementById("clinic-inquiry")?.scrollIntoView({ behavior: "smooth", block: "start" });

    return (
        <div className="clinic-detail">
            <PageHeader title={name} subtitle={location} crumbs={[listCrumb, { label: name }]} />

            {/* Overview: gallery + description, sticky contact card */}
            <section className="md-section">
                <div className="container md-layout">
                    <div className="md-main">
                        <MediaGallery images={images} alt={name} />
                        <div className="md-block">
                            <h2>{tx(t, "medicalPages.overview")}</h2>
                            <p className="md-prose">{getLocalizedText(clinic, "description")}</p>
                        </div>
                    </div>

                    <aside className="md-aside">
                        <div className="md-contact-card">
                            <div className="md-contact-card__head">
                                <span className="badge badge--brand">
                                    <MapPin size={14} aria-hidden="true" /> {location}
                                </span>
                                <h3 className="clinic-detail__aside-title">{name}</h3>
                            </div>
                            <ul className="md-facts">
                                <li>
                                    <span className="md-facts__icon"><Stethoscope size={18} /></span>
                                    <span><strong>{services.length}</strong> {t("navbar.services")}</span>
                                </li>
                                {doctors.length > 0 && (
                                    <li>
                                        <span className="md-facts__icon"><UserRound size={18} /></span>
                                        <span><strong>{doctors.length}</strong> {t("navbar.doctors")}</span>
                                    </li>
                                )}
                                {certificates.length > 0 && (
                                    <li>
                                        <span className="md-facts__icon"><Award size={18} /></span>
                                        <span><strong>{certificates.length}</strong> {t("clinicDetail.certificates.title")}</span>
                                    </li>
                                )}
                            </ul>
                            <hr className="md-divider" />
                            <p className="clinic-detail__aside-text">{tx(t, "medicalPages.consultText")}</p>
                            <div className="md-actions">
                                <button type="button" className="btn btn--primary btn--block" onClick={scrollToForm}>
                                    {tx(t, "medicalPages.consultTitle")}
                                </button>
                                <a className="btn btn--secondary btn--block" href={`tel:${phone.replace(/\s/g, "")}`}>
                                    <Phone size={18} aria-hidden="true" /> <span dir="ltr">{phone}</span>
                                </a>
                            </div>
                        </div>
                    </aside>
                </div>
            </section>

            {/* Services */}
            {services.length > 0 && (
                <section className="md-section md-section--subtle">
                    <div className="container">
                        <SectionTitle
                            align="start"
                            title={t("clinicDetail.services.title")}
                            desc={t("clinicDetail.services.description")}
                        />
                        <div className={`md-grid${!showAllServices && services.length > SERVICES_PREVIEW ? " is-collapsed" : ""}`}>
                            {visibleServices.map((item) => (
                                <HomeServiceCard
                                    key={item.id}
                                    id={item.id}
                                    name={getLocalizedText(item, "name")}
                                    desc={getLocalizedText(item, "description")}
                                    icon={item.categoryImage}
                                />
                            ))}
                        </div>
                        {services.length > SERVICES_PREVIEW && (
                            <div className="md-more">
                                <button
                                    type="button"
                                    className="btn btn--secondary"
                                    aria-expanded={showAllServices}
                                    onClick={() => setShowAllServices((v) => !v)}
                                >
                                    {showAllServices
                                        ? tx(t, "medicalPages.showLess")
                                        : `${t("clinicDetail.services.button")} (${services.length})`}
                                </button>
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* Doctors */}
            {doctors.length > 0 && (
                <section className="md-section">
                    <div className="container">
                        <SectionTitle
                            align="start"
                            title={t("clinicDetail.doctors.title")}
                            desc={t("clinicDetail.doctors.subtitle")}
                        />
                        <div className="md-grid">
                            {visibleDoctors.map((doc) => (
                                <DoctorCard key={doc.id} item={doc} />
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

            {/* Certificates */}
            {certificates.length > 0 && (
                <section className="md-section md-section--subtle">
                    <div className="container">
                        <SectionTitle align="start" title={t("clinicDetail.certificates.title")} />
                        <CertificateGallery images={certificates} />
                    </div>
                </section>
            )}

            <ClinicHotels otels={clinic.otels} />

            {/* Inquiry form */}
            <section className="md-section md-section--subtle clinic-detail__inquiry" id="clinic-inquiry">
                <div className="container">
                    <div className="clinic-detail__inquiry-grid">
                        <div className="md-contact-card">
                            <div className="md-contact-card__head">
                                <h2>{t("contact.form.title")}</h2>
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
                                title="Kliniken Allianz — Google Map"
                            />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default ClinicDetail;
