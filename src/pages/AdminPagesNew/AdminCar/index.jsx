import './index.scss';
import LanguageDiv from "../../../components/AdminComponents/LanguageDic/index.jsx";
import AddBtn from "../../../components/AdminComponents/AddBtn/index.jsx";
import CarTableNew from "./CarTable/index.jsx";
import {useState} from "react";
import {useTranslation} from "react-i18next";

function AdminCarNew() {
    const {t} = useTranslation();
    const [language, setLanguage] = useState("AZ");

    return (
        <div id={'admin-car'}>
            <div className={'admin-car'}>
                <div className={'category-head'}>
                    <div className={'category-header'}>
                        <h4>{t("adminPanel.carTable.header.title")}</h4>
                        <p>{t("adminPanel.carTable.header.description")}</p>
                    </div>
                    <div className={'category-buttons'}>
                        <LanguageDiv selected={language} onChange={setLanguage}/>
                        <AddBtn nav={'/admin/car/add'}/>
                    </div>
                </div>
                <CarTableNew language={language}/>
            </div>
        </div>
    );
}

export default AdminCarNew;