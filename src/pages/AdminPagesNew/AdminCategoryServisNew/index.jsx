import './index.scss'
import LanguageDiv from "../../../components/AdminComponents/LanguageDic/index.jsx";
import AddBtn from "../../../components/AdminComponents/AddBtn/index.jsx";
import {NavLink, useParams} from "react-router-dom";
import rootIcon from "../../../assets/rootIcon.svg";
import CategoryTableServisNew from "./CategoryServisTable/index.jsx";
import {useGetCategoryByIdQuery} from "../../../services/userApi.jsx";
import {useMemo, useState} from "react";
function AdminCategoryServisNew() {
    const {id} = useParams();
    const {data:getCategoryById} = useGetCategoryByIdQuery(id)
    const category = getCategoryById?.data
    const [language, setLanguage] = useState("AZ");
    // 🔹 Dildə uyğun olan ad
    const localizedCategoryName = useMemo(() => {
        if (!category) return "";
        switch (language) {
            case "EN": return category.nameEng || category.name;
            case "RU": return category.nameRu || category.name;
            case "DE": return category.nameAlm || category.name;
            case "AR": return category.nameArab || category.name;
            default: return category.name;
        }
    }, [category, language]);
    return (
        <div id={'admin-category'}>
            <div className={'admin-category'}>
                <div className={"root"}>
                    <h2>
                        <NavLink className="link" to="/admin/category">Kateqoriya</NavLink>
                        <img src={rootIcon} alt="" />
                        {localizedCategoryName}
                    </h2>
                </div>
                <div className={'category-head'}>
                    <div className={'category-header'}>
                        <h4>{localizedCategoryName}</h4>
                        <p>Bu bölmədə kateqoriyanın ümumi məlumatlarını görə və ona yeni xidmətlər əlavə edə bilərsiniz.</p>
                    </div>
                    <div className={'category-buttons'}>
                        <LanguageDiv selected={language} onChange={setLanguage}/>
                        <AddBtn nav={`/admin/category/servis/add/${id}`}/>
                    </div>
                </div>
                <CategoryTableServisNew language={language}/>
            </div>
        </div>
    );
}

export default AdminCategoryServisNew;