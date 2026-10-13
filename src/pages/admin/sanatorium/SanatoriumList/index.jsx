import { useState } from "react";
import { useTranslation } from "react-i18next";
import LanguageDiv from "../../../../components/admin/ContentLanguageTabs/index.jsx";
import AddBtn from "../../../../components/admin/AddButton/index.jsx";
import AdminPageHeader from "../../../../components/admin/AdminPageHeader/index.jsx";
import SanatoriumTableNew from "./SanatoriumTable/index.jsx";

function AdminSanatoriumNew() {
    const [language, setLanguage] = useState("AZ");
    const { t } = useTranslation();

    return (
        <>
            <AdminPageHeader
                title={t("adminPanel.sanatoriumPage.title")}
                description={t("adminPanel.sanatoriumPage.description")}
                actions={(
                    <>
                        <LanguageDiv selected={language} onChange={setLanguage} />
                        <AddBtn nav="/admin/sanatorium/add" />
                    </>
                )}
            />
            <SanatoriumTableNew language={language} />
        </>
    );
}

export default AdminSanatoriumNew;
