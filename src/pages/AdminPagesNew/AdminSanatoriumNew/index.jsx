import './index.scss';
import LanguageDiv from "../../../components/AdminComponents/LanguageDic/index.jsx";
import AddBtn from "../../../components/AdminComponents/AddBtn/index.jsx";
import CategoryTableNew from "./SanatoriumTable/index.jsx";
import { useState } from "react";
import { useTranslation } from "react-i18next";

function AdminSanatoriumNew() {
    const [language, setLanguage] = useState("AZ");
    const { t } = useTranslation();

    return (
        <div id={'admin-sanatorium'}>
            <div className={'admin-sanatorium'}>
                <div className={'category-head'}>
                    <div className={'category-header'}>
                        <h4>{t("adminPanel.sanatoriumPage.title")}</h4>
                        <p>{t("adminPanel.sanatoriumPage.description")}</p>
                    </div>
                    <div className={'category-buttons'}>
                        <LanguageDiv selected={language} onChange={setLanguage} />
                        <AddBtn nav={'/admin/sanatorium/add'} />
                    </div>
                </div>
                <CategoryTableNew language={language} />
            </div>
        </div>
    );
}

export default AdminSanatoriumNew;
