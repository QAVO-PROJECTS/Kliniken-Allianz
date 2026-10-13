import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Loader2 } from "lucide-react";
import { useGetSanatoriumByIdQuery, usePutSanatoriumMutation } from "../../../../api/userApi.js";
import { SANATORIUM_CARD_IMAGES, SANATORIUM_IMAGES } from "../../../../config/mediaUrls.js";
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
    readLangs,
    ROOM_TYPES,
    SAN_LANGS,
    stripClientKey,
    withClientKey,
} from "../shared/sanatoriumFields.js";

const T = "adminPanel.sanatoriumEdit";

// Appends the value only when it changed and is not empty.
const appendIfChanged = (formData, key, newVal, oldVal) => {
    if (newVal !== oldVal && newVal !== undefined && newVal !== null && newVal !== "") {
        formData.append(key, newVal);
    }
};

function SanatoriumEdit() {
    const { t } = useTranslation();
    const at = useAdminT();
    const { id } = useParams();
    const navigate = useNavigate();
    const [isLoaded, setIsLoaded] = useState(false);

    const [editSanatorium, { isLoading }] = usePutSanatoriumMutation();
    const { data: getSanatoriumById, isLoading: isFetching, refetch } = useGetSanatoriumByIdQuery(id);
    const sanatorium = getSanatoriumById?.data;

    const [names, setNames] = useState(EMPTY_LANGS);
    const [descs, setDescs] = useState(EMPTY_LANGS);
    const [locations, setLocations] = useState(EMPTY_LANGS);

    // Images
    const [selectedFile, setSelectedFile] = useState(null);
    const [oldMainImage, setOldMainImage] = useState(null);
    const [galereyaFiles, setGalereyaFiles] = useState([]);
    const [oldGalereyaFiles, setOldGalereyaFiles] = useState([]);
    const [deleteImages, setDeleteImages] = useState([]);

    // Videos
    const [videos, setVideos] = useState([]);
    const [videoInput, setVideoInput] = useState("");
    const [addedVideos, setAddedVideos] = useState([]);
    const [deleteVideos, setDeleteVideos] = useState([]);

    // Services (new ones have id: null until saved)
    const [serviceList, setServiceList] = useState([]);
    const [editedServices, setEditedServices] = useState([]);
    const [deleteServiceIds, setDeleteServiceIds] = useState([]);
    const [serviceForm, setServiceForm] = useState(EMPTY_SERVICE);

    // Rooms
    const [selectedRooms, setSelectedRooms] = useState([]);
    const [rooms, setRooms] = useState(EMPTY_ROOMS);

    useEffect(() => {
        refetch();
    }, [refetch]);

    useEffect(() => {
        if (sanatorium && !isLoaded) {
            setNames(readLangs(sanatorium, "name"));
            setDescs(readLangs(sanatorium, "description"));
            setLocations(readLangs(sanatorium, "location"));

            setOldMainImage(sanatorium.sanatoriumCardImage || null);
            setOldGalereyaFiles(sanatorium.images || []);
            setVideos(sanatorium.videos || []);
            setServiceList(sanatorium.services || []);

            const nextRooms = Object.fromEntries(ROOM_TYPES.map((room) => [room.key, readLangs(sanatorium, room.api)]));
            setRooms(nextRooms);
            // Pre-select the room types that already have an (AZ) description.
            setSelectedRooms(ROOM_TYPES.filter((room) => nextRooms[room.key].az).map((room) => room.key));
            setIsLoaded(true);
        }
    }, [sanatorium, isLoaded]);

    const setLang = (setter) => (lang, value) => setter((prev) => ({ ...prev, [lang]: value }));

    const toggleRoom = (type) => {
        setSelectedRooms((prev) => (prev.includes(type) ? prev.filter((r) => r !== type) : [...prev, type]));
    };
    const setRoomDesc = (room, lang, value) => {
        setRooms((prev) => ({ ...prev, [room]: { ...prev[room], [lang]: value } }));
    };

    // Gallery
    const removeOldGalereya = (fileName) => {
        setOldGalereyaFiles((prev) => prev.filter((f) => f !== fileName));
        setDeleteImages((prev) => [...prev, fileName]);
    };

    // Videos
    const addVideo = () => {
        const trimmed = videoInput.trim();
        if (!trimmed) return;
        setVideos((prev) => [...prev, trimmed]);
        setAddedVideos((prev) => [...prev, trimmed]);
        setVideoInput("");
    };

    const removeVideo = (index) => {
        const url = videos[index];
        if (addedVideos.includes(url)) {
            const findIdx = addedVideos.indexOf(url);
            const newAdded = [...addedVideos];
            newAdded.splice(findIdx, 1);
            setAddedVideos(newAdded);
        } else if (sanatorium.videos?.includes(url)) {
            setDeleteVideos((prev) => [...prev, url]);
        }
        setVideos((prev) => prev.filter((_, i) => i !== index));
    };

    // Services
    const addService = () => {
        if (!serviceForm.name.trim()) {
            showToast(t(`${T}.toast.emptyService`), "warning");
            return;
        }
        setServiceList((prev) => [...prev, withClientKey({ id: null, ...serviceForm })]);
        setServiceForm(EMPTY_SERVICE);
    };

    const updateService = (index, field, value) => {
        const service = serviceList[index];
        const updated = { ...service, [field]: value };
        setServiceList((prev) => prev.map((s, i) => (i === index ? updated : s)));
        // Existing services are tracked so only the changed ones are sent.
        if (service.id) {
            setEditedServices((prev) => (prev.some((x) => x.id === service.id)
                ? prev.map((x) => (x.id === service.id ? { ...x, [field]: value } : x))
                : [...prev, updated]));
        }
    };

    const removeService = (index) => {
        const service = serviceList[index];
        if (service.id) setDeleteServiceIds((prev) => [...prev, service.id]);
        setServiceList((prev) => prev.filter((_, i) => i !== index));
    };

    const handleEdit = async (e) => {
        e?.preventDefault();
        if (!sanatorium) return;

        const formData = new FormData();
        formData.append("id", sanatorium.id);

        SAN_LANGS.forEach(({ key, suffix }) => {
            appendIfChanged(formData, `Name${suffix}`, names[key], sanatorium[`name${suffix}`]);
        });
        SAN_LANGS.forEach(({ key, suffix }) => {
            appendIfChanged(formData, `Description${suffix}`, descs[key], sanatorium[`description${suffix}`]);
        });
        SAN_LANGS.forEach(({ key, suffix }) => {
            appendIfChanged(formData, `Location${suffix}`, locations[key], sanatorium[`location${suffix}`]);
        });
        ROOM_TYPES.forEach((room) => {
            SAN_LANGS.forEach(({ key, suffix }) => {
                appendIfChanged(formData, `${room.form}${suffix}`, rooms[room.key][key], sanatorium[`${room.api}${suffix}`]);
            });
        });

        if (selectedFile) formData.append("SanatoriumCardImage", selectedFile);

        const allServiceChanges = [
            ...editedServices.filter((s) => !deleteServiceIds.includes(s.id)),
            ...serviceList.filter((s) => !s.id).map((s) => ({ ...stripClientKey(s), id: null })),
        ];
        if (allServiceChanges.length > 0) {
            formData.append("serviceJson", JSON.stringify(allServiceChanges));
        }

        galereyaFiles.forEach((file) => formData.append("Images", file));
        deleteImages.forEach((f) => formData.append("DeleteImageIds", f));
        addedVideos.forEach((url) => formData.append("Videos", url));
        deleteVideos.forEach((url) => formData.append("DeleteVideoIds", url));
        deleteServiceIds.forEach((serviceId) => formData.append("DeleteServiceIds", serviceId));

        try {
            await editSanatorium(formData).unwrap();
            showToast(t(`${T}.toast.success`), "success");
            refetch();
            navigate("/admin/sanatorium");
        } catch {
            showToast(t(`${T}.toast.error`), "error");
        }
    };

    if (isFetching && !sanatorium) {
        return (
            <div className="adm-loading" role="status">
                <Loader2 size={20} aria-hidden="true" />
                {at("loading")}
            </div>
        );
    }

    const hasGallery = oldGalereyaFiles.length > 0 || galereyaFiles.length > 0;

    return (
        <form className="adm-form" onSubmit={handleEdit} noValidate>
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
                    {(oldMainImage || selectedFile) && (
                        <PreviewGrid>
                            {oldMainImage && (
                                <FilePreview src={SANATORIUM_CARD_IMAGES + oldMainImage} name={oldMainImage} badge={at("current")} />
                            )}
                            {selectedFile && (
                                <FilePreview file={selectedFile} badge={at("newFile")} onRemove={() => setSelectedFile(null)} />
                            )}
                        </PreviewGrid>
                    )}
                    <Dropzone compact onFiles={([file]) => setSelectedFile(file)} title={t(`${T}.uploadHint`)} />
                </FormSection>

                <FormSection title={t(`${T}.videosTitle`)} description={t(`${T}.videosDescription`)}>
                    <VideoListEditor
                        tPrefix={T}
                        value={videoInput}
                        onInput={setVideoInput}
                        onAdd={addVideo}
                        videos={videos}
                        onRemove={removeVideo}
                    />
                </FormSection>

                <FormSection wide title={t(`${T}.galleryTitle`)} description={t(`${T}.galleryDescription`)}>
                    <Dropzone
                        multiple
                        compact={hasGallery}
                        onFiles={(files) => setGalereyaFiles((prev) => [...prev, ...files])}
                        title={t(`${T}.uploadHint`)}
                    />
                    {hasGallery && (
                        <PreviewGrid>
                            {oldGalereyaFiles.map((f) => (
                                <FilePreview
                                    key={f}
                                    src={SANATORIUM_IMAGES + f}
                                    name={f}
                                    badge={at("current")}
                                    onRemove={() => removeOldGalereya(f)}
                                />
                            ))}
                            {galereyaFiles.map((file, index) => (
                                <FilePreview
                                    key={fileKey(file)}
                                    file={file}
                                    badge={at("newFile")}
                                    onRemove={() => setGalereyaFiles((prev) => prev.filter((_, i) => i !== index))}
                                />
                            ))}
                        </PreviewGrid>
                    )}
                </FormSection>

                <FormSection
                    wide
                    title={t(`${T}.roomsTitle`, { defaultValue: t("adminPanel.sanatoriumAdd.roomsTitle") })}
                    description={t(`${T}.roomsDescription`, { defaultValue: t("adminPanel.sanatoriumAdd.roomsDescription") })}
                >
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

export default SanatoriumEdit;
