import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Stethoscope } from 'lucide-react';
import './index.scss';
import CardSlot from '../CardSlot.jsx';
import { CATEGORY_IMAGES } from '../../../config/mediaUrls.js';

/**
 * Icon card for a medical service. Links to /category/:id (a SERVICE id).
 * Props: id, name, desc, icon (category image file name); [bare]; [wrapperClassName]
 * (`isService` is accepted for backwards compatibility and ignored.)
 */
// eslint-disable-next-line no-unused-vars
function HomeServiceCard({ name, desc, icon, id, isService, bare = false, wrapperClassName = 'col-15 col-md-30 col-sm-30 col-xs-30' }) {
    const { t } = useTranslation();
    const [iconFailed, setIconFailed] = useState(false);

    return (
        <CardSlot bare={bare} className={wrapperClassName}>
            <Link to={`/category/${id}`} className="service-card">
                <span className="service-card__icon">
                    {icon && !iconFailed ? (
                        <img
                            src={CATEGORY_IMAGES + icon}
                            alt=""
                            loading="lazy"
                            decoding="async"
                            onError={() => setIconFailed(true)}
                        />
                    ) : (
                        <Stethoscope size={26} strokeWidth={1.75} aria-hidden="true" />
                    )}
                </span>
                <h3 className="service-card__title">{name}</h3>
                {desc && <p className="service-card__desc">{desc}</p>}
                <span className="service-card__more">
                    {t('homeServiceCard.button')}
                    <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
                </span>
            </Link>
        </CardSlot>
    );
}

export default HomeServiceCard;
