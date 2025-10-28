import './index.scss';
import HomeServiceCard from '../../../../components/UserComponents/Home/ServiceCardHome/index.jsx';
import image from '/src/assets/HomeVideo.gif';
import { useTranslation } from 'react-i18next';
import { useGetAllCategoryQuery } from "../../../../services/userApi.jsx";
import icons from "/src/assets/icon1.png"
function HomeServices() {
    const { t, i18n } = useTranslation();
    const { data: getAllService } = useGetAllCategoryQuery();
    const cardss = getAllService?.data?.slice(0, 6);

    // Mevcut dili al ve buna göre alan seç
    const getLocalizedText = (card, field) => {
        switch (i18n.language) {
            case 'en':
                return field === 'name' ? card.nameEng : card.descriptionEng;
            case 'ru':
                return field === 'name' ? card.nameRu : card.descriptionRu;
            default: // 'tr' veya varsayılan
                return field === 'name' ? card.name : card.description;
        }
    };

    return (
        <div id={'home-services'}>
            <div className={'container'}>
                <div className={'head'}>
                    <div className={'title'}>
                        <h2>Sizə Təklif Etdiyimiz Tibbi Xidmətlər</h2>
                        <p>Sizin ehtiyaclarınıza uyğun tibbi xidmət sahələrini kəşf edin.</p>
                    </div>
                    <div>
                        <button>
                            Hamısına bax <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
                            <path d="M23.0291 8.53068L20.0291 11.5307C19.8884 11.6714 19.6975 11.7505 19.4985 11.7505C19.2995 11.7505 19.1086 11.6714 18.9679 11.5307C18.8271 11.3899 18.7481 11.1991 18.7481 11.0001C18.7481 10.801 18.8271 10.6102 18.9679 10.4694L20.6882 8.75005H19.4985C15.8732 8.75005 15.1307 10.5313 14.1904 12.7888C13.2219 15.1138 12.1232 17.7501 7.49849 17.7501H7.40474C7.22219 18.457 6.78807 19.0732 6.18373 19.483C5.5794 19.8928 4.84635 20.0681 4.12199 19.9761C3.39763 19.8841 2.73169 19.5311 2.249 18.9832C1.7663 18.4353 1.5 17.7302 1.5 17.0001C1.5 16.2699 1.7663 15.5648 2.249 15.0169C2.73169 14.469 3.39763 14.116 4.12199 14.024C4.84635 13.932 5.5794 14.1073 6.18373 14.5171C6.78807 14.9269 7.22219 15.5431 7.40474 16.2501H7.49849C11.1238 16.2501 11.8663 14.4688 12.8066 12.2113C13.7797 9.8863 14.8738 7.25005 19.4985 7.25005H20.6882L18.9679 5.53068C18.8271 5.38995 18.7481 5.19907 18.7481 5.00005C18.7481 4.80103 18.8271 4.61016 18.9679 4.46943C19.1086 4.3287 19.2995 4.24963 19.4985 4.24963C19.6975 4.24963 19.8884 4.3287 20.0291 4.46943L23.0291 7.46943C23.0988 7.53908 23.1542 7.6218 23.1919 7.71285C23.2297 7.80389 23.2491 7.90149 23.2491 8.00005C23.2491 8.09861 23.2297 8.19621 23.1919 8.28726C23.1542 8.3783 23.0988 8.46102 23.0291 8.53068Z" fill="black"/>
                            <path d="M23.0291 8.53068L20.0291 11.5307C19.8884 11.6714 19.6975 11.7505 19.4985 11.7505C19.2995 11.7505 19.1086 11.6714 18.9679 11.5307C18.8271 11.3899 18.7481 11.1991 18.7481 11.0001C18.7481 10.801 18.8271 10.6102 18.9679 10.4694L20.6882 8.75005H19.4985C15.8732 8.75005 15.1307 10.5313 14.1904 12.7888C13.2219 15.1138 12.1232 17.7501 7.49849 17.7501H7.40474C7.22219 18.457 6.78807 19.0732 6.18373 19.483C5.5794 19.8928 4.84635 20.0681 4.12199 19.9761C3.39763 19.8841 2.73169 19.5311 2.249 18.9832C1.7663 18.4353 1.5 17.7302 1.5 17.0001C1.5 16.2699 1.7663 15.5648 2.249 15.0169C2.73169 14.469 3.39763 14.116 4.12199 14.024C4.84635 13.932 5.5794 14.1073 6.18373 14.5171C6.78807 14.9269 7.22219 15.5431 7.40474 16.2501H7.49849C11.1238 16.2501 11.8663 14.4688 12.8066 12.2113C13.7797 9.8863 14.8738 7.25005 19.4985 7.25005H20.6882L18.9679 5.53068C18.8271 5.38995 18.7481 5.19907 18.7481 5.00005C18.7481 4.80103 18.8271 4.61016 18.9679 4.46943C19.1086 4.3287 19.2995 4.24963 19.4985 4.24963C19.6975 4.24963 19.8884 4.3287 20.0291 4.46943L23.0291 7.46943C23.0988 7.53908 23.1542 7.6218 23.1919 7.71285C23.2297 7.80389 23.2491 7.90149 23.2491 8.00005C23.2491 8.09861 23.2297 8.19621 23.1919 8.28726C23.1542 8.3783 23.0988 8.46102 23.0291 8.53068Z" fill="url(#paint0_linear_7_1482)"/>
                            <defs>
                                <linearGradient id="paint0_linear_7_1482" x1="1.5" y1="12.1248" x2="23.2491" y2="12.1248" gradientUnits="userSpaceOnUse">
                                    <stop offset="0.538462" stop-color="#0063A6"/>
                                    <stop offset="0.870192" stop-color="#0B93EF"/>
                                </linearGradient>
                            </defs>
                        </svg>
                        </button>
                    </div>
                </div>
                <div className={'row'}>
                    <div className={'col-6'}>
                        <div className={"videos"}>
                            <img src={image} alt={t('homeServices.videoAlt')} />
                        </div>
                    </div>
                    {cardss?.map((card) => (
                        <HomeServiceCard
                            id={card?.id}
                            name={"Xərçəng müalicəsi"}
                            desc={"Həyat keyfiyyətinizi yüksəltmək üçün ən yeni xərçəng müalicə üsulları."}
                            icon={icons}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default HomeServices;