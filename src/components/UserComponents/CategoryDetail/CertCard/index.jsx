import { useState } from 'react';
import './index.scss';
import {CERT_DOKTOR_URL} from "../../../../contants.js";
import ReactDOM from 'react-dom';
const CardCertificateCategory = ({ image, number, text, index }) => {
    const layoutClass = index % 2 === 0 ? 'layout1' : 'layout2';
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = (e) => {
        // Modalın içindəki contentə kliklədikdə bağlanmaması üçün
        e.stopPropagation();
        setIsModalOpen(false);
    };
    let numbers = number;
    if(numbers<10){
        numbers = "0"+numbers;
    }
    const modalElement = isModalOpen ? ReactDOM.createPortal(
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <img src={image} alt="Certificate" />
                <button className="close-button" onClick={closeModal}>X</button>
            </div>
        </div>,
        document.body // 👈 modalı birbaşa body içində göstər
    ) : null;
    return (
        <div className="col-60 col-md-60 col-sm-60 col-xs-60" style={{ padding: "8px" }}>
            <div className="card-certificate-doktor"
                 // style={{ backgroundImage: `url(${CERT_DOKTOR_URL+image})` }}
                 style={{ backgroundImage: `url(${image})` }}
                 onClick={openModal}>
                <div className={`overlay ${layoutClass}`}>
                    <div className="number">{numbers}</div>
                    <div className="text">{text}</div>
                </div>
            </div>

            {modalElement}
        </div>
    );
};

export default CardCertificateCategory;