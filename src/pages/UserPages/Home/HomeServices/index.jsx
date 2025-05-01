import './index.scss';
import HomeServiceCard from '../../../../components/UserComponents/Home/ServiceCardHome/index.jsx';
import icon1 from '../../../../assets/Servis/cancer.png';
import icon2 from '../../../../assets/Servis/ortaped.png';
import icon3 from '../../../../assets/Servis/genekoloq.png';
import icon4 from '../../../../assets/Servis/oftomoloq.png';
import icon5 from '../../../../assets/Servis/hepatoloq.png';
import icon6 from '../../../../assets/Servis/travmatoloq.png';
import image from '/src/assets/HomeVideo.gif';
import { useTranslation } from 'react-i18next';

function HomeServices() {
    const { t } = useTranslation();

    const cards = [
        {
            name: t('homeServices.cards.cancer.name'),
            description: t('homeServices.cards.cancer.description'),
            icon: icon1,
        },
        {
            name: t('homeServices.cards.oftamologiya.name'),
            description: t('homeServices.cards.oftamologiya.description'),
            icon: icon4,
        },
        {
            name: t('homeServices.cards.ginekologiya.name'),
            description: t('homeServices.cards.ginekologiya.description'),
            icon: icon3,
        },
        {
            name: t('homeServices.cards.hepatologiya.name'),
            description: t('homeServices.cards.hepatologiya.description'),
            icon: icon5,
        },
        {
            name: t('homeServices.cards.travmatologiya.name'),
            description: t('homeServices.cards.travmatologiya.description'),
            icon: icon6,
        },
        {
            name: t('homeServices.cards.onurga.name'),
            description: t('homeServices.cards.onurga.description'),
            icon: icon2,
        },
    ];

    return (
        <div id={'home-services'}>
            <div className={'container'}>
                <div className={'head'}>
                    <div className={'title'}>
                        <h2>{t('homeServices.title')}</h2>
                        <p>{t('homeServices.description')}</p>
                    </div>
                </div>
                <div className={'row'}>
                    <div className={'col-6'}>
                        <div className={" videos"}>
                            <img src={image} alt={t('homeServices.videoAlt')} />
                        </div>
                    </div>
                    {cards.map((card, index) => (
                        <HomeServiceCard key={index} name={card.name} desc={card.description} icon={card.icon} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default HomeServices;