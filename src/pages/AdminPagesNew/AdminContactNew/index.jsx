import './index.scss'
import LanguageDiv from "../../../components/AdminComponents/LanguageDic/index.jsx";
import filterIcon from '/src/assets/filterIcon.svg'
import ContactTableNew from "./ContactTable/index.jsx";
import FilterDropdown from "../../../components/AdminComponents/FilterDiv/index.jsx";
import {useState} from "react";
import {useTranslation} from "react-i18next";
function AdminContactNew() {
    const [language, setLanguage] = useState("AZ");
    const [selectedFilter, setSelectedFilter] = useState("all");
    const { t } = useTranslation();

    return (
        <div id={'admin-contact'}>
            <div className={'admin-contact'}>
                <div className={'category-head'}>
                    <div className={'category-header'}>
                        <h4>{t("adminPanel.contactPage.title")}</h4>
                        <p>{t("adminPanel.contactPage.description")}</p>
                    </div>
                    <div className={'category-buttons'}>
                        {/*<LanguageDiv selected={language} onChange={setLanguage} />*/}
                        <FilterDropdown
                            selected={selectedFilter}
                            onChange={setSelectedFilter} // 🔹 filter dəyərini yuxarı qaldırdıq
                        />
                    </div>
                </div>
                <ContactTableNew  language={language} filter={selectedFilter}/>
            </div>
        </div>
    );
}

export default AdminContactNew;