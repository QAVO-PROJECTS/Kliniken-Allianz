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
import cat7 from "../../../assets/Servis/cat7.svg";
import cat8 from "../../../assets/Servis/cat8.svg";
import cat9 from "../../../assets/Servis/cat9.svg";
import cat10 from "../../../assets/Servis/cat10.svg";
import cat11 from "../../../assets/Servis/cat11.svg";
import cat12 from "../../../assets/Servis/cat12.svg";
import cat13 from "../../../assets/Servis/cat13.svg";
import cat14 from "../../../assets/Servis/cat14.svg";
import cat15 from "../../../assets/Servis/cat15.svg";
import cat16 from "../../../assets/Servis/cat16.svg";
import cat17 from "../../../assets/Servis/cat17.svg";
import cat18 from "../../../assets/Servis/cat18.svg";
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
        en: "",
        de: "",
        ar: ""
    });
    // 🔹 input dəyişiklikləri üçün funksiya
    const handleInputChange = (lang, value) => {
        setInputs(prev => ({ ...prev, [lang]: value }));
    };

    // 🔹 ikon seçmək üçün nümunə array
    const icons = [
        cat1, cat2, cat3, cat4, cat5, cat6 , cat7 , cat8 , cat9, cat10, cat11, cat12, cat13, cat14, cat15, cat16 , cat17, cat18
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
            formData.append("nameAlm", inputs.de);
            formData.append("nameArab", inputs.ar);
            const iconBlob = await getImageBlob(icons[activeIcon]);
            formData.append("categoryImage", iconBlob, `icon_${activeIcon}.svg`);
            await postCategory(formData).unwrap();
            showToast(t("adminPanel.categoryAdd.toast.success"), "success");
            setInputs({ az: "", ru: "", en: "", de: "", ar: "" });
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
                                <div className={'add-data'}>
                                    <div className={'add-input'}>
                                        <input
                                            value={inputs.de}
                                            onChange={e => handleInputChange("de", e.target.value)}
                                            placeholder={t("adminPanel.categoryAdd.placeholders.de")}
                                        />
                                    </div>
                                    <div className={'langCountry'}>
                                        <img src={ger} alt="" />
                                    </div>
                                </div>
                                <div className={'add-data'}>
                                    <div className={'add-input'}>
                                        <input
                                            value={inputs.ar}
                                            onChange={e => handleInputChange("ar", e.target.value)}
                                            placeholder={t("adminPanel.categoryAdd.placeholders.ar")}
                                        />
                                    </div>
                                    <div className={'langCountry'}>
                                        <img src={arb} alt="" />
                                    </div>
                                </div>
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