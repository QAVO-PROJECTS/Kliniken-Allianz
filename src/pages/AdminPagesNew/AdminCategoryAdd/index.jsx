import './index.scss'
import {NavLink, useNavigate} from "react-router-dom";
import rootIcon from '/src/assets/rootIcon.svg'
import aze from '/src/assets/azerbaijan.svg'
import rus from '/src/assets/russia.svg'
import usa from '/src/assets/unitedstates.svg'
import ger from '/src/assets/germany.svg'
import arb from '/src/assets/unitedarabemirates.svg'
import cat1 from "../../../assets/Servis/cat1.svg";
import cat2 from "../../../assets/Servis/cat2.svg";
import cat3 from "../../../assets/Servis/cat3.svg";
import cat4 from "../../../assets/Servis/cat4.svg";
import cat5 from "../../../assets/Servis/cat5.svg";
import cat6 from "../../../assets/Servis/cat6.svg";
import {useState} from "react";
import {usePostCategoryMutation} from "../../../services/userApi.jsx";
import showToast from "../../../components/ToastMessage.js";
import {useTranslation} from "react-i18next";
function CategoryAdd() {
    const { t } = useTranslation();
    const [activeIcon, setActiveIcon] = useState(null);
    const [postCategory, { isLoading }] = usePostCategoryMutation()
    const navigate = useNavigate();
    // 🔹 input state-lər (dillərə görə)
    const [inputs, setInputs] = useState({
        az: "",
        ru: "",
        en: ""
    });
    // 🔹 input dəyişiklikləri üçün funksiya
    const handleInputChange = (lang, value) => {
        setInputs(prev => ({ ...prev, [lang]: value }));
    };

    // 🔹 ikon seçmək üçün nümunə array
    const icons = [
        cat1, cat2, cat3, cat4, cat5, cat6
    ];
    const getImageBlob = async (url) => {
        const response = await fetch(url);
        return await response.blob();
    };
    // 🔹 POST sorğusu
    const handleSubmit = async () => {
        if (!inputs.az.trim()) {
            showToast(t("adminPanel.categoryAdd.toast.emptyName"), "warning");
            return;
        }
        if (activeIcon === null) {
            showToast(t("adminPanel.categoryAdd.toast.noIcon"), "warning");
            return;
        }


        try {
            const formData = new FormData();
            formData.append("name", inputs.az);
            formData.append("nameRu", inputs.ru);
            formData.append("nameEng", inputs.en);
            const iconBlob = await getImageBlob(icons[activeIcon]);
            formData.append("categoryImage", iconBlob, `icon_${activeIcon}.svg`);
            await postCategory(formData).unwrap();
            showToast(t("adminPanel.categoryAdd.toast.success"), "success");
            setInputs({ az: "", ru: "", en: "" });
            setActiveIcon(null);
            navigate('/admin/category');
        } catch (err) {
            console.error("Xəta:", err);
            showToast(t("adminPanel.categoryAdd.toast.error"), "error");
        }
    };
    return (
        <div id={'category-add'}>
            <div className={'category-add'}>
                <div className={"root"}>
                    <h2>
                        <NavLink className="link" to="/admin/category">{t("adminPanel.categoryAdd.breadcrumb.main")}</NavLink>
                        <img src={rootIcon} alt="" />
                        {t("adminPanel.categoryAdd.breadcrumb.sub")}
                    </h2>
                </div>
                <div className={'category-add-head'}>
                    <h1>{t("adminPanel.categoryAdd.title")}</h1>
                    <p>{t("adminPanel.categoryAdd.description")}</p>
                </div>
                <div className={'category-add-main'}>
                    <div className={'category-add-data'}>
                        <div className={"dataDiv inputs"}>
                            <div className={'header'}>
                                <h3>{t("adminPanel.categoryAdd.nameTitle")}</h3>
                                <p>{t("adminPanel.categoryAdd.nameDescription")}</p>
                            </div>
                            <div className={'add-inputs'}>
                                <div className={'add-data'}>
                                    <div className={'add-input'}>
                                        <input
                                            value={inputs.az}
                                            onChange={e => handleInputChange("az", e.target.value)}
                                            placeholder={t("adminPanel.categoryAdd.placeholders.az")}
                                        />
                                    </div>
                                    <div className={'langCountry'}>
                                        <img src={aze} alt="" />
                                    </div>
                                </div>
                                <div className={'add-data'}>
                                    <div className={'add-input'}>
                                        <input
                                            value={inputs.ru}
                                            onChange={e => handleInputChange("ru", e.target.value)}
                                            placeholder={t("adminPanel.categoryAdd.placeholders.ru")}
                                        />
                                    </div>
                                    <div className={'langCountry'}>
                                        <img src={rus} alt="" />
                                    </div>
                                </div>
                                <div className={'add-data'}>
                                    <div className={'add-input'}>
                                        <input
                                            value={inputs.en}
                                            onChange={e => handleInputChange("en", e.target.value)}
                                            placeholder={t("adminPanel.categoryAdd.placeholders.en")}
                                        />
                                    </div>
                                    <div className={'langCountry'}>
                                        <img src={usa} alt="" />
                                    </div>
                                </div>
                                {/*<div className={'add-data'}>*/}
                                {/*    <div className={'add-input'}>*/}
                                {/*        <input placeholder={'Travmatologiya'}/>*/}
                                {/*    </div>*/}
                                {/*    <div className={'langCountry'}>*/}
                                {/*        <img src={ger} alt="" />*/}
                                {/*    </div>*/}
                                {/*</div>*/}
                                {/*<div className={'add-data'}>*/}
                                {/*    <div className={'add-input'}>*/}
                                {/*        <input placeholder={'Travmatologiya'}/>*/}
                                {/*    </div>*/}
                                {/*    <div className={'langCountry'}>*/}
                                {/*        <img src={arb} alt="" />*/}
                                {/*    </div>*/}
                                {/*</div>*/}
                            </div>
                        </div>
                        <div className={"dataDiv images"}>
                            <div className={'header'}>
                                <h3>{t("adminPanel.categoryAdd.iconTitle")}</h3>
                                <p>{t("adminPanel.categoryAdd.iconDescription")}</p>
                            </div>
                            <div className={'addCategory'}>
                                {icons.map((icon, index) => (
                                    <div
                                        key={index}
                                        className={`iconDiv ${activeIcon === index ? 'active' : ''}`}
                                        onClick={() => setActiveIcon(index)}
                                    >
                                        <img src={icon} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <button onClick={handleSubmit} disabled={isLoading}>
                        {isLoading
                            ? t("adminPanel.categoryAdd.buttons.loading")
                            : t("adminPanel.categoryAdd.buttons.save")}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CategoryAdd;