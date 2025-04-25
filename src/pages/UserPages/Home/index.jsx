import HomeBanner from "./HomeBanner/index.jsx";
import HomeServices from "./HomeServices/index.jsx";
import HomeClinic from "./HomeClinic/index.jsx";
import HomeHotel from "./HomeHotel/index.jsx";
import HomeBestServ from "./HomeBestService/index.jsx";
import HomeComment from "./HomeComment/index.jsx";

function Home() {
    return (
        <>
            <HomeBanner />
            <HomeServices/>
            <HomeClinic/>
            <HomeHotel/>
            <HomeBestServ/>
            <HomeComment/>
        </>
    );
}

export default Home;