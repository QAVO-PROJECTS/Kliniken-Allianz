import { useState } from "react";
import { useTranslation } from "react-i18next";
import LanguageDiv from "../../../../components/admin/ContentLanguageTabs/index.jsx";
import AddBtn from "../../../../components/admin/AddButton/index.jsx";
import AdminPageHeader from "../../../../components/admin/AdminPageHeader/index.jsx";
import DoctorTable from "./DoctorTable/index.jsx";

function AdminDoctorNew() {
    const { t } = useTranslation();
    const [language, setLanguage] = useState("AZ");
    return (
        <>
            <AdminPageHeader
                title={t("adminPanel.doctorPage.title")}
                description={t("adminPanel.doctorPage.description")}
                actions={(
                    <>
                        <LanguageDiv selected={language} onChange={setLanguage} />
                        <AddBtn nav="/admin/doctors/add" />
                    </>
                )}
            />
            <DoctorTable language={language} />
        </>
    );
}

export default AdminDoctorNew;
