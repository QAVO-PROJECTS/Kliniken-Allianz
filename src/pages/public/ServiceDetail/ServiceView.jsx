import "./ServiceView.scss";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Building2, CheckCircle2 } from "lucide-react";
import {
    useGetAllClinicQuery,
    useGetCategoryByIdQuery,
    usePostContactServiceMutation,
} from "../../../api/userApi.js";
import { CATEGORY_IMAGES } from "../../../config/mediaUrls.js";
import { getLocalizedText } from "../../../i18n/getLocalizedText.js";
import PageHeader from "../../../components/ui/PageHeader/index.jsx";
import ClinicGridCard from "../../../components/cards/ClinicGridCard/index.jsx";
import InquiryForm from "../Clinics/shared/InquiryForm.jsx";
import { EmptyState, SkeletonBlock, SkeletonGrid } from "../Clinics/shared/Feedback.jsx";
import { tx } from "../Clinics/shared/texts.js";

const CLINICS_PREVIEW = 6;

/**
 * Full service page body (header, description, features, clinics offering it
 * and an inquiry form). Shared by /services/:id and /category/:id.
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
    const name = getLocalizedText(service, "name");
    const description = getLocalizedText(service, "description");
    const options = service.options || [];
    const visibleClinics = showAll ? clinics : clinics.slice(0, CLINICS_PREVIEW);

    const crumbs = [
        { label: t("navbar.categories"), to: "/services" },
        ...(category ? [{ label: getLocalizedText(category, "name"), to: `/category/${category.id}` }] : []),
        { label: name },
    ];

    return (
        <div className="service-view">
            <PageHeader title={name} crumbs={crumbs} />

            <section className="md-section">
                <div className="container md-layout">
                    <div className="md-main">
                        <div className="md-card service-view__intro">
                            {service.categoryImage && (
                                <span className="service-view__icon">
                                    <img src={CATEGORY_IMAGES + service.categoryImage} alt="" decoding="async" />
                                </span>
                            )}
                            <div className="service-view__intro-text">
                                {category && <span className="badge badge--brand">{getLocalizedText(category, "name")}</span>}
                                <h2>{name}</h2>
                                {description && <p className="md-prose">{description}</p>}
                            </div>
                        </div>

                        {options.length > 0 && (
                            <div className="md-block">
                                <h2>{t("categoryDetail.features")}</h2>
                                <ul className="service-view__features">
                                    {options.map((opt, i) => (
                                        <li key={opt.id ?? i}>
                                            <CheckCircle2 size={20} aria-hidden="true" />
                                            <span>{getLocalizedText(opt, "name")}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div className="md-block">
                            <h2>{tx(t, "medicalPages.clinicsOffering")}</h2>
                            {clinics.length > 0 ? (
                                <>
                                    <div className={`md-grid${!showAll && clinics.length > CLINICS_PREVIEW ? " is-collapsed" : ""}`}>
                                        {visibleClinics.map((clinic) => (
                                            <ClinicGridCard key={clinic.id} item={clinic} />
                                        ))}
                                    </div>
                                    {clinics.length > CLINICS_PREVIEW && (
                                        <div className="md-more">
                                            <button
                                                type="button"
                                                className="btn btn--secondary"
                                                aria-expanded={showAll}
                                                onClick={() => setShowAll((v) => !v)}
                                            >
                                                {showAll
                                                    ? tx(t, "medicalPages.showLess")
                                                    : `${t("clinicDetail.services.button")} (${clinics.length})`}
                                            </button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <EmptyState icon={Building2} text={tx(t, "medicalPages.noClinics")} compact />
                            )}
                        </div>
                    </div>

                    <aside className="md-aside">
                        <div className="md-contact-card">
                            <div className="md-contact-card__head">
                                <h2>{tx(t, "medicalPages.consultTitle")}</h2>
                                <p>{tx(t, "medicalPages.consultText")}</p>
                            </div>
                            <InquiryForm submit={postServiceContact} extra={{ serviceId: service.id }} stacked />
                        </div>
                    </aside>
                </div>
            </section>
        </div>
    );
}

/** Placeholder layout shown while a service/category loads. */
export function ServiceViewSkeleton({ crumbs = [] }) {
    return (
        <div className="service-view">
            <PageHeader title={"\u00a0"} crumbs={[...crumbs, { label: "…" }]} />
            <section className="md-section">
                <div className="container md-layout">
                    <div className="md-main">
                        <SkeletonBlock height={180} radius="var(--radius-xl)" />
                        <SkeletonGrid count={3} ratio="16 / 10" />
                    </div>
                    <SkeletonBlock height={420} radius="var(--radius-xl)" />
                </div>
            </section>
        </div>
    );
}

export default ServiceView;
