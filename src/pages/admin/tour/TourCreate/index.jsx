import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Plus, X } from "lucide-react";
import { usePostToursMutation, useGetAllCarQuery, useGetAllOtelsQuery } from "../../../../api/userApi.js";
import showToast from "../../../../utils/toast.js";
import AdminPageHeader from "../../../../components/admin/AdminPageHeader/index.jsx";
import { CheckList, FormFooter, FormSection, LangField } from "../../../../components/admin/FormKit/index.jsx";
import { Dropzone, FilePreview, PreviewGrid } from "../../../../components/admin/Dropzone/index.jsx";
import IconButton from "../../../../components/admin/IconButton/index.jsx";
import { useAdminT, useOptionalT } from "../../../../components/admin/shared/adminStrings.js";
import TourOffers from "../TourOffers/index.jsx";

const P = "adminPanel.toursAdd";

function ToursAdd() {
    const { t } = useTranslation();
    const at = useAdminT();
    const ot = useOptionalT();
    const navigate = useNavigate();
    const [postTour, { isLoading }] = usePostToursMutation();

    const { data: getCars } = useGetAllCarQuery();
    const cars = getCars?.data || [];

    const { data: getOtels } = useGetAllOtelsQuery();
    const otels = getOtels?.data || [];

    const uid = useRef(1);
    const nextId = () => {
        uid.current += 1;
        return uid.current;
    };

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

    // Cover image + gallery (plain File objects; FilePreview manages the object URLs)
    const [selectedFile, setSelectedFile] = useState(null);
    const [tourImages, setTourImages] = useState([]);

    // YouTube links
    const [tourVideos, setTourVideos] = useState([{ id: 1, value: "" }]);

    // Relations
    const [selectedCars, setSelectedCars] = useState([]);
    const [selectedOtels, setSelectedOtels] = useState([]);

    // Offers (5 languages each)
    const [sections, setSections] = useState([
        { id: 1, expanded: true, inputs: Array(5).fill("") },
    ]);

    const addTourImages = (files) => {
        const added = files.map((file) => ({ id: nextId(), file }));
        setTourImages((prev) => [...prev, ...added]);
    };

    const removeTourImage = (imageId) => {
        setTourImages((prev) => prev.filter((img) => img.id !== imageId));
    };

    const handleVideoChange = (videoId, value) => {
        setTourVideos((prev) => prev.map((v) => (v.id === videoId ? { ...v, value } : v)));
    };

    const addVideoInput = () => {
        if (tourVideos[tourVideos.length - 1].value.trim() !== "") {
            const added = { id: nextId(), value: "" };
            setTourVideos((prev) => [...prev, added]);
        }
    };

    const removeVideoInput = (videoId) => {
        setTourVideos((prev) => prev.filter((v) => v.id !== videoId));
    };

    const toggleCarSelection = (carId) => {
        setSelectedCars((prev) => (prev.includes(carId) ? prev.filter((x) => x !== carId) : [...prev, carId]));
    };

    const toggleOtelSelection = (otelId) => {
        setSelectedOtels((prev) => (prev.includes(otelId) ? prev.filter((x) => x !== otelId) : [...prev, otelId]));
    };

    const handleInputChange = (sectionId, index, value) => {
        setSections((prev) =>
            prev.map((s) =>
                s.id === sectionId
                    ? { ...s, inputs: s.inputs.map((v, i) => (i === index ? value : v)) }
                    : s,
            ),
        );
    };

    const handleAddSection = () => {
        // The first three languages (AZ, RU, EN) of the last offer must be filled.
        const allFilled = sections[sections.length - 1].inputs.every((x, i) => x.trim() !== "" || i > 2);
        if (!allFilled) return;
        const newSection = { id: nextId(), expanded: true, inputs: Array(5).fill("") };
        setSections((prev) => prev.map((s) => ({ ...s, expanded: false })).concat(newSection));
    };

    const toggleSection = (sectionId) => {
        setSections((prev) => prev.map((s) => (s.id === sectionId ? { ...s, expanded: !s.expanded } : s)));
    };

    const handleRemoveSection = (sectionId) => {
        setSections((prev) => prev.filter((s) => s.id !== sectionId));
    };

    const handleSubmit = async (e) => {
        e?.preventDefault();
        const formData = new FormData();

        formData.append("Name", nameAz);
        formData.append("NameEng", nameEn);
        formData.append("NameRu", nameRu);
        formData.append("NameAlm", nameAlm);
        formData.append("NameArab", nameArab);

        formData.append("Description", descAz);
        formData.append("DescriptionEng", descEn);
        formData.append("DescriptionRu", descRu);
        formData.append("DescriptionAlm", descAlm);
        formData.append("DescriptionArab", descArab);

        if (selectedFile) {
            formData.append("CardImage", selectedFile);
        }

        tourImages.forEach((img) => formData.append("TourImages", img.file));
        tourVideos.filter((v) => v.value.trim() !== "").forEach((v) => formData.append("TourVideos", v.value));

        selectedCars.forEach((carId) => formData.append("CarTourIds", carId));
        selectedOtels.forEach((otelId) => formData.append("otelIds", otelId));

        const servicesArray = sections.map((section) => ({
            name: section.inputs[0],
            nameRU: section.inputs[1],
            nameEN: section.inputs[2],
            nameAL: section.inputs[3],
            nameAR: section.inputs[4],
        }));
        formData.append("servicesJson", JSON.stringify(servicesArray));

        try {
            await postTour(formData).unwrap();
            showToast(t(`${P}.toast.success`), "success");
            navigate("/admin/tours");
        } catch {
            showToast(t(`${P}.toast.error`), "error");
        }
    };

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
                    {selectedFile && (
                        <FilePreview file={selectedFile} single badge={at("newFile")} onRemove={() => setSelectedFile(null)} />
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
                    title={t(`${P}.sections.gallery.title`, "Qalereya şəkilləri")}
                    description={t(`${P}.sections.gallery.desc`, "Turun içərisində görünəcək çoxlu şəkillər əlavə edin")}
                >
                    <Dropzone multiple compact onFiles={addTourImages} />
                    {tourImages.length > 0 && (
                        <PreviewGrid>
                            {tourImages.map((img) => (
                                <FilePreview key={img.id} file={img.file} onRemove={() => removeTourImage(img.id)} />
                            ))}
                        </PreviewGrid>
                    )}
                </FormSection>

                <FormSection
                    title={t(`${P}.sections.videos.title`, "Videolar")}
                    description={t(`${P}.sections.videos.desc`, "Tura aid YouTube video linklərini əlavə edin")}
                >
                    {tourVideos.map((video, index) => (
                        <div key={video.id} className="adm-inline">
                            <input
                                type="url"
                                className="adm-input"
                                value={video.value}
                                onChange={(e) => handleVideoChange(video.id, e.target.value)}
                                placeholder="https://youtube.com/..."
                                aria-label={`${t(`${P}.sections.videos.title`, "Videolar")} ${index + 1}`}
                            />
                            {tourVideos.length > 1 && (
                                <IconButton icon={X} label={at("remove")} onClick={() => removeVideoInput(video.id)} variant="danger" />
                            )}
                        </div>
                    ))}
                    <button type="button" className="btn btn--secondary btn--sm tour-offers__add" onClick={addVideoInput}>
                        <Plus size={16} aria-hidden="true" />
                        {t(`${P}.sections.videos.addBtn`, "Video linki əlavə et")}
                    </button>
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

export default ToursAdd;
