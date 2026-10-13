import { useState } from "react";
import { useTranslation } from "react-i18next";
import LanguageDiv from "../../../../components/admin/ContentLanguageTabs/index.jsx";
import AddBtn from "../../../../components/admin/AddButton/index.jsx";
import AdminPageHeader from "../../../../components/admin/AdminPageHeader/index.jsx";
import ClinicTable from "./ClinicTable/index.jsx";

function AdminClinic() {
    const [language, setLanguage] = useState("AZ");
    const { t } = useTranslation();
    return (
        <>
            <AdminPageHeader
                title={t("adminPanel.leftBar.menu.clinic")}
                description={t("adminPanel.clinicPage.description")}
                actions={(
                    <>
                        <LanguageDiv selected={language} onChange={setLanguage} />
                        <AddBtn nav="/admin/clinic/add" />
                    </>
                )}
            />
            <ClinicTable language={language} isGermany={false} />
        </>
    );
}

export default AdminClinic;
