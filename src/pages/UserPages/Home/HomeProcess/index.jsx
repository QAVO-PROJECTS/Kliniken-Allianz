import './index.scss';
import { useTranslation } from 'react-i18next';
import { FaPhoneAlt, FaCalendarCheck, FaPlane, FaHeartbeat } from 'react-icons/fa';

function HomeProcess() {
    const { t } = useTranslation();
    
    const stepsData = t("homeProcess.steps", { returnObjects: true }) || [];
    const icons = [<FaPhoneAlt />, <FaCalendarCheck />, <FaPlane />, <FaHeartbeat />];

    return (
        <section id="home-process" data-aos="fade-up">
            <div className="container">
                <div className="head" data-aos="fade-up" data-aos-delay="50">
                    <span className="subtitle">Mərhələlər</span>
                    <h2 data-aos="fade-up" data-aos-delay="100">{t("homeProcess.title")}</h2>
                    <p data-aos="fade-up" data-aos-delay="150">{t("homeProcess.description")}</p>
                </div>
                
                <div className="process-grid">
                    {stepsData.map((step, index) => (
                        <div 
                            key={index} 
                            className="process-card"
                            data-aos="fade-up"
                            data-aos-delay={index * 70}
                        >
                            <div className="step-number">{index + 1}</div>
                            <div className="icon-box">
                                {icons[index]}
                            </div>
                            <h3>{step.title}</h3>
                            <p>{step.description}</p>
                            {index < stepsData.length - 1 && (
                                <div className="arrow-connector"></div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default HomeProcess;
