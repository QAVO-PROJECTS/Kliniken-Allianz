import { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Pencil, Trash2 } from "lucide-react";
import {
    useDeleteServiceMutation,
    useGetAllServiceQuery,
    useGetCategoryByIdQuery,
} from "../../../../../api/userApi.js";
import AdminDataTable from "../../../../../components/admin/AdminDataTable/index.jsx";
import ExpandableText from "../../../../../components/admin/ExpandableText/index.jsx";
import IconButton from "../../../../../components/admin/IconButton/index.jsx";
import ConfirmDialog from "../../../../../components/admin/ConfirmDialog/index.jsx";
import { useDeleteConfirm } from "../../../../../components/admin/shared/useDeleteConfirm.js";
import { pickLocalized } from "../../../../../components/admin/shared/localize.js";
import { useAdminT } from "../../../../../components/admin/shared/adminStrings.js";

function CategoryTableServisNew({ language }) {
    const { t } = useTranslation();
    const at = useAdminT();
    const { id } = useParams();
    const { data: getCategoryById, isLoading, refetch } = useGetCategoryByIdQuery(id);
    // The category payload lists its services but not their clinics; one
    // get-all-services call (shared cache) fills them in instead of N get-service calls.
    const { data: getAllServices, isLoading: isLoadingServices } = useGetAllServiceQuery();
    const [deleteService, { isLoading: isDeleting }] = useDeleteServiceMutation();

    const services = useMemo(() => {
        const list = getCategoryById?.data?.services || [];
        const clinicsById = new Map((getAllServices?.data || []).map((s) => [s.id, s.clinics || []]));
        return list.map((srv) => ({
            ...srv,
            clinics: srv.clinics?.length ? srv.clinics : clinicsById.get(srv.id) || [],
        }));
    }, [getCategoryById, getAllServices]);

    const del = useDeleteConfirm(deleteService, {
        successMessage: t("adminPanel.categoryServiceTable.toast.success"),
        errorMessage: t("adminPanel.categoryServiceTable.toast.error"),
        onSuccess: refetch,
    });

    useEffect(() => {
        refetch();
    }, [refetch]);

    const name = (item) => pickLocalized(item, "name", language);

    const columns = [
        {
            key: "name",
            header: t("adminPanel.categoryServiceTable.name"),
            render: (item) => <span className="adm-cell-title">{name(item)}</span>,
        },
        {
            key: "description",
            header: t("adminPanel.categoryServiceTable.description"),
            render: (item) => <ExpandableText text={pickLocalized(item, "description", language)} />,
        },
        {
            key: "clinics",
            header: t("adminPanel.categoryServiceTable.clinics"),
            render: (item) => (
                <ExpandableText text={item.clinics.map((c) => pickLocalized(c, "name", language)).join(", ")} />
            ),
        },
        {
            key: "actions",
            header: <span className="visually-hidden">{t("adminPanel.categoryServiceTable.actions")}</span>,
            className: "is-actions",
            render: (item) => (
                <div className="adm-actions">
                    <IconButton icon={Pencil} label={at("edit")} to={`/admin/category/servis/edit/${item.id}`} variant="brand" />
                    <IconButton icon={Trash2} label={at("delete")} onClick={() => del.ask(item)} variant="danger" />
                </div>
            ),
        },
    ];

    return (
        <>
            <AdminDataTable
                columns={columns}
                rows={services}
                loading={isLoading || (isLoadingServices && services.length > 0)}
                searchText={name}
                emptyTitle={t("adminPanel.categoryServiceTable.noData")}
            />
            <ConfirmDialog
                open={del.isOpen}
                title={t("adminPanel.categoryServiceTable.deleteConfirmTitle")}
                description={del.target ? `${name(del.target)} — ${at("deleteHint")}` : undefined}
                cancelLabel={t("adminPanel.categoryServiceTable.cancel")}
                confirmLabel={t("adminPanel.categoryServiceTable.delete")}
                loadingLabel={t("adminPanel.categoryServiceTable.deleting")}
                loading={isDeleting}
                onCancel={del.cancel}
                onConfirm={del.confirm}
            />
        </>
    );
}

export default CategoryTableServisNew;
