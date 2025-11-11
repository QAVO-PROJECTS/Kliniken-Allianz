import './index.scss'
import {NavLink, useNavigate, useParams} from "react-router-dom";
import rootIcon from '/src/assets/rootIcon.svg'
import aze from '/src/assets/azerbaijan.svg'
import rus from '/src/assets/russia.svg'
import usa from '/src/assets/unitedstates.svg'
import ger from '/src/assets/germany.svg'
import arb from '/src/assets/unitedarabemirates.svg'
import cat1 from "../../../assets/Servis/cat1.svg";
import {useEffect, useState} from "react";
import {useGetCategoryByIdQuery, usePostCategoryMutation, usePutCategoryMutation} from "../../../services/userApi.jsx";
import showToast from "../../../components/ToastMessage.js";
import {CATEGORY_IMAGES} from "../../../contants.js";
import {useTranslation} from "react-i18next";
function CategoryEdit() {
    const { t } = useTranslation();
    const { id } = useParams();
    const { data: getCategoryById, isLoading: isFetching,refetch } = useGetCategoryByIdQuery(id);
    const category = getCategoryById?.data;
    const navigate = useNavigate();
    const [putCategory, { isLoading: isUpdating }] = usePutCategoryMutation();

    // 🔹 form üçün state-lər
    const [inputs, setInputs] = useState({
        az: "",
        ru: "",
        en: "",
    });
    const [activeIcon, setActiveIcon] = useState(null);

    // 🔹 mövcud datanı inputlara doldur
    useEffect(() => {
        if (category) {
            setInputs({
                az: category.name || "",
                ru: category.nameRu || "",
                en: category.nameEng || "",
            });
        }
    }, [category]);

    // 🔹 input dəyişiklikləri
    const handleInputChange = (lang, value) => {
        setInputs(prev => ({ ...prev, [lang]: value }));
    };

    // 🔹 iconlar (placeholder, əslində burada sənin icon listin olacaq)
    const icons = [cat1, cat1, cat1, cat1, cat1, cat1];

    // 🔹 icon-u blob-a çevirmək üçün helper
    const getImageBlob = async (url) => {
        const response = await fetch(url);
        return await response.blob();
    };
    useEffect(() => {
        refetch()
    }, []);
    // 🔹 PUT sorğusu (update)
    const handleUpdate = async () => {
        if (!inputs.az.trim()) {
            showToast(t("adminPanel.categoryEdit.toast.emptyName"), "warning");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("id", category.id);
            formData.append("name", inputs.az);
            formData.append("nameRu", inputs.ru);
            formData.append("nameEng", inputs.en);

            if (activeIcon !== null) {
                const iconBlob = await getImageBlob(icons[activeIcon]);
                formData.append("categoryImage", iconBlob, `icon_${activeIcon}.svg`);
            } else {
                formData.append("categoryImage", category.categoryImage);
            }

            await putCategory(formData).unwrap(); // ✅ sadəcə formData göndər
            showToast(t("adminPanel.categoryEdit.toast.success"), "success");
            navigate('/admin/category');
            refetch()
        } catch (err) {
            console.error("Xəta PUT:", err);
            showToast(t("adminPanel.categoryEdit.toast.error"), "error");
        }
    };


    if (isFetching) return <p>{t("adminPanel.categoryEdit.loading")}</p>;

    return (
        <div id={'category-edit'}>
            <div className={'category-edit'}>
                <div className={"root"}>
                    <h2>
                        <NavLink className="link" to="/admin/category">{t("adminPanel.categoryEdit.breadcrumb.main")}</NavLink>
                        <img src={rootIcon} alt="" />
                        {t("adminPanel.categoryEdit.breadcrumb.sub")}
                    </h2>
                </div>
                <div className={'category-edit-head'}>
                    <h1>{t("adminPanel.categoryEdit.title")}</h1>
                    <p>{t("adminPanel.categoryEdit.description")}</p>
                </div>
                <div className={'category-edit-main'}>
                    <div className={'category-edit-data'}>
                        <div className={"dataDiv inputs"}>
                            <div className={'header'}>
                                <h3>{t("adminPanel.categoryEdit.nameTitle")}</h3>
                                <p>{t("adminPanel.categoryEdit.nameDescription")}</p>
                            </div>
                            <div className={'add-inputs'}>
                                <div className={'add-data'}>
                                    <div className={'add-input'}>
                                        <input
                                            value={inputs.az}
                                            onChange={e => handleInputChange("az", e.target.value)}
                                            placeholder={t("adminPanel.categoryEdit.placeholders.az")}
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
                                            placeholder={t("adminPanel.categoryEdit.placeholders.ru")}
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
                                            placeholder={t("adminPanel.categoryEdit.placeholders.en")}
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
                                <h3>{t("adminPanel.categoryEdit.iconTitle")}</h3>
                                <p>{t("adminPanel.categoryEdit.iconDescription")}</p>
                            </div>
                            <div className={'addCategory'}>
                                {icons.map((icon, index) => (
                                    <div
                                        key={index}
                                        className={`iconDiv ${activeIcon === index ? 'active' : ''}`}
                                        onClick={() => setActiveIcon(index)}
                                    >
                                        <img src={icon} alt="category-icon" />
                                    </div>
                                ))}

                                {/* Mövcud backend şəkli göstərmək */}
                                {activeIcon === null && category?.categoryImage && (
                                    <div className="iconDiv active">
                                        <img src={CATEGORY_IMAGES+ category.categoryImage} alt="current-icon" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <button onClick={handleUpdate} disabled={isUpdating}>
                        {isUpdating
                            ? t("adminPanel.categoryEdit.buttons.updating")
                            : t("adminPanel.categoryEdit.buttons.save")}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CategoryEdit;