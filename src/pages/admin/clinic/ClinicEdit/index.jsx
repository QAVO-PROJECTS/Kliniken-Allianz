import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Loader2, Plus, Video, X } from "lucide-react";
import {
    useGetAllDoctorsQuery,
    useGetAllOtelsQuery,
    useGetAllServiceQuery,
    useGetClinicByIdQuery,
    usePutClinicMutation,
} from "../../../../api/userApi.js";
import { CLINIC_CARD_IMAGES, CLINIC_IMAGES, CLINIC_SERT_IMAGES } from "../../../../config/mediaUrls.js";
import showToast from "../../../../utils/toast.js";
import AdminPageHeader from "../../../../components/admin/AdminPageHeader/index.jsx";
import IconButton from "../../../../components/admin/IconButton/index.jsx";
import { CheckList, FormFooter, FormSection, LangField } from "../../../../components/admin/FormKit/index.jsx";
import { Dropzone, FilePreview, PreviewGrid } from "../../../../components/admin/Dropzone/index.jsx";
import { useAdminT } from "../../../../components/admin/shared/adminStrings.js";

const LANG_ORDER = ["az", "ru", "en", "de", "ar"];
// Placeholder key suffix (adminPanel.clinicEdit.placeholders.name<Suffix>) and API field suffix per language.
const PH_SUFFIX = { az: "Az", ru: "Ru", en: "En", de: "Alm", ar: "Arab" };
const FIELD_SUFFIX = { az: "", ru: "Ru", en: "Eng", de: "Alm", ar: "Arab" };
const EMPTY = { az: "", ru: "", en: "", de: "", ar: "" };

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
const fromClinic = (clinic, field) =>
    Object.fromEntries(LANG_ORDER.map((lang) => [lang, clinic[`${field}${FIELD_SUFFIX[lang]}`] || ""]));

// Only send a text field when it was changed to a non-empty value.
const appendIfChanged = (formData, key, newVal, oldVal) => {
    if (newVal !== oldVal && newVal !== undefined && newVal !== null && newVal !== "") {
        formData.append(key, newVal);
    }
};

function ClinicEdit({ isGermany }) {
    const { t } = useTranslation();
    const at = useAdminT();
    const { id } = useParams();
    const navigate = useNavigate();
    const listPath = isGermany ? "/admin/germany-clinic" : "/admin/clinic";

    const [editClinic, { isLoading: isUpdating }] = usePutClinicMutation();
    const { data: getClinicById, isLoading: isFetching, refetch } = useGetClinicByIdQuery(id);
    const clinic = getClinicById?.data;
    const { data: getAllService } = useGetAllServiceQuery();
    const { data: getAllOtels } = useGetAllOtelsQuery();
    const { data: getAllDoctors } = useGetAllDoctorsQuery();

    const [isLoaded, setIsLoaded] = useState(false);
    const [names, setNames] = useState(EMPTY);
    const [descs, setDescs] = useState(EMPTY);
    const [locations, setLocations] = useState(EMPTY);

    const [selectedServices, setSelectedServices] = useState([]);
    const [selectedDoctors, setSelectedDoctors] = useState([]);
    const [selectedOtels, setSelectedOtels] = useState([]);
    const [deleteServices, setDeleteServices] = useState([]);
    const [deleteDoctors, setDeleteDoctors] = useState([]);
    const [deleteOtels, setDeleteOtels] = useState([]);

    const [selectedFile, setSelectedFile] = useState(null);
    const [sertifikatFiles, setSertifikatFiles] = useState([]);
    const [oldSertifikatFiles, setOldSertifikatFiles] = useState([]);
    const [deleteClinicSertificates, setDeleteClinicSertificates] = useState([]);
    const [galereyaFiles, setGalereyaFiles] = useState([]);
    const [oldGalereyaFiles, setOldGalereyaFiles] = useState([]);
    const [deleteClinicImages, setDeleteClinicImages] = useState([]);

    const [clinicVideos, setClinicVideos] = useState([]);
    const [videoInput, setVideoInput] = useState("");
    const [addedClinicVideos, setAddedClinicVideos] = useState([]);
    const [deleteClinicVideos, setDeleteClinicVideos] = useState([]);

    useEffect(() => {
        refetch();
    }, [refetch]);

    useEffect(() => {
        if (clinic && !isLoaded) {
            setNames(fromClinic(clinic, "name"));
            setDescs(fromClinic(clinic, "description"));
            setLocations(fromClinic(clinic, "location"));
            setSelectedServices(clinic.services?.map((s) => s.id) || []);
            setSelectedDoctors(clinic.doctors?.map((d) => d.id) || []);
            setSelectedOtels(clinic.otels?.map((o) => o.id) || []);
            setOldSertifikatFiles(clinic.clinicSertificates || []);
            setOldGalereyaFiles(clinic.clinicImages || []);
            setClinicVideos(clinic.clinicVideos || []);
            setIsLoaded(true);
        }
    }, [clinic, isLoaded]);

    const origServices = clinic?.services?.map((s) => s.id) || [];
    const origDoctors = clinic?.doctors?.map((d) => d.id) || [];
    const origOtels = clinic?.otels?.map((o) => o.id) || [];

    const setLang = (setter, lang) => (e) => setter((prev) => ({ ...prev, [lang]: e.target.value }));
    const removeAt = (setList, index) => setList((prev) => prev.filter((_, i) => i !== index));

    // Unchecking an originally linked item marks it for deletion; re-checking it un-marks it.
    const toggleWithDelete = (selected, setList, setDeleteList, original) => (itemId) => {
        if (selected.includes(itemId)) {
            if (original.includes(itemId)) {
                setDeleteList((prev) => (prev.includes(itemId) ? prev : [...prev, itemId]));
            }
            setList((prev) => prev.filter((x) => x !== itemId));
        } else {
            setDeleteList((prev) => prev.filter((x) => x !== itemId));
            setList((prev) => [...prev, itemId]);
        }
    };

    const removeOldSertifikat = (fileName) => {
        setOldSertifikatFiles((prev) => prev.filter((f) => f !== fileName));
        setDeleteClinicSertificates((prev) => [...prev, fileName]);
    };

    const removeOldGalereya = (fileName) => {
        setOldGalereyaFiles((prev) => prev.filter((f) => f !== fileName));
        setDeleteClinicImages((prev) => [...prev, fileName]);
    };

    const addVideo = () => {
        const trimmed = videoInput.trim();
        if (!trimmed) return;
        setClinicVideos((prev) => [...prev, trimmed]);
        setAddedClinicVideos((prev) => [...prev, trimmed]);
        setVideoInput("");
    };

    const removeVideo = (index) => {
        const url = clinicVideos[index];
        const addedIdx = addedClinicVideos.indexOf(url);
        if (addedIdx > -1) {
            // Newly added in this session: just drop it from the "added" list.
            setAddedClinicVideos((prev) => prev.filter((_, i) => i !== addedIdx));
        } else {
            // Came from the server: ask the API to delete it.
            setDeleteClinicVideos((prev) => [...prev, url]);
        }
        removeAt(setClinicVideos, index);
    };

    const handleEdit = async (e) => {
        e?.preventDefault();
        if (!clinic) return;

        const formData = new FormData();
        formData.append("id", clinic.id);

        LANG_ORDER.forEach((lang) => {
            const suffix = FIELD_SUFFIX[lang];
            appendIfChanged(formData, `name${suffix}`, names[lang], clinic[`name${suffix}`]);
        });
        LANG_ORDER.forEach((lang) => {
            const suffix = FIELD_SUFFIX[lang];
            appendIfChanged(formData, `description${suffix}`, descs[lang], clinic[`description${suffix}`]);
        });
        LANG_ORDER.forEach((lang) => {
            const suffix = FIELD_SUFFIX[lang];
            appendIfChanged(formData, `Location${suffix}`, locations[lang], clinic[`location${suffix}`]);
        });

        if (selectedFile) formData.append("clinicCardImage", selectedFile);
        galereyaFiles.forEach((file) => formData.append("clinicImages", file));
        sertifikatFiles.forEach((file) => formData.append("clinicSertificates", file));

        deleteClinicImages.forEach((f) => formData.append("DeleteClinicImages", f));
        deleteClinicSertificates.forEach((f) => formData.append("DeleteClinicSertificates", f));
        deleteServices.forEach((sid) => formData.append("DeleteClinicServiceIds", sid));
        deleteDoctors.forEach((did) => formData.append("DeleteDoctorIds", did));
        deleteOtels.forEach((oid) => formData.append("DeleteOtelIds", oid));

        addedClinicVideos.forEach((url) => formData.append("ClinicVideos", url));
        deleteClinicVideos.forEach((url) => formData.append("DeleteClinicVideos", url));

        selectedServices.filter((sid) => !origServices.includes(sid)).forEach((sid) => formData.append("ClinicServiceIds", sid));
        selectedDoctors.filter((did) => !origDoctors.includes(did)).forEach((did) => formData.append("DoctorIds", did));
        selectedOtels.filter((oid) => !origOtels.includes(oid)).forEach((oid) => formData.append("OtelIds", oid));

        try {
            await editClinic(formData).unwrap();
            showToast(t("adminPanel.clinicEdit.toast.success"), "success");
            refetch();
            navigate(listPath);
        } catch {
            showToast(t("adminPanel.clinicEdit.toast.error"), "error");
        }
    };

    if (isFetching) {
        return (
            <div className="adm-loading" role="status">
                <Loader2 size={20} aria-hidden="true" />
                {at("loading")}
            </div>
        );
    }

    const langFields = (prefix, values, setter, extra = {}) =>
        LANG_ORDER.map((lang) => (
            <LangField
                key={lang}
                lang={lang}
                value={values[lang]}
                onChange={setLang(setter, lang)}
                placeholder={t(`adminPanel.clinicEdit.placeholders.${prefix}${PH_SUFFIX[lang]}`)}
                wide={extra.multiline && lang === "ar"}
                {...extra}
            />
        ));

    return (
        <form className="adm-form" onSubmit={handleEdit} noValidate>
            <AdminPageHeader
                crumbs={[
                    {
                        label: isGermany ? t("adminPanel.leftBar.menu.clinicGermany") : t("adminPanel.clinicEdit.breadcrumb.main"),
                        to: listPath,
                    },
                    { label: t("adminPanel.clinicEdit.breadcrumb.sub") },
                ]}
                title={t("adminPanel.clinicEdit.title")}
                description={t("adminPanel.clinicEdit.description")}
            />
            <div className="adm-form-grid">
                <FormSection title={t("adminPanel.clinicEdit.nameTitle")} description={t("adminPanel.clinicEdit.nameDescription")}>
                    {langFields("name", names, setNames)}
                </FormSection>

                <FormSection title={t("adminPanel.clinicEdit.locationTitle")} description={t("adminPanel.clinicEdit.locationDescription")}>
                    {langFields("location", locations, setLocations)}
                </FormSection>

                <FormSection title={t("adminPanel.clinicEdit.imageTitle")} description={t("adminPanel.clinicEdit.imageDescription")}>
                    <Dropzone onFiles={([file]) => setSelectedFile(file)} />
                    {selectedFile ? (
                        <FilePreview file={selectedFile} badge={at("newFile")} single onRemove={() => setSelectedFile(null)} />
                    ) : (
                        clinic?.clinicCardImage && (
                            <FilePreview
                                src={CLINIC_CARD_IMAGES + clinic.clinicCardImage}
                                name={clinic.clinicCardImage}
                                badge={at("current")}
                                single
                            />
                        )
                    )}
                </FormSection>

                <FormSection title={t("adminPanel.clinicEdit.videosTitle")} description={t("adminPanel.clinicEdit.videosDescription")}>
                    <div className="adm-inline">
                        <input
                            className="adm-input"
                            type="url"
                            inputMode="url"
                            aria-label={t("adminPanel.clinicEdit.videosTitle")}
                            placeholder={t("adminPanel.clinicEdit.placeholders.videoUrl")}
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
                            {t("adminPanel.clinicEdit.buttons.addVideo")}
                        </button>
                    </div>
                    {clinicVideos.length > 0 && (
                        <ul className="adm-list">
                            {clinicVideos.map((url, index) => (
                                <li key={`${url}-${index}`} className="adm-list__item">
                                    <Video size={16} aria-hidden="true" />
                                    <a href={url} target="_blank" rel="noreferrer">{url}</a>
                                    <IconButton icon={X} label={at("remove")} onClick={() => removeVideo(index)} />
                                </li>
                            ))}
                        </ul>
                    )}
                </FormSection>

                <FormSection wide title={t("adminPanel.clinicEdit.descTitle")} description={t("adminPanel.clinicEdit.descDescription")}>
                    <div className="adm-grid">
                        {langFields("desc", descs, setDescs, { multiline: true, rows: 5 })}
                    </div>
                </FormSection>

                <FormSection wide title={t("adminPanel.clinicEdit.servicesTitle")} description={t("adminPanel.clinicEdit.servicesDescription")}>
                    <RelationList
                        result={getAllService}
                        selected={selectedServices}
                        onToggle={toggleWithDelete(selectedServices, setSelectedServices, setDeleteServices, origServices)}
                        emptyText={at("noData")}
                    />
                </FormSection>

                <FormSection title={t("adminPanel.clinicEdit.doctorsTitle")} description={t("adminPanel.clinicEdit.doctorsDescription")}>
                    <RelationList
                        result={getAllDoctors}
                        selected={selectedDoctors}
                        onToggle={toggleWithDelete(selectedDoctors, setSelectedDoctors, setDeleteDoctors, origDoctors)}
                        emptyText={at("noData")}
                    />
                </FormSection>

                <FormSection title={t("adminPanel.clinicEdit.hotelsTitle")} description={t("adminPanel.clinicEdit.hotelsDescription")}>
                    <RelationList
                        result={getAllOtels}
                        selected={selectedOtels}
                        onToggle={toggleWithDelete(selectedOtels, setSelectedOtels, setDeleteOtels, origOtels)}
                        emptyText={at("noData")}
                    />
                </FormSection>

                <FormSection title={t("adminPanel.clinicEdit.certificateTitle")} description={t("adminPanel.clinicEdit.certificateDescription")}>
                    <Dropzone multiple compact onFiles={(files) => setSertifikatFiles((prev) => [...prev, ...files])} />
                    {(oldSertifikatFiles.length > 0 || sertifikatFiles.length > 0) && (
                        <PreviewGrid>
                            {oldSertifikatFiles.map((f) => (
                                <FilePreview
                                    key={f}
                                    src={CLINIC_SERT_IMAGES + f}
                                    name={f}
                                    badge={at("current")}
                                    onRemove={() => removeOldSertifikat(f)}
                                />
                            ))}
                            {sertifikatFiles.map((file, index) => (
                                <FilePreview
                                    key={`${file.name}-${file.lastModified}-${index}`}
                                    file={file}
                                    badge={at("newFile")}
                                    onRemove={() => removeAt(setSertifikatFiles, index)}
                                />
                            ))}
                        </PreviewGrid>
                    )}
                </FormSection>

                <FormSection title={t("adminPanel.clinicEdit.galleryTitle")} description={t("adminPanel.clinicEdit.galleryDescription")}>
                    <Dropzone multiple compact onFiles={(files) => setGalereyaFiles((prev) => [...prev, ...files])} />
                    {(oldGalereyaFiles.length > 0 || galereyaFiles.length > 0) && (
                        <PreviewGrid>
                            {oldGalereyaFiles.map((f) => (
                                <FilePreview
                                    key={f}
                                    src={CLINIC_IMAGES + f}
                                    name={f}
                                    badge={at("current")}
                                    onRemove={() => removeOldGalereya(f)}
                                />
                            ))}
                            {galereyaFiles.map((file, index) => (
                                <FilePreview
                                    key={`${file.name}-${file.lastModified}-${index}`}
                                    file={file}
                                    badge={at("newFile")}
                                    onRemove={() => removeAt(setGalereyaFiles, index)}
                                />
                            ))}
                        </PreviewGrid>
                    )}
                </FormSection>
            </div>
            <FormFooter
                cancelTo={listPath}
                saving={isUpdating}
                saveLabel={t("adminPanel.clinicEdit.buttons.save")}
                savingLabel={t("adminPanel.clinicEdit.buttons.loading")}
            />
        </form>
    );
}

export default ClinicEdit;
