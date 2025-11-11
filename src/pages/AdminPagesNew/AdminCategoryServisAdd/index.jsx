import './index.scss'
import {NavLink, useNavigate, useParams} from "react-router-dom";
import rootIcon from '/src/assets/rootIcon.svg'
import rootIcongri from '/src/assets/adminNavİcon2.svg'
import aze from '/src/assets/azerbaijan.svg'
import rus from '/src/assets/russia.svg'
import usa from '/src/assets/unitedstates.svg'
import ger from '/src/assets/germany.svg'
import arb from '/src/assets/unitedarabemirates.svg'
import cat1 from "../../../assets/Servis/cat1.svg";
import {useState} from "react";
import {useGetAllClinicQuery, useGetCategoryByIdQuery, usePostServiceMutation} from "../../../services/userApi.jsx";
import showToast from "../../../components/ToastMessage.js";
import {useTranslation} from "react-i18next";

function CategoryServisAdd() {
    const { t } = useTranslation();
    const {id} = useParams();
    const navigate = useNavigate();
    const { data: getCategoryById } = useGetCategoryByIdQuery(id);
    const category = getCategoryById?.data;
    const {data:getAllClinic} = useGetAllClinicQuery()
    const clinics = getAllClinic?.data
    const [postServis, { isLoading }] = usePostServiceMutation()
    const [inputs, setInputs] = useState({
        az: "",
        ru: "",
        en: "",
    });

    const [descriptions, setDescriptions] = useState({
        az: "",
        ru: "",
        en: "",
    });

    // 🔹 seçilmiş klinikalar
    const [selectedClinics, setSelectedClinics] = useState([]);

    // 🔹 input dəyişiklikləri
    const handleInputChange = (lang, value) => {
        setInputs(prev => ({ ...prev, [lang]: value }));
    };

    const handleDescriptionChange = (lang, value) => {
        setDescriptions(prev => ({ ...prev, [lang]: value }));
    };

    // 🔹 POST sorğusu
    const handleSubmit = async () => {
        if (!inputs.az.trim()) {
            showToast(t("adminPanel.categoryServisAdd.toast.emptyName"), "warning");
            return;
        }

        if (!id) {
            showToast(t("adminPanel.categoryServisAdd.toast.noCategoryId"), "error");
            return;
        }

        if (selectedClinics.length === 0) {
            showToast(t("adminPanel.categoryServisAdd.toast.noClinic"), "warning");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("categoryId", id);
            formData.append("name", inputs.az);
            formData.append("nameRu", inputs.ru);
            formData.append("nameEng", inputs.en);
            formData.append("description", descriptions.az);
            formData.append("descriptionRu", descriptions.ru);
            formData.append("descriptionEng", descriptions.en);

            // 🔹 Hər bir clinic ID-ni ayrıca əlavə et
            selectedClinics.forEach((clinicId) => {
                formData.append("clinicServiceIds", clinicId);
            });

            await postServis(formData).unwrap();
            showToast(t("adminPanel.categoryServisAdd.toast.success"), "success");

            // reset
            setInputs({ az: "", ru: "", en: "" });
            setDescriptions({ az: "", ru: "", en: "" });
            setSelectedClinics([]);
            navigate(`/admin/category/servis/${id}`)
        } catch (err) {
            console.error("Xəta:", err);
            showToast(t("adminPanel.categoryServisAdd.toast.error"), "error");
        }
    };

    // 🔹 checkbox seçimi
    const toggleClinic = (id) => {
        setSelectedClinics((prev) =>
            prev.includes(id)
                ? prev.filter((cid) => cid !== id)
                : [...prev, id]
        );
    };

    return (
        <div id={'category-servis-add'}>
            <div className={'category-servis-add'}>
                <div className={"root"}>
                    <h2>
                        <NavLink className="link" to="/admin/category">{t("adminPanel.categoryServisAdd.breadcrumb.main")}</NavLink>
                        <img src={rootIcongri} alt=""/>
                        <NavLink className="link" to={`/admin/category/servis/${id}`}>{category?.name || "Kateqoriya"}</NavLink>
                        <img src={rootIcon} alt=""/>
                        {t("adminPanel.categoryServisAdd.breadcrumb.sub")}
                    </h2>
                </div>
                <div className={'category-servis-add-head'}>
                    <h1>{t("adminPanel.categoryServisAdd.title")}</h1>
                    <p>{t("adminPanel.categoryServisAdd.description")}</p>
                </div>
                <div className={'category-servis-add-main'}>
                    <div className={'category-servis-add-data'}>
                        <div className={"dataDiv inputs"}>
                            <div className={'header'}>
                                <h3>{t("adminPanel.categoryServisAdd.nameTitle")}</h3>
                                <p>{t("adminPanel.categoryServisAdd.nameDescription")}</p>
                            </div>
                            <div className={'add-inputs'}>
                                <div className={'add-data'}>
                                    <div className={'add-input'}>
                                        <input
                                            value={inputs.az}
                                            onChange={e => handleInputChange("az", e.target.value)}
                                            placeholder={t("adminPanel.categoryServisAdd.placeholders.nameAz")}
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
                                            placeholder={t("adminPanel.categoryServisAdd.placeholders.nameRu")}
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
                                            placeholder={t("adminPanel.categoryServisAdd.placeholders.nameEn")}
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
                                {/*        <img src={ger} alt=""/>*/}
                                {/*    </div>*/}
                                {/*</div>*/}
                                {/*<div className={'add-data'}>*/}
                                {/*    <div className={'add-input'}>*/}
                                {/*        <input placeholder={'Travmatologiya'}/>*/}
                                {/*    </div>*/}
                                {/*    <div className={'langCountry'}>*/}
                                {/*        <img src={arb} alt=""/>*/}
                                {/*    </div>*/}
                                {/*</div>*/}
                            </div>
                        </div>
                        <div className={"dataDiv images"}>
                            <div className={'header'}>
                                <h3>{t("adminPanel.categoryServisAdd.clinicTitle")}</h3>
                                <p>{t("adminPanel.categoryServisAdd.clinicDescription")}</p>
                            </div>
                            <div className={'addCategory'}>
                                {clinics?.length > 0 ? (
                                    clinics?.map((item) => (
                                        <label key={item.id} className="checkboxItem">
                                            <input
                                                type="checkbox"
                                                checked={selectedClinics.includes(item.id)}
                                                onChange={() => toggleClinic(item.id)}
                                            />
                                            <span>{item.name}</span>
                                        </label>
                                    ))
                                ) : (
                                    <p>{t("adminPanel.categoryServisAdd.noClinic")}</p>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className={'category-servis-desc'}>
                        <div className={'header'}>
                            <h3>{t("adminPanel.categoryServisAdd.descTitle")}</h3>
                            <p>{t("adminPanel.categoryServisAdd.descDescription")}</p>
                        </div>
                        <div className={'category-servis-desc-data'}>
                            <div className={'category-servis-desc-texts'}>
                                <textarea
                                    value={descriptions.az}
                                    onChange={e => handleDescriptionChange("az", e.target.value)}
                                    placeholder={t("adminPanel.categoryServisAdd.placeholders.descAz")}
                                />
                                <div className={'langCountry'}>
                                    <img src={aze} alt="" />
                                </div>
                            </div>

                            <div className={'category-servis-desc-texts'}>
                                <textarea
                                    value={descriptions.ru}
                                    onChange={e => handleDescriptionChange("ru", e.target.value)}
                                    placeholder={t("adminPanel.categoryServisAdd.placeholders.descRu")}
                                />
                                <div className={'langCountry'}>
                                    <img src={rus} alt="" />
                                </div>
                            </div>

                            <div className={'category-servis-desc-texts'}>
                                <textarea
                                    value={descriptions.en}
                                    onChange={e => handleDescriptionChange("en", e.target.value)}
                                    placeholder={t("adminPanel.categoryServisAdd.placeholders.descEn")}
                                />
                                <div className={'langCountry'}>
                                    <img src={usa} alt="" />
                                </div>
                            </div>
                            {/*<div className={'category-servis-desc-texts'}>*/}
                            {/*    <textarea  placeholder={'Təsvir əlavə edin...'}/>*/}
                            {/*    <div className={'langCountry'}>*/}
                            {/*        <img src={ger} alt=""/>*/}
                            {/*    </div>*/}
                            {/*</div>*/}
                            {/*<div className={'category-servis-desc-texts'}>*/}
                            {/*    <textarea  placeholder={'Təsvir əlavə edin...'}/>*/}
                            {/*    <div className={'langCountry'}>*/}
                            {/*        <img src={arb} alt=""/>*/}
                            {/*    </div>*/}
                            {/*</div>*/}
                        </div>
                    </div>
                    <button onClick={handleSubmit} disabled={isLoading}>
                        {isLoading
                            ? t("adminPanel.categoryServisAdd.buttons.loading")
                            : t("adminPanel.categoryServisAdd.buttons.save")}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CategoryServisAdd;