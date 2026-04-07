import './index.scss';
import LanguageDiv from "../../../components/AdminComponents/LanguageDic/index.jsx";
import AddBtn from "../../../components/AdminComponents/AddBtn/index.jsx";
import NewspaperTable from "./NewspaperTable/index.jsx";
import {useState} from "react";

function AdminNewspaper() {
    const [language, setLanguage] = useState("AZ");

    return (
        <div id={'admin-newspaper'}>
            <div className={'admin-newspaper'}>
                <div className={'category-head'}>
                    <div className={'category-header'}>
                        <h4>Qəzet / Xəbərlər</h4>
                        <p>Mövcud xəbərləri idarə edin</p>
                    </div>
                    <div className={'category-buttons'}>
                        <LanguageDiv selected={language} onChange={setLanguage}/>
                        <AddBtn nav={'/admin/newspaper/add'}/>
                    </div>
                </div>
                <NewspaperTable language={language}/>
            </div>
        </div>
    );
}

export default AdminNewspaper;
