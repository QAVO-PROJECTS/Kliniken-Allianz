import './index.scss';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, CircleCheck } from 'lucide-react';
import SectionTitle from '../../../../components/ui/SectionTitle/index.jsx';
import aboutImg from '../../../../assets/banner1.png';

function HomeAbout() {
    const { t } = useTranslation();
    const raw = t('homeAbout.features', { returnObjects: true });
    const features = Array.isArray(raw) ? raw : [];

    return (
        <section id="home-about" className="section section--subtle home-about">
            <div className="container home-about__grid">
                <div className="home-about__media" data-reveal>
                    <img
                        src={aboutImg}
                        alt=""
                        width={2000}
                        height={1121}
                        loading="lazy"
                        decoding="async"
                    />
                </div>

                <div className="home-about__content" data-reveal style={{ '--reveal-delay': '120ms' }}>
                    <SectionTitle
                        eyebrow={t('homeAbout.tag')}
                        title={t('homeAbout.title')}
                        desc={t('homeAbout.description')}
                        align="start"
                    />
                    {features.length > 0 && (
                        <ul className="home-about__features">
                            {features.map((feature) => (
                                <li key={feature}>
                                    <CircleCheck size={20} strokeWidth={1.75} aria-hidden="true" />
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                    <div className="home-about__footer">
                        <Link to="/about" className="btn btn--primary btn--lg home-more">
                            {t('homeAbout.button')}
                            <ArrowRight size={20} strokeWidth={1.75} aria-hidden="true" />
                        </Link>
                        <p className="home-about__years">
                            <strong>{t('homeAbout.experienceValue', '10+')}</strong>
                            <span>{t('homeAbout.experienceLabel', 'Years of Experience')}</span>
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default HomeAbout;
