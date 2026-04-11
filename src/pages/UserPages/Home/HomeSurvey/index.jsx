import './index.scss';
import { useTranslation } from 'react-i18next';
import { FiArrowRight } from 'react-icons/fi';

function HomeSurvey() {
    const { t } = useTranslation();

    return (
        <section id="home-survey" data-aos="fade-up">
            <div className="container">
                <div className="survey-wrapper">
                    <div className="survey-image" data-aos="fade-right" data-aos-delay="100">
                        <img src="https://b2670330.smushcdn.com/2670330/wp-content/uploads/2018/10/AdobeStock_206006240-Converted.png?size=3840x3840&lossy=1&strip=1&webp=1" alt="Survey" />
                    </div>

                    <div className="survey-card" data-aos="fade-left" data-aos-delay="150">
                        <div className="survey-tag">
                            <span className="survey-tag__dot" />
                            {t('homeSurvey.tag', 'Anket')}
                        </div>

                        <h2 className="survey-card__title">
                            {t('homeSurvey.title')}
                        </h2>

                        <p className="survey-card__desc">
                            {t('homeSurvey.description')}
                        </p>

                        <p className="survey-card__note">
                            {t('homeSurvey.importance')}
                        </p>

                        <div className="survey-pills">
                            <span className="survey-pills__item">{t('homeSurvey.pill1', 'Anonim')}</span>
                            <span className="survey-pills__item">{t('homeSurvey.pill2', '3–5 dəq')}</span>
                            <span className="survey-pills__item">{t('homeSurvey.pill3', 'Azərbaycan dili')}</span>
                        </div>

                        <div className="survey-card__divider" />

                        <div className="survey-card__footer">
                            <div className="survey-meta">
                                <span className="survey-meta__label">{t('homeSurvey.metaLabel', 'Platform')}</span>
                                <span className="survey-meta__value">{t('homeSurvey.metaValue', 'Google Forms vasitəsilə')}</span>
                            </div>

                            <a
                                href="https://forms.google.com/your-survey-link"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="survey-btn"
                            >
                                {t('homeSurvey.button')}
                                <FiArrowRight className="survey-btn__icon" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default HomeSurvey;