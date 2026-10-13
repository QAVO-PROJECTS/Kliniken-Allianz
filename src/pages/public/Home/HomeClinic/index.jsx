import { useTranslation } from 'react-i18next';
import { useGetAllClinicQuery } from '../../../../api/userApi.js';
import ClinicCard from '../../../../components/cards/ClinicCard/index.jsx';
import HomeCarousel from '../HomeCarousel/index.jsx';

function HomeClinic() {
    const { t } = useTranslation();
    const { data } = useGetAllClinicQuery();
    const clinics = data?.data || [];

    return (
        <HomeCarousel
            id="home-clinic"
            title={t('homeClinic.title')}
            desc={t('homeClinic.description')}
            items={clinics}
            viewAll={{ to: '/clinics', label: t('homeClinic.moreButton') }}
            perView={{ lg: 3, md: 2, sm: 1.15 }}
            renderItem={(item) => <ClinicCard id={item.id} item={item} />}
        />
    );
}

export default HomeClinic;
