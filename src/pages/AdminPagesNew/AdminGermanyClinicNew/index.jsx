import './index.scss';
import LanguageDiv from "../../../components/AdminComponents/LanguageDic/index.jsx";
import AddBtn from "../../../components/AdminComponents/AddBtn/index.jsx";
import ClinicTableNew from "../AdminClinicaNew/ClinicTable/index.jsx";
import { useState } from "react";
import { useTranslation } from "react-i18next";

function AdminGermanyClinicNew() {
    const [language, setLanguage] = useState("AZ");
    const { t } = useTranslation();

    return (
        <div id={'admin-clinic'}>
            <div className={'admin-clinic'}>
                <div className={'category-head'}>
                    <div className={'category-header'}>
                        <h4>{t("adminPanel.leftBar.menu.clinicGermany")}</h4>
                        <p>{t("adminPanel.clinicPage.description")}</p>
                    </div>
                    <div className={'category-buttons'}>
                        <LanguageDiv selected={language} onChange={setLanguage} />
                        <AddBtn nav={'/admin/germany-clinic/add'} />
                    </div>
                </div>
                <ClinicTableNew language={language} isGermany={true} />
            </div>
        </div>
    );
}

export default AdminGermanyClinicNew;
