import './index.scss';
import { useTranslation } from 'react-i18next';
import { Hospital, PlaneTakeoff, Star, Stethoscope } from 'lucide-react';

const ICONS = [Hospital, Stethoscope, PlaneTakeoff, Star];

function HomeFeatures() {
    const { t } = useTranslation();
    const raw = t('homeFeatures.stats', { returnObjects: true });
    const stats = Array.isArray(raw) ? raw : [];

    if (!stats.length) return null;

    return (
        <section id="home-features" className="home-stats">
            <div className="container">
                <ul className="home-stats__grid">
                    {stats.map((stat, i) => {
                        const Icon = ICONS[i] || Star;
                        return (
                            <li key={stat.label || i} className="home-stats__item">
                                <span className="home-stats__icon" aria-hidden="true">
                                    <Icon size={24} strokeWidth={1.75} />
                                </span>
                                <span className="home-stats__text">
                                    <strong>{stat.value}</strong>
                                    <span>{stat.label}</span>
                                </span>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </section>
    );
}

export default HomeFeatures;
