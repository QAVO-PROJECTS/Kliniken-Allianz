import './index.scss';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, BadgeCheck, Hotel, MapPinned, Plane } from 'lucide-react';
import { useGetAllToursQuery } from '../../../../api/userApi.js';
import { TOUR_CARD_IMG } from '../../../../config/mediaUrls.js';
import { getLocalizedText } from '../../../../i18n/getLocalizedText.js';
import SectionTitle from '../../../../components/ui/SectionTitle/index.jsx';
import HomeImage from '../shared/HomeImage.jsx';
import { noDash } from '../shared/text.js';

const MAX_LIST = 5;

/** Layout family: editorial split, one featured tour + a short list. */
function HomeTour() {
    const { t } = useTranslation();
    const { data } = useGetAllToursQuery();
    const tours = data?.data || [];
    if (!tours.length) return null;

    const [featured, ...rest] = tours;
    const list = rest.slice(0, MAX_LIST);
    const includes = [
        { Icon: Hotel, label: t('tourCard.hotel') },
        { Icon: BadgeCheck, label: t('tourCard.visa') },
        { Icon: Plane, label: t('tourCard.flight') },
    ];
    const title = (item) => noDash(getLocalizedText(item, 'name'));
    const image = (item) => item?.cardImage && TOUR_CARD_IMG + item.cardImage;

    return (
        <section id="home-tour" className="section home-tours">
            <div className="container">
                <div className="home-head">
                    <SectionTitle
                        title={t('homeTour.title')}
                        desc={t('homeTour.description')}
                        align="start"
                    />
                    <Link to="/tours" className="btn btn--secondary home-more">
                        {t('homeClinic.moreButton')}
                        <ArrowRight size={18} strokeWidth={1.75} aria-hidden="true" />
                    </Link>
                </div>

                <div className={`home-tours__grid${list.length ? '' : ' is-single'}`}>
                    <Link to={`/tours/${featured.id}`} className="home-tours__feature" data-reveal>
                        <span className="home-tours__media">
                            <HomeImage
                                src={image(featured)}
                                width={1200}
                                height={750}
                                fallbackIcon={MapPinned}
                                iconSize={40}
                            />
                        </span>
                        <span className="home-tours__body">
                            <h3>{title(featured)}</h3>
                            <span className="home-tours__desc">
                                {noDash(getLocalizedText(featured, 'description'))}
                            </span>
                            <ul className="home-tours__includes">
                                {includes.map(({ Icon, label }) => (
                                    <li key={label}>
                                        <Icon size={16} strokeWidth={1.75} aria-hidden="true" />
                                        {label}
                                    </li>
                                ))}
                            </ul>
                            <span className="home-tours__cta">
                                {t('tourCard.apply')}
                                <ArrowRight size={18} strokeWidth={1.75} aria-hidden="true" />
                            </span>
                        </span>
                    </Link>

                    {list.length > 0 && (
                        <ul className="home-tours__list">
                            {list.map((tour, i) => (
                                <li key={tour.id} data-reveal style={{ '--reveal-delay': `${80 + i * 60}ms` }}>
                                    <Link to={`/tours/${tour.id}`} className="home-tours__row">
                                        <span className="home-tours__thumb">
                                            <HomeImage
                                                src={image(tour)}
                                                width={160}
                                                height={120}
                                                fallbackIcon={MapPinned}
                                                iconSize={22}
                                            />
                                        </span>
                                        <span className="home-tours__row-text">
                                            <h3>{title(tour)}</h3>
                                            <span>{noDash(getLocalizedText(tour, 'description'))}</span>
                                        </span>
                                        <span className="home-tours__go" aria-hidden="true">
                                            <ArrowRight size={18} strokeWidth={1.75} />
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </section>
    );
}

export default HomeTour;
