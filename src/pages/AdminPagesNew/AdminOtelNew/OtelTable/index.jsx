import './index.scss'
import Pagination from "../../../../components/UserComponents/Pagination/index.jsx";
import {useState} from "react";
import editIcon from '/src/assets/adminEditİcon.svg'
import delIcon from '/src/assets/adminDelİcon.svg'
import deleteImgModal from '/src/assets/deleteModalImg.png'
import {useNavigate} from "react-router-dom";
import starDolu from '/src/assets/doluUlduz.svg'
function OtelTableNew() {
    const arr = [
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
    ]
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;
    const totalPages = Math.ceil(arr.length / itemsPerPage);
    const [activeIcon, setActiveIcon] = useState(null);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = arr.slice(startIndex, startIndex + itemsPerPage);
    const [openIndex, setOpenIndex] = useState(null);
    const openEditModal = (item) => {
        setSelectedItem(item);
        setShowEditModal(true);
    };
    const navigate =useNavigate();
    const openDeleteModal = (item) => {
        setSelectedItem(item);
        setShowDeleteModal(true);
    };

    const closeModal = () => {
        setShowEditModal(false);
        setShowDeleteModal(false);
        setSelectedItem(null);
    };
    const toggleAccordion = (index) => {
        setOpenIndex(openIndex === index ? null : index);
        setIsOpen(true);
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
                   {currentItems.map((item, index) => {
                       const isOpen = openIndex === index; // true/false
                       return (
                           <div className="grid-row" key={index}>
                               <div>
                                   <input type="checkbox" />
                               </div>
                               <div className="icon">
                                   {item.icon}
                               </div>
                               <div>Xərçəng müalicəsi</div>

                               {/* --- Təsvir --- */}
                               <div>
                                   Almanya
                               </div>
                               <div>
                                   <img src={starDolu}/>
                                   <img src={starDolu}/>
                                   <img src={starDolu}/>
                                   <img src={starDolu}/>
                                   <img src={starDolu}/>
                               </div>


                               {/* --- Actions --- */}
                               <div className="actions">
                                   <div className="action edit" onClick={() => navigate('/admin/otel/edit/:id')}>
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
                        <h3>Oteli silmək istədiyinizə əminsiz?</h3>
                        <div className="modal-actions">
                            <button className="cancel" onClick={closeModal}>Ləğv et</button>
                            <button className="confirm">Sil</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default OtelTableNew;