import { useTranslation } from 'react-i18next';
import { useGetAllToursQuery } from '../../../../api/userApi.js';
import TourCard from '../../../../components/cards/TourCard/index.jsx';
import HomeCarousel from '../HomeCarousel/index.jsx';

function HomeTour() {
    const { t } = useTranslation();
    const { data } = useGetAllToursQuery();
    const tours = data?.data || [];

    return (
        <HomeCarousel
            id="home-tour"
            title={t('homeTour.title')}
            desc={t('homeTour.description')}
            items={tours}
            viewAll={{ to: '/tours', label: t('homeClinic.moreButton') }}
            perView={{ lg: 4, md: 2.5, sm: 1.25 }}
            renderItem={(item) => <TourCard id={item.id} item={item} />}
        />
    );
}

export default HomeTour;
