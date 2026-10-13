import './index.scss';
import { useTranslation } from 'react-i18next';
import { CalendarCheck, HeartPulse, Phone, Plane } from 'lucide-react';
import SectionTitle from '../../../../components/ui/SectionTitle/index.jsx';

const ICONS = [Phone, CalendarCheck, Plane, HeartPulse];

function HomeProcess() {
    const { t } = useTranslation();
    const raw = t('homeProcess.steps', { returnObjects: true });
    const steps = Array.isArray(raw) ? raw : [];

    return (
        <section id="home-process" className="section home-process">
            <div className="container">
                <SectionTitle
                    eyebrow={t('homeProcess.subtitle')}
                    title={t('homeProcess.title')}
                    desc={t('homeProcess.description')}
                />

                {steps.length > 0 && (
                    <ol className="home-process__steps">
                        {steps.map((step, i) => {
                            const Icon = ICONS[i] || HeartPulse;
                            return (
                                <li
                                    key={step.title || i}
                                    className="home-process__step"
                                    data-aos="fade-up"
                                    data-aos-delay={i * 80}
                                >
                                    <div className="home-process__marker" aria-hidden="true">
                                        <span className="home-process__icon">
                                            <Icon size={26} strokeWidth={1.75} />
                                        </span>
                                        <span className="home-process__num">{String(i + 1).padStart(2, '0')}</span>
                                    </div>
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
