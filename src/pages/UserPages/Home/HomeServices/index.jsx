import './index.scss';
import HomeServiceCard from '../../../../components/UserComponents/Home/ServiceCardHome/index.jsx';
import image from '/src/assets/9430532-hd_1920_1080_25fps.gif';
import { useTranslation } from 'react-i18next';
import {useGetAllCategoryQuery, useGetAllServiceQuery} from "../../../../services/userApi.jsx";
import icons from "/src/assets/icon1.png"
import {useMediaQuery} from "react-responsive";
function HomeServices() {
    const { t, i18n } = useTranslation();
    const { data: getAllCategories } = useGetAllCategoryQuery();
    const categories = getAllCategories?.data?.slice(0, 6);
    const isMobile = useMediaQuery({maxWidth:768})

    const getLocalizedText = (item, field) => {
        switch (i18n.language) {
            case 'en':
                return field === 'name' ? item.nameEng : item.descriptionEng;
            case 'ru':
                return field === 'name' ? item.nameRu : item.descriptionRu;
            default:
                return field === 'name' ? item.name : item.description;
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
                    {categories?.map((category) => {
                        const firstService = category.services?.[0];
                        const displayItem = firstService || category;
                        const isService = !!firstService;

                        return (
                            <HomeServiceCard
                                key={category?.id}
                                id={displayItem?.id}
                                name={getLocalizedText(displayItem, 'name')}
                                desc={getLocalizedText(displayItem, 'description')}
                                icon={category.categoryImage}
                                isService={isService}
                            />
                        );
                    })}

                </div>

            </div>
        </div>
    );
}

export default HomeServices;