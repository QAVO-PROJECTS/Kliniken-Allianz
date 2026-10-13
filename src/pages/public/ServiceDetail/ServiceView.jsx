import "./ServiceView.scss";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight, Building2, Check, Layers, Mail, Phone } from "lucide-react";
import {
    useGetAllClinicQuery,
    useGetCategoryByIdQuery,
    usePostContactServiceMutation,
} from "../../../api/userApi.js";
import { CATEGORY_IMAGES } from "../../../config/mediaUrls.js";
import { getLocalizedText } from "../../../i18n/getLocalizedText.js";
import { CONTACT } from "../../../components/layout/contactInfo.js";
import PageHeader from "../../../components/ui/PageHeader/index.jsx";
import ClinicGridCard from "../../../components/cards/ClinicGridCard/index.jsx";
import InquiryForm from "../Clinics/shared/InquiryForm.jsx";
import { EmptyState, SkeletonBlock, SkeletonGrid } from "../Clinics/shared/Feedback.jsx";
import { tx } from "../Clinics/shared/texts.js";

const CLINICS_PREVIEW = 6;

function CategoryMark({ file }) {
    const [failed, setFailed] = useState(false);
    if (!file || failed) return null;
    return (
        <span className="service-view__mark" aria-hidden="true">
            <img src={CATEGORY_IMAGES + file} alt="" width="40" height="40" decoding="async" onError={() => setFailed(true)} />
        </span>
    );
}

/**
 * Full service page body (lead, features, clinics offering it, sticky info card
 * and an inquiry section). Shared by /services/:id and /category/:id.
 */
function ServiceView({ service }) {
    const { t } = useTranslation();
    const [showAll, setShowAll] = useState(false);
    const [postServiceContact] = usePostContactServiceMutation();

    const { data: categoryData } = useGetCategoryByIdQuery(service.categoryId, { skip: !service.categoryId });
    // Older payloads only carry clinicIds; newer ones embed the clinics.
    const needsClinicLookup = !service.clinics && service.clinicIds?.length > 0;
    const { data: allClinics } = useGetAllClinicQuery(undefined, { skip: !needsClinicLookup });

    const clinics = useMemo(() => {
        if (Array.isArray(service.clinics)) return service.clinics;
        const ids = new Set(service.clinicIds || []);
        return (allClinics?.data || []).filter((c) => ids.has(c.id));
    }, [service, allClinics]);

    const category = categoryData?.data;
    const categoryName = category ? getLocalizedText(category, "name") : "";
    const name = getLocalizedText(service, "name");
    const description = getLocalizedText(service, "description");
    const options = service.options || [];
    const visibleClinics = showAll ? clinics : clinics.slice(0, CLINICS_PREVIEW);
    const phone = t("contact.contactCard.mobile.value");

    const crumbs = [
        { label: t("navbar.categories"), to: "/services" },
        ...(category ? [{ label: categoryName, to: `/category/${category.id}` }] : []),
        { label: name },
    ];

    return (
        <div className="service-view">
            <PageHeader title={name} crumbs={crumbs} />

            <section className="md-section md-section--flush-top">
                <div className="container md-layout">
                    <div className="md-main">
                        {description && (
                            <div className="service-view__lead">
                                <CategoryMark file={service.categoryImage} />
                                <p className="md-prose md-prose--lead">{description}</p>
                            </div>
                        )}

                        {options.length > 0 && (
                            <div className="md-block" data-reveal>
                                <h2>{t("categoryDetail.features")}</h2>
                                <ul className={`service-view__features${options.length > 5 ? " is-grid" : ""}`}>
                                    {options.map((opt, i) => (
                                        <li key={opt.id ?? i}>
                                            <Check size={18} strokeWidth={1.75} aria-hidden="true" />
                                            <span>{getLocalizedText(opt, "name")}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div className="md-block" id="service-clinics" data-reveal>
                            <h2>{tx(t, "medicalPages.clinicsOffering")}</h2>
                            {clinics.length > 0 ? (
                                <>
                                    <div
                                        id="service-clinics-grid"
                                        className={`md-grid md-grid--sm${!showAll && clinics.length > CLINICS_PREVIEW ? " is-collapsed" : ""}`}
                                    >
                                        {visibleClinics.map((clinic) => (
                                            <div key={clinic.id} className="md-grid__item">
                                                <ClinicGridCard item={clinic} bare />
                                            </div>
                                        ))}
                                    </div>
                                    {clinics.length > CLINICS_PREVIEW && (
                                        <div className="md-more">
                                            <button
                                                type="button"
                                                className="btn btn--secondary"
                                                aria-expanded={showAll}
                                                aria-controls="service-clinics-grid"
                                                onClick={() => setShowAll((v) => !v)}
                                            >
                                                {showAll ? (
                                                    tx(t, "medicalPages.showLess")
                                                ) : (
                                                    <>
                                                        {t("clinicDetail.services.button")}
                                                        <span className="md-num">({clinics.length})</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <EmptyState icon={Building2} text={tx(t, "medicalPages.noClinics")} compact />
                            )}
                        </div>
                    </div>

                    <aside className="md-aside" aria-labelledby="service-cta-title">
                        <div className="md-contact-card">
                            <div className="md-contact-card__head">
                                <h2 id="service-cta-title">{tx(t, "medicalPages.consultTitle")}</h2>
                                <p>{tx(t, "medicalPages.consultText")}</p>
                            </div>
                            {(category || clinics.length > 0) && (
                                <>
                                    <ul className="md-facts">
                                        {category && (
                                            <li>
                                                <Layers size={18} strokeWidth={1.75} className="md-facts__icon" aria-hidden="true" />
                                                <Link to={`/category/${category.id}`}>{categoryName}</Link>
                                            </li>
                                        )}
                                        {clinics.length > 0 && (
                                            <li>
                                                <Building2 size={18} strokeWidth={1.75} className="md-facts__icon" aria-hidden="true" />
                                                <a href="#service-clinics" className="service-view__fact-link">
                                                    {tx(t, "medicalPages.clinicsCount", { n: clinics.length })}
                                                </a>
                                            </li>
                                        )}
                                    </ul>
                                    <hr className="md-divider" />
                                </>
                            )}
                            <div className="md-actions">
                                <a className="btn btn--primary btn--block" href="#service-inquiry">
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

            {/* Inquiry: copy column + form card */}
            <section className="md-section md-section--subtle" id="service-inquiry" aria-labelledby="service-inquiry-title">
                <div className="container md-split">
                    <div className="md-split__copy">
                        <h2 id="service-inquiry-title">{t("contact.form.title")}</h2>
                        <p>{tx(t, "medicalPages.consultText")}</p>
                        <ul className="md-facts">
                            <li>
                                <Phone size={18} strokeWidth={1.75} className="md-facts__icon" aria-hidden="true" />
                                <a href={`tel:${phone.replace(/\s/g, "")}`} dir="ltr" className="md-num">{phone}</a>
                            </li>
                            <li>
                                <Mail size={18} strokeWidth={1.75} className="md-facts__icon" aria-hidden="true" />
                                <a href={`mailto:${CONTACT.email}`} translate="no">{CONTACT.email}</a>
                            </li>
                        </ul>
                    </div>
                    <div className="md-contact-card service-view__form-card">
                        <InquiryForm submit={postServiceContact} extra={{ serviceId: service.id }} />
                    </div>
                </div>
            </section>
        </div>
    );
}

/** Placeholder layout shown while a service/category loads. */
export function ServiceViewSkeleton({ crumbs = [] }) {
    return (
        <div className="service-view">
            <PageHeader title={" "} crumbs={[...crumbs, { label: "…" }]} />
            <section className="md-section md-section--flush-top">
                <div className="container md-layout">
                    <div className="md-main">
                        <div className="service-view__skel-lines">
                            <SkeletonBlock height={18} />
                            <SkeletonBlock height={18} width="92%" />
                            <SkeletonBlock height={18} width="70%" />
                        </div>
                        <SkeletonGrid count={3} ratio="4 / 3" className="md-grid--sm" />
                    </div>
                    <SkeletonBlock height={300} variant="block" />
                </div>
            </section>
        </div>
    );
}

export default ServiceView;
