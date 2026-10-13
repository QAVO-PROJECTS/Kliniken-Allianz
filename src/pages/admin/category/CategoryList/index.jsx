import { useState } from "react";
import { useTranslation } from "react-i18next";
import LanguageDiv from "../../../../components/admin/ContentLanguageTabs/index.jsx";
import AddBtn from "../../../../components/admin/AddButton/index.jsx";
import AdminPageHeader from "../../../../components/admin/AdminPageHeader/index.jsx";
import CategoryTableNew from "./CategoryTable/index.jsx";

function AdminCategoryNew() {
    const [language, setLanguage] = useState("AZ");
    const { t } = useTranslation();
    return (
        <>
            <AdminPageHeader
                title={t("adminPanel.categoryPage.title")}
                description={t("adminPanel.categoryPage.description")}
                actions={(
                    <>
                        <LanguageDiv selected={language} onChange={setLanguage} />
                        <AddBtn nav="/admin/category/add" />
                    </>
                )}
            />
            <CategoryTableNew language={language} />
        </>
    );
}

export default AdminCategoryNew;
