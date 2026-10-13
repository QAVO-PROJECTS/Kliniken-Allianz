import { useState } from "react";
import { useTranslation } from "react-i18next";
import AdminPageHeader from "../../../../components/admin/AdminPageHeader/index.jsx";
import ContactTableNew from "./ContactTable/index.jsx";

function AdminContactNew() {
    const { t } = useTranslation();
    const [selectedFilter, setSelectedFilter] = useState("all");

    return (
        <>
            <AdminPageHeader
                title={t("adminPanel.contactPage.title")}
                description={t("adminPanel.contactPage.description")}
            />
            <ContactTableNew filter={selectedFilter} onFilterChange={setSelectedFilter} />
        </>
    );
}

export default AdminContactNew;
