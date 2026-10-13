import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Plus, Video, X } from "lucide-react";
import {
    useGetAllDoctorsQuery,
    useGetAllOtelsQuery,
    useGetAllServiceQuery,
    usePostClinicMutation,
} from "../../../../api/userApi.js";
import showToast from "../../../../utils/toast.js";
import AdminPageHeader from "../../../../components/admin/AdminPageHeader/index.jsx";
import IconButton from "../../../../components/admin/IconButton/index.jsx";
import { CheckList, FormFooter, FormSection, LangField } from "../../../../components/admin/FormKit/index.jsx";
import { Dropzone, FilePreview, PreviewGrid } from "../../../../components/admin/Dropzone/index.jsx";
import { useAdminT } from "../../../../components/admin/shared/adminStrings.js";

const LANG_ORDER = ["az", "ru", "en", "de", "ar"];
// Placeholder key suffix (adminPanel.clinicAdd.placeholders.name<Suffix>) and FormData field suffix per language.
const PH_SUFFIX = { az: "Az", ru: "Ru", en: "En", de: "Alm", ar: "Arab" };
const FIELD_SUFFIX = { az: "", ru: "Ru", en: "Eng", de: "Alm", ar: "Arab" };
const EMPTY = { az: "", ru: "", en: "", de: "", ar: "" };
const GERMANY_LOCATION = { az: "Almaniya", ru: "Германия", en: "Germany", de: "Deutschland", ar: "ألمانيا" };

// Checkbox cards for a related entity list, or a short note once it has loaded empty.
function RelationList({ result, selected, onToggle, emptyText }) {
    if (result && !result.data?.length) return <p className="text-muted">{emptyText}</p>;
    return (
        <CheckList
            items={result?.data?.map((item) => ({ id: item.id, label: item.name }))}
            selected={selected}
            onToggle={onToggle}
        />
    );
}

function ClinicAdd({ isGermany }) {
    const { t } = useTranslation();
    const at = useAdminT();
    const navigate = useNavigate();
    const listPath = isGermany ? "/admin/germany-clinic" : "/admin/clinic";

    const [postClinic, { isLoading }] = usePostClinicMutation();
    const { data: getAllService } = useGetAllServiceQuery();
    const { data: getAllOtels } = useGetAllOtelsQuery();
    const { data: getAllDoctors } = useGetAllDoctorsQuery();

    const [names, setNames] = useState(EMPTY);
    const [descs, setDescs] = useState(EMPTY);
    const [locations, setLocations] = useState(isGermany ? GERMANY_LOCATION : EMPTY);

    const [selectedFile, setSelectedFile] = useState(null);
    const [sertifikatFiles, setSertifikatFiles] = useState([]);
    const [galereyaFiles, setGalereyaFiles] = useState([]);
    const [clinicVideos, setClinicVideos] = useState([]);
    const [videoInput, setVideoInput] = useState("");

    const [selectedServices, setSelectedServices] = useState([]);
    const [selectedDoctors, setSelectedDoctors] = useState([]);
    const [selectedOtels, setSelectedOtels] = useState([]);

    const setLang = (setter, lang) => (e) => setter((prev) => ({ ...prev, [lang]: e.target.value }));
    const toggle = (setList) => (id) =>
        setList((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    const removeAt = (setList, index) => setList((prev) => prev.filter((_, i) => i !== index));

    const addVideo = () => {
        const trimmed = videoInput.trim();
        if (!trimmed) return;
        setClinicVideos((prev) => [...prev, trimmed]);
        setVideoInput("");
    };

    const handleSubmit = async (e) => {
        e?.preventDefault();
        if (!selectedFile) {
            showToast(t("adminPanel.clinicAdd.toast.noMainImage"), "warning");
            return;
        }

        const formData = new FormData();
        LANG_ORDER.forEach((lang) => {
            formData.append(`Name${FIELD_SUFFIX[lang]}`, names[lang]);
            formData.append(`Description${FIELD_SUFFIX[lang]}`, descs[lang]);
            formData.append(`Location${FIELD_SUFFIX[lang]}`, locations[lang]);
        });
        formData.append("ClinicCardImage", selectedFile);
        sertifikatFiles.forEach((file) => formData.append("ClinicSertificates", file));
        galereyaFiles.forEach((file) => formData.append("ClinicImages", file));
        selectedServices.forEach((id) => formData.append("ClinicServiceIds", id));
        selectedDoctors.forEach((id) => formData.append("DoctorIds", id));
        selectedOtels.forEach((id) => formData.append("OtelIds", id));
        clinicVideos.forEach((url) => formData.append("ClinicVideos", url));

        try {
            await postClinic(formData).unwrap();
            showToast(t("adminPanel.clinicAdd.toast.success"), "success");
            setNames(EMPTY);
            setDescs(EMPTY);
            setLocations(EMPTY);
            setSelectedFile(null);
            setSertifikatFiles([]);
            setGalereyaFiles([]);
            setSelectedServices([]);
            setSelectedDoctors([]);
            setSelectedOtels([]);
            setClinicVideos([]);
            setVideoInput("");
            navigate(listPath);
        } catch {
            showToast(t("adminPanel.clinicAdd.toast.error"), "error");
        }
    };

    const langFields = (prefix, values, setter, extra = {}) =>
        LANG_ORDER.map((lang) => (
            <LangField
                key={lang}
                lang={lang}
                value={values[lang]}
                onChange={setLang(setter, lang)}
                placeholder={t(`adminPanel.clinicAdd.placeholders.${prefix}${PH_SUFFIX[lang]}`)}
                wide={extra.multiline && lang === "ar"}
                {...extra}
            />
        ));

    return (
        <form className="adm-form" onSubmit={handleSubmit} noValidate>
            <AdminPageHeader
                crumbs={[
                    {
                        label: isGermany ? t("adminPanel.leftBar.menu.clinicGermany") : t("adminPanel.clinicAdd.breadcrumb.main"),
                        to: listPath,
                    },
                    { label: t("adminPanel.clinicAdd.breadcrumb.sub") },
                ]}
                title={t("adminPanel.clinicAdd.title")}
                description={t("adminPanel.clinicAdd.description")}
            />
            <div className="adm-form-grid">
                <FormSection title={t("adminPanel.clinicAdd.nameTitle")} description={t("adminPanel.clinicAdd.nameDescription")}>
                    {langFields("name", names, setNames)}
                </FormSection>

                <FormSection title={t("adminPanel.clinicAdd.locationTitle")} description={t("adminPanel.clinicAdd.locationDescription")}>
                    {langFields("location", locations, setLocations)}
                </FormSection>

                <FormSection title={t("adminPanel.clinicAdd.imageTitle")} description={t("adminPanel.clinicAdd.imageDescription")}>
                    <Dropzone onFiles={([file]) => setSelectedFile(file)} />
                    {selectedFile && (
                        <FilePreview file={selectedFile} badge={at("newFile")} single onRemove={() => setSelectedFile(null)} />
                    )}
                </FormSection>

                <FormSection title={t("adminPanel.clinicAdd.videosTitle")} description={t("adminPanel.clinicAdd.videosDescription")}>
                    <div className="adm-inline">
                        <input
                            className="adm-input"
                            type="url"
                            inputMode="url"
                            aria-label={t("adminPanel.clinicAdd.videosTitle")}
                            placeholder={t("adminPanel.clinicAdd.placeholders.videoUrl")}
                            value={videoInput}
                            onChange={(e) => setVideoInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    addVideo();
                                }
                            }}
                        />
                        <button type="button" className="btn btn--secondary" onClick={addVideo}>
                            <Plus size={16} aria-hidden="true" />
                            {t("adminPanel.clinicAdd.buttons.addVideo")}
                        </button>
                    </div>
                    {clinicVideos.length > 0 && (
                        <ul className="adm-list">
                            {clinicVideos.map((url, index) => (
                                <li key={`${url}-${index}`} className="adm-list__item">
                                    <Video size={16} aria-hidden="true" />
                                    <a href={url} target="_blank" rel="noreferrer">{url}</a>
                                    <IconButton icon={X} label={at("remove")} onClick={() => removeAt(setClinicVideos, index)} />
                                </li>
                            ))}
                        </ul>
                    )}
                </FormSection>

                <FormSection wide title={t("adminPanel.clinicAdd.descTitle")} description={t("adminPanel.clinicAdd.descDescription")}>
                    <div className="adm-grid">
                        {langFields("desc", descs, setDescs, { multiline: true, rows: 5 })}
                    </div>
                </FormSection>

                <FormSection wide title={t("adminPanel.clinicAdd.servicesTitle")} description={t("adminPanel.clinicAdd.servicesDescription")}>
                    <RelationList result={getAllService} selected={selectedServices} onToggle={toggle(setSelectedServices)} emptyText={at("noData")} />
                </FormSection>

                <FormSection title={t("adminPanel.clinicAdd.doctorsTitle")} description={t("adminPanel.clinicAdd.doctorsDescription")}>
                    <RelationList result={getAllDoctors} selected={selectedDoctors} onToggle={toggle(setSelectedDoctors)} emptyText={at("noData")} />
                </FormSection>

                <FormSection title={t("adminPanel.clinicAdd.hotelsTitle")} description={t("adminPanel.clinicAdd.hotelsDescription")}>
                    <RelationList result={getAllOtels} selected={selectedOtels} onToggle={toggle(setSelectedOtels)} emptyText={at("noData")} />
                </FormSection>

                <FormSection title={t("adminPanel.clinicAdd.certificateTitle")} description={t("adminPanel.clinicAdd.certificateDescription")}>
                    <Dropzone multiple compact onFiles={(files) => setSertifikatFiles((prev) => [...prev, ...files])} />
                    {sertifikatFiles.length > 0 && (
                        <PreviewGrid>
                            {sertifikatFiles.map((file, index) => (
                                <FilePreview
                                    key={`${file.name}-${file.lastModified}-${index}`}
                                    file={file}
                                    onRemove={() => removeAt(setSertifikatFiles, index)}
                                />
                            ))}
                        </PreviewGrid>
                    )}
                </FormSection>

                <FormSection title={t("adminPanel.clinicAdd.galleryTitle")} description={t("adminPanel.clinicAdd.galleryDescription")}>
                    <Dropzone multiple compact onFiles={(files) => setGalereyaFiles((prev) => [...prev, ...files])} />
                    {galereyaFiles.length > 0 && (
                        <PreviewGrid>
                            {galereyaFiles.map((file, index) => (
                                <FilePreview
                                    key={`${file.name}-${file.lastModified}-${index}`}
                                    file={file}
                                    onRemove={() => removeAt(setGalereyaFiles, index)}
                                />
                            ))}
                        </PreviewGrid>
                    )}
                </FormSection>
            </div>
            <FormFooter
                cancelTo={listPath}
                saving={isLoading}
                saveLabel={t("adminPanel.clinicAdd.buttons.save")}
                savingLabel={t("adminPanel.clinicAdd.buttons.loading")}
            />
        </form>
    );
}

export default ClinicAdd;
