import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Loader2 } from "lucide-react";
import { useGetCategoryByIdQuery, usePutCategoryMutation } from "../../../../api/userApi.js";
import { CATEGORY_IMAGES } from "../../../../config/mediaUrls.js";
import showToast from "../../../../utils/toast.js";
import AdminPageHeader from "../../../../components/admin/AdminPageHeader/index.jsx";
import { FormFooter, FormSection, LangField } from "../../../../components/admin/FormKit/index.jsx";
import { useAdminT, useOptionalT } from "../../../../components/admin/shared/adminStrings.js";
import { CATEGORY_ICONS, getIconBlob } from "../categoryIcons.js";

const LANG_ORDER = ["az", "ru", "en", "de", "ar"];

function CategoryEdit() {
    const { t } = useTranslation();
    const at = useAdminT();
    const ot = useOptionalT();
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: getCategoryById, isLoading: isFetching, refetch } = useGetCategoryByIdQuery(id);
    const category = getCategoryById?.data;
    const [putCategory, { isLoading: isUpdating }] = usePutCategoryMutation();

    const [inputs, setInputs] = useState({ az: "", ru: "", en: "", de: "", ar: "" });
    const [activeIcon, setActiveIcon] = useState(null);

    useEffect(() => {
        if (category) {
            setInputs({
                az: category.name || "",
                ru: category.nameRu || "",
                en: category.nameEng || "",
                de: category.nameAlm || "",
                ar: category.nameArab || "",
            });
        }
    }, [category]);

    useEffect(() => {
        refetch();
    }, [refetch]);

    const handleInputChange = (lang, value) => setInputs((prev) => ({ ...prev, [lang]: value }));

    const handleUpdate = async (e) => {
        e?.preventDefault();
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
            formData.append("nameAlm", inputs.de);
            formData.append("nameArab", inputs.ar);
            if (activeIcon !== null) {
                const iconBlob = await getIconBlob(CATEGORY_ICONS[activeIcon]);
                formData.append("categoryImage", iconBlob, `icon_${activeIcon}.svg`);
            } else {
                formData.append("categoryImage", category.categoryImage);
            }
            await putCategory(formData).unwrap();
            showToast(t("adminPanel.categoryEdit.toast.success"), "success");
            navigate("/admin/category");
            refetch();
        } catch {
            showToast(t("adminPanel.categoryEdit.toast.error"), "error");
        }
    };

    if (isFetching) {
        return (
            <div className="adm-loading" role="status">
                <Loader2 size={20} aria-hidden="true" />
                {t("adminPanel.categoryEdit.loading")}
            </div>
        );
    }

    return (
        <form className="adm-form" onSubmit={handleUpdate} noValidate>
            <AdminPageHeader
                crumbs={[
                    { label: t("adminPanel.categoryEdit.breadcrumb.main"), to: "/admin/category" },
                    { label: t("adminPanel.categoryEdit.breadcrumb.sub") },
                ]}
                title={t("adminPanel.categoryEdit.title")}
                description={t("adminPanel.categoryEdit.description")}
            />
            <div className="adm-form-grid">
                <FormSection title={t("adminPanel.categoryEdit.nameTitle")} description={t("adminPanel.categoryEdit.nameDescription")}>
                    {LANG_ORDER.map((lang) => (
                        <LangField
                            key={lang}
                            lang={lang}
                            required={lang === "az"}
                            value={inputs[lang]}
                            onChange={(e) => handleInputChange(lang, e.target.value)}
                            placeholder={ot(`adminPanel.categoryEdit.placeholders.${lang}`)}
                        />
                    ))}
                </FormSection>
                <FormSection title={t("adminPanel.categoryEdit.iconTitle")} description={t("adminPanel.categoryEdit.iconDescription")}>
                    {category?.categoryImage && (
                        <div className="adm-current-icon">
                            <img
                                className="adm-thumb adm-thumb--icon"
                                src={CATEGORY_IMAGES + category.categoryImage}
                                alt=""
                            />
                            <span>
                                {at("current")}
                                {activeIcon !== null && <span className="badge badge--brand">→ {at("newFile")}</span>}
                            </span>
                        </div>
                    )}
                    <div className="adm-icon-picker" role="radiogroup" aria-label={t("adminPanel.categoryEdit.iconTitle")}>
                        {CATEGORY_ICONS.map((icon, index) => (
                            <button
                                key={icon}
                                type="button"
                                role="radio"
                                aria-checked={activeIcon === index}
                                aria-label={`${t("adminPanel.categoryEdit.iconTitle")} ${index + 1}`}
                                className="adm-icon-picker__item"
                                onClick={() => setActiveIcon(index)}
                            >
                                <img src={icon} alt="" />
                            </button>
                        ))}
                    </div>
                </FormSection>
            </div>
            <FormFooter
                cancelTo="/admin/category"
                saving={isUpdating}
                saveLabel={t("adminPanel.categoryEdit.buttons.save")}
                savingLabel={t("adminPanel.categoryEdit.buttons.updating")}
            />
        </form>
    );
}

export default CategoryEdit;
