import './index.scss';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Building2, MapPin } from 'lucide-react';
import { useGetAllClinicQuery } from '../../../../api/userApi.js';
import { CLINIC_CARD_IMAGES } from '../../../../config/mediaUrls.js';
import { getLocalizedText } from '../../../../i18n/getLocalizedText.js';
import SectionTitle from '../../../../components/ui/SectionTitle/index.jsx';
import HomeImage from '../shared/HomeImage.jsx';

// One feature tile + up to four smaller tiles; the rest live on /clinics.
const MAX_TILES = 5;

/** Layout family: asymmetric photo mosaic (one large tile + smaller tiles). */
function HomeClinic() {
    const { t } = useTranslation();
    const { data, isLoading } = useGetAllClinicQuery();
    const clinics = (data?.data || []).slice(0, MAX_TILES);
    const count = isLoading && !clinics.length ? MAX_TILES : clinics.length;

    if (!count) return null;

    return (
        <section id="home-clinic" className="section home-clinics">
            <div className="container">
                <div className="home-head">
                    <SectionTitle
                        title={t('homeClinic.title')}
                        desc={t('homeClinic.description')}
                        align="start"
                    />
                    <Link to="/clinics" className="btn btn--secondary home-more">
                        {t('homeClinic.moreButton')}
                        <ArrowRight size={18} strokeWidth={1.75} aria-hidden="true" />
                    </Link>
                </div>

                <ul className={`home-clinics__grid home-clinics__grid--${count}`}>
                    {clinics.length
                        ? clinics.map((clinic, i) => {
                            const name = getLocalizedText(clinic, 'name').trim();
                            const location = getLocalizedText(clinic, 'location');
                            return (
                                <li
                                    key={clinic.id}
                                    className="home-clinics__cell"
                                    data-reveal
                                    style={{ '--reveal-delay': `${i * 70}ms` }}
                                >
                                    <Link to={`/clinics/${clinic.id}`} className="home-clinics__tile">
                                        <HomeImage
                                            src={clinic.clinicCardImage && CLINIC_CARD_IMAGES + clinic.clinicCardImage}
                                            width={800}
                                            height={600}
                                            className="home-clinics__img"
                                            fallbackIcon={Building2}
                                            iconSize={i === 0 ? 48 : 32}
                                        />
                                        <span className="home-clinics__caption">
                                            <h3>{name}</h3>
                                            {location && (
                                                <span className="home-clinics__loc">
                                                    <MapPin size={15} strokeWidth={1.75} aria-hidden="true" />
                                                    {location}
                                                </span>
                                            )}
                                        </span>
                                    </Link>
                                </li>
                            );
                        })
                        : Array.from({ length: count }, (_, i) => (
                            <li key={i} className="home-clinics__cell home-clinics__skeleton" aria-hidden="true" />
                        ))}
                </ul>
            </div>
        </section>
    );
}

export default HomeClinic;
