import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Pencil, Stethoscope, Trash2 } from "lucide-react";
import { useDeleteDoctorsMutation, useGetAllDoctorsQuery } from "../../../../../api/userApi.js";
import { DOCTOR_IMG_URL } from "../../../../../config/mediaUrls.js";
import AdminDataTable from "../../../../../components/admin/AdminDataTable/index.jsx";
import IconButton from "../../../../../components/admin/IconButton/index.jsx";
import ExpandableText from "../../../../../components/admin/ExpandableText/index.jsx";
import ConfirmDialog from "../../../../../components/admin/ConfirmDialog/index.jsx";
import { useDeleteConfirm } from "../../../../../components/admin/shared/useDeleteConfirm.js";
import { pickLocalized } from "../../../../../components/admin/shared/localize.js";
import { useAdminT } from "../../../../../components/admin/shared/adminStrings.js";

function DoctorTable({ language }) {
    const { t } = useTranslation();
    const at = useAdminT();
    const { data: getAllDoctors, isLoading, refetch } = useGetAllDoctorsQuery();
    const doctors = getAllDoctors?.data;
    const [deleteDoctor, { isLoading: isDeleting }] = useDeleteDoctorsMutation();
    const del = useDeleteConfirm(deleteDoctor, {
        successMessage: t("adminPanel.doctorTable.toast.success"),
        errorMessage: t("adminPanel.doctorTable.toast.error"),
        onSuccess: refetch,
    });

    useEffect(() => {
        refetch();
    }, [refetch]);

    const fullName = (item) =>
        [pickLocalized(item, "name", language), pickLocalized(item, "surName", language)].filter(Boolean).join(" ");
    const role = (item) => pickLocalized(item, "role", language);
    const clinics = (item) => (item.clinics || []).map((c) => pickLocalized(c, "name", language)).filter(Boolean).join(", ");

    const columns = [
        {
            key: "image",
            header: t("adminPanel.doctorTable.headers.image"),
            className: "is-thumb",
            render: (item) => (
                <img
                    className="adm-thumb adm-thumb--round"
                    src={DOCTOR_IMG_URL + item.doctorImage}
                    alt=""
                    loading="lazy"
                    decoding="async"
                />
            ),
        },
        {
            key: "name",
            header: `${t("adminPanel.doctorTable.headers.name")} / ${t("adminPanel.doctorTable.headers.role")}`,
            className: "is-nowrap",
            render: (item) => (
                <>
                    <span className="adm-cell-title">{fullName(item)}</span>
                    {role(item) && <span className="adm-cell-sub">{role(item)}</span>}
                </>
            ),
        },
        {
            key: "experience",
            header: t("adminPanel.doctorTable.headers.experience"),
            className: "is-num",
            render: (item) => <span className="badge">{item.experience ?? 0}</span>,
        },
        {
            key: "clinics",
            header: t("adminPanel.doctorAdd.sections.clinic.title"),
            render: (item) => <ExpandableText text={clinics(item)} fallback={t("adminPanel.doctorTable.notAssigned")} />,
        },
        {
            key: "actions",
            header: <span className="visually-hidden">{t("adminPanel.doctorTable.headers.actions")}</span>,
            className: "is-actions",
            render: (item) => (
                <div className="adm-actions">
                    <IconButton icon={Pencil} label={at("edit")} to={`/admin/doctors/edit/${item.id}`} variant="brand" />
                    <IconButton icon={Trash2} label={at("delete")} onClick={() => del.ask(item)} variant="danger" />
                </div>
            ),
        },
    ];

    return (
        <>
            <AdminDataTable
                columns={columns}
                rows={doctors}
                loading={isLoading}
                searchText={(row) => `${fullName(row)} ${role(row)} ${clinics(row)}`}
                emptyTitle={t("adminPanel.doctorTable.noData")}
                emptyIcon={Stethoscope}
            />
            <ConfirmDialog
                open={del.isOpen}
                title={t("adminPanel.doctorTable.modal.confirm")}
                description={del.target ? `${fullName(del.target)}: ${at("deleteHint")}` : undefined}
                cancelLabel={t("adminPanel.doctorTable.modal.cancel")}
                confirmLabel={t("adminPanel.doctorTable.modal.delete")}
                loadingLabel={t("adminPanel.doctorTable.modal.deleting")}
                loading={isDeleting}
                onCancel={del.cancel}
                onConfirm={del.confirm}
            />
        </>
    );
}

export default DoctorTable;
