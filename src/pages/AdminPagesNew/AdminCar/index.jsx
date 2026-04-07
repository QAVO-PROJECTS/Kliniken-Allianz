import './index.scss';
import LanguageDiv from "../../../components/AdminComponents/LanguageDic/index.jsx";
import AddBtn from "../../../components/AdminComponents/AddBtn/index.jsx";
import CarTable from "./CarTable/index.jsx";
import {useState} from "react";

function AdminCar() {
    const [language, setLanguage] = useState("AZ");

    return (
        <div id={'admin-car'}>
            <div className={'admin-car'}>
                <div className={'category-head'}>
                    <div className={'category-header'}>
                        <h4>Avtomobillər</h4>
                        <p>Mövcud avtomobilləri idarə edin</p>
                    </div>
                    <div className={'category-buttons'}>
                        <LanguageDiv selected={language} onChange={setLanguage}/>
                        <AddBtn nav={'/admin/car/add'}/>
                    </div>
                </div>
                <CarTable language={language}/>
            </div>
        </div>
    );
}

export default AdminCar;