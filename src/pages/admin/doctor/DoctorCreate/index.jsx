import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useGetAllClinicQuery, usePostDoctorsMutation } from "../../../../api/userApi.js";
import showToast from "../../../../utils/toast.js";
import AdminPageHeader from "../../../../components/admin/AdminPageHeader/index.jsx";
import { CheckList, FormFooter, FormSection } from "../../../../components/admin/FormKit/index.jsx";
import { Dropzone, FilePreview, PreviewGrid } from "../../../../components/admin/Dropzone/index.jsx";
import RatingPicker from "../../../../components/admin/RatingPicker/index.jsx";
import { useAdminT } from "../../../../components/admin/shared/adminStrings.js";
import LocalizedSection from "../shared/LocalizedSection.jsx";
import BioEditor from "../shared/BioEditor.jsx";
import { useBioSections } from "../shared/useBioSections.js";
import { appendLangs, emptyLangs, nextLocalId } from "../shared/doctorForm.js";

function DoctorAdd() {
    const { t } = useTranslation();
    const at = useAdminT();
    const navigate = useNavigate();
    const { data: getAllClinic } = useGetAllClinicQuery();
    const clinic = getAllClinic?.data;
    const [postDoctor, { isLoading }] = usePostDoctorsMutation();

    const [name, setName] = useState(emptyLangs);
    const [surName, setSurName] = useState(emptyLangs);
    const [role, setRole] = useState(emptyLangs);
    const [experience, setExperience] = useState("");
    const [rating, setRating] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    // [{ id, file }] — previews are created and revoked by <FilePreview>.
    const [sertifikatFiles, setSertifikatFiles] = useState([]);
    const [activeClinics, setActiveClinics] = useState([]);
    const bio = useBioSections();

    const setLang = (setter) => (lang, value) => setter((prev) => ({ ...prev, [lang]: value }));

    const addSertifikats = (files) => {
        setSertifikatFiles((prev) => [...prev, ...files.map((file) => ({ id: nextLocalId(), file }))]);
    };
    const removeSertifikat = (id) => {
        setSertifikatFiles((prev) => prev.filter((item) => item.id !== id));
    };

    const toggleClinic = (id) => {
        setActiveClinics((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
    };

    const handleSubmit = async (e) => {
        e?.preventDefault();
        try {
            const formData = new FormData();
            appendLangs(formData, "name", name);
            appendLangs(formData, "surName", surName);
            appendLangs(formData, "role", role);

            formData.append("rate", rating ?? 0);
            formData.append("experience", experience || "0");

            const bioObjects = bio.sections.map((s) => ({
                name: s.inputs[0] || "",
                nameEng: s.inputs[1] || "",
                nameRu: s.inputs[2] || "",
                nameAlm: s.inputs[3] || "",
                nameArab: s.inputs[4] || "",
            }));
            formData.append("biosJson", JSON.stringify(bioObjects));

            if (selectedFile) formData.append("doctorImage", selectedFile);
            sertifikatFiles.forEach((item) => formData.append("doctorSertificates", item.file));

            (clinic || [])
                .filter((c) => activeClinics.includes(c.id))
                .forEach((c) => formData.append("doctorClinicIds", c.id));

            await postDoctor(formData).unwrap();
            showToast(t("adminPanel.doctorAdd.toast.success"), "success");
            navigate("/admin/doctors");
        } catch {
            showToast(t("adminPanel.doctorAdd.toast.error"), "error");
        }
    };

    return (
        <form className="adm-form" onSubmit={handleSubmit} noValidate>
            <AdminPageHeader
                crumbs={[
                    { label: t("adminPanel.doctorAdd.breadcrumb.root"), to: "/admin/doctors" },
                    { label: t("adminPanel.doctorAdd.breadcrumb.current") },
                ]}
                title={t("adminPanel.doctorAdd.title")}
                description={t("adminPanel.doctorAdd.description")}
            />
            <div className="adm-form-grid">
                <LocalizedSection
                    title={t("adminPanel.doctorAdd.sections.name.title")}
                    description={t("adminPanel.doctorAdd.sections.name.desc")}
                    values={name}
                    onChange={setLang(setName)}
                    placeholderKey="name"
                />
                <LocalizedSection
                    title={t("adminPanel.doctorAdd.sections.surname.title")}
                    description={t("adminPanel.doctorAdd.sections.surname.desc")}
                    values={surName}
                    onChange={setLang(setSurName)}
                    placeholderKey="surname"
                />
                <LocalizedSection
                    title={t("adminPanel.doctorAdd.sections.role.title")}
                    description={t("adminPanel.doctorAdd.sections.role.desc")}
                    values={role}
                    onChange={setLang(setRole)}
                    placeholderKey="role"
                />
                <FormSection
                    title={t("adminPanel.doctorAdd.sections.image.title")}
                    description={t("adminPanel.doctorAdd.sections.image.desc")}
                >
                    <Dropzone onFiles={([file]) => setSelectedFile(file)} label={t("adminPanel.doctorAdd.sections.image.title")} />
                    {selectedFile && (
                        <FilePreview file={selectedFile} badge={at("newFile")} single onRemove={() => setSelectedFile(null)} />
                    )}
                </FormSection>

                <FormSection
                    title={t("adminPanel.doctorAdd.sections.experience.title")}
                    description={t("adminPanel.doctorAdd.sections.experience.desc")}
                >
                    <input
                        className="adm-input"
                        inputMode="numeric"
                        aria-label={t("adminPanel.doctorAdd.sections.experience.title")}
                        placeholder={t("adminPanel.doctorAdd.sections.experience.placeholder")}
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)}
                    />
                </FormSection>
                <FormSection
                    title={t("adminPanel.doctorAdd.sections.rating.title")}
                    description={t("adminPanel.doctorAdd.sections.rating.desc")}
                >
                    <RatingPicker value={rating} onChange={setRating} label={t("adminPanel.doctorAdd.sections.rating.title")} />
                </FormSection>

                <FormSection
                    title={t("adminPanel.doctorAdd.sections.clinic.title")}
                    description={t("adminPanel.doctorAdd.sections.clinic.desc")}
                >
                    <CheckList
                        items={clinic?.map((c) => ({ id: c.id, label: c.name }))}
                        selected={activeClinics}
                        onToggle={toggleClinic}
                    />
                </FormSection>
                <FormSection
                    title={t("adminPanel.doctorAdd.sections.certificate.title")}
                    description={t("adminPanel.doctorAdd.sections.certificate.desc")}
                >
                    <Dropzone multiple onFiles={addSertifikats} label={t("adminPanel.doctorAdd.sections.certificate.title")} />
                    {sertifikatFiles.length > 0 && (
                        <PreviewGrid>
                            {sertifikatFiles.map((item) => (
                                <FilePreview key={item.id} file={item.file} onRemove={() => removeSertifikat(item.id)} />
                            ))}
                        </PreviewGrid>
                    )}
                </FormSection>

                <FormSection
                    wide
                    title={t("adminPanel.doctorAdd.sections.bio.title")}
                    description={t("adminPanel.doctorAdd.sections.bio.desc")}
                >
                    <BioEditor
                        sections={bio.sections}
                        onChange={bio.change}
                        onToggle={bio.toggle}
                        onRemove={bio.remove}
                        onAdd={bio.add}
                        canAdd={bio.canAdd}
                        placeholder={t("adminPanel.doctorAdd.sections.bio.placeholder")}
                    />
                </FormSection>
            </div>
            <FormFooter
                cancelTo="/admin/doctors"
                saving={isLoading}
                saveLabel={t("adminPanel.doctorAdd.buttons.save")}
                savingLabel={t("adminPanel.doctorAdd.buttons.loading")}
            />
        </form>
    );
}

export default DoctorAdd;
