import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Pencil, Trash2 } from "lucide-react";
import { useDeleteSanatoriumMutation, useGetAllSanatoriumQuery } from "../../../../../api/userApi.js";
import { SANATORIUM_CARD_IMAGES } from "../../../../../config/mediaUrls.js";
import AdminDataTable from "../../../../../components/admin/AdminDataTable/index.jsx";
import IconButton from "../../../../../components/admin/IconButton/index.jsx";
import ExpandableText from "../../../../../components/admin/ExpandableText/index.jsx";
import ConfirmDialog from "../../../../../components/admin/ConfirmDialog/index.jsx";
import { useDeleteConfirm } from "../../../../../components/admin/shared/useDeleteConfirm.js";
import { pickLocalized } from "../../../../../components/admin/shared/localize.js";
import { useAdminT } from "../../../../../components/admin/shared/adminStrings.js";

function SanatoriumTableNew({ language }) {
    const { t } = useTranslation();
    const at = useAdminT();
    const { data: getAllSanatorium, isLoading, refetch } = useGetAllSanatoriumQuery();
    const sanatoriums = getAllSanatorium?.data;
    const [deleteSanatorium, { isLoading: isDeleting }] = useDeleteSanatoriumMutation();
    const del = useDeleteConfirm(deleteSanatorium, {
        successMessage: t("adminPanel.sanatoriumTable.toast.deleteSuccess"),
        errorMessage: t("adminPanel.sanatoriumTable.toast.deleteError"),
        onSuccess: refetch,
    });

    useEffect(() => {
        refetch();
    }, [refetch]);

    const name = (item) => pickLocalized(item, "name", language);
    const location = (item) => pickLocalized(item, "location", language);

    const columns = [
        {
            key: "image",
            header: t("adminPanel.sanatoriumTable.image"),
            className: "is-thumb",
            render: (item) => (
                <img
                    className="adm-thumb"
                    src={SANATORIUM_CARD_IMAGES + item.sanatoriumCardImage}
                    alt=""
                    loading="lazy"
                    decoding="async"
                />
            ),
        },
        {
            key: "name",
            header: t("adminPanel.sanatoriumTable.name"),
            render: (item) => (
                <>
                    <span className="adm-cell-title">{name(item)}</span>
                    {location(item) && <span className="adm-cell-sub">{location(item)}</span>}
                </>
            ),
        },
        {
            key: "description",
            header: t("adminPanel.sanatoriumTable.description"),
            render: (item) => <ExpandableText text={pickLocalized(item, "description", language)} />,
        },
        {
            key: "actions",
            header: <span className="visually-hidden">{t("adminPanel.sanatoriumTable.actions")}</span>,
            className: "is-actions",
            render: (item) => (
                <div className="adm-actions">
                    <IconButton icon={Pencil} label={at("edit")} to={`/admin/sanatorium/edit/${item.id}`} variant="brand" />
                    <IconButton icon={Trash2} label={at("delete")} onClick={() => del.ask(item)} variant="danger" />
                </div>
            ),
        },
    ];

    return (
        <>
            <AdminDataTable
                columns={columns}
                rows={sanatoriums}
                loading={isLoading}
                searchText={(row) => `${name(row)} ${location(row)}`}
            />
            <ConfirmDialog
                open={del.isOpen}
                title={t("adminPanel.sanatoriumTable.deleteConfirmTitle")}
                description={del.target ? `${name(del.target)} — ${at("deleteHint")}` : undefined}
                cancelLabel={t("adminPanel.sanatoriumTable.cancel")}
                confirmLabel={t("adminPanel.sanatoriumTable.delete")}
                loadingLabel={t("adminPanel.sanatoriumTable.deleting")}
                loading={isDeleting}
                onCancel={del.cancel}
                onConfirm={del.confirm}
            />
        </>
    );
}

export default SanatoriumTableNew;
