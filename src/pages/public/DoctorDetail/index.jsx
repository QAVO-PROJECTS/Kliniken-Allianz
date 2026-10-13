import "./index.scss";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import DOMPurify from "dompurify";
import { Briefcase, Building2, FileText, Star, UserRound } from "lucide-react";
import { useGetClinicByIdQuery, useGetDoctorsByIdQuery } from "../../../api/userApi.js";
import { CERT_DOKTOR_URL, DOCTOR_IMG_URL } from "../../../config/mediaUrls.js";
import { getLocalizedText } from "../../../i18n/getLocalizedText.js";
import PageHeader from "../../../components/ui/PageHeader/index.jsx";
import CertificateGallery from "../Clinics/shared/CertificateGallery.jsx";
import { EmptyState, SkeletonBlock } from "../Clinics/shared/Feedback.jsx";
import { tx } from "../Clinics/shared/texts.js";

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
                <section className="md-section">
                    <div className="container md-layout">
                        <div className="md-main">
                            <SkeletonBlock height={24} width="30%" />
                            <SkeletonBlock height={14} />
                            <SkeletonBlock height={14} width="80%" />
                        </div>
                        <SkeletonBlock height={480} radius="var(--radius-xl)" />
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
                        <EmptyState icon={UserRound} title={tx(t, "medicalPages.notFound")} />
                    </div>
                </section>
            </div>
        );
    }

    const fullName = `${getLocalizedText(doctor, "name")} ${getLocalizedText(doctor, "surName")}`.trim();
    const role = getLocalizedText(doctor, "role");
    const rate = Math.max(0, Math.min(5, Math.round(Number(doctor.rate) || 0)));
    const clinic = clinicData?.data || doctor.clinics?.[0];
    const bios = (Array.isArray(doctor.bio) ? doctor.bio : [])
        .map((b) => DOMPurify.sanitize(getLocalizedText(b, "name") || ""))
        .filter((html) => html.replace(/<[^>]*>/g, "").trim());
    const certificates = (doctor.doctorSertificates || []).map((img) => CERT_DOKTOR_URL + img);

    return (
        <div className="doctor-detail">
            <PageHeader title={fullName} subtitle={role} crumbs={[...crumbsBase, { label: fullName }]} />

            <section className="md-section">
                <div className="container md-layout">
                    <div className="md-main">
                        <div className="md-block">
                            <h2>{t("doctorDetail.sections.bio")}</h2>
                            {bios.length > 0 ? (
                                <div className="md-card doctor-detail__bio">
                                    {bios.map((html, i) => (
                                        <div key={i} className="md-prose" dangerouslySetInnerHTML={{ __html: html }} />
                                    ))}
                                </div>
                            ) : (
                                <EmptyState icon={FileText} text={tx(t, "medicalPages.noBio")} compact />
                            )}
                        </div>

                        <div className="md-block">
                            <h2>{t("doctorDetail.sections.certificates")}</h2>
                            <CertificateGallery images={certificates} />
                        </div>
                    </div>

                    <aside className="md-aside">
                        <div className="md-contact-card doctor-detail__profile">
                            <div className="doctor-detail__photo">
                                {doctor.doctorImage ? (
                                    <img src={DOCTOR_IMG_URL + doctor.doctorImage} alt={fullName} decoding="async" />
                                ) : (
                                    <UserRound size={64} strokeWidth={1.25} aria-hidden="true" />
                                )}
                            </div>
                            <div className="doctor-detail__identity">
                                <h2>{fullName}</h2>
                                {role && <span className="badge badge--brand">{role}</span>}
                            </div>
                            <ul className="md-facts">
                                {rate > 0 && (
                                    <li>
                                        <span className="md-facts__icon"><Star size={18} /></span>
                                        <span className="doctor-detail__stars" aria-label={`${rate}/5`}>
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <Star key={i} size={16} className={i < rate ? "is-on" : ""} aria-hidden="true" />
                                            ))}
                                            <strong>{Number(doctor.rate).toFixed(1)}</strong>
                                        </span>
                                    </li>
                                )}
                                {doctor.experience != null && doctor.experience !== "" && (
                                    <li>
                                        <span className="md-facts__icon"><Briefcase size={18} /></span>
                                        <span><strong>{doctor.experience}</strong> {t("doctorDetail.experienceSuffix")}</span>
                                    </li>
                                )}
                                {clinic && (
                                    <li>
                                        <span className="md-facts__icon"><Building2 size={18} /></span>
                                        <Link to={`/clinics/${clinic.id}`}>{getLocalizedText(clinic, "name")}</Link>
                                    </li>
                                )}
                            </ul>
                            <hr className="md-divider" />
                            <p className="doctor-detail__cta-text">{tx(t, "medicalPages.consultText")}</p>
                            <Link to="/contact" className="btn btn--primary btn--block">
                                {tx(t, "medicalPages.consultTitle")}
                            </Link>
                        </div>
                    </aside>
                </div>
            </section>
        </div>
    );
}

export default DoctorDetail;
