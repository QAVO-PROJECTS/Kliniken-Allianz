import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { usePostCategoryMutation } from "../../../../api/userApi.js";
import showToast from "../../../../utils/toast.js";
import AdminPageHeader from "../../../../components/admin/AdminPageHeader/index.jsx";
import { FormFooter, FormSection, LangField } from "../../../../components/admin/FormKit/index.jsx";
import { useOptionalT } from "../../../../components/admin/shared/adminStrings.js";
import { CATEGORY_ICONS, getIconBlob } from "../categoryIcons.js";

const EMPTY = { az: "", ru: "", en: "", de: "", ar: "" };
const LANG_ORDER = ["az", "ru", "en", "de", "ar"];

function CategoryAdd() {
    const { t } = useTranslation();
    const ot = useOptionalT();
    const navigate = useNavigate();
    const [postCategory, { isLoading }] = usePostCategoryMutation();
    const [inputs, setInputs] = useState(EMPTY);
    const [activeIcon, setActiveIcon] = useState(null);

    const handleInputChange = (lang, value) => setInputs((prev) => ({ ...prev, [lang]: value }));

    const handleSubmit = async (e) => {
        e?.preventDefault();
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
            const iconBlob = await getIconBlob(CATEGORY_ICONS[activeIcon]);
            formData.append("categoryImage", iconBlob, `icon_${activeIcon}.svg`);
            await postCategory(formData).unwrap();
            showToast(t("adminPanel.categoryAdd.toast.success"), "success");
            setInputs(EMPTY);
            setActiveIcon(null);
            navigate("/admin/category");
        } catch {
            showToast(t("adminPanel.categoryAdd.toast.error"), "error");
        }
    };

    return (
        <form className="adm-form" onSubmit={handleSubmit} noValidate>
            <AdminPageHeader
                crumbs={[
                    { label: t("adminPanel.categoryAdd.breadcrumb.main"), to: "/admin/category" },
                    { label: t("adminPanel.categoryAdd.breadcrumb.sub") },
                ]}
                title={t("adminPanel.categoryAdd.title")}
                description={t("adminPanel.categoryAdd.description")}
            />
            <div className="adm-form-grid">
                <FormSection title={t("adminPanel.categoryAdd.nameTitle")} description={t("adminPanel.categoryAdd.nameDescription")}>
                    {LANG_ORDER.map((lang) => (
                        <LangField
                            key={lang}
                            lang={lang}
                            required={lang === "az"}
                            value={inputs[lang]}
                            onChange={(e) => handleInputChange(lang, e.target.value)}
                            placeholder={ot(`adminPanel.categoryAdd.placeholders.${lang}`)}
                        />
                    ))}
                </FormSection>
                <FormSection title={t("adminPanel.categoryAdd.iconTitle")} description={t("adminPanel.categoryAdd.iconDescription")}>
                    <div className="adm-icon-picker" role="radiogroup" aria-label={t("adminPanel.categoryAdd.iconTitle")}>
                        {CATEGORY_ICONS.map((icon, index) => (
                            <button
                                key={icon}
                                type="button"
                                role="radio"
                                aria-checked={activeIcon === index}
                                aria-label={`${t("adminPanel.categoryAdd.iconTitle")} ${index + 1}`}
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
                saving={isLoading}
                saveLabel={t("adminPanel.categoryAdd.buttons.save")}
                savingLabel={t("adminPanel.categoryAdd.buttons.loading")}
            />
        </form>
    );
}

export default CategoryAdd;
