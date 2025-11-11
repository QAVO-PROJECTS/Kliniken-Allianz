import './index.scss'
import Pagination from "../../../../components/UserComponents/Pagination/index.jsx";
import {useEffect, useState} from "react";
import editIcon from '/src/assets/adminEditİcon.svg'
import delIcon from '/src/assets/adminDelİcon.svg'
import deleteImgModal from '/src/assets/deleteModalImg.png'
import {useNavigate} from "react-router-dom";
import closeIcon from '/src/assets/accordionClose.svg'
import openIcon from '/src/assets/accordionOpen.svg'
import {useDeleteToursMutation, useGetAllToursQuery} from "../../../../services/userApi.jsx";
import {TOUR_CARD_IMG} from "../../../../contants.js";
import showToast from "../../../../components/ToastMessage.js";
import {useTranslation} from "react-i18next";
function ToursTableNew({language}) {
    const { t } = useTranslation();
    const {data:getAllTours,refetch} = useGetAllToursQuery();
    const tours = getAllTours?.data
    const [deleteTour, { isLoading: isDeleting }] = useDeleteToursMutation();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;
    const totalPages = Math.ceil(tours?.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = tours?.slice(startIndex, startIndex + itemsPerPage);
    const [openIndex, setOpenIndex] = useState(null);
    const navigate =useNavigate();
    const openDeleteModal = (item) => {
        setSelectedItem(item);
        setShowDeleteModal(true);
    };
    useEffect(() => {
        refetch()
    }, []);
    const getLocalizedName = (item) => {
        switch (language) {
            case "EN": return item.nameEng && item.nameEng.trim() !== "" ? item.nameEng : item.name;
            case "RU": return item.nameRu && item.nameRu.trim() !== "" ? item.nameRu : item.name;
            case "DE": return item.nameAlm && item.nameAlm.trim() !== "" ? item.nameAlm : item.name;
            case "AR": return item.nameArab && item.nameArab.trim() !== "" ? item.nameArab : item.name;
            default: return item.name;
        }
    };

    const getLocalizedDescription = (item) => {
        switch (language) {
            case "EN": return item.descriptionEng && item.descriptionEng.trim() !== "" ? item.descriptionEng : item.description;
            case "RU": return item.descriptionRu && item.descriptionRu.trim() !== "" ? item.descriptionRu : item.description;
            case "DE": return item.descriptionAlm && item.descriptionAlm.trim() !== "" ? item.descriptionAlm : item.description;
            case "AR": return item.descriptionArab && item.descriptionArab.trim() !== "" ? item.descriptionArab : item.description;
            default: return item.description;
        }
    };
    const closeModal = () => {
        setShowDeleteModal(false);
        setSelectedItem(null);
    };
    const toggleAccordion = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };
    const handleDelete = async () => {
        if (!selectedItem) return;
        try {
            await deleteTour(selectedItem.id).unwrap();
            showToast(t("adminPanel.toursTable.toast.deleteSuccess"), "success");
            setShowDeleteModal(false);
            setSelectedItem(null);
            refetch();
        } catch (error) {
            console.error("Silinmə zamanı xəta:", error);
            showToast(t("adminPanel.toursTable.toast.deleteError"), "error");
        }
    };

    return (
        <div id={'tours-table'}>
           <div className={'tours-table-wrapper'}>
               <div className="grid-header">
                   <div></div>
                   <div>{t("adminPanel.toursTable.headers.image")}</div>
                   <div>{t("adminPanel.toursTable.headers.name")}</div>
                   <div>{t("adminPanel.toursTable.headers.offer")}</div>
                   <div>{t("adminPanel.toursTable.headers.description")}</div>
                   <div>{t("adminPanel.toursTable.headers.actions")}</div>
               </div>

               <div className="grid-body">
                   {currentItems?.map((item, index) => {
                       const isOpen = openIndex === index; // true/false
                       return (
                           <div className="grid-row" key={index}>
                               <div>
                                   <input type="checkbox" />
                               </div>
                               <div className="icon">
                                   <img
                                       src={TOUR_CARD_IMG + item.cardImage}
                                       alt={getLocalizedName(item)}
                                   />
                               </div>
                               <div>{getLocalizedName(item)}</div>

                               {/* --- Təsvir --- */}
                               <div className={`count ${isOpen ? "open" : ""}`}>
                                   <p>
                                       {item.services && item.services.length > 0
                                           ? item.services?.map(s => s.name).join(", ")
                                           : "-"}
                                   </p>
                                   <button
                                       className="accordion-btn"
                                       onClick={() => toggleAccordion(index)}
                                   >
                                       <img src={isOpen ? openIcon : closeIcon} alt="toggle" />
                                   </button>
                               </div>

                               {/* --- Description --- */}
                               <div className={`name ${isOpen ? "open" : ""}`}>
                                   <p>{getLocalizedDescription(item) || "-"}</p>
                                   <button
                                       className="accordion-btn"
                                       onClick={() => toggleAccordion(index)}
                                   >
                                       <img src={isOpen ? openIcon : closeIcon} alt="toggle" />
                                   </button>

                               </div>

                               {/* --- Actions --- */}
                               <div className="actions">
                                   <div className="action edit" onClick={() => navigate(`/admin/tours/edit/${item.id}`)}>
                                       <img src={editIcon} />
                                   </div>
                                   <div className="action trash" onClick={() => openDeleteModal(item)}>
                                       <img src={delIcon} />
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
            {/* Delete Modal */}
            {showDeleteModal && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="delete-modal-content" onClick={(e) => e.stopPropagation()}>
                       <img src={deleteImgModal} className={'deleteImg'}/>
                        <h3>{t("adminPanel.toursTable.modal.title")}</h3>
                        <div className="modal-actions">
                            <button className="cancel" onClick={closeModal}>{t("adminPanel.toursTable.modal.cancel")}</button>
                            <button
                                className="confirm"
                                onClick={handleDelete}
                                disabled={isDeleting}
                            >
                                {isDeleting
                                    ? t("adminPanel.toursTable.modal.deleting")
                                    : t("adminPanel.toursTable.modal.confirm")}
                            </button>

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ToursTableNew;