import "./index.scss";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Search } from "lucide-react";
import PageHeader from "../../../components/ui/PageHeader/index.jsx";
import ServicesGrid from "./ServicesGrid/index.jsx";
import CtaBand from "../Clinics/shared/CtaBand.jsx";

function ServicesPage() {
    const { t } = useTranslation();
    const [query, setQuery] = useState("");
    const title = t("navbar.categories");

    return (
        <div className="services-page">
            <PageHeader title={title} crumbs={[{ label: title }]}>
                <label className="search-field">
                    <span className="visually-hidden">{t("navbar.search")}</span>
                    <input
                        type="search"
                        name="q"
                        autoComplete="off"
                        enterKeyHint="search"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder={t("navbar.searchPlaceholder")}
                    />
                    <Search size={20} strokeWidth={1.75} aria-hidden="true" />
                </label>
            </PageHeader>
            <ServicesGrid query={query} onClear={() => setQuery("")} />
            <CtaBand />
        </div>
    );
}

export default ServicesPage;
