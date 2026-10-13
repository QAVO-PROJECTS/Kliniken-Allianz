import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Building2, Pencil, Trash2 } from "lucide-react";
import { useDeleteClinicMutation, useGetAllClinicQuery } from "../../../../../api/userApi.js";
import { CLINIC_CARD_IMAGES } from "../../../../../config/mediaUrls.js";
import AdminDataTable from "../../../../../components/admin/AdminDataTable/index.jsx";
import IconButton from "../../../../../components/admin/IconButton/index.jsx";
import ExpandableText from "../../../../../components/admin/ExpandableText/index.jsx";
import ConfirmDialog from "../../../../../components/admin/ConfirmDialog/index.jsx";
import { useDeleteConfirm } from "../../../../../components/admin/shared/useDeleteConfirm.js";
import { pickLocalized } from "../../../../../components/admin/shared/localize.js";
import { useAdminT } from "../../../../../components/admin/shared/adminStrings.js";

// German clinics are stored with the Azerbaijani location "Almaniya".
const GERMANY = "Almaniya";

function ClinicTable({ language, isGermany }) {
    const { t } = useTranslation();
    const at = useAdminT();
    const { data: getAllClinic, isLoading, refetch } = useGetAllClinicQuery();
    const clinics = useMemo(
        () => getAllClinic?.data?.filter((item) => (isGermany ? item.location === GERMANY : item.location !== GERMANY)),
        [getAllClinic, isGermany],
    );
    const [deleteClinic, { isLoading: isDeleting }] = useDeleteClinicMutation();
    const del = useDeleteConfirm(deleteClinic, {
        successMessage: t("adminPanel.clinicTable.toast.deleteSuccess"),
        errorMessage: t("adminPanel.clinicTable.toast.deleteError"),
        onSuccess: refetch,
    });

    useEffect(() => {
        refetch();
    }, [refetch]);

    const name = (item) => pickLocalized(item, "name", language);
    const location = (item) => pickLocalized(item, "location", language);
    const editBase = isGermany ? "/admin/germany-clinic/edit" : "/admin/clinic/edit";

    const columns = [
        {
            key: "image",
            header: t("adminPanel.clinicTable.image"),
            className: "is-thumb",
            render: (item) => (
                <img className="adm-thumb" src={CLINIC_CARD_IMAGES + item.clinicCardImage} alt="" loading="lazy" decoding="async" />
            ),
        },
        {
            key: "name",
            header: t("adminPanel.clinicTable.name"),
            render: (item) => (
                <>
                    <span className="adm-cell-title">{name(item)}</span>
                    {location(item) && <span className="adm-cell-sub">{location(item)}</span>}
                </>
            ),
        },
        {
            key: "description",
            header: t("adminPanel.clinicTable.description"),
            render: (item) => <ExpandableText text={pickLocalized(item, "description", language)} />,
        },
        {
            key: "actions",
            header: <span className="visually-hidden">{t("adminPanel.clinicTable.actions")}</span>,
            className: "is-actions",
            render: (item) => (
                <div className="adm-actions">
                    <IconButton icon={Pencil} label={at("edit")} to={`${editBase}/${item.id}`} variant="brand" />
                    <IconButton icon={Trash2} label={at("delete")} onClick={() => del.ask(item)} variant="danger" />
                </div>
            ),
        },
    ];

    return (
        <>
            <AdminDataTable
                columns={columns}
                rows={clinics}
                loading={isLoading}
                searchText={(item) => `${name(item)} ${location(item)}`}
                emptyIcon={Building2}
            />
            <ConfirmDialog
                open={del.isOpen}
                title={t("adminPanel.clinicTable.deleteConfirmTitle")}
                description={del.target ? `${name(del.target)}: ${at("deleteHint")}` : undefined}
                cancelLabel={t("adminPanel.clinicTable.cancel")}
                confirmLabel={t("adminPanel.clinicTable.delete")}
                loadingLabel={t("adminPanel.clinicTable.deleting")}
                loading={isDeleting}
                onCancel={del.cancel}
                onConfirm={del.confirm}
            />
        </>
    );
}

export default ClinicTable;
