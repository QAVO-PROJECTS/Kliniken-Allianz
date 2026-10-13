import { useState } from "react";
import { useTranslation } from "react-i18next";
import LanguageDiv from "../../../../components/admin/ContentLanguageTabs/index.jsx";
import AddBtn from "../../../../components/admin/AddButton/index.jsx";
import AdminPageHeader from "../../../../components/admin/AdminPageHeader/index.jsx";
import OtelTableNew from "./HotelTable/index.jsx";

function AdminOtelNew() {
    const [language, setLanguage] = useState("AZ");
    const { t } = useTranslation();
    return (
        <>
            <AdminPageHeader
                title={t("adminPanel.hotelPage.title")}
                description={t("adminPanel.hotelPage.description")}
                actions={(
                    <>
                        <LanguageDiv selected={language} onChange={setLanguage} />
                        <AddBtn nav="/admin/otel/add" />
                    </>
                )}
            />
            <OtelTableNew language={language} />
        </>
    );
}

export default AdminOtelNew;
