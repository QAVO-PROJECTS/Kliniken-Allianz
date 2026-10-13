import './index.scss';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useMediaQuery } from 'react-responsive';
import { ArrowRight, Stethoscope } from 'lucide-react';
import SectionTitle from '../../../../components/ui/SectionTitle/index.jsx';
import { useGetAllCategoryQuery } from '../../../../api/userApi.js';
import { getLocalizedText } from '../../../../i18n/getLocalizedText.js';
import { CATEGORY_IMAGES } from '../../../../config/mediaUrls.js';
import labVideo from '../../../../assets/video/services-lab.mp4';
import labPoster from '../../../../assets/video/services-lab-poster.jpg';
import useLazyVideo from '../useLazyVideo.js';
import HomeImage from '../shared/HomeImage.jsx';

const MAX_SERVICES = 6;

/** Layout family: tall video tile beside a two-column service grid. */
function HomeServices() {
    const { t } = useTranslation();
    const { data, isLoading } = useGetAllCategoryQuery();
    const reduceMotion = useMediaQuery({ query: '(prefers-reduced-motion: reduce)' });
    const videoRef = useLazyVideo({ enabled: !reduceMotion });

    const services = (data?.data || [])
        .map((category) => ({ category, service: category.services?.[0] }))
        .filter(({ service }) => service)
        .slice(0, MAX_SERVICES);

    if (!isLoading && !services.length) return null;

    return (
        <section id="home-services" className="section section--subtle home-services">
            <div className="container">
                <SectionTitle
                    title={t('homeServices.title')}
                    desc={t('homeServices.description')}
                    align="start"
                />
                <div className="home-services__grid">
                    <div className="home-services__media" data-reveal>
                        <video
                            ref={videoRef}
                            muted
                            loop
                            playsInline
                            preload="none"
                            poster={labPoster}
                            aria-hidden="true"
                            tabIndex={-1}
                        >
                            <source src={labVideo} type="video/mp4" />
                        </video>
                    </div>

                    <ul className={`home-services__list${services.length % 2 ? ' is-odd' : ''}`}>
                        {isLoading && !services.length
                            ? Array.from({ length: MAX_SERVICES }, (_, i) => (
                                <li key={i} className="home-services__skeleton" aria-hidden="true" />
                            ))
                            : services.map(({ category, service }, i) => {
                                const name = getLocalizedText(service, 'name');
                                const desc = getLocalizedText(service, 'description');
                                return (
                                    <li
                                        key={category.id}
                                        data-reveal
                                        style={{ '--reveal-delay': `${(i % 2) * 80 + Math.floor(i / 2) * 60}ms` }}
                                    >
                                        <Link to={`/category/${service.id}`} className="home-services__item">
                                            <span className="home-services__icon">
                                                <HomeImage
                                                    src={category.categoryImage && CATEGORY_IMAGES + category.categoryImage}
                                                    width={28}
                                                    height={28}
                                                    fallbackIcon={Stethoscope}
                                                    iconSize={24}
                                                />
                                            </span>
                                            <span className="home-services__text">
                                                <h3>{name}</h3>
                                                {desc && <span className="home-services__desc">{desc}</span>}
                                            </span>
                                            <span className="home-services__go" aria-hidden="true">
                                                <ArrowRight size={18} strokeWidth={1.75} />
                                            </span>
                                        </Link>
                                    </li>
                                );
                            })}
                    </ul>
                </div>
            </div>
        </section>
    );
}

export default HomeServices;
