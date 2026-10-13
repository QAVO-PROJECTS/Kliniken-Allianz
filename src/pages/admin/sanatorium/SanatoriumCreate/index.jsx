import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { usePostSanatoriumMutation } from "../../../../api/userApi.js";
import showToast from "../../../../utils/toast.js";
import AdminPageHeader from "../../../../components/admin/AdminPageHeader/index.jsx";
import { FormFooter, FormSection } from "../../../../components/admin/FormKit/index.jsx";
import { Dropzone, FilePreview, PreviewGrid } from "../../../../components/admin/Dropzone/index.jsx";
import { useAdminT } from "../../../../components/admin/shared/adminStrings.js";
import { LangInputs, RoomsEditor, ServicesEditor, VideoListEditor } from "../shared/SanatoriumFormParts.jsx";
import {
    EMPTY_LANGS,
    EMPTY_ROOMS,
    EMPTY_SERVICE,
    fileKey,
    ROOM_TYPES,
    SAN_LANGS,
    stripClientKey,
    withClientKey,
} from "../shared/sanatoriumFields.js";

const T = "adminPanel.sanatoriumAdd";

function SanatoriumAdd() {
    const { t } = useTranslation();
    const at = useAdminT();
    const navigate = useNavigate();
    const [postClinic, { isLoading }] = usePostSanatoriumMutation();

    const [selectedFile, setSelectedFile] = useState(null);
    const [galereyaFiles, setGalereyaFiles] = useState([]);
    const [clinicVideos, setClinicVideos] = useState([]);
    const [videoInput, setVideoInput] = useState("");

    const [names, setNames] = useState(EMPTY_LANGS);
    const [descs, setDescs] = useState(EMPTY_LANGS);
    const [locations, setLocations] = useState(EMPTY_LANGS);

    const [selectedRooms, setSelectedRooms] = useState([]);
    const [rooms, setRooms] = useState(EMPTY_ROOMS);

    const [serviceList, setServiceList] = useState([]);
    const [serviceForm, setServiceForm] = useState(EMPTY_SERVICE);

    const setLang = (setter) => (lang, value) => setter((prev) => ({ ...prev, [lang]: value }));

    const toggleRoom = (type) => {
        setSelectedRooms((prev) => (prev.includes(type) ? prev.filter((r) => r !== type) : [...prev, type]));
    };
    const setRoomDesc = (room, lang, value) => {
        setRooms((prev) => ({ ...prev, [room]: { ...prev[room], [lang]: value } }));
    };

    const addService = () => {
        if (!serviceForm.name.trim()) {
            showToast(t(`${T}.toast.emptyService`), "warning");
            return;
        }
        setServiceList((prev) => [...prev, withClientKey(serviceForm)]);
        setServiceForm(EMPTY_SERVICE);
    };
    const updateService = (index, field, value) => {
        setServiceList((prev) => prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)));
    };
    const removeService = (index) => {
        setServiceList((prev) => prev.filter((_, i) => i !== index));
    };

    const addVideo = () => {
        const trimmed = videoInput.trim();
        if (!trimmed) return;
        setClinicVideos((prev) => [...prev, trimmed]);
        setVideoInput("");
    };
    const removeVideo = (index) => {
        setClinicVideos((prev) => prev.filter((_, i) => i !== index));
    };

    const resetForm = () => {
        setNames(EMPTY_LANGS);
        setDescs(EMPTY_LANGS);
        setLocations(EMPTY_LANGS);
        setSelectedFile(null);
        setGalereyaFiles([]);
        setClinicVideos([]);
        setVideoInput("");
        setServiceList([]);
        setServiceForm(EMPTY_SERVICE);
        setSelectedRooms([]);
        setRooms(EMPTY_ROOMS);
    };

    const handleSubmit = async (e) => {
        e?.preventDefault();
        if (!selectedFile) {
            showToast(t(`${T}.toast.noMainImage`), "warning");
            return;
        }

        const formData = new FormData();
        SAN_LANGS.forEach(({ key, suffix }) => {
            formData.append(`Name${suffix}`, names[key]);
            formData.append(`Description${suffix}`, descs[key]);
            formData.append(`Location${suffix}`, locations[key]);
        });
        ROOM_TYPES.forEach((room) => {
            SAN_LANGS.forEach(({ key, suffix }) => {
                formData.append(`${room.form}${suffix}`, rooms[room.key][key]);
            });
        });
        formData.append("SanatoriumCardImage", selectedFile);
        galereyaFiles.forEach((file) => formData.append("Images", file));
        clinicVideos.forEach((url) => formData.append("Videos", url));
        formData.append("serviceJson", JSON.stringify(serviceList.map(stripClientKey)));

        try {
            await postClinic(formData).unwrap();
            showToast(t(`${T}.toast.success`), "success");
            resetForm();
            navigate("/admin/sanatorium");
        } catch {
            showToast(t(`${T}.toast.error`), "error");
        }
    };

    return (
        <form className="adm-form" onSubmit={handleSubmit} noValidate>
            <AdminPageHeader
                crumbs={[
                    { label: t(`${T}.breadcrumb.main`), to: "/admin/sanatorium" },
                    { label: t(`${T}.breadcrumb.sub`) },
                ]}
                title={t(`${T}.title`)}
                description={t(`${T}.description`)}
            />
            <div className="adm-form-grid">
                <FormSection title={t(`${T}.nameTitle`)} description={t(`${T}.nameDescription`)}>
                    <LangInputs
                        values={names}
                        onChange={setLang(setNames)}
                        placeholderKey={(ph) => `${T}.placeholders.name${ph}`}
                    />
                </FormSection>

                <FormSection title={t(`${T}.locationTitle`)} description={t(`${T}.locationDescription`)}>
                    <LangInputs
                        values={locations}
                        onChange={setLang(setLocations)}
                        placeholderKey={(ph) => `${T}.placeholders.location${ph}`}
                    />
                </FormSection>

                <FormSection wide title={t(`${T}.descTitle`)} description={t(`${T}.descDescription`)}>
                    <LangInputs
                        grid
                        multiline
                        rows={5}
                        values={descs}
                        onChange={setLang(setDescs)}
                        placeholderKey={(ph) => `${T}.placeholders.desc${ph}`}
                    />
                </FormSection>

                <FormSection title={t(`${T}.imageTitle`)} description={t(`${T}.imageDescription`)}>
                    {selectedFile ? (
                        <FilePreview file={selectedFile} single badge={at("newFile")} onRemove={() => setSelectedFile(null)} />
                    ) : (
                        <Dropzone onFiles={([file]) => setSelectedFile(file)} title={t(`${T}.uploadHint`)} />
                    )}
                </FormSection>

                <FormSection title={t(`${T}.videosTitle`)} description={t(`${T}.videosDescription`)}>
                    <VideoListEditor
                        tPrefix={T}
                        value={videoInput}
                        onInput={setVideoInput}
                        onAdd={addVideo}
                        videos={clinicVideos}
                        onRemove={removeVideo}
                    />
                </FormSection>

                <FormSection wide title={t(`${T}.galleryTitle`)} description={t(`${T}.galleryDescription`)}>
                    <Dropzone
                        multiple
                        compact={galereyaFiles.length > 0}
                        onFiles={(files) => setGalereyaFiles((prev) => [...prev, ...files])}
                        title={t(`${T}.uploadHint`)}
                    />
                    {galereyaFiles.length > 0 && (
                        <PreviewGrid>
                            {galereyaFiles.map((file, index) => (
                                <FilePreview
                                    key={fileKey(file)}
                                    file={file}
                                    onRemove={() => setGalereyaFiles((prev) => prev.filter((_, i) => i !== index))}
                                />
                            ))}
                        </PreviewGrid>
                    )}
                </FormSection>

                <FormSection wide title={t(`${T}.roomsTitle`)} description={t(`${T}.roomsDescription`)}>
                    <RoomsEditor
                        rooms={rooms}
                        selectedRooms={selectedRooms}
                        onToggle={toggleRoom}
                        onChange={setRoomDesc}
                    />
                </FormSection>

                <FormSection wide title={t(`${T}.servicesTitle`)} description={t(`${T}.servicesDescription`)}>
                    <ServicesEditor
                        tPrefix={T}
                        form={serviceForm}
                        onFormChange={(field, value) => setServiceForm((prev) => ({ ...prev, [field]: value }))}
                        onAdd={addService}
                        services={serviceList}
                        onChange={updateService}
                        onRemove={removeService}
                    />
                </FormSection>
            </div>
            <FormFooter
                cancelTo="/admin/sanatorium"
                saving={isLoading}
                saveLabel={t(`${T}.buttons.save`)}
                savingLabel={t(`${T}.buttons.loading`)}
            />
        </form>
    );
}

export default SanatoriumAdd;
