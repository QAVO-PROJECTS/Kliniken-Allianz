import { useState } from "react";
import { useTranslation } from "react-i18next";
import LanguageDiv from "../../../../components/admin/ContentLanguageTabs/index.jsx";
import AddBtn from "../../../../components/admin/AddButton/index.jsx";
import AdminPageHeader from "../../../../components/admin/AdminPageHeader/index.jsx";
import SerhTableNew from "./ReviewTable/index.jsx";

function AdminSerhNew() {
    const [language, setLanguage] = useState("AZ");
    const { t } = useTranslation();
    return (
        <>
            <AdminPageHeader
                title={t("adminPanel.commentPage.header.title")}
                description={t("adminPanel.commentPage.header.description")}
                actions={(
                    <>
                        <LanguageDiv selected={language} onChange={setLanguage} />
                        <AddBtn nav="/admin/serh/add" />
                    </>
                )}
            />
            <SerhTableNew language={language} />
        </>
    );
}

export default AdminSerhNew;
