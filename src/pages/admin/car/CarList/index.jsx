import { useState } from "react";
import { useTranslation } from "react-i18next";
import LanguageDiv from "../../../../components/admin/ContentLanguageTabs/index.jsx";
import AddBtn from "../../../../components/admin/AddButton/index.jsx";
import AdminPageHeader from "../../../../components/admin/AdminPageHeader/index.jsx";
import CarTableNew from "./CarTable/index.jsx";

function AdminCarNew() {
    const { t } = useTranslation();
    const [language, setLanguage] = useState("AZ");
    return (
        <>
            <AdminPageHeader
                title={t("adminPanel.carTable.header.title")}
                description={t("adminPanel.carTable.header.description")}
                actions={(
                    <>
                        <LanguageDiv selected={language} onChange={setLanguage} />
                        <AddBtn nav="/admin/car/add" />
                    </>
                )}
            />
            <CarTableNew language={language} />
        </>
    );
}

export default AdminCarNew;
