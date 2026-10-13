import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Stethoscope } from "lucide-react";
import { useGetServiceByIdQuery } from "../../../api/userApi.js";
import PageHeader from "../../../components/ui/PageHeader/index.jsx";
import ServiceView, { ServiceViewSkeleton } from "./ServiceView.jsx";
import { EmptyState } from "../Clinics/shared/Feedback.jsx";
import { tx } from "../Clinics/shared/texts.js";

function ServiceDetail() {
    const { id } = useParams();
    const { t } = useTranslation();
    const { data, isLoading } = useGetServiceByIdQuery(id);
    const service = data?.data;
    const crumbs = [{ label: t("navbar.categories"), to: "/services" }];

    if (isLoading) return <ServiceViewSkeleton crumbs={crumbs} />;

    if (!service) {
        return (
            <>
                <PageHeader title={t("categoryDetail.pageTitle")} crumbs={crumbs} />
                <section className="md-section">
                    <div className="container">
                        <EmptyState icon={Stethoscope} title={tx(t, "medicalPages.notFound")} />
                    </div>
                </section>
            </>
        );
    }

    return <ServiceView key={service.id} service={service} />;
}

export default ServiceDetail;
