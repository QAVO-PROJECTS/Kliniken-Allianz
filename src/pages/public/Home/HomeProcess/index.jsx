import './index.scss';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CalendarCheck, HeartPulse, Phone, Plane } from 'lucide-react';

const ICONS = [Phone, CalendarCheck, Plane, HeartPulse];

/** Layout family: sticky intro column + vertical timeline (no step numbers). */
function HomeProcess() {
    const { t } = useTranslation();
    const raw = t('homeProcess.steps', { returnObjects: true });
    const steps = Array.isArray(raw) ? raw : [];

    return (
        <section id="home-process" className="section home-process">
            <div className="container home-process__grid">
                <div className="home-process__intro" data-reveal>
                    <h2>{t('homeProcess.title')}</h2>
                    <p>{t('homeProcess.description')}</p>
                    <Link to="/contact" className="btn btn--secondary">
                        {t('navbar.contact')}
                    </Link>
                </div>

                {steps.length > 0 && (
                    <ol className="home-process__steps">
                        {steps.map((step, i) => {
                            const Icon = ICONS[i] || HeartPulse;
                            return (
                                <li
                                    key={step.title || i}
                                    className="home-process__step"
                                    data-reveal
                                    style={{ '--reveal-delay': `${i * 90}ms` }}
                                >
                                    <span className="home-process__icon" aria-hidden="true">
                                        <Icon size={22} strokeWidth={1.75} />
                                    </span>
                                    <div className="home-process__text">
                                        <h3>{step.title}</h3>
                                        <p>{step.description}</p>
                                    </div>
                                </li>
                            );
                        })}
                    </ol>
                )}
            </div>
        </section>
    );
}

export default HomeProcess;
