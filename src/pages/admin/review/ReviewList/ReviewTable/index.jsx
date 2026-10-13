import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { MessageSquareQuote, Pencil, Trash2, UserRound } from "lucide-react";
import { useDeleteCustomerViewMutation, useGetAllCustomerViewQuery } from "../../../../../api/userApi.js";
import { VIEW_CARD_IMAGES } from "../../../../../config/mediaUrls.js";
import AdminDataTable from "../../../../../components/admin/AdminDataTable/index.jsx";
import ExpandableText from "../../../../../components/admin/ExpandableText/index.jsx";
import IconButton from "../../../../../components/admin/IconButton/index.jsx";
import ConfirmDialog from "../../../../../components/admin/ConfirmDialog/index.jsx";
import { useDeleteConfirm } from "../../../../../components/admin/shared/useDeleteConfirm.js";
import { pickLocalized } from "../../../../../components/admin/shared/localize.js";
import { useAdminT } from "../../../../../components/admin/shared/adminStrings.js";

function SerhTableNew({ language }) {
    const { t } = useTranslation();
    const at = useAdminT();
    const { data: getAllCustomerView, isLoading, refetch } = useGetAllCustomerViewQuery();
    const views = getAllCustomerView?.data;
    const [deleteSerh, { isLoading: isDeleting }] = useDeleteCustomerViewMutation();
    const del = useDeleteConfirm(deleteSerh, {
        successMessage: t("adminPanel.commentTable.toast.success"),
        errorMessage: t("adminPanel.commentTable.toast.error"),
        onSuccess: refetch,
    });

    useEffect(() => {
        refetch();
    }, [refetch]);

    const review = (item) => pickLocalized(item, "reviewText", language);

    const columns = [
        {
            key: "image",
            header: t("adminPanel.commentTable.table.headers.image"),
            className: "is-thumb",
            render: (item) => (item.profilImage ? (
                <img className="adm-thumb adm-thumb--round" src={VIEW_CARD_IMAGES + item.profilImage} alt="" loading="lazy" decoding="async" />
            ) : (
                <UserRound className="adm-cell-muted" size={22} aria-hidden="true" />
            )),
        },
        {
            key: "author",
            header: t("adminPanel.commentTable.table.headers.author"),
            className: "is-nowrap",
            render: (item) => <span className="adm-cell-title">{item.customerName || "—"}</span>,
        },
        {
            key: "country",
            header: t("adminPanel.commentTable.table.headers.country"),
            className: "is-nowrap",
            render: (item) => (item.country ? item.country : <span className="adm-cell-muted">—</span>),
        },
        {
            key: "review",
            header: t("adminPanel.commentTable.table.headers.description"),
            render: (item) => <ExpandableText text={review(item)} />,
        },
        {
            key: "actions",
            header: <span className="visually-hidden">{t("adminPanel.commentTable.table.headers.actions")}</span>,
            className: "is-actions",
            render: (item) => (
                <div className="adm-actions">
                    <IconButton icon={Pencil} label={at("edit")} to={`/admin/serh/edit/${item.id}`} variant="brand" />
                    <IconButton icon={Trash2} label={at("delete")} onClick={() => del.ask(item)} variant="danger" />
                </div>
            ),
        },
    ];

    return (
        <>
            <AdminDataTable
                columns={columns}
                rows={views}
                loading={isLoading}
                searchText={(item) => `${item.customerName ?? ""} ${item.country ?? ""} ${review(item)}`}
                emptyTitle={t("adminPanel.commentTable.table.noData")}
                emptyIcon={MessageSquareQuote}
            />
            <ConfirmDialog
                open={del.isOpen}
                title={t("adminPanel.commentTable.table.deleteConfirm")}
                description={del.target ? `${del.target.customerName ?? ""} — ${at("deleteHint")}` : undefined}
                cancelLabel={t("adminPanel.commentTable.modal.cancel")}
                confirmLabel={t("adminPanel.commentTable.modal.confirm")}
                loadingLabel={t("adminPanel.commentTable.modal.deleting")}
                loading={isDeleting}
                onCancel={del.cancel}
                onConfirm={del.confirm}
            />
        </>
    );
}

export default SerhTableNew;
