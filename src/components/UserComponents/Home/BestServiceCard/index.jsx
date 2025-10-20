import './index.scss';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {SERVICE_CARD_IMAGES, SERVICE_IMAGES} from "../../../../contants.js";

function BestServCard({ name, desc, img, imgAlt, icon, iconAlt,id }) {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <div className="col-3 col-md-6 col-sm-6 col-xs-6" onClick={() => navigate(`/services/${id}`)}>
            <div id="bestServCard">
                <div className="image">
                    <img src={SERVICE_IMAGES+img} alt={imgAlt} />
                    <div>
                        <img src={SERVICE_CARD_IMAGES +icon} alt={iconAlt} />
                    </div>
                </div>
                <div className="content">
                    <h4>{name}</h4>
                    <p>{desc}</p>
                    <div>
                        <button onClick={() => navigate(`/services/${id}`)}>
                            {t('bestServCard.button')}
                            <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
                                <g clip-path="url(#clip0_59_1769)">
                                    <path d="M14.839 12.19C14.6178 11.807 14.666 11.0165 14.7718 10.3153C14.9067 9.41149 15.1831 8.53123 15.6197 7.72923C15.9471 7.12794 16.389 6.47704 16.8825 6.19211M16.8825 6.19211C16.389 6.47704 15.6038 6.53458 14.9199 6.51714C14.0067 6.49371 13.1062 6.29299 12.2567 5.95888C11.5962 5.69943 10.8869 5.34489 10.6664 4.96288M16.8825 6.19211L4.49313 13.3451L16.8825 6.19211Z" fill="black"/>
                                    <path d="M14.839 12.19C14.6178 11.807 14.666 11.0165 14.7718 10.3153C14.9067 9.41149 15.1831 8.53123 15.6197 7.72923C15.9471 7.12794 16.389 6.47704 16.8825 6.19211M16.8825 6.19211C16.389 6.47704 15.6038 6.53458 14.9199 6.51714C14.0067 6.49371 13.1062 6.29299 12.2567 5.95888C11.5962 5.69943 10.8869 5.34489 10.6664 4.96288M16.8825 6.19211L4.49313 13.3451L16.8825 6.19211Z" fill="#0063A6"/>
                                    <path d="M14.839 12.19C14.6178 11.807 14.666 11.0165 14.7718 10.3153C14.9067 9.41149 15.1831 8.53123 15.6197 7.72923C15.9471 7.12794 16.389 6.47704 16.8825 6.19211M16.8825 6.19211C16.389 6.47704 15.6038 6.53458 14.9199 6.51714C14.0067 6.49371 13.1062 6.29299 12.2567 5.95888C11.5962 5.69943 10.8869 5.34489 10.6664 4.96288M16.8825 6.19211L4.49313 13.3451" stroke="black" stroke-width="0.794776"/>
                                </g>
                                <defs>
                                    <clipPath id="clip0_59_1769">
                                        <rect width="14.306" height="14.306" fill="white" transform="translate(20.4609 12.3867) rotate(150)"/>
                                    </clipPath>
                                </defs>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BestServCard;