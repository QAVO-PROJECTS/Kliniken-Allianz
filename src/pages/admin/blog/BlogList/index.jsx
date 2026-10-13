import { useState } from "react";
import { useTranslation } from "react-i18next";
import LanguageDiv from "../../../../components/admin/ContentLanguageTabs/index.jsx";
import AddBtn from "../../../../components/admin/AddButton/index.jsx";
import AdminPageHeader from "../../../../components/admin/AdminPageHeader/index.jsx";
import NewspaperTableNew from "./BlogTable/index.jsx";

function AdminNewspaperNew() {
    const { t } = useTranslation();
    const [language, setLanguage] = useState("AZ");

    return (
        <>
            <AdminPageHeader
                title={t("adminPanel.newspaperTable.header.title")}
                description={t("adminPanel.newspaperTable.header.description")}
                actions={(
                    <>
                        <LanguageDiv selected={language} onChange={setLanguage} />
                        <AddBtn nav="/admin/newspaper/add" />
                    </>
                )}
            />
            <NewspaperTableNew language={language} />
        </>
    );
}

export default AdminNewspaperNew;
