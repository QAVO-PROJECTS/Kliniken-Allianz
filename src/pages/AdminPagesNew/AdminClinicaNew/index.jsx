import './index.scss';
import LanguageDiv from "../../../components/AdminComponents/LanguageDic/index.jsx";
import AddBtn from "../../../components/AdminComponents/AddBtn/index.jsx";
import CategoryTableNew from "./ClinicTable/index.jsx";
import { useState } from "react";
import { useTranslation } from "react-i18next";

function AdminClinicNew() {
    const [language, setLanguage] = useState("AZ");
    const { t } = useTranslation();

    return (
        <div id={'admin-clinic'}>
            <div className={'admin-clinic'}>
                <div className={'category-head'}>
                    <div className={'category-header'}>
                        <h4>{t("adminPanel.clinicPage.title")}</h4>
                        <p>{t("adminPanel.clinicPage.description")}</p>
                    </div>
                    <div className={'category-buttons'}>
                        <LanguageDiv selected={language} onChange={setLanguage} />
                        <AddBtn nav={'/admin/clinic/add'} />
                    </div>
                </div>
                <CategoryTableNew language={language} />
            </div>
        </div>
    );
}

export default AdminClinicNew;
