import './index.scss'
import LanguageDiv from "../../../components/AdminComponents/LanguageDic/index.jsx";
import AddBtn from "../../../components/AdminComponents/AddBtn/index.jsx";
import CategoryTableNew from "./OtelTable/index.jsx";
function AdminOtelNew() {
    return (
        <div id={'admin-otel'}>
            <div className={'admin-otel'}>
                <div className={'category-head'}>
                    <div className={'category-header'}>
                        <h4>Otel</h4>
                        <p>Buradan otelləri idarə edə və yenilərini yarada bilərsiniz.</p>
                    </div>
                    <div className={'category-buttons'}>
                        <LanguageDiv />
                        <AddBtn nav={'/admin/otel/add'}/>
                    </div>
                </div>
                <CategoryTableNew />
            </div>
        </div>
    );
}

export default AdminOtelNew;