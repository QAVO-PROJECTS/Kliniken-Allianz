import { useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useGetCategoryByIdQuery } from "../../../../api/userApi.js";
import LanguageDiv from "../../../../components/admin/ContentLanguageTabs/index.jsx";
import AddBtn from "../../../../components/admin/AddButton/index.jsx";
import AdminPageHeader from "../../../../components/admin/AdminPageHeader/index.jsx";
import { pickLocalized } from "../../../../components/admin/shared/localize.js";
import CategoryTableServisNew from "./ServiceTable/index.jsx";

function AdminCategoryServisNew() {
    const { t } = useTranslation();
    const { id } = useParams();
    const { data: getCategoryById } = useGetCategoryByIdQuery(id);
    const category = getCategoryById?.data;
    const [language, setLanguage] = useState("AZ");
    const categoryName = pickLocalized(category, "name", language);

    return (
        <>
            <AdminPageHeader
                crumbs={[
                    { label: t("adminPanel.categoryService.main"), to: "/admin/category" },
                    { label: categoryName || "…" },
                ]}
                title={categoryName || "…"}
                description={t("adminPanel.categoryService.description")}
                actions={(
                    <>
                        <LanguageDiv selected={language} onChange={setLanguage} />
                        <AddBtn nav={`/admin/category/servis/add/${id}`} />
                    </>
                )}
            />
            <CategoryTableServisNew language={language} />
        </>
    );
}

export default AdminCategoryServisNew;
