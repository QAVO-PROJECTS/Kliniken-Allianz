import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useGetAllClinicQuery, useGetCategoryByIdQuery, usePostServiceMutation } from "../../../../api/userApi.js";
import { getLocalizedText } from "../../../../i18n/getLocalizedText.js";
import showToast from "../../../../utils/toast.js";
import AdminPageHeader from "../../../../components/admin/AdminPageHeader/index.jsx";
import { CheckList, FormFooter, FormSection, LangField } from "../../../../components/admin/FormKit/index.jsx";

const LANGS = [
    ["az", "Az"],
    ["ru", "Ru"],
    ["en", "En"],
    ["de", "De"],
    ["ar", "Ar"],
];
const EMPTY = { az: "", ru: "", en: "", de: "", ar: "" };

function CategoryServisAdd() {
    const { t, i18n } = useTranslation();
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: getCategoryById } = useGetCategoryByIdQuery(id);
    const category = getCategoryById?.data;
    const { data: getAllClinic, isLoading: isLoadingClinics } = useGetAllClinicQuery();
    const clinics = getAllClinic?.data;
    const [postServis, { isLoading }] = usePostServiceMutation();
    const [inputs, setInputs] = useState(EMPTY);
    const [descriptions, setDescriptions] = useState(EMPTY);
    const [selectedClinics, setSelectedClinics] = useState([]);

    const handleInputChange = (lang, value) => {
        setInputs((prev) => ({ ...prev, [lang]: value }));
    };

    const handleDescriptionChange = (lang, value) => {
        setDescriptions((prev) => ({ ...prev, [lang]: value }));
    };

    const toggleClinic = (clinicId) => {
        setSelectedClinics((prev) =>
            prev.includes(clinicId) ? prev.filter((cid) => cid !== clinicId) : [...prev, clinicId],
        );
    };

    const handleSubmit = async (e) => {
        e?.preventDefault();
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
            formData.append("nameAlm", inputs.de);
            formData.append("nameArab", inputs.ar);
            formData.append("description", descriptions.az);
            formData.append("descriptionRu", descriptions.ru);
            formData.append("descriptionEng", descriptions.en);
            formData.append("descriptionAlm", descriptions.de);
            formData.append("descriptionArab", descriptions.ar);

            selectedClinics.forEach((clinicId) => {
                formData.append("clinicServiceIds", clinicId);
            });

            await postServis(formData).unwrap();
            showToast(t("adminPanel.categoryServisAdd.toast.success"), "success");

            setInputs(EMPTY);
            setDescriptions(EMPTY);
            setSelectedClinics([]);
            navigate(`/admin/category/servis/${id}`);
        } catch {
            showToast(t("adminPanel.categoryServisAdd.toast.error"), "error");
        }
    };

    const categoryName = getLocalizedText(category, "name", i18n.language);
    const clinicItems = (clinics || []).map((clinic) => ({
        id: clinic.id,
        label: getLocalizedText(clinic, "name", i18n.language) || clinic.name,
    }));

    return (
        <form className="adm-form" onSubmit={handleSubmit} noValidate>
            <AdminPageHeader
                crumbs={[
                    { label: t("adminPanel.categoryServisAdd.breadcrumb.main"), to: "/admin/category" },
                    { label: categoryName || "…", to: `/admin/category/servis/${id}` },
                    { label: t("adminPanel.categoryServisAdd.breadcrumb.sub") },
                ]}
                title={t("adminPanel.categoryServisAdd.title")}
                description={t("adminPanel.categoryServisAdd.description")}
            />
            <div className="adm-form-grid">
                <FormSection
                    title={t("adminPanel.categoryServisAdd.nameTitle")}
                    description={t("adminPanel.categoryServisAdd.nameDescription")}
                >
                    {LANGS.map(([lang, suffix]) => (
                        <LangField
                            key={lang}
                            lang={lang}
                            required={lang === "az"}
                            value={inputs[lang]}
                            onChange={(e) => handleInputChange(lang, e.target.value)}
                            placeholder={t(`adminPanel.categoryServisAdd.placeholders.name${suffix}`)}
                        />
                    ))}
                </FormSection>

                <FormSection
                    title={t("adminPanel.categoryServisAdd.clinicTitle")}
                    description={t("adminPanel.categoryServisAdd.clinicDescription")}
                >
                    {clinicItems.length > 0 ? (
                        <CheckList items={clinicItems} selected={selectedClinics} onToggle={toggleClinic} />
                    ) : (
                        !isLoadingClinics && <p className="adm-hint">{t("adminPanel.categoryServisAdd.noClinic")}</p>
                    )}
                </FormSection>

                <FormSection
                    wide
                    title={t("adminPanel.categoryServisAdd.descTitle")}
                    description={t("adminPanel.categoryServisAdd.descDescription")}
                >
                    <div className="adm-grid">
                        {LANGS.map(([lang, suffix]) => (
                            <LangField
                                key={lang}
                                lang={lang}
                                multiline
                                rows={5}
                                wide={lang === "ar"}
                                value={descriptions[lang]}
                                onChange={(e) => handleDescriptionChange(lang, e.target.value)}
                                placeholder={t(`adminPanel.categoryServisAdd.placeholders.desc${suffix}`)}
                            />
                        ))}
                    </div>
                </FormSection>
            </div>
            <FormFooter
                cancelTo={`/admin/category/servis/${id}`}
                saving={isLoading}
                saveLabel={t("adminPanel.categoryServisAdd.buttons.save")}
                savingLabel={t("adminPanel.categoryServisAdd.buttons.loading")}
            />
        </form>
    );
}

export default CategoryServisAdd;
