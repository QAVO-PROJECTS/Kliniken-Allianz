import React, { useState } from 'react';
import './index.scss';
import {CERT_CLINIC_URL} from "../../../../contants.js";

const CardCertificate = ({ image, number, text, index }) => {
    const layoutClass = index % 2 === 0 ? 'layout1' : 'layout2';
    const [isModalOpen, setIsModalOpen] = useState(false);
    console.log(image)
    const openModal = () => setIsModalOpen(true);
    const closeModal = (e) => {
        // Modalın içindəki contentə kliklədikdə bağlanmaması üçün
        e.stopPropagation();
        setIsModalOpen(false);
    };

    return (
        <div className="col-2 col-md-4 col-sm-6 col-xs-6" style={{ padding: "8px" }}>
            <div id="card-certificate-clinic" style={{ backgroundImage: `url(${CERT_CLINIC_URL+image})` }} onClick={openModal}>
                <div className={`overlay ${layoutClass}`}>
                    <div className="number">{number}</div>
                    <div className="text">{text}</div>
                </div>
            </div>

            {isModalOpen && (
                <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <img src={CERT_CLINIC_URL+image} alt="Certificate" />
                        <button className="close-button" onClick={closeModal}>X</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CardCertificate;