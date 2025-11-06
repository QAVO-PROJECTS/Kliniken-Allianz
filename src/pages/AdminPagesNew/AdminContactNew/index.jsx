import './index.scss'
import LanguageDiv from "../../../components/AdminComponents/LanguageDic/index.jsx";
import filterIcon from '/src/assets/filterIcon.svg'
import ContactTableNew from "./ContactTable/index.jsx";
import FilterDropdown from "../../../components/AdminComponents/FilterDiv/index.jsx";
function AdminContactNew() {
    return (
        <div id={'admin-contact'}>
            <div className={'admin-contact'}>
                <div className={'category-head'}>
                    <div className={'category-header'}>
                        <h4>Əlaqələr</h4>
                        <p>Müştəri mesajlarına baxın və cavabları izləyin</p>
                    </div>
                    <div className={'category-buttons'}>
                        <LanguageDiv />
                        <FilterDropdown />
                    </div>
                </div>
                <ContactTableNew />
            </div>
        </div>
    );
}

export default AdminContactNew;