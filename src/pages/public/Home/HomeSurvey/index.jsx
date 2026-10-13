import './index.scss';
import { useTranslation } from 'react-i18next';
import { ArrowUpRight, Clock3, EyeOff, FileText, Languages } from 'lucide-react';

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

/** Layout family: closing call-to-action band (text + actions, no media). */
function HomeSurvey() {
    const { t, i18n } = useTranslation();
    const lang = (i18n.language || 'az').slice(0, 2);
    const clinicLink = clinicSurveyLinks[lang] || clinicSurveyLinks.az;
    const sanatoriumLink = sanatoriumSurveyLinks[lang] || sanatoriumSurveyLinks.az;
    const facts = [
        { Icon: EyeOff, label: t('homeSurvey.pill1', 'Anonim') },
        { Icon: Clock3, label: t('homeSurvey.pill2', '3-5 dəq') },
        { Icon: Languages, label: t('homeSurvey.pill3', 'Azərbaycan dili') },
        { Icon: FileText, label: t('homeSurvey.metaValue', 'Google Forms vasitəsilə') },
    ];

    return (
        <section id="home-survey" className="section home-survey">
            <div className="container">
                <div className="home-survey__band" data-reveal>
                    <div className="home-survey__copy">
                        <h2 className="home-survey__title">
                            {t('homeSurvey.title', 'Təcrübənizi Yaxşılaşdırmağa Kömək Edin')}
                        </h2>
                        <p className="home-survey__desc">
                            {t('homeSurvey.description', 'Rəyinizi bölüşməklə daha yaxşı səhiyyə xidmətləri təqdim etməyimizə kömək edin.')}
                        </p>
                        <p className="home-survey__note">
                            {t('homeSurvey.importance', 'Bu niyə vacibdir? Rəyləriniz xidmət keyfiyyətinə bilavasitə təsir edir.')}
                        </p>
                        <ul className="home-survey__facts">
                            {facts.map(({ Icon, label }) => (
                                <li key={label}>
                                    <Icon size={16} strokeWidth={1.75} aria-hidden="true" />
                                    {label}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="home-survey__actions">
                        <a
                            href={clinicLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn--primary btn--lg"
                        >
                            {t('homeSurvey.clinicButton', 'Klinika Anketi')}
                            <ArrowUpRight size={18} strokeWidth={1.75} aria-hidden="true" />
                        </a>
                        <a
                            href={sanatoriumLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn--secondary btn--lg"
                        >
                            {t('homeSurvey.sanatoriumButton', 'Sanatoriya Anketi')}
                            <ArrowUpRight size={18} strokeWidth={1.75} aria-hidden="true" />
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default HomeSurvey;
