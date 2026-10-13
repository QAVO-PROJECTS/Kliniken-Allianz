import { useState } from "react";
import { useTranslation } from "react-i18next";
import LanguageDiv from "../../../../components/admin/ContentLanguageTabs/index.jsx";
import AddBtn from "../../../../components/admin/AddButton/index.jsx";
import AdminPageHeader from "../../../../components/admin/AdminPageHeader/index.jsx";
import ToursTableNew from "./TourTable/index.jsx";

function AdminToursNew() {
    const [language, setLanguage] = useState("AZ");
    const { t } = useTranslation();
    return (
        <>
            <AdminPageHeader
                title={t("adminPanel.toursPagee.header.title")}
                description={t("adminPanel.toursPagee.header.description")}
                actions={(
                    <>
                        <LanguageDiv selected={language} onChange={setLanguage} />
                        <AddBtn nav="/admin/tours/add" />
                    </>
                )}
            />
            <ToursTableNew language={language} />
        </>
    );
}

export default AdminToursNew;
