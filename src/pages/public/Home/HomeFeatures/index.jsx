import './index.scss';
import { useTranslation } from 'react-i18next';

/** Metric strip under the hero: the client's own figures, no cards. */
function HomeFeatures() {
    const { t } = useTranslation();
    const raw = t('homeFeatures.stats', { returnObjects: true });
    const stats = Array.isArray(raw) ? raw : [];

    if (!stats.length) return null;

    return (
        <section id="home-features" className="home-stats">
            <div className="container">
                <dl className="home-stats__list">
                    {stats.map((stat, i) => (
                        <div
                            key={stat.label || i}
                            className="home-stats__item"
                            data-reveal
                            style={{ '--reveal-delay': `${i * 80}ms` }}
                        >
                            <dt>{stat.label}</dt>
                            <dd>{stat.value}</dd>
                        </div>
                    ))}
                </dl>
            </div>
        </section>
    );
}

export default HomeFeatures;
