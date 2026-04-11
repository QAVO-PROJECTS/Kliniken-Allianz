import HomeBanner from "./HomeBanner/index.jsx";
import HomeSurvey from "./HomeSurvey/index.jsx";
import HomeFeatures from "./HomeFeatures/index.jsx";
import HomeAbout from "./HomeAbout/index.jsx";
import HomeProcess from "./HomeProcess/index.jsx";
import HomeServices from "./HomeServices/index.jsx";
import HomeClinic from "./HomeClinic/index.jsx";
import HomeHotel from "./HomeHotel/index.jsx";
import HomeBestServ from "./HomeBestService/index.jsx";
import HomeComment from "./HomeComment/index.jsx";
import HomeTour from "./HomeTour/index.jsx";

function Home() {
    return (
        <>
            <HomeBanner />
            <HomeFeatures />
            <HomeSurvey />
            <HomeAbout />
            <HomeProcess />
            <HomeServices/>
            <HomeClinic/>
            <HomeHotel/>
            <HomeTour/>
            {/*<HomeBestServ/>*/}
            <HomeComment/>
        </>
    );
}

export default Home;