import './index.scss'
import LanguageDiv from "../../../components/AdminComponents/LanguageDic/index.jsx";
import AddBtn from "../../../components/AdminComponents/AddBtn/index.jsx";
import {NavLink} from "react-router-dom";
import rootIcon from "../../../assets/rootIcon.svg";
import CategoryTableServisNew from "./CategoryServisTable/index.jsx";
function AdminCategoryServisNew() {
    return (
        <div id={'admin-category'}>
            <div className={'admin-category'}>
                <div className={"root"}>
                    <h2>
                        <NavLink className="link" to="/admin/category">Kateqoriya</NavLink>
                        <img src={rootIcon} alt="" />
                        Xərçəng müalicəsi
                    </h2>
                </div>
                <div className={'category-head'}>
                    <div className={'category-header'}>
                        <h4>Xərçəng müalicəsi</h4>
                        <p>Bu bölmədə kateqoriyanın ümumi məlumatlarını görə və ona yeni xidmətlər əlavə edə bilərsiniz.</p>
                    </div>
                    <div className={'category-buttons'}>
                        <LanguageDiv />
                        <AddBtn nav={'/admin/category/servis/add/:id'}/>
                    </div>
                </div>
                <CategoryTableServisNew />
            </div>
        </div>
    );
}

export default AdminCategoryServisNew;