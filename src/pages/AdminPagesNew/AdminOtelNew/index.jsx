import './index.scss'
import LanguageDiv from "../../../components/AdminComponents/LanguageDic/index.jsx";
import AddBtn from "../../../components/AdminComponents/AddBtn/index.jsx";
import CategoryTableNew from "./OtelTable/index.jsx";
import {useState} from "react";
import {useTranslation} from "react-i18next";
function AdminOtelNew() {
    const [language, setLanguage] = useState("AZ");
    const { t } = useTranslation();
    return (
        <div id={'admin-otel'}>
            <div className={'admin-otel'}>
                <div className={'category-head'}>
                    <div className={'category-header'}>
                        <h4>{t("adminPanel.hotelPage.title")}</h4>
                        <p>{t("adminPanel.hotelPage.description")}</p>
                    </div>
                    <div className={'category-buttons'}>
                        <LanguageDiv  selected={language} onChange={setLanguage}/>
                        <AddBtn nav={'/admin/otel/add'}/>
                    </div>
                </div>
                <CategoryTableNew language={language} />
            </div>
        </div>
    );
}

export default AdminOtelNew;