import "./index.scss";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Stethoscope } from "lucide-react";
import { useGetCategoryByIdQuery, useGetServiceByIdQuery } from "../../../api/userApi.js";
import { getLocalizedText } from "../../../i18n/getLocalizedText.js";
import PageHeader from "../../../components/ui/PageHeader/index.jsx";
import SectionTitle from "../../../components/ui/SectionTitle/index.jsx";
import HomeServiceCard from "../../../components/cards/ServiceCard/index.jsx";
import ServiceView, { ServiceViewSkeleton } from "../ServiceDetail/ServiceView.jsx";
import CtaBand from "../Clinics/shared/CtaBand.jsx";
import { EmptyState } from "../Clinics/shared/Feedback.jsx";
import { tx } from "../Clinics/shared/texts.js";

/**
 * /category/:id — most links (menus, search, cards) pass a SERVICE id, some
 * (category menus, the services grid) pass a CATEGORY id. Try the service
 * first and fall back to the category so both kinds of link work.
 */
function CategoryDetail() {
    const { id } = useParams();
    const { t } = useTranslation();
    const crumbs = [{ label: t("navbar.categories"), to: "/services" }];

    const serviceQuery = useGetServiceByIdQuery(id);
    const service = serviceQuery.data?.data;
    const serviceMissing = !serviceQuery.isFetching && !service;
    const categoryQuery = useGetCategoryByIdQuery(id, { skip: !serviceMissing });
    const category = categoryQuery.data?.data;

    if (serviceQuery.isFetching || (serviceMissing && (categoryQuery.isFetching || categoryQuery.isUninitialized))) {
        return <ServiceViewSkeleton crumbs={crumbs} />;
    }

    if (service) return <ServiceView key={service.id} service={service} />;

    if (!category) {
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

    const name = getLocalizedText(category, "name");
    const services = category.services || [];

    return (
        <div className="category-detail">
            <PageHeader
                title={name}
                subtitle={tx(t, "medicalPages.servicesCount", { n: services.length })}
                crumbs={[...crumbs, { label: name }]}
            />

            <section className="md-section">
                <div className="container">
                    <SectionTitle align="start" title={tx(t, "medicalPages.servicesInCategory")} />
                    {services.length > 0 ? (
                        <div className="md-grid">
                            {services.map((item) => (
                                <HomeServiceCard
                                    key={item.id}
                                    id={item.id}
                                    name={getLocalizedText(item, "name")}
                                    desc={getLocalizedText(item, "description")}
                                    icon={item.categoryImage || category.categoryImage}
                                />
                            ))}
                        </div>
                    ) : (
                        <EmptyState icon={Stethoscope} title={tx(t, "medicalPages.noServices")} />
                    )}
                </div>
            </section>

            <CtaBand />
        </div>
    );
}

export default CategoryDetail;
