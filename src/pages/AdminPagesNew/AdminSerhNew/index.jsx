import './index.scss'
import LanguageDiv from "../../../components/AdminComponents/LanguageDic/index.jsx";
import AddBtn from "../../../components/AdminComponents/AddBtn/index.jsx";
import CategoryTableNew from "./SerhTable/index.jsx";
import {useState} from "react";
function AdminSerhNew() {
    const [language, setLanguage] = useState("AZ");
    return (
        <div id={'admin-serh'}>
            <div className={'admin-serh'}>
                <div className={'category-head'}>
                    <div className={'category-header'}>
                        <h4>Şərh</h4>
                        <p>Buradan şərhləri idarə edə və yenilərini yarada bilərsiniz.</p>
                    </div>
                    <div className={'category-buttons'}>
                        <LanguageDiv  selected={language} onChange={setLanguage}/>
                        <AddBtn nav={'/admin/serh/add'}/>
                    </div>
                </div>
                <CategoryTableNew  language={language}/>
            </div>
        </div>
    );
}

export default AdminSerhNew;