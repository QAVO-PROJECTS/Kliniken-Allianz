import './index.scss';
import HomeServiceCard from '../../../../components/UserComponents/Home/ServiceCardHome/index.jsx';
import image from '/src/assets/HomeVideo.gif';
import { useTranslation } from 'react-i18next';
import {useGetAllCategoryQuery, useGetAllServiceQuery} from "../../../../services/userApi.jsx";
import icons from "/src/assets/icon1.png"
import {useMediaQuery} from "react-responsive";
function HomeServices() {
    const { t, i18n } = useTranslation();
    const { data: getAllService } = useGetAllServiceQuery()
    const cardss = getAllService?.data?.slice(0, 6);
    const isMobile = useMediaQuery({maxWidth:768})
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
                        <h2>{t("homeServices.title")}</h2>
                        <p>{t("homeServices.description")}</p>
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
                            name={card.name}
                            desc={card.description}
                            icon={card.categoryImage}
                        />
                    ))}

                </div>

            </div>
        </div>
    );
}

export default HomeServices;