import { useState } from "react";
import { useTranslation } from "react-i18next";
import LanguageDiv from "../../../../components/admin/ContentLanguageTabs/index.jsx";
import AddBtn from "../../../../components/admin/AddButton/index.jsx";
import AdminPageHeader from "../../../../components/admin/AdminPageHeader/index.jsx";
import ClinicTable from "../ClinicList/ClinicTable/index.jsx";

function AdminGermanyClinic() {
    const [language, setLanguage] = useState("AZ");
    const { t } = useTranslation();
    return (
        <>
            <AdminPageHeader
                title={t("adminPanel.leftBar.menu.clinicGermany")}
                description={t("adminPanel.clinicPage.description")}
                actions={(
                    <>
                        <LanguageDiv selected={language} onChange={setLanguage} />
                        <AddBtn nav="/admin/germany-clinic/add" />
                    </>
                )}
            />
            <ClinicTable language={language} isGermany />
        </>
    );
}

export default AdminGermanyClinic;
