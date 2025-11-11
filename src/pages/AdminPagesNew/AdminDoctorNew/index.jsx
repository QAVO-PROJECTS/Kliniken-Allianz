import './index.scss'
import LanguageDiv from "../../../components/AdminComponents/LanguageDic/index.jsx";
import AddBtn from "../../../components/AdminComponents/AddBtn/index.jsx";
import CategoryTableNew from "./DoctorTable/index.jsx";
import {useState} from "react";
import {useTranslation} from "react-i18next";
function AdminDoctorNew() {
    const { t } = useTranslation();
    const [language, setLanguage] = useState("AZ");
    return (
        <div id={'admin-doctor'}>
            <div className={'admin-doctor'}>
                <div className={'category-head'}>
                    <div className={'category-header'}>
                        <h4>{t("adminPanel.doctorPage.title")}</h4>
                        <p>{t("adminPanel.doctorPage.description")}</p>
                    </div>
                    <div className={'category-buttons'}>
                        <LanguageDiv selected={language} onChange={setLanguage}/>
                        <AddBtn nav={'/admin/doctors/add'}/>
                    </div>
                </div>
                <CategoryTableNew language={language}/>
            </div>
        </div>
    );
}

export default AdminDoctorNew;