import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Loader2 } from "lucide-react";
import { useGetAllClinicQuery, useGetDoctorsByIdQuery, usePutDoctorsMutation } from "../../../../api/userApi.js";
import { CERT_DOKTOR_URL, DOCTOR_IMG_URL } from "../../../../config/mediaUrls.js";
import showToast from "../../../../utils/toast.js";
import AdminPageHeader from "../../../../components/admin/AdminPageHeader/index.jsx";
import { CheckList, FormFooter, FormSection } from "../../../../components/admin/FormKit/index.jsx";
import { Dropzone, FilePreview, PreviewGrid } from "../../../../components/admin/Dropzone/index.jsx";
import RatingPicker from "../../../../components/admin/RatingPicker/index.jsx";
import { useAdminT } from "../../../../components/admin/shared/adminStrings.js";
import LocalizedSection from "../shared/LocalizedSection.jsx";
import BioEditor from "../shared/BioEditor.jsx";
import { useBioSections } from "../shared/useBioSections.js";
import { appendLangs, emptyLangs, langsFromApi, newBioSection, nextLocalId } from "../shared/doctorForm.js";

function DoctorEdit() {
    const { t } = useTranslation();
    const at = useAdminT();
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: getAllClinic } = useGetAllClinicQuery();
    const clinic = getAllClinic?.data;
    const { data: getDoctorsById, isFetching, refetch } = useGetDoctorsByIdQuery(id);
    const doctor = getDoctorsById?.data;
    const [editDoctor, { isLoading }] = usePutDoctorsMutation();

    const [name, setName] = useState(emptyLangs);
    const [surName, setSurName] = useState(emptyLangs);
    const [role, setRole] = useState(emptyLangs);
    const [experience, setExperience] = useState("");
    const [rating, setRating] = useState(0);
    // New image (File) — the current server image is shown from `doctor`.
    const [selectedFile, setSelectedFile] = useState(null);
    // Certificates already on the server (file names) and newly added ones ([{ id, file }]).
    const [serverSertifikats, setServerSertifikats] = useState([]);
    const [newSertifikats, setNewSertifikats] = useState([]);
    const [activeClinics, setActiveClinics] = useState([]);
    const bio = useBioSections();
    const { setSections } = bio;

    useEffect(() => {
        if (!doctor) return;
        setName(langsFromApi(doctor, "name"));
        setSurName(langsFromApi(doctor, "surName"));
        setRole(langsFromApi(doctor, "role"));
        setExperience(doctor.experience || "");
        setRating(doctor.rate || 0);
        setSelectedFile(null);
        setServerSertifikats(doctor.doctorSertificates || []);
        setNewSertifikats([]);
        setActiveClinics(doctor.clinics?.map((c) => c.id) || []);
        setSections(
            doctor.bio?.length
                ? doctor.bio.map((b) => ({
                    id: b.id, // backend bio id — used to detect changed / deleted bios
                    expanded: true,
                    inputs: [b.name || "", b.nameEng || "", b.nameRu || "", b.nameAlm || "", b.nameArab || ""],
                }))
                : [newBioSection()],
        );
    }, [doctor, setSections]);

    useEffect(() => {
        refetch();
    }, [refetch]);

    const setLang = (setter) => (lang, value) => setter((prev) => ({ ...prev, [lang]: value }));

    const addSertifikats = (files) => {
        setNewSertifikats((prev) => [...prev, ...files.map((file) => ({ id: nextLocalId(), file }))]);
    };

    const toggleClinic = (clinicId) => {
        setActiveClinics((prev) => (prev.includes(clinicId) ? prev.filter((i) => i !== clinicId) : [...prev, clinicId]));
    };

    const handleSubmit = async (e) => {
        e?.preventDefault();
        try {
            const formData = new FormData();
            formData.append("id", id);
            appendLangs(formData, "name", name);
            appendLangs(formData, "surName", surName);
            appendLangs(formData, "role", role);
            formData.append("experience", experience);
            formData.append("rate", rating);
            formData.append("bornDate", "");

            // Only new and changed bios are sent.
            const existingBios = doctor?.bio || [];
            const updatedBios = bio.sections
                .map((s) => {
                    const oldBio = existingBios.find((b) => b.id === s.id);
                    const values = {
                        name: s.inputs[0],
                        nameEng: s.inputs[1],
                        nameRu: s.inputs[2],
                        nameAlm: s.inputs[3],
                        nameArab: s.inputs[4],
                    };
                    if (!oldBio) return values;
                    const changed = Object.keys(values).some((key) => oldBio[key] !== values[key]);
                    return changed ? { id: oldBio.id, ...values } : null;
                })
                .filter(Boolean);
            if (updatedBios.length > 0) {
                formData.append("biosJson", JSON.stringify(updatedBios));
            }

            if (selectedFile) formData.append("doctorImage", selectedFile);

            newSertifikats.forEach((item) => formData.append("doctorSertificates", item.file));
            (doctor?.doctorSertificates || [])
                .filter((oldFile) => !serverSertifikats.includes(oldFile))
                .forEach((f) => formData.append("deleteDoctorSertificates", f));

            const currentClinicIds = doctor?.clinics?.map((c) => c.id) || [];
            activeClinics
                .filter((clinicId) => !currentClinicIds.includes(clinicId))
                .forEach((clinicId) => formData.append("clinicIds", clinicId));
            currentClinicIds
                .filter((clinicId) => !activeClinics.includes(clinicId))
                .forEach((clinicId) => formData.append("deleteClinicIds", clinicId));

            // Bios removed from the form, or emptied completely, are deleted.
            existingBios
                .filter((b) => {
                    const section = bio.sections.find((s) => s.id === b.id);
                    return !section || section.inputs.every((v) => !v);
                })
                .forEach((b) => formData.append("deleteBioIds", b.id));

            await editDoctor(formData).unwrap();
            showToast(t("adminPanel.doctorEdit.toast.success"), "success");
            navigate("/admin/doctors");
            refetch();
        } catch {
            showToast(t("adminPanel.doctorEdit.toast.error"), "error");
        }
    };

    if (isFetching) {
        return (
            <div className="adm-loading" role="status">
                <Loader2 size={20} aria-hidden="true" />
                {t("adminPanel.doctorEdit.loading")}
            </div>
        );
    }

    return (
        <form className="adm-form" onSubmit={handleSubmit} noValidate>
            <AdminPageHeader
                crumbs={[
                    { label: t("adminPanel.doctorEdit.breadcrumb.root"), to: "/admin/doctors" },
                    { label: t("adminPanel.doctorEdit.breadcrumb.current") },
                ]}
                title={t("adminPanel.doctorEdit.title")}
                description={t("adminPanel.doctorEdit.description")}
            />
            <div className="adm-form-grid">
                <LocalizedSection
                    title={t("adminPanel.doctorEdit.sections.name.title")}
                    description={t("adminPanel.doctorEdit.sections.name.desc")}
                    values={name}
                    onChange={setLang(setName)}
                    placeholderKey="name"
                />
                <LocalizedSection
                    title={t("adminPanel.doctorEdit.sections.surname.title")}
                    description={t("adminPanel.doctorEdit.sections.surname.desc")}
                    values={surName}
                    onChange={setLang(setSurName)}
                    placeholderKey="surname"
                />
                <LocalizedSection
                    title={t("adminPanel.doctorEdit.sections.role.title")}
                    description={t("adminPanel.doctorEdit.sections.role.desc")}
                    values={role}
                    onChange={setLang(setRole)}
                    placeholderKey="role"
                />
                <FormSection
                    title={t("adminPanel.doctorEdit.sections.image.title")}
                    description={t("adminPanel.doctorEdit.sections.image.desc")}
                >
                    <Dropzone onFiles={([file]) => setSelectedFile(file)} label={t("adminPanel.doctorEdit.sections.image.title")} />
                    {(doctor?.doctorImage || selectedFile) && (
                        <PreviewGrid>
                            {doctor?.doctorImage && (
                                <FilePreview src={DOCTOR_IMG_URL + doctor.doctorImage} badge={at("current")} />
                            )}
                            {selectedFile && (
                                <FilePreview file={selectedFile} badge={at("newFile")} onRemove={() => setSelectedFile(null)} />
                            )}
                        </PreviewGrid>
                    )}
                </FormSection>

                <FormSection
                    title={t("adminPanel.doctorEdit.sections.experience.title")}
                    description={t("adminPanel.doctorEdit.sections.experience.desc")}
                >
                    <input
                        className="adm-input"
                        inputMode="numeric"
                        aria-label={t("adminPanel.doctorEdit.sections.experience.title")}
                        placeholder={t("adminPanel.doctorEdit.sections.experience.placeholder")}
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)}
                    />
                </FormSection>
                <FormSection
                    title={t("adminPanel.doctorEdit.sections.rating.title")}
                    description={t("adminPanel.doctorEdit.sections.rating.desc")}
                >
                    <RatingPicker value={rating} onChange={setRating} label={t("adminPanel.doctorEdit.sections.rating.title")} />
                </FormSection>

                <FormSection
                    title={t("adminPanel.doctorEdit.sections.clinic.title")}
                    description={t("adminPanel.doctorEdit.sections.clinic.desc")}
                >
                    <CheckList
                        items={clinic?.map((c) => ({ id: c.id, label: c.name }))}
                        selected={activeClinics}
                        onToggle={toggleClinic}
                    />
                </FormSection>
                <FormSection
                    title={t("adminPanel.doctorEdit.sections.certificate.title")}
                    description={t("adminPanel.doctorEdit.sections.certificate.desc")}
                >
                    <Dropzone multiple onFiles={addSertifikats} label={t("adminPanel.doctorEdit.sections.certificate.title")} />
                    {(serverSertifikats.length > 0 || newSertifikats.length > 0) && (
                        <PreviewGrid>
                            {serverSertifikats.map((fileName) => (
                                <FilePreview
                                    key={fileName}
                                    src={CERT_DOKTOR_URL + fileName}
                                    badge={at("current")}
                                    onRemove={() => setServerSertifikats((prev) => prev.filter((f) => f !== fileName))}
                                />
                            ))}
                            {newSertifikats.map((item) => (
                                <FilePreview
                                    key={item.id}
                                    file={item.file}
                                    badge={at("newFile")}
                                    onRemove={() => setNewSertifikats((prev) => prev.filter((f) => f.id !== item.id))}
                                />
                            ))}
                        </PreviewGrid>
                    )}
                </FormSection>

                <FormSection
                    wide
                    title={t("adminPanel.doctorEdit.sections.bio.title")}
                    description={t("adminPanel.doctorEdit.sections.bio.desc")}
                >
                    <BioEditor
                        sections={bio.sections}
                        onChange={bio.change}
                        onToggle={bio.toggle}
                        onRemove={bio.remove}
                        onAdd={bio.add}
                        canAdd={bio.canAdd}
                        placeholder={t("adminPanel.doctorEdit.sections.bio.placeholder")}
                    />
                </FormSection>
            </div>
            <FormFooter
                cancelTo="/admin/doctors"
                saving={isLoading}
                saveLabel={t("adminPanel.doctorEdit.buttons.save")}
                savingLabel={t("adminPanel.doctorEdit.buttons.saving")}
            />
        </form>
    );
}

export default DoctorEdit;
