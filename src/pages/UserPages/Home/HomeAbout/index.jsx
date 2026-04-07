import './index.scss';
import { useTranslation } from 'react-i18next';
import aboutImg from '/src/assets/banner1.png'; // Using existing banner as placeholder or I can generate one
import { FaCheckCircle } from 'react-icons/fa';

function HomeAbout() {
    const { t } = useTranslation();

    return (
        <section id="home-about" data-aos="fade-up">
            <div className="container">
                <div className="row">
                    <div className="col-image" data-aos="fade-right" data-aos-delay="50">
                        <div className="image-wrapper">
                            <img src={aboutImg} alt="About Kliniken Allianz" />
                            <div className="experience-badge" data-aos="zoom-in" data-aos-delay="100">
                                <h3>10+</h3>
                                <p>Years of Excellence</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-content" data-aos="fade-left" data-aos-delay="150">
                        <div className="section-tag">{t("homeAbout.tag")}</div>
                        <h2>{t("homeAbout.title")}</h2>
                        <p>
                            {t("homeAbout.description")}
                        </p>
                        <ul className="features-list">
                            {(t("homeAbout.features", { returnObjects: true }) || []).map((feature, i) => (
                                <li key={i}><FaCheckCircle className="icon" /> <span>{feature}</span></li>
                            ))}
                        </ul>
                        <button className="about-btn">{t("homeAbout.button")}</button>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default HomeAbout;
