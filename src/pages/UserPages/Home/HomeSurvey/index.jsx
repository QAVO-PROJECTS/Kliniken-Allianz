import './index.scss';
import { useTranslation } from 'react-i18next';
import { FiArrowRight } from 'react-icons/fi';

const clinicSurveyLinks = {
    az: 'https://forms.gle/dSrm97WREuuz6m6cA',
    ru: 'https://forms.gle/tWyAXa1JwuqvteKu5',
    en: 'https://forms.gle/C7u5Wxpn5Xdthi5x9',
    de: 'https://forms.gle/JKh48nVaPgoD4FLt7',
    ar: 'https://forms.gle/9gsaHP6WscqPimoBA',
};

const sanatoriumSurveyLinks = {
    az: 'https://forms.gle/wRaZExfhwaZUe2HJA', // Replace with Sanatorium AZ link
    ru: 'https://forms.gle/6isgzCMuRWHBo9wo8', // Replace with Sanatorium RU link
    en: 'https://forms.gle/q9uJHDSLUqGtqWnSA', // Replace with Sanatorium EN link
    de: 'https://forms.gle/AfM3XfipXT2DceZ36', // Replace with Sanatorium DE link
    ar: 'https://forms.gle/9gsaHP6WscqPimoBA', // Replace with Sanatorium AR link
};

function HomeSurvey() {
    const { t, i18n } = useTranslation();

    const currentClinicLink = clinicSurveyLinks[i18n.language] || clinicSurveyLinks.az;
    const currentSanatoriumLink = sanatoriumSurveyLinks[i18n.language] || sanatoriumSurveyLinks.az;

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
                            {t('homeSurvey.title', 'Təcrübənizi Yaxşılaşdırmağa Kömək Edin')}
                        </h2>

                        <p className="survey-card__desc">
                            {t('homeSurvey.description', 'Rəyinizi bölüşməklə daha yaxşı səhiyyə xidmətləri təqdim etməyimizə kömək edin.')}
                        </p>

                        <p className="survey-card__note">
                            {t('homeSurvey.importance', 'Bu niyə vacibdir? Rəyləriniz xidmət keyfiyyətinə bilavasitə təsir edir.')}
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

                            <div className="survey-actions">
                                <a
                                    href={currentClinicLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="survey-btn"
                                >
                                    {t('homeSurvey.clinicButton', 'Klinika Anketi')}
                                    <FiArrowRight className="survey-btn__icon" />
                                </a>
                                <a
                                    href={currentSanatoriumLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="survey-btn survey-btn--secondary"
                                >
                                    {t('homeSurvey.sanatoriumButton', 'Sanatoriya Anketi')}
                                    <FiArrowRight className="survey-btn__icon" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default HomeSurvey;