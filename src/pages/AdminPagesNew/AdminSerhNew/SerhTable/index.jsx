import './index.scss'
import Pagination from "../../../../components/UserComponents/Pagination/index.jsx";
import {useEffect, useState} from "react";
import editIcon from '/src/assets/adminEditİcon.svg'
import delIcon from '/src/assets/adminDelİcon.svg'
import deleteImgModal from '/src/assets/deleteModalImg.png'
import {useNavigate} from "react-router-dom";
import closeIcon from '/src/assets/accordionClose.svg'
import openIcon from '/src/assets/accordionOpen.svg'
import {useDeleteCustomerViewMutation, useGetAllCustomerViewQuery} from "../../../../services/userApi.jsx";
import {VIEW_CARD_IMAGES} from "../../../../contants.js";
import showToast from "../../../../components/ToastMessage.js";
import {useTranslation} from "react-i18next";
function SerhTableNew({language}) {
    const { t } = useTranslation();
    const {data:getAllCustomerView,isLoading,refetch } = useGetAllCustomerViewQuery()
    const views = getAllCustomerView?.data
    const [selectedId, setSelectedId] = useState(null);
    const [deleteSerh, { isLoading: isDeleting }] = useDeleteCustomerViewMutation();
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;
    const totalPages = Math.ceil(views?.length / itemsPerPage);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = views?.slice(startIndex, startIndex + itemsPerPage);
    const [openIndex, setOpenIndex] = useState(null);
    useEffect(() => {
        refetch()
    }, []);
    const navigate =useNavigate();
    const openDeleteModal = (id) => {
        setSelectedId(id);
        setShowDeleteModal(true);
    };

    const closeModal = () => {
        setSelectedId(null);
        setShowDeleteModal(false);
    };

    const toggleAccordion = (index) => {
        setOpenIndex(openIndex === index ? null : index);

    };
    const getLocalizedReview = (item) => {
        switch (language) {
            case "EN": return item.reviewTextEng || item.reviewText;
            case "RU": return item.reviewTextRu || item.reviewText;
            case "DE": return item.reviewTextAlm || item.reviewText;
            case "AR": return item.reviewTextArab || item.reviewText;
            default: return item.reviewText;
        }
    };
    const handleDelete = async () => {
        if (!selectedId) return;

        try {
            await deleteSerh(selectedId).unwrap();
            showToast(t("adminPanel.commentTable.toast.success"), "success");
            closeModal();
            refetch();
        } catch (err) {
            console.error("Delete error:", err);
            showToast(t("adminPanel.commentTable.toast.error"), "error");
        }
    };
    if (isLoading) return <p>{t("adminPanel.commentTable.table.loading")}</p>;

    return (
        <div id={'serh-table'}>
           <div className={'serh-table-wrapper'}>
               <div className="grid-header">
                   <div></div>
                   <div>{t("adminPanel.commentTable.table.headers.image")}</div>
                   <div>{t("adminPanel.commentTable.table.headers.author")}</div>
                   <div>{t("adminPanel.commentTable.table.headers.country")}</div>
                   <div>{t("adminPanel.commentTable.table.headers.description")}</div>
                   <div>{t("adminPanel.commentTable.table.headers.actions")}</div>
               </div>

               <div className="grid-body">
                   {currentItems.length > 0 ? (
                       currentItems.map((item, index) => {
                           const isOpen = openIndex === index;

                           return (
                               <div className="grid-row" key={item.id}>
                                   {/* Checkbox */}
                                   <div><input type="checkbox" /></div>

                                   {/* Şəkil */}
                                   <div className="icon">
                                       {item.profilImage ? (
                                           <img
                                               src={VIEW_CARD_IMAGES+ item.profilImage}
                                               alt="profil"
                                               className="profile-img"
                                           />
                                       ) : (
                                           <span>-</span>
                                       )}
                                   </div>

                                   {/* Ad */}
                                   <div>{item.customerName || "-"}</div>

                                   {/* Ölkə */}
                                   <div>{item.country || "-"}</div>

                                   {/* Təsvir */}
                                   <div className={`count ${isOpen ? "open" : ""}`}>
                                       <p>{getLocalizedReview(item)}</p>
                                       <button
                                           className="accordion-btn"
                                           onClick={() => toggleAccordion(index)}
                                       >
                                           <img src={isOpen ? openIcon : closeIcon} alt="toggle"/>
                                       </button>
                                   </div>


                                   {/* Fəaliyyətlər */}
                                   <div className="actions">
                                       <div
                                           className="action edit"
                                           onClick={() => navigate(`/admin/serh/edit/${item.id}`)}
                                       >
                                           <img src={editIcon} alt="edit"/>
                                       </div>
                                       <div
                                           className="action trash"
                                           onClick={()=>openDeleteModal(item.id)}
                                       >
                                           <img src={delIcon} alt="delete"/>
                                       </div>
                                   </div>
                               </div>
                           );
                       })
                   ) : (
                       <div className="no-data">
                           <p>{t("adminPanel.commentTable.table.noData")}</p>
                       </div>
                   )}
               </div>
           </div>
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
            {/* Delete Modal */}
            {showDeleteModal && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="delete-modal-content" onClick={(e) => e.stopPropagation()}>
                       <img src={deleteImgModal} className={'deleteImg'}/>
                        <h3>{t("adminPanel.commentTable.table.deleteConfirm")}</h3>
                        <div className="modal-actions">
                            <button className="cancel" onClick={closeModal}>
                                {t("adminPanel.commentTable.modal.cancel")}
                            </button>
                            <button
                                className="confirm"
                                onClick={handleDelete}
                                disabled={isDeleting}
                            >
                                {isDeleting
                                    ? t("adminPanel.commentTable.modal.deleting")
                                    : t("adminPanel.commentTable.modal.confirm")}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SerhTableNew;