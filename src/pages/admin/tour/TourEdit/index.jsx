import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Loader2, Plus, Video, X } from "lucide-react";
import { useGetToursByIdQuery, usePutToursMutation, useGetAllCarQuery, useGetAllOtelsQuery } from "../../../../api/userApi.js";
import showToast from "../../../../utils/toast.js";
import { TOUR_CARD_IMG, TOUR_IMAGES } from "../../../../config/mediaUrls.js";
import AdminPageHeader from "../../../../components/admin/AdminPageHeader/index.jsx";
import { CheckList, FormFooter, FormSection, LangField } from "../../../../components/admin/FormKit/index.jsx";
import { Dropzone, FilePreview, PreviewGrid } from "../../../../components/admin/Dropzone/index.jsx";
import IconButton from "../../../../components/admin/IconButton/index.jsx";
import { useAdminT, useOptionalT } from "../../../../components/admin/shared/adminStrings.js";
import TourOffers from "../TourOffers/index.jsx";

const P = "adminPanel.toursEdit";
const emptySection = (id) => ({ id, expanded: true, serviceId: null, inputs: Array(5).fill("") });

function ToursEdit() {
    const { t } = useTranslation();
    const at = useAdminT();
    const ot = useOptionalT();
    const { id } = useParams();
    const navigate = useNavigate();

    const { data: getToursById, isLoading: isFetching, refetch } = useGetToursByIdQuery(id);
    const tour = getToursById?.data;

    const [editTour, { isLoading }] = usePutToursMutation();

    const { data: getCars } = useGetAllCarQuery();
    const cars = getCars?.data || [];

    const { data: getOtels } = useGetAllOtelsQuery();
    const otels = getOtels?.data || [];

    const uid = useRef(0);
    const nextId = () => {
        uid.current += 1;
        return `new-${uid.current}`;
    };

    const [isLoaded, setIsLoaded] = useState(false);

    // Names
    const [nameAz, setNameAz] = useState("");
    const [nameEn, setNameEn] = useState("");
    const [nameRu, setNameRu] = useState("");
    const [nameAlm, setNameAlm] = useState("");
    const [nameArab, setNameArab] = useState("");

    // Descriptions
    const [descAz, setDescAz] = useState("");
    const [descEn, setDescEn] = useState("");
    const [descRu, setDescRu] = useState("");
    const [descAlm, setDescAlm] = useState("");
    const [descArab, setDescArab] = useState("");

    // Cover image
    const [selectedFile, setSelectedFile] = useState(null);
    const [oldImage, setOldImage] = useState(null);

    // Gallery (new files are plain File objects; FilePreview manages the object URLs)
    const [newTourImages, setNewTourImages] = useState([]);
    const [oldTourImages, setOldTourImages] = useState([]);
    const [deleteTourImageIds, setDeleteTourImageIds] = useState([]);

    // YouTube links
    const [tourVideos, setTourVideos] = useState([]);
    const [videoInput, setVideoInput] = useState("");
    const [addedTourVideos, setAddedTourVideos] = useState([]);
    const [deleteTourVideos, setDeleteTourVideos] = useState([]);

    // Relations
    const [selectedCars, setSelectedCars] = useState([]);
    const [selectedOtels, setSelectedOtels] = useState([]);
    const [deletedCarIds, setDeletedCarIds] = useState([]);
    const [deletedOtelIds, setDeletedOtelIds] = useState([]);

    // Offers
    const [sections, setSections] = useState([emptySection("new-0")]);
    const [deletedServiceIds, setDeletedServiceIds] = useState([]);

    useEffect(() => {
        refetch();
    }, [refetch]);

    useEffect(() => {
        if (tour && !isLoaded) {
            setNameAz(tour.name || "");
            setNameEn(tour.nameEng || "");
            setNameRu(tour.nameRu || "");
            setNameAlm(tour.nameAlm || "");
            setNameArab(tour.nameArab || "");

            setDescAz(tour.description || "");
            setDescEn(tour.descriptionEng || "");
            setDescRu(tour.descriptionRu || "");
            setDescAlm(tour.descriptionAlm || "");
            setDescArab(tour.descriptionArab || "");

            setOldImage(tour.cardImage ? `${TOUR_CARD_IMG}${tour.cardImage.split("/").pop()}` : null);

            setOldTourImages(tour.tourImages || []);
            setTourVideos(tour.tourVideos || []);

            setSelectedCars(tour.carTourIds || tour.cars?.map((c) => c.id) || []);
            setSelectedOtels(tour.otelIds || tour.otels?.map((o) => o.id) || []);

            // Existing offers start collapsed (title + summary) so long lists stay scannable.
            const collapse = (tour.services?.length || 0) > 1;
            const mappedServices = tour.services?.map((s, i) => ({
                id: s.id || `srv-${i}`,
                expanded: !collapse,
                serviceId: s.id || null,
                inputs: [s.name || "", s.nameRU || "", s.nameEN || "", s.nameAL || "", s.nameAR || ""],
            })) || [];

            setSections(mappedServices.length > 0 ? mappedServices : [emptySection("new-0")]);
            setIsLoaded(true);
        }
    }, [tour, isLoaded]);

    const addNewTourImages = (files) => {
        const added = files.map((file) => ({ id: nextId(), file }));
        setNewTourImages((prev) => [...prev, ...added]);
    };

    const removeNewTourImage = (imageId) => {
        setNewTourImages((prev) => prev.filter((img) => img.id !== imageId));
    };

    const removeOldTourImage = (image) => {
        setOldTourImages((prev) => prev.filter((img) => img !== image));
        setDeleteTourImageIds((prev) => [...prev, image.id || image]);
    };

    const addVideo = () => {
        const trimmed = videoInput.trim();
        if (!trimmed) return;
        setTourVideos((prev) => [...prev, trimmed]);
        setAddedTourVideos((prev) => [...prev, trimmed]);
        setVideoInput("");
    };

    const removeVideo = (index) => {
        const url = tourVideos[index];
        const addedIdx = addedTourVideos.indexOf(url);
        if (addedIdx > -1) {
            setAddedTourVideos((prev) => prev.filter((_, i) => i !== addedIdx));
        } else {
            setDeleteTourVideos((prev) => [...prev, url.id || url]);
        }
        setTourVideos((prev) => prev.filter((_, i) => i !== index));
    };

    // Unchecking a relation marks it for deletion; re-checking removes that mark.
    const toggleCarSelection = (carId) => {
        if (selectedCars.includes(carId)) {
            setSelectedCars((prev) => prev.filter((x) => x !== carId));
            setDeletedCarIds((d) => (d.includes(carId) ? d : [...d, carId]));
        } else {
            setSelectedCars((prev) => [...prev, carId]);
            setDeletedCarIds((d) => d.filter((x) => x !== carId));
        }
    };

    const toggleOtelSelection = (otelId) => {
        if (selectedOtels.includes(otelId)) {
            setSelectedOtels((prev) => prev.filter((x) => x !== otelId));
            setDeletedOtelIds((d) => (d.includes(otelId) ? d : [...d, otelId]));
        } else {
            setSelectedOtels((prev) => [...prev, otelId]);
            setDeletedOtelIds((d) => d.filter((x) => x !== otelId));
        }
    };

    const handleInputChange = (sectionId, index, value) => {
        setSections((prev) =>
            prev.map((s) => (s.id === sectionId ? { ...s, inputs: s.inputs.map((v, i) => (i === index ? value : v)) } : s)),
        );
    };

    const handleAddSection = () => {
        const anyFilled = sections[sections.length - 1]?.inputs?.some((x) => x.trim() !== "");
        if (!anyFilled && sections.length > 0) return;
        const added = emptySection(nextId());
        setSections((prev) => prev.map((s) => ({ ...s, expanded: false })).concat(added));
    };

    const toggleSection = (sectionId) => {
        setSections((prev) => prev.map((s) => (s.id === sectionId ? { ...s, expanded: !s.expanded } : s)));
    };

    const handleRemoveSection = (sectionId) => {
        const toRemove = sections.find((s) => s.id === sectionId);
        if (toRemove?.serviceId) setDeletedServiceIds((d) => [...d, toRemove.serviceId]);
        setSections((prev) => prev.filter((s) => s.id !== sectionId));
    };

    const appendIfChanged = (formData, key, newVal, oldVal) => {
        if (newVal !== oldVal && newVal !== undefined && newVal !== null && newVal !== "") {
            formData.append(key, newVal);
        }
    };

    const handleSubmit = async (e) => {
        e?.preventDefault();
        if (!tour) return;

        const formData = new FormData();
        formData.append("id", id);

        appendIfChanged(formData, "Name", nameAz, tour.name);
        appendIfChanged(formData, "NameEng", nameEn, tour.nameEng);
        appendIfChanged(formData, "NameRu", nameRu, tour.nameRu);
        appendIfChanged(formData, "NameAlm", nameAlm, tour.nameAlm);
        appendIfChanged(formData, "NameArab", nameArab, tour.nameArab);

        appendIfChanged(formData, "Description", descAz, tour.description);
        appendIfChanged(formData, "DescriptionEng", descEn, tour.descriptionEng);
        appendIfChanged(formData, "DescriptionRu", descRu, tour.descriptionRu);
        appendIfChanged(formData, "DescriptionAlm", descAlm, tour.descriptionAlm);
        appendIfChanged(formData, "DescriptionArab", descArab, tour.descriptionArab);

        if (selectedFile) formData.append("CardImage", selectedFile);

        newTourImages.forEach((img) => formData.append("TourImages", img.file));
        deleteTourImageIds.forEach((imageId) => formData.append("DeleteTourImages", imageId));

        addedTourVideos.forEach((url) => formData.append("TourVideos", url));
        deleteTourVideos.forEach((video) => formData.append("DeleteTourVideos", video));

        selectedCars.forEach((carId) => formData.append("CarTourIds", carId));
        deletedCarIds.forEach((carId) => formData.append("DeleteCarTourIds", carId));

        selectedOtels.forEach((otelId) => formData.append("otelIds", otelId));
        deletedOtelIds.forEach((otelId) => formData.append("deleteOtelds", otelId));

        const servicesArray = sections
            .filter((s) => s.inputs.some((x) => x.trim() !== ""))
            .map((s) => ({
                id: s.serviceId,
                name: s.inputs[0],
                nameRU: s.inputs[1],
                nameEN: s.inputs[2],
                nameAL: s.inputs[3],
                nameAR: s.inputs[4],
            }));

        formData.append("servicesJson", JSON.stringify(servicesArray));
        deletedServiceIds.forEach((serviceId) => formData.append("deleteTourServiceIds", serviceId));

        try {
            await editTour(formData).unwrap();
            showToast(t(`${P}.toast.success`), "success");
            navigate("/admin/tours");
            refetch();
        } catch {
            showToast(t(`${P}.toast.error`), "error");
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

    const names = [
        { lang: "az", value: nameAz, set: setNameAz },
        { lang: "ru", value: nameRu, set: setNameRu },
        { lang: "en", value: nameEn, set: setNameEn },
        { lang: "de", value: nameAlm, set: setNameAlm },
        { lang: "ar", value: nameArab, set: setNameArab },
    ];
    const descriptions = [
        { lang: "az", value: descAz, set: setDescAz },
        { lang: "ru", value: descRu, set: setDescRu },
        { lang: "en", value: descEn, set: setDescEn },
        { lang: "de", value: descAlm, set: setDescAlm },
        { lang: "ar", value: descArab, set: setDescArab },
    ];
    const selectedLabel = (count) => t(`${P}.sections.relations.selected`, { count, defaultValue: "{{count}} seçilib" });
    const videosTitle = t(`${P}.sections.videos.title`, "Videolar");

    return (
        <form className="adm-form" onSubmit={handleSubmit} noValidate>
            <AdminPageHeader
                crumbs={[
                    { label: t(`${P}.breadcrumb.root`), to: "/admin/tours" },
                    { label: t(`${P}.breadcrumb.current`) },
                ]}
                title={t(`${P}.title`)}
                description={t(`${P}.description`)}
            />
            <div className="adm-form-grid">
                <FormSection title={t(`${P}.sections.name.title`)} description={t(`${P}.sections.name.desc`)}>
                    {names.map(({ lang, value, set }) => (
                        <LangField
                            key={lang}
                            lang={lang}
                            value={value}
                            onChange={(e) => set(e.target.value)}
                            placeholder={ot(`${P}.sections.name.placeholders.${lang}`)}
                        />
                    ))}
                </FormSection>

                <FormSection title={t(`${P}.sections.image.title`)} description={t(`${P}.sections.image.desc`)}>
                    <Dropzone onFiles={([file]) => setSelectedFile(file)} title={t(`${P}.sections.image.uploadText`)} />
                    {selectedFile ? (
                        <FilePreview file={selectedFile} single badge={at("newFile")} onRemove={() => setSelectedFile(null)} />
                    ) : oldImage && (
                        <FilePreview src={oldImage} single name={t(`${P}.sections.image.oldImage`)} badge={at("current")} />
                    )}
                </FormSection>

                <FormSection wide title={t(`${P}.sections.description.title`)} description={t(`${P}.sections.description.desc`)}>
                    <div className="adm-grid">
                        {descriptions.map(({ lang, value, set }) => (
                            <LangField
                                key={lang}
                                lang={lang}
                                multiline
                                rows={5}
                                value={value}
                                onChange={(e) => set(e.target.value)}
                                placeholder={ot(`${P}.sections.description.placeholders.${lang}`)}
                            />
                        ))}
                    </div>
                </FormSection>

                <FormSection wide title={t(`${P}.sections.offers.title`)} description={t(`${P}.sections.offers.desc`)}>
                    <TourOffers
                        prefix={P}
                        sections={sections}
                        onChange={handleInputChange}
                        onToggle={toggleSection}
                        onRemove={handleRemoveSection}
                        onAdd={handleAddSection}
                    />
                </FormSection>

                <FormSection
                    title={`${t(`${P}.sections.gallery.title`, "Qalereya şəkilləri")} (${oldTourImages.length + newTourImages.length})`}
                    description={t(`${P}.sections.gallery.desc`, "Tura aid şəkilləri əlavə edin / mövcudları silin")}
                >
                    <Dropzone multiple compact onFiles={addNewTourImages} />
                    {oldTourImages.length + newTourImages.length > 0 && (
                        <PreviewGrid>
                            {oldTourImages.map((img) => (
                                <FilePreview
                                    key={img.id || img.url || img}
                                    src={TOUR_IMAGES + (img.url || img)}
                                    name={img.name || img.url || img}
                                    badge={at("current")}
                                    onRemove={() => removeOldTourImage(img)}
                                />
                            ))}
                            {newTourImages.map((img) => (
                                <FilePreview key={img.id} file={img.file} badge={at("newFile")} onRemove={() => removeNewTourImage(img.id)} />
                            ))}
                        </PreviewGrid>
                    )}
                </FormSection>

                <FormSection
                    title={videosTitle}
                    description={t(`${P}.sections.videos.desc`, "Tura aid YouTube video linklərini əlavə edin / silin")}
                >
                    <div className="adm-inline">
                        <input
                            type="url"
                            className="adm-input"
                            placeholder="https://youtube.com/..."
                            aria-label={videosTitle}
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
                            {t(`${P}.sections.videos.addBtn`, at("add"))}
                        </button>
                    </div>
                    {tourVideos.length > 0 && (
                        <ul className="adm-list">
                            {tourVideos.map((video, index) => {
                                const url = video.url || video;
                                return (
                                    <li key={`${url}-${index}`} className="adm-list__item">
                                        <Video size={16} aria-hidden="true" />
                                        <span title={url}>{url}</span>
                                        <IconButton icon={X} label={at("remove")} onClick={() => removeVideo(index)} variant="danger" />
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </FormSection>

                <FormSection
                    title={t(`${P}.sections.relations.hotels`, "Otellər")}
                    description={`${t(`${P}.sections.relations.desc`, "Zəruri deyil")} · ${selectedLabel(selectedOtels.length)}`}
                >
                    <CheckList
                        items={otels.map((otel) => ({ id: otel.id, label: otel.name || otel.title || `Otel ${otel.id}` }))}
                        selected={selectedOtels}
                        onToggle={toggleOtelSelection}
                    />
                </FormSection>

                <FormSection
                    title={t(`${P}.sections.relations.cars`, "Avtomobillər")}
                    description={`${t(`${P}.sections.relations.desc`, "Zəruri deyil")} · ${selectedLabel(selectedCars.length)}`}
                >
                    <CheckList
                        items={cars.map((car) => ({ id: car.id, label: car.name || car.title || `Maşın ${car.id}` }))}
                        selected={selectedCars}
                        onToggle={toggleCarSelection}
                    />
                </FormSection>
            </div>
            <FormFooter
                cancelTo="/admin/tours"
                saving={isLoading}
                saveLabel={t(`${P}.buttons.save`)}
                savingLabel={t(`${P}.buttons.saving`)}
            />
        </form>
    );
}

export default ToursEdit;
