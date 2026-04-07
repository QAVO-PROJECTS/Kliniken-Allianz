import './index.scss';
import Pagination from "../../../../components/UserComponents/Pagination/index.jsx";
import {useEffect, useState} from "react";
import editIcon from '/src/assets/adminEditİcon.svg'
import delIcon from '/src/assets/adminDelİcon.svg'
import deleteImgModal from '/src/assets/deleteModalImg.png'
import {useNavigate} from "react-router-dom";
import closeIcon from '/src/assets/accordionClose.svg'
import openIcon from '/src/assets/accordionOpen.svg'
import {useDeleteCarMutation, useGetAllCarQuery} from "../../../../services/userApi.jsx";
import {CAR_IMAGES} from "../../../../contants.js";
import showToast from "../../../../components/ToastMessage.js";

function CarTable({language}) {
    const {data: getAllCars, refetch} = useGetAllCarQuery();
    const cars = getAllCars?.data;
    const [deleteCar, {isLoading: isDeleting}] = useDeleteCarMutation();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;
    const totalPages = Math.ceil((cars?.length || 0) / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = cars?.slice(startIndex, startIndex + itemsPerPage);
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

    const getLocalizedName = (item) => {
        switch (language) {
            case "EN": return item.nameEng?.trim() ? item.nameEng : item.name;
            case "RU": return item.nameRu?.trim() ? item.nameRu : item.name;
            case "DE": return item.nameAlm?.trim() ? item.nameAlm : item.name;
            case "AR": return item.nameArab?.trim() ? item.nameArab : item.name;
            default: return item.name;
        }
    };

    const getLocalizedDescription = (item) => {
        switch (language) {
            case "EN": return item.descriptionEng?.trim() ? item.descriptionEng : item.description;
            case "RU": return item.descriptionRu?.trim() ? item.descriptionRu : item.description;
            case "DE": return item.descriptionAlm?.trim() ? item.descriptionAlm : item.description;
            case "AR": return item.descriptionArab?.trim() ? item.descriptionArab : item.description;
            default: return item.description;
        }
    };

    const handleDelete = async () => {
        if (!selectedItem) return;
        try {
            await deleteCar(selectedItem.id).unwrap();
            closeModal();
            refetch();
            showToast("Avtomobil uğurla silindi", "success");
        } catch (err) {
            console.error("Silinmə xətası:", err);
            showToast("Xəta baş verdi", "error");
        }
    };

    return (
        <div id={'Car-table'}>
            <div className={'Car-table-wrapper'}>
                <div className="grid-header">
                    <div></div>
                    <div>Şəkil</div>
                    <div>Ad</div>
                    <div>Tip</div>
                    <div>Qiymət</div>
                    <div>Təsvir</div>
                    <div>Əməliyyat</div>
                </div>

                <div className="grid-body">
                    {currentItems?.map((item, index) => {
                        const isOpen = openIndex === index;
                        const firstImage = item.carImages?.[0];
                        return (
                            <div className="grid-row" key={index}>
                                <div>
                                    <input type="checkbox"/>
                                </div>
                                <div className="icon">
                                    {firstImage ? (
                                        <img src={CAR_IMAGES + firstImage} alt={getLocalizedName(item)}/>
                                    ) : (
                                        <div className="no-img">🚗</div>
                                    )}
                                </div>
                                <div>{getLocalizedName(item)}</div>
                                <div>{item.type || "-"}</div>
                                <div>{item.price || "-"}</div>
                                <div className={`count ${isOpen ? "open" : ""}`}>
                                    <p>{getLocalizedDescription(item) || "-"}</p>
                                    <button className="accordion-btn" onClick={() => toggleAccordion(index)}>
                                        <img src={isOpen ? openIcon : closeIcon} alt="toggle"/>
                                    </button>
                                </div>
                                <div className="actions">
                                    <div className="action edit" onClick={() => navigate(`/admin/car/edit/${item.id}`)}>
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
                        <h3>Bu avtomobili silmək istədiyinizə əminsiniz?</h3>
                        <div className="modal-actions">
                            <button className="cancel" onClick={closeModal}>Ləğv et</button>
                            <button className="confirm" onClick={handleDelete} disabled={isDeleting}>
                                {isDeleting ? "Silinir..." : "Sil"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CarTable;