import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Loader2 } from "lucide-react";
import {
    useGetAllClinicQuery,
    useGetCategoryByIdQuery,
    useGetServiceByIdQuery,
    usePutServiceMutation,
} from "../../../../api/userApi.js";
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

function CategoryServisEdit() {
    const { t, i18n } = useTranslation();
    const { id } = useParams();
    const { data: getServiceById, isLoading } = useGetServiceByIdQuery(id);
    const service = getServiceById?.data;
    const categoryId = service?.categoryId;
    const { data: getCategoryById } = useGetCategoryByIdQuery(categoryId, { skip: !categoryId });
    const category = getCategoryById?.data;
    const { data: getAllClinic } = useGetAllClinicQuery();
    const clinics = getAllClinic?.data;
    const [putService, { isLoading: isUpdating }] = usePutServiceMutation();
    const navigate = useNavigate();
    const [inputs, setInputs] = useState({ az: "", ru: "", en: "", de: "", ar: "" });
    const [descriptions, setDescriptions] = useState({ az: "", ru: "", en: "", de: "", ar: "" });
    const [selectedClinics, setSelectedClinics] = useState([]);
    // Clinics linked on the server; ones unticked here are sent as deleteClinicServices.
    const [initialClinics, setInitialClinics] = useState([]);

    useEffect(() => {
        if (service) {
            setInputs({
                az: service.name || "",
                ru: service.nameRu || "",
                en: service.nameEng || "",
                de: service.nameAlm || "",
                ar: service.nameArab || "",
            });
            setDescriptions({
                az: service.description || "",
                ru: service.descriptionRu || "",
                en: service.descriptionEng || "",
                de: service.descriptionAlm || "",
                ar: service.descriptionArab || "",
            });
            const clinicIds = service.clinics?.map((c) => c.id) || [];
            setSelectedClinics(clinicIds);
            setInitialClinics(clinicIds);
        }
    }, [service]);

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
            showToast(t("adminPanel.categoryServiceEdit.toast.emptyName"), "warning");
            return;
        }

        if (!service?.categoryId) {
            showToast(t("adminPanel.categoryServiceEdit.toast.noCategoryId"), "error");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("id", id);
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
            formData.append("categoryId", service.categoryId);

            selectedClinics.forEach((clinicId) => {
                formData.append("clinicServices", clinicId);
            });

            initialClinics
                .filter((clinicId) => !selectedClinics.includes(clinicId))
                .forEach((clinicId) => {
                    formData.append("deleteClinicServices", clinicId);
                });

            await putService(formData).unwrap();
            showToast(t("adminPanel.categoryServiceEdit.toast.success"), "success");
            navigate(`/admin/category/servis/${service.categoryId}`);
        } catch {
            showToast(t("adminPanel.categoryServiceEdit.toast.error"), "error");
        }
    };

    if (isLoading) {
        return (
            <div className="adm-loading" role="status">
                <Loader2 size={20} aria-hidden="true" />
                {t("adminPanel.categoryServiceEdit.loading")}
            </div>
        );
    }

    const categoryName = getLocalizedText(category, "name", i18n.language);
    const servicesPath = categoryId ? `/admin/category/servis/${categoryId}` : "/admin/category";
    const clinicItems = (clinics || []).map((clinic) => ({
        id: clinic.id,
        label: getLocalizedText(clinic, "name", i18n.language) || clinic.name,
    }));

    return (
        <form className="adm-form" onSubmit={handleSubmit} noValidate>
            <AdminPageHeader
                crumbs={[
                    { label: t("adminPanel.categoryServiceEdit.breadcrumb.main"), to: "/admin/category" },
                    { label: categoryName || "…", to: servicesPath },
                    { label: t("adminPanel.categoryServiceEdit.breadcrumb.sub") },
                ]}
                title={t("adminPanel.categoryServiceEdit.title")}
                description={t("adminPanel.categoryServiceEdit.description")}
            />
            <div className="adm-form-grid">
                <FormSection
                    title={t("adminPanel.categoryServiceEdit.nameTitle")}
                    description={t("adminPanel.categoryServiceEdit.nameDescription")}
                >
                    {LANGS.map(([lang, suffix]) => (
                        <LangField
                            key={lang}
                            lang={lang}
                            required={lang === "az"}
                            value={inputs[lang]}
                            onChange={(e) => handleInputChange(lang, e.target.value)}
                            placeholder={t(`adminPanel.categoryServiceEdit.placeholders.name${suffix}`)}
                        />
                    ))}
                </FormSection>

                <FormSection
                    title={t("adminPanel.categoryServiceEdit.clinicTitle")}
                    description={t("adminPanel.categoryServiceEdit.clinicDescription")}
                >
                    <CheckList items={clinicItems} selected={selectedClinics} onToggle={toggleClinic} />
                </FormSection>

                <FormSection
                    wide
                    title={t("adminPanel.categoryServiceEdit.descTitle")}
                    description={t("adminPanel.categoryServiceEdit.descDescription")}
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
                                placeholder={t(`adminPanel.categoryServiceEdit.placeholders.desc${suffix}`)}
                            />
                        ))}
                    </div>
                </FormSection>
            </div>
            <FormFooter
                cancelTo={servicesPath}
                saving={isUpdating}
                saveLabel={t("adminPanel.categoryServiceEdit.buttons.save")}
                savingLabel={t("adminPanel.categoryServiceEdit.buttons.updating")}
            />
        </form>
    );
}

export default CategoryServisEdit;
