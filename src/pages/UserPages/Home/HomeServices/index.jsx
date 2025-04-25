import './index.scss';
import icon from '/src/assets/icons/ph_flow-arrow-fill.svg';
import ServiceCard from '../../../../components/UserComponents/ClinicDetail/ServiceCard/index.jsx';
import HomeServiceCard from '../../../../components/UserComponents/Home/ServiceCardHome/index.jsx';

function HomeServices() {
    return (
        <div id={'home-services'}>
            <div className={'container'}>
                <div className={'head'}>
                    <div className={'title'}>
                        <h2>Sizə Təklif Etdiyimiz Tibbi Xidmət Kateqoriyaları</h2>
                        <p>Sizin ehtiyaclarınıza uyğun tibbi xidmət sahələrini kəşf edin.</p>
                    </div>
                    <button>
                        Daha çox <img src={icon} alt='' />
                    </button>
                </div>
                <div className={'row'}>
                    <div className={'col-6 videos'}>
                        <video autoPlay muted loop>
                            <source src='/src/assets/HomeVideo.mp4' type='video/mp4' />
                            Your browser does not support the video tag.
                        </video>
                    </div>
                    <HomeServiceCard />
                    <HomeServiceCard />
                    <HomeServiceCard />
                    <HomeServiceCard />
                    <HomeServiceCard />
                    <HomeServiceCard />
                </div>
            </div>
        </div>
    );
}

export default HomeServices;