import './index.scss'
import LanguageDiv from "../../../components/AdminComponents/LanguageDic/index.jsx";
import AddBtn from "../../../components/AdminComponents/AddBtn/index.jsx";

import CategoryTableServisNew from "./ToursTable/index.jsx";
function AdminToursNew() {
    return (
        <div id={'admin-tours'}>
            <div className={'admin-tours'}>

                <div className={'category-head'}>
                    <div className={'category-header'}>
                        <h4>Xidmət paketi</h4>
                        <p>Buradan həkimləri idarə edə və yenilərini yarada bilərsiniz.</p>
                    </div>
                    <div className={'category-buttons'}>
                        <LanguageDiv />
                        <AddBtn nav={'/admin/tours/add'}/>
                    </div>
                </div>
                <CategoryTableServisNew />
            </div>
        </div>
    );
}

export default AdminToursNew;