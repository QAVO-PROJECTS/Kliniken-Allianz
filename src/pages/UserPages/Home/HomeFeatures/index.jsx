import './index.scss';
import { useTranslation } from 'react-i18next';
import { FaUserMd, FaHospital, FaPlaneDeparture, FaStar } from 'react-icons/fa';

function HomeFeatures() {
    const { t } = useTranslation();

    const statsDataRaw = t("homeFeatures.stats", { returnObjects: true });
    const statsData = Array.isArray(statsDataRaw) ? statsDataRaw : [];
    const icons = [<FaHospital />, <FaUserMd />, <FaPlaneDeparture />, <FaStar />];

    const stats = statsData.map((stat, i) => ({
        ...stat,
        icon: icons[i] || <FaStar />
    }));

    return (
        <section id="home-features">
            <div className="container">
                <div className="stats-grid">
                    {stats.map((stat, index) => (
                        <div 
                            key={index} 
                            className="stat-card" 
                        >
                            <div className="icon-wrapper">{stat.icon}</div>
                            <div className="stat-info">
                                <h3>{stat.value}</h3>
                                <p>{stat.label}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default HomeFeatures;
