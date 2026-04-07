import './index.scss';
import logo from '../../../assets/Logo.png';

const SplashScreen = ({ isFading }) => {
    return (
        <div id="splash-screen" className={isFading ? 'fade-out' : ''}>
            <div className="logo-container">
                <img src={logo} alt="Kliniken Allianz Logo" className="pulse-logo" />
            </div>
            <div className="loader-container">
                <div className="spinning-circle"></div>
            </div>
        </div>
    );
};

export default SplashScreen;
