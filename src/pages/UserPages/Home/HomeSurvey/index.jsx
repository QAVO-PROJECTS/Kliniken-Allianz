import './index.scss';
import { useTranslation } from 'react-i18next';
import { FiArrowRight } from 'react-icons/fi';

const surveyLinks = {
    az: 'https://docs.google.com/forms/d/e/1FAIpQLSeRngYQUtZwFbfVPl4sVR6RKumhf0DpqgTJQUaxaXwVsGn0Yw/viewform',
    ru: 'https://docs.google.com/forms/d/e/1FAIpQLSdCyyD5fsi2xYa_VgL8P19_vIDz6RaZCi_nDlT_obmvYpIj1Q/viewform',
    en: 'https://docs.google.com/forms/d/e/1FAIpQLSfU1HLO3x2tupLHWFlDwA5kxY1huJ6lMsXf2KYn8rTDbJKy1w/viewform',
    de: 'https://docs.google.com/forms/d/e/1FAIpQLSeAHkrn22jsBZiQ1lc_TpJgpfmG4FrhjEIk-m3RiKTvBPo49Q/viewform',
    ar: 'https://docs.google.com/forms/d/e/1FAIpQLSfQdTrhCVJ2_zJclHxfrs7-jzJ3SQLCWCB_dAA7zUQam6K1iA/viewform',
};

function HomeSurvey() {
    const { t, i18n } = useTranslation();

    const currentSurveyLink = surveyLinks[i18n.language] || surveyLinks.az;

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

                            <a
                                href={currentSurveyLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="survey-btn"
                            >
                                {t('homeSurvey.button', 'Anketi Doldur')}
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