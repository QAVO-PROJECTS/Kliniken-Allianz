import './index.scss'
import LanguageDiv from "../../../components/AdminComponents/LanguageDic/index.jsx";
import AddBtn from "../../../components/AdminComponents/AddBtn/index.jsx";
import CategoryTableNew from "./CategoryTable/index.jsx";
import {useState} from "react";
import {useTranslation} from "react-i18next";
function AdminCategoryNew() {
    const [language, setLanguage] = useState("AZ");
    const { t } = useTranslation();
    return (
        <div id={'admin-category'}>
            <div className={'admin-category'}>
                <div className={'category-head'}>
                    <div className={'category-header'}>
                        <h4>{t("adminPanel.categoryPage.title")}</h4>
                        <p>{t("adminPanel.categoryPage.description")}</p>
                    </div>
                    <div className={'category-buttons'}>
                        <LanguageDiv selected={language} onChange={setLanguage}/>
                        <AddBtn nav={'/admin/category/add'}/>
                    </div>
                </div>
                <CategoryTableNew  language={language}/>
            </div>
        </div>
    );
}

export default AdminCategoryNew;