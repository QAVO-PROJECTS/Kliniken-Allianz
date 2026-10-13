import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Newspaper, Pencil, Trash2 } from "lucide-react";
import { useDeleteNewspaperMutation, useGetAllNewspaperQuery } from "../../../../../api/userApi.js";
import { NEWSPAPER_IMAGES } from "../../../../../config/mediaUrls.js";
import AdminDataTable from "../../../../../components/admin/AdminDataTable/index.jsx";
import ExpandableText from "../../../../../components/admin/ExpandableText/index.jsx";
import IconButton from "../../../../../components/admin/IconButton/index.jsx";
import ConfirmDialog from "../../../../../components/admin/ConfirmDialog/index.jsx";
import { useDeleteConfirm } from "../../../../../components/admin/shared/useDeleteConfirm.js";
import { pickLocalized } from "../../../../../components/admin/shared/localize.js";
import { useAdminT } from "../../../../../components/admin/shared/adminStrings.js";

// The API has returned both spellings of the images array over time.
const firstImage = (item) => item.newsPaperImages?.[0] || item.newspaperImages?.[0];

function NewspaperTableNew({ language }) {
    const { t } = useTranslation();
    const at = useAdminT();
    const { data: getAllNewspapers, isLoading, refetch } = useGetAllNewspaperQuery();
    const newspapers = getAllNewspapers?.data;
    const [deleteNewspaper, { isLoading: isDeleting }] = useDeleteNewspaperMutation();
    const del = useDeleteConfirm(deleteNewspaper, {
        successMessage: t("adminPanel.newspaperTable.toast.deleteSuccess"),
        errorMessage: t("adminPanel.newspaperTable.toast.deleteError"),
        onSuccess: refetch,
    });

    useEffect(() => {
        refetch();
    }, [refetch]);

    const title = (item) => pickLocalized(item, "title", language);

    const columns = [
        {
            key: "image",
            header: t("adminPanel.newspaperTable.headers.image"),
            className: "is-thumb",
            render: (item) => {
                const image = firstImage(item);
                return image ? (
                    <img className="adm-thumb adm-thumb--wide" src={NEWSPAPER_IMAGES + image} alt="" loading="lazy" decoding="async" />
                ) : (
                    <span className="adm-cell-muted">-</span>
                );
            },
        },
        {
            key: "title",
            header: t("adminPanel.newspaperTable.headers.title"),
            render: (item) => <span className="adm-cell-title">{title(item) || "-"}</span>,
        },
        {
            key: "subtitle",
            header: t("adminPanel.newspaperTable.headers.subtitle"),
            render: (item) => <ExpandableText text={pickLocalized(item, "subtitle", language)} />,
        },
        {
            key: "actions",
            header: <span className="visually-hidden">{t("adminPanel.newspaperTable.headers.actions")}</span>,
            className: "is-actions",
            render: (item) => (
                <div className="adm-actions">
                    <IconButton icon={Pencil} label={at("edit")} to={`/admin/newspaper/edit/${item.id}`} variant="brand" />
                    <IconButton icon={Trash2} label={at("delete")} onClick={() => del.ask(item)} variant="danger" />
                </div>
            ),
        },
    ];

    return (
        <>
            <AdminDataTable
                columns={columns}
                rows={newspapers}
                loading={isLoading}
                searchText={(item) => `${title(item)} ${pickLocalized(item, "subtitle", language)}`}
                emptyIcon={Newspaper}
            />
            <ConfirmDialog
                open={del.isOpen}
                title={t("adminPanel.newspaperTable.modal.confirmDelete")}
                description={del.target ? `${title(del.target)}: ${at("deleteHint")}` : undefined}
                cancelLabel={t("adminPanel.newspaperTable.modal.cancel")}
                confirmLabel={t("adminPanel.newspaperTable.modal.delete")}
                loadingLabel={t("adminPanel.newspaperTable.modal.deleting")}
                loading={isDeleting}
                onCancel={del.cancel}
                onConfirm={del.confirm}
            />
        </>
    );
}

export default NewspaperTableNew;
