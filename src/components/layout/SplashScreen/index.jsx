import './index.scss';
import logo from '../../../assets/Logo.png';

const SplashScreen = ({ isFading }) => (
    <div className={`splash${isFading ? ' is-fading' : ''}`} role="status" aria-live="polite" aria-busy={!isFading}>
        <div className="splash__mark">
            <span className="splash__halo" aria-hidden="true" />
            <img src={logo} alt="Kliniken Allianz" className="splash__logo" width="200" height="68" />
        </div>
        <span className="splash__bar" aria-hidden="true"><span /></span>
    </div>
);

export default SplashScreen;
