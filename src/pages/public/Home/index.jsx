import './index.scss';
import HomeBanner from './HomeBanner/index.jsx';
import HomeFeatures from './HomeFeatures/index.jsx';
import HomeSurvey from './HomeSurvey/index.jsx';
import HomeAbout from './HomeAbout/index.jsx';
import HomeProcess from './HomeProcess/index.jsx';
import HomeServices from './HomeServices/index.jsx';
import HomeClinic from './HomeClinic/index.jsx';
import HomeHotel from './HomeHotel/index.jsx';
import HomeTour from './HomeTour/index.jsx';
import HomeComment from './HomeComment/index.jsx';

/**
 * Home page. Every section uses a different layout family:
 * media hero · metric strip · media/text split · sticky intro + timeline ·
 * video + service grid · clinic mosaic · compact hotel strip ·
 * featured tour + list · single large quote · survey call-to-action band.
 */
function Home() {
    return (
        <div className="home">
            <HomeBanner />
            <HomeFeatures />
            <HomeAbout />
            <HomeProcess />
            <HomeServices />
            <HomeClinic />
            <HomeHotel />
            <HomeTour />
            <HomeComment />
            <HomeSurvey />
        </div>
    );
}

export default Home;
