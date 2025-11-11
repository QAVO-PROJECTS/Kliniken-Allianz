import './index.scss'
import LanguageDiv from "../../../components/AdminComponents/LanguageDic/index.jsx";
import AddBtn from "../../../components/AdminComponents/AddBtn/index.jsx";

import CategoryTableServisNew from "./ToursTable/index.jsx";
import {useState} from "react";
import {useTranslation} from "react-i18next";
function AdminToursNew() {
    const [language, setLanguage] = useState("AZ");
    const { t } = useTranslation();
    return (
        <div id={'admin-tours'}>
            <div className={'admin-tours'}>

                <div className={'category-head'}>
                    <div className={'category-header'}>
                        <h4>{t("adminPanel.toursPage.header.title")}</h4>
                        <p>{t("adminPanel.toursPage.header.description")}</p>
                    </div>
                    <div className={'category-buttons'}>
                        <LanguageDiv selected={language} onChange={setLanguage}/>
                        <AddBtn nav={'/admin/tours/add'}/>
                    </div>
                </div>
                <CategoryTableServisNew language={language}/>
            </div>
        </div>
    );
}

export default AdminToursNew;