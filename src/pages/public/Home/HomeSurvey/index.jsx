import './index.scss';
import { useTranslation } from 'react-i18next';
import { ArrowUpRight, ClipboardList } from 'lucide-react';

const clinicSurveyLinks = {
    az: 'https://forms.gle/dSrm97WREuuz6m6cA',
    ru: 'https://forms.gle/tWyAXa1JwuqvteKu5',
    en: 'https://forms.gle/C7u5Wxpn5Xdthi5x9',
    de: 'https://forms.gle/JKh48nVaPgoD4FLt7',
    ar: 'https://forms.gle/9gsaHP6WscqPimoBA',
};

const sanatoriumSurveyLinks = {
    az: 'https://forms.gle/wRaZExfhwaZUe2HJA',
    ru: 'https://forms.gle/6isgzCMuRWHBo9wo8',
    en: 'https://forms.gle/q9uJHDSLUqGtqWnSA',
    de: 'https://forms.gle/AfM3XfipXT2DceZ36',
    ar: 'https://forms.gle/9gsaHP6WscqPimoBA',
};

function HomeSurvey() {
    const { t, i18n } = useTranslation();
    const lang = (i18n.language || 'az').slice(0, 2);
    const clinicLink = clinicSurveyLinks[lang] || clinicSurveyLinks.az;
    const sanatoriumLink = sanatoriumSurveyLinks[lang] || sanatoriumSurveyLinks.az;
    const pills = [
        t('homeSurvey.pill1', 'Anonim'),
        t('homeSurvey.pill2', '3–5 dəq'),
        t('homeSurvey.pill3', 'Azərbaycan dili'),
    ];

    return (
        <section id="home-survey" className="section home-survey">
            <div className="container">
                <div className="home-survey__panel" data-aos="fade-up">
                    <div className="home-survey__media">
                        <img
                            src="https://b2670330.smushcdn.com/2670330/wp-content/uploads/2018/10/AdobeStock_206006240-Converted.png?size=3840x3840&lossy=1&strip=1&webp=1"
                            alt=""
                            loading="lazy"
                            decoding="async"
                        />
                    </div>

                    <div className="home-survey__body">
                        <span className="eyebrow">
                            <ClipboardList size={14} strokeWidth={2} aria-hidden="true" />
                            {t('homeSurvey.tag', 'Anket')}
                        </span>

                        <h2 className="home-survey__title">
                            {t('homeSurvey.title', 'Təcrübənizi Yaxşılaşdırmağa Kömək Edin')}
                        </h2>

                        <p className="home-survey__desc">
                            {t('homeSurvey.description', 'Rəyinizi bölüşməklə daha yaxşı səhiyyə xidmətləri təqdim etməyimizə kömək edin.')}
                        </p>

                        <p className="home-survey__note">
                            {t('homeSurvey.importance', 'Bu niyə vacibdir? Rəyləriniz xidmət keyfiyyətinə bilavasitə təsir edir.')}
                        </p>

                        <ul className="home-survey__pills">
                            {pills.map((pill) => (
                                <li key={pill} className="badge">{pill}</li>
                            ))}
                        </ul>

                        <div className="home-survey__footer">
                            <div className="home-survey__meta">
                                <span>{t('homeSurvey.metaLabel', 'Platform')}</span>
                                <strong>{t('homeSurvey.metaValue', 'Google Forms vasitəsilə')}</strong>
                            </div>

                            <div className="home-survey__actions">
                                <a
                                    href={clinicLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn--primary"
                                >
                                    {t('homeSurvey.clinicButton', 'Klinika Anketi')}
                                    <ArrowUpRight size={18} strokeWidth={2} aria-hidden="true" />
                                </a>
                                <a
                                    href={sanatoriumLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn--secondary"
                                >
                                    {t('homeSurvey.sanatoriumButton', 'Sanatoriya Anketi')}
                                    <ArrowUpRight size={18} strokeWidth={2} aria-hidden="true" />
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
