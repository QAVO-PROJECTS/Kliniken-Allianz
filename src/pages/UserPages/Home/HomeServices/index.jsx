import './index.scss';

import HomeServiceCard from '../../../../components/UserComponents/Home/ServiceCardHome/index.jsx';
import icon1 from "../../../../assets/Servis/cancer.png";
import icon2 from "../../../../assets/Servis/ortaped.png";
import icon3 from "../../../../assets/Servis/genekoloq.png";
import icon4 from "../../../../assets/Servis/oftomoloq.png";
import icon5 from "../../../../assets/Servis/hepatoloq.png";
import icon6 from "../../../../assets/Servis/travmatoloq.png";

function HomeServices() {
    const cards = [{
        name: "Xərçəng müalicəsi",
        description: "Abş",
        icon:icon1,
    },
        {
            name: "Oftamologiya",
            description: "Bangkok",
            icon:icon4,
        },

        {
            name: "Ginekologiya",
            description: "İstanbul",
            icon:icon3,
        },

        {
            name: "Hepatologiya",
            description: "Sinqapur",
            icon:icon5,
        }, {
            name: "Travmatologiya",
            description: "Bangkok",
            icon:icon6,
        },
        {
            name: "Onurğanın müalicəsi",
            description: "Berlin",
            icon:icon2,
        },];
    return (
        <div id={'home-services'}>
            <div className={'container'}>
                <div className={'head'}>
                    <div className={'title'}>
                        <h2>Sizə Təklif Etdiyimiz Tibbi Xidmət Kateqoriyaları</h2>
                        <p>Sizin ehtiyaclarınıza uyğun tibbi xidmət sahələrini kəşf edin.</p>
                    </div>
                    {/*<div className={'only-desktop'}>*/}
                    {/*    <button >*/}
                    {/*        Daha çox <img src={icon} alt='' />*/}
                    {/*    </button>*/}
                    {/*</div>*/}
                </div>
                <div className={'row'}>
                    <div className={'col-6 videos'}>
                        <video autoPlay muted loop>
                            <source src='/src/assets/HomeVideo.mp4' type='video/mp4' />
                            Your browser does not support the video tag.
                        </video>
                    </div>
                    {cards.map((card, index) => (
                        <HomeServiceCard key={index} name={card.name} desc={card.description} icon={card.icon} />
                    ))}

                </div>
                {/*<div className={'only-mobile'}>*/}
                {/*    <button >*/}
                {/*        Daha çox <img src={icon} alt='' />*/}
                {/*    </button>*/}
                {/*</div>*/}
            </div>
        </div>
    );
}

export default HomeServices;