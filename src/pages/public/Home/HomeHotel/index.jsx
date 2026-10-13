import { useTranslation } from 'react-i18next';
import { useGetAllOtelsQuery } from '../../../../api/userApi.js';
import HotelCard from '../../../../components/cards/HotelCard/index.jsx';
import HomeCarousel from '../HomeCarousel/index.jsx';

function HomeHotel() {
    const { t } = useTranslation();
    const { data } = useGetAllOtelsQuery();
    const hotels = data?.data || [];

    return (
        <HomeCarousel
            id="home-hotel"
            className="section--subtle"
            title={t('homeHotel.title')}
            desc={t('homeHotel.desc')}
            items={hotels}
            perView={{ lg: 4, md: 2.5, sm: 1.6 }}
            renderItem={(item) => <HotelCard id={item.id} item={item} />}
        />
    );
}

export default HomeHotel;
