import './index.scss'
import Pagination from "../../../../components/UserComponents/Pagination/index.jsx";
import {useEffect, useState} from "react";
import editIcon from '/src/assets/adminEditİcon.svg'
import delIcon from '/src/assets/adminDelİcon.svg'
import deleteImgModal from '/src/assets/deleteModalImg.png'
import {useNavigate} from "react-router-dom";
import starDolu from '/src/assets/doluUlduz.svg'
import starBos from '/src/assets/bosUlduz.svg'
import {useDeleteOtelsMutation, useGetAllOtelsQuery} from "../../../../services/userApi.jsx";
import {OTEL_CARD_IMAGES} from "../../../../contants.js";
import showToast from "../../../../components/ToastMessage.js";
function OtelTableNew({language}) {
    const {data:getAllOtels,refetch} = useGetAllOtelsQuery()
    const otels = getAllOtels?.data

    const [deleteOtel, { isLoading: isDeleting }] = useDeleteOtelsMutation()
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;
    const totalPages = Math.ceil(otels?.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = otels?.slice(startIndex, startIndex + itemsPerPage);


    const navigate =useNavigate();
    const openDeleteModal = (item) => {
        setSelectedItem(item);
        setShowDeleteModal(true);
    };

    const closeModal = () => {

        setShowDeleteModal(false);
        setSelectedItem(null);
    };
    const handleDelete = async () => {
        try {
            await deleteOtel(selectedItem.id).unwrap();
            showToast("Otel uğurla silindi ✅", "success");
            closeModal();
            refetch();
        } catch (err) {
            console.error("Silinmə xətası:", err);
            showToast("Oteli silmək mümkün olmadı ❌", "error");
        }
    };
    // 🔹 Ad (otel adı)
    const getLocalizedName = (item) => {
        switch (language) {
            case "EN":
                return item.nameEng && item.nameEng.trim() !== "" ? item.nameEng : item.name;
            case "RU":
                return item.nameRu && item.nameRu.trim() !== "" ? item.nameRu : item.name;
            case "DE":
                return item.nameAlm && item.nameAlm.trim() !== "" ? item.nameAlm : item.name;
            case "AR":
                return item.nameArab && item.nameArab.trim() !== "" ? item.nameArab : item.name;
            default:
                return item.name;
        }
    };

// 🔹 Yerləşdiyi ölkə (location)
    const getLocalizedLocation = (item) => {
        switch (language) {
            case "EN":
                return item.locationEng && item.locationEng.trim() !== "" ? item.locationEng : item.location;
            case "RU":
                return item.locationRu && item.locationRu.trim() !== "" ? item.locationRu : item.location;
            case "DE":
                return item.locationAlm && item.locationAlm.trim() !== "" ? item.locationAlm : item.location;
            case "AR":
                return item.locationArab && item.locationArab.trim() !== "" ? item.locationArab : item.location;
            default:
                return item.location;
        }
    };
    useEffect(() => {
        refetch()
    }, []);
    const renderStars = (raiting) => {
        const fullStars = Math.floor(raiting); // tam ulduz sayı
        const hasHalf = raiting % 1 >= 0.5;    // yarım ulduz varsa
        const totalStars = 5;

        return Array.from({length: totalStars}, (_, i) => {
            if (i < fullStars) return <img key={i} src={starDolu} alt="star" />;
            else if (i === fullStars && hasHalf) return <img key={i} src={starDolu} alt="half" style={{opacity: 0.6}} />;
            else return <img key={i} src={starBos} alt="empty" />;
        });
    };
    return (
        <div id={'otel-table'}>
           <div className={'otel-table-wrapper'}>
               <div className="grid-header">
                   <div></div>
                   <div>Şəkil</div>
                   <div>Adı</div>
                   <div>Yerləşdiyi ölkə</div>
                   <div>Reytinq</div>
                   <div>Fəaliyyətlər</div>
               </div>

               <div className="grid-body">
                   {currentItems?.map((item, index) => (
                       <div className="grid-row" key={item.id || index}>
                           <div>
                               <input type="checkbox" />
                           </div>
                           <div className="icon">
                               <img
                                   src={OTEL_CARD_IMAGES+item.cardImage}
                                   alt={getLocalizedName(item, "name")}

                               />
                           </div>

                           <div>{getLocalizedName(item)}</div>
                           <div>{getLocalizedLocation(item)}</div>

                           <div className="stars">
                               {renderStars(item.raiting || 0)}
                           </div>

                           <div className="actions">
                               <div className="action edit" onClick={() => navigate(`/admin/otel/edit/${item.id}`)}>
                                   <img src={editIcon}/>
                               </div>
                               <div className="action trash" onClick={() => openDeleteModal(item)}>
                                   <img src={delIcon}/>
                               </div>
                           </div>
                       </div>
                   ))}
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
                        <h3>Oteli silmək istədiyinizə əminsiz?</h3>
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

export default OtelTableNew;