import './index.scss'
import LanguageDiv from "../../../components/AdminComponents/LanguageDic/index.jsx";
import AddBtn from "../../../components/AdminComponents/AddBtn/index.jsx";
import CategoryTableNew from "./DoctorTable/index.jsx";
function AdminDoctorNew() {
    return (
        <div id={'admin-doctor'}>
            <div className={'admin-doctor'}>
                <div className={'category-head'}>
                    <div className={'category-header'}>
                        <h4>Həkim</h4>
                        <p>Buradan həkimləri idarə edə və yenilərini yarada bilərsiniz.</p>
                    </div>
                    <div className={'category-buttons'}>
                        <LanguageDiv />
                        <AddBtn nav={'/admin/doctors/add'}/>
                    </div>
                </div>
                <CategoryTableNew />
            </div>
        </div>
    );
}

export default AdminDoctorNew;