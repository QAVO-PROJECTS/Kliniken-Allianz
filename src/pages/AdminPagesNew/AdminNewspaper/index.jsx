import './index.scss';
import LanguageDiv from "../../../components/AdminComponents/LanguageDic/index.jsx";
import AddBtn from "../../../components/AdminComponents/AddBtn/index.jsx";
import NewspaperTableNew from "./NewspaperTable/index.jsx";
import {useState} from "react";
import {useTranslation} from "react-i18next";

function AdminNewspaperNew() {
    const {t} = useTranslation();
    const [language, setLanguage] = useState("AZ");

    return (
        <div id={'admin-newspaper'}>
            <div className={'admin-newspaper'}>
                <div className={'category-head'}>
                    <div className={'category-header'}>
                        <h4>{t("adminPanel.newspaperTable.header.title")}</h4>
                        <p>{t("adminPanel.newspaperTable.header.description")}</p>
                    </div>
                    <div className={'category-buttons'}>
                        <LanguageDiv selected={language} onChange={setLanguage}/>
                        <AddBtn nav={'/admin/newspaper/add'}/>
                    </div>
                </div>
                <NewspaperTableNew language={language}/>
            </div>
        </div>
    );
}

export default AdminNewspaperNew;
