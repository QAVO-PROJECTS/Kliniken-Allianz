import './index.scss'
import LanguageDiv from "../../../components/AdminComponents/LanguageDic/index.jsx";
import AddBtn from "../../../components/AdminComponents/AddBtn/index.jsx";
import CategoryTableNew from "./ClinicTable/index.jsx";
import {useState} from "react";
function AdminClinicNew() {
    const [language, setLanguage] = useState("AZ");

    return (
        <div id={'admin-clinic'}>
            <div className={'admin-clinic'}>
                <div className={'category-head'}>
                    <div className={'category-header'}>
                        <h4>Klinika</h4>
                        <p>Buradan klinikaları idarə edə və yenilərini yarada bilərsiniz.</p>
                    </div>
                    <div className={'category-buttons'}>
                        <LanguageDiv selected={language} onChange={setLanguage}/>
                        <AddBtn nav={'/admin/clinic/add'}/>
                    </div>
                </div>
                <CategoryTableNew language={language}/>
            </div>
        </div>
    );
}

export default AdminClinicNew;