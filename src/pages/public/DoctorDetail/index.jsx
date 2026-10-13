import "./index.scss";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import DOMPurify from "dompurify";
import { ArrowRight, Briefcase, Building2, FileText, Phone, Star, UserRound } from "lucide-react";
import { useGetClinicByIdQuery, useGetDoctorsByIdQuery } from "../../../api/userApi.js";
import { CERT_DOKTOR_URL, DOCTOR_IMG_URL } from "../../../config/mediaUrls.js";
import { getLocalizedText } from "../../../i18n/getLocalizedText.js";
import PageHeader from "../../../components/ui/PageHeader/index.jsx";
import CertificateGallery from "../Clinics/shared/CertificateGallery.jsx";
import { EmptyState, SkeletonBlock } from "../Clinics/shared/Feedback.jsx";
import { tx } from "../Clinics/shared/texts.js";

function Portrait({ src, alt }) {
    const [failed, setFailed] = useState(false);
    return (
        <div className="doctor-detail__photo">
            {src && !failed ? (
                <img
                    src={src}
                    alt={alt}
                    width="640"
                    height="800"
                    fetchPriority="high"
                    decoding="async"
                    onError={() => setFailed(true)}
                />
            ) : (
                <UserRound size={72} strokeWidth={1.75} aria-hidden="true" />
            )}
        </div>
    );
}

function DoctorDetail() {
    const { id } = useParams();
    const { t } = useTranslation();
    const { data, isLoading } = useGetDoctorsByIdQuery(id);
    const doctor = data?.data;
    const { data: clinicData } = useGetClinicByIdQuery(doctor?.clinicId, { skip: !doctor?.clinicId });

    const crumbsBase = [{ label: t("doctorDetail.breadcrumbDoctors"), to: "/doctors" }];

    if (isLoading) {
        return (
            <div className="doctor-detail">
                <PageHeader title={" "} crumbs={[...crumbsBase, { label: "…" }]} />
                <section className="md-section md-section--flush-top">
                    <div className="container md-layout">
                        <div className="md-main">
                            <div className="doctor-detail__hero">
                                <SkeletonBlock variant="block" className="doctor-detail__photo" />
                                <div className="doctor-detail__skel-lines">
                                    <SkeletonBlock height={26} width="70%" />
                                    <SkeletonBlock height={14} width="40%" />
                                    <SkeletonBlock height={14} width="55%" />
                                </div>
                            </div>
                            <SkeletonBlock height={160} variant="block" />
                        </div>
                        <SkeletonBlock height={280} variant="block" />
                    </div>
                </section>
            </div>
        );
    }

    if (!doctor) {
        return (
            <div className="doctor-detail">
                <PageHeader title={t("doctorDetail.title")} crumbs={crumbsBase} />
                <section className="md-section">
                    <div className="container">
                        <EmptyState icon={UserRound} title={tx(t, "medicalPages.notFound")}>
                            <Link to="/doctors" className="btn btn--secondary btn--sm">
                                {t("doctorDetail.breadcrumbDoctors")}
                            </Link>
                        </EmptyState>
                    </div>
                </section>
            </div>
        );
    }

    const fullName = `${getLocalizedText(doctor, "name")} ${getLocalizedText(doctor, "surName")}`.trim();
    const role = getLocalizedText(doctor, "role");
    const rateNum = Number(doctor.rate) || 0;
    const rate = Math.max(0, Math.min(5, Math.round(rateNum)));
    const clinic = clinicData?.data || doctor.clinics?.[0];
    const bios = (Array.isArray(doctor.bio) ? doctor.bio : [])
        .map((b) => DOMPurify.sanitize(getLocalizedText(b, "name") || ""))
        .filter((html) => html.replace(/<[^>]*>/g, "").trim());
    const certificates = (doctor.doctorSertificates || []).map((img) => CERT_DOKTOR_URL + img);
    const hasExperience = doctor.experience != null && doctor.experience !== "";
    const phone = t("contact.contactCard.mobile.value");

    return (
        <div className="doctor-detail">
            <PageHeader title={fullName} subtitle={role} crumbs={[...crumbsBase, { label: fullName }]} />

            <section className="md-section md-section--flush-top">
                <div className="container md-layout">
                    <div className="md-main">
                        {/* Profile: portrait + key facts */}
                        <div className="doctor-detail__hero">
                            <Portrait src={doctor.doctorImage && DOCTOR_IMG_URL + doctor.doctorImage} alt={fullName} />
                            <div className="doctor-detail__identity">
                                <dl className="doctor-detail__stats">
                                    {rate > 0 && (
                                        <div>
                                            <dt>{t("doctorsPage.filters.rating")}</dt>
                                            <dd>
                                                <Star size={18} strokeWidth={1.75} className="doctor-detail__star" aria-hidden="true" />
                                                <span className="md-num">{rateNum.toFixed(1)}</span>
                                                <span className="doctor-detail__of">/ 5</span>
                                            </dd>
                                        </div>
                                    )}
                                    {hasExperience && (
                                        <div>
                                            <dt>{t("doctorsPage.filters.experience")}</dt>
                                            <dd>
                                                <Briefcase size={18} strokeWidth={1.75} aria-hidden="true" />
                                                <span>
                                                    <span className="md-num">{doctor.experience}</span> {t("doctorDetail.experienceSuffix")}
                                                </span>
                                            </dd>
                                        </div>
                                    )}
                                    {clinic && (
                                        <div>
                                            <dt>{t("doctorsPage.filters.clinics")}</dt>
                                            <dd>
                                                <Building2 size={18} strokeWidth={1.75} aria-hidden="true" />
                                                <Link to={`/clinics/${clinic.id}`}>{getLocalizedText(clinic, "name")}</Link>
                                            </dd>
                                        </div>
                                    )}
                                </dl>
                            </div>
                        </div>

                        <div className="md-block" data-reveal>
                            <h2>{t("doctorDetail.sections.bio")}</h2>
                            {bios.length > 0 ? (
                                <div className="doctor-detail__bio">
                                    {bios.map((html, i) => (
                                        <div key={i} className="md-prose" dangerouslySetInnerHTML={{ __html: html }} />
                                    ))}
                                </div>
                            ) : (
                                <EmptyState icon={FileText} text={tx(t, "medicalPages.noBio")} compact />
                            )}
                        </div>

                        <div className="md-block" data-reveal>
                            <h2>{t("doctorDetail.sections.certificates")}</h2>
                            <CertificateGallery images={certificates} />
                        </div>
                    </div>

                    <aside className="md-aside" aria-labelledby="doctor-cta-title">
                        <div className="md-contact-card">
                            <div className="md-contact-card__head">
                                <h2 id="doctor-cta-title">{tx(t, "medicalPages.consultTitle")}</h2>
                                <p>{tx(t, "medicalPages.consultText")}</p>
                            </div>
                            <div className="md-actions">
                                <Link to="/contact" className="btn btn--primary btn--block">
                                    {t("navbar.contact")}
                                    <ArrowRight size={18} strokeWidth={1.75} className="md-flip-rtl" aria-hidden="true" />
                                </Link>
                                <a className="btn btn--secondary btn--block" href={`tel:${phone.replace(/\s/g, "")}`}>
                                    <Phone size={18} strokeWidth={1.75} aria-hidden="true" />
                                    <span dir="ltr" className="md-num">{phone}</span>
                                </a>
                            </div>
                        </div>
                    </aside>
                </div>
            </section>
        </div>
    );
}

export default DoctorDetail;
