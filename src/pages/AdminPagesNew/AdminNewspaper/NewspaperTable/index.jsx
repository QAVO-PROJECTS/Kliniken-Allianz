import './index.scss';
import Pagination from "../../../../components/UserComponents/Pagination/index.jsx";
import {useEffect, useState} from "react";
import editIcon from '/src/assets/adminEditİcon.svg'
import delIcon from '/src/assets/adminDelİcon.svg'
import deleteImgModal from '/src/assets/deleteModalImg.png'
import {useNavigate} from "react-router-dom";
import closeIcon from '/src/assets/accordionClose.svg'
import openIcon from '/src/assets/accordionOpen.svg'
import {useDeleteNewspaperMutation, useGetAllNewspaperQuery} from "../../../../services/userApi.jsx";
import {NEWSPAPER_IMAGES} from "../../../../contants.js";
import showToast from "../../../../components/ToastMessage.js";
import {useTranslation} from "react-i18next";

function NewspaperTableNew({language}) {
    const {t} = useTranslation();
    const {data: getAllNewspapers, refetch} = useGetAllNewspaperQuery();
    const newspapers = getAllNewspapers?.data;
    const [deleteNewspaper, {isLoading: isDeleting}] = useDeleteNewspaperMutation();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;
    const totalPages = Math.ceil((newspapers?.length || 0) / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = newspapers?.slice(startIndex, startIndex + itemsPerPage);
    const [openIndex, setOpenIndex] = useState(null);
    const navigate = useNavigate();

    useEffect(() => { refetch(); }, []);

    const openDeleteModal = (item) => {
        setSelectedItem(item);
        setShowDeleteModal(true);
    };

    const closeModal = () => {
        setShowDeleteModal(false);
        setSelectedItem(null);
    };

    const toggleAccordion = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const getLocalizedTitle = (item) => {
        switch (language) {
            case "EN": return item.titleEng?.trim() ? item.titleEng : item.title;
            case "RU": return item.titleRu?.trim() ? item.titleRu : item.title;
            case "DE": return item.titleAlm?.trim() ? item.titleAlm : item.title;
            case "AR": return item.titleArab?.trim() ? item.titleArab : item.title;
            default: return item.title;
        }
    };

    const getLocalizedSubtitle = (item) => {
        switch (language) {
            case "EN": return item.subtitleEng?.trim() ? item.subtitleEng : item.subtitle;
            case "RU": return item.subtitleRu?.trim() ? item.subtitleRu : item.subtitle;
            case "DE": return item.subtitleAlm?.trim() ? item.subtitleAlm : item.subtitle;
            case "AR": return item.subtitleArab?.trim() ? item.subtitleArab : item.subtitle;
            default: return item.subtitle;
        }
    };

    const handleDelete = async () => {
        if (!selectedItem) return;
        try {
            await deleteNewspaper(selectedItem.id).unwrap();
            closeModal();
            refetch();
            showToast(t("adminPanel.newspaperTable.toast.deleteSuccess"), "success");
        } catch (err) {
            console.error("Silinmə xətası:", err);
            showToast(t("adminPanel.newspaperTable.toast.deleteError"), "error");
        }
    };

    return (
        <div id={'Newspaper-table'}>
            <div className={'Newspaper-table-wrapper'}>
                <div className="grid-header">
                    <div></div>
                    <div>{t("adminPanel.newspaperTable.headers.image")}</div>
                    <div>{t("adminPanel.newspaperTable.headers.title")}</div>
                    <div>{t("adminPanel.newspaperTable.headers.subtitle")}</div>
                    <div>{t("adminPanel.newspaperTable.headers.actions")}</div>
                </div>

                <div className="grid-body">
                    {currentItems?.map((item, index) => {
                        const isOpen = openIndex === index;
                        // Use the array or possible singular depending on how backend outputs
                        const firstImage = item.newsPaperImages?.[0] || item.newspaperImages?.[0];
                        return (
                            <div className="grid-row newspaper-grid" key={index}>
                                <div>
                                    <input type="checkbox"/>
                                </div>
                                <div className="icon">
                                    {firstImage ? (
                                        <img src={NEWSPAPER_IMAGES + firstImage} alt={getLocalizedTitle(item)}/>
                                    ) : (
                                        <div className="no-img">📰</div>
                                    )}
                                </div>
                                <div>{getLocalizedTitle(item) || "-"}</div>
                                <div className={`count ${isOpen ? "open" : ""}`}>
                                    <p>{getLocalizedSubtitle(item) || "-"}</p>
                                    <button className="accordion-btn" onClick={() => toggleAccordion(index)}>
                                        <img src={isOpen ? openIcon : closeIcon} alt="toggle"/>
                                    </button>
                                </div>
                                <div className="actions">
                                    <div className="action edit" onClick={() => navigate(`/admin/newspaper/edit/${item.id}`)}>
                                        <img src={editIcon} alt="edit"/>
                                    </div>
                                    <div className="action trash" onClick={() => openDeleteModal(item)}>
                                        <img src={delIcon} alt="delete"/>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />

            {showDeleteModal && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="delete-modal-content" onClick={(e) => e.stopPropagation()}>
                        <img src={deleteImgModal} className={'deleteImg'} alt="delete"/>
                        <h3>{t("adminPanel.newspaperTable.modal.confirmDelete")}</h3>
                        <div className="modal-actions">
                            <button className="cancel" onClick={closeModal}>{t("adminPanel.newspaperTable.modal.cancel")}</button>
                            <button className="confirm" onClick={handleDelete} disabled={isDeleting}>
                                {isDeleting ? t("adminPanel.newspaperTable.modal.deleting") : t("adminPanel.newspaperTable.modal.delete")}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default NewspaperTableNew;
