import './index.scss';
import { useTranslation } from 'react-i18next';
import { useMediaQuery } from 'react-responsive';
import HomeServiceCard from '../../../../components/cards/ServiceCard/index.jsx';
import SectionTitle from '../../../../components/ui/SectionTitle/index.jsx';
import { useGetAllCategoryQuery } from '../../../../api/userApi.js';
import { getLocalizedText } from '../../../../i18n/getLocalizedText.js';
import labVideo from '../../../../assets/video/services-lab.mp4';
import labPoster from '../../../../assets/video/services-lab-poster.jpg';
import useLazyVideo from '../useLazyVideo.js';

function HomeServices() {
    const { t } = useTranslation();
    const { data } = useGetAllCategoryQuery();
    const reduceMotion = useMediaQuery({ query: '(prefers-reduced-motion: reduce)' });
    const videoRef = useLazyVideo({ enabled: !reduceMotion });

    const services = (data?.data || [])
        .slice(0, 6)
        .map((category) => ({ category, service: category.services?.[0] }))
        .filter(({ service }) => service);

    return (
        <section id="home-services" className="section section--subtle home-services">
            <div className="container">
                <SectionTitle
                    title={t('homeServices.title')}
                    desc={t('homeServices.description')}
                />
                <div className="home-services__grid">
                    <div className="home-services__media" data-aos="fade-up">
                        <video
                            ref={videoRef}
                            muted
                            loop
                            playsInline
                            preload="none"
                            poster={labPoster}
                            aria-label={t('homeServices.videoAlt')}
                        >
                            <source src={labVideo} type="video/mp4" />
                        </video>
                    </div>
                    {services.map(({ category, service }, i) => (
                        <div
                            key={category.id}
                            className="home-services__item"
                            data-aos="fade-up"
                            data-aos-delay={60 * (i % 4)}
                        >
                            <HomeServiceCard
                                id={service.id}
                                name={getLocalizedText(service, 'name')}
                                desc={getLocalizedText(service, 'description')}
                                icon={category.categoryImage}
                                isService
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default HomeServices;
