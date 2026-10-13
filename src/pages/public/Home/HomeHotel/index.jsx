import './index.scss';
import { useTranslation } from 'react-i18next';
import { ArrowUpRight, Hotel, MapPin, Star } from 'lucide-react';
import { useGetAllOtelsQuery } from '../../../../api/userApi.js';
import { OTEL_CARD_IMAGES } from '../../../../config/mediaUrls.js';
import { getLocalizedText } from '../../../../i18n/getLocalizedText.js';
import HomeCarousel from '../HomeCarousel/index.jsx';
import HomeImage from '../shared/HomeImage.jsx';

function HotelChip({ item }) {
    const name = getLocalizedText(item, 'name');
    const location = getLocalizedText(item, 'location');
    const rating = Math.max(0, Math.min(5, Math.round(Number(item?.raiting) || 0)));
    const Tag = item?.otelLink ? 'a' : 'div';
    const linkProps = item?.otelLink
        ? { href: item.otelLink, target: '_blank', rel: 'noopener noreferrer' }
        : {};

    return (
        <Tag className={`home-hotel${item?.otelLink ? ' is-link' : ''}`} {...linkProps}>
            <span className="home-hotel__thumb">
                <HomeImage
                    src={item?.cardImage && OTEL_CARD_IMAGES + item.cardImage}
                    width={96}
                    height={96}
                    fallbackIcon={Hotel}
                    iconSize={24}
                />
            </span>
            <span className="home-hotel__body">
                <span className="home-hotel__name">{name}</span>
                {rating > 0 && (
                    <span className="home-hotel__stars" role="img" aria-label={`${rating} / 5`}>
                        {Array.from({ length: 5 }, (_, i) => (
                            <Star
                                key={i}
                                size={13}
                                strokeWidth={1.75}
                                className={i < rating ? 'is-on' : ''}
                                aria-hidden="true"
                            />
                        ))}
                    </span>
                )}
                {location && (
                    <span className="home-hotel__loc">
                        <MapPin size={13} strokeWidth={1.75} aria-hidden="true" />
                        {location}
                    </span>
                )}
            </span>
            {item?.otelLink && (
                <span className="home-hotel__go" aria-hidden="true">
                    <ArrowUpRight size={18} strokeWidth={1.75} />
                </span>
            )}
        </Tag>
    );
}

/** Layout family: compact horizontal scroll-snap strip. */
function HomeHotel() {
    const { t } = useTranslation();
    const { data } = useGetAllOtelsQuery();
    const hotels = data?.data || [];

    if (!hotels.length) return null;

    return (
        <HomeCarousel
            id="home-hotel"
            className="section--subtle home-hotels"
            title={t('homeHotel.title')}
            desc={t('homeHotel.desc')}
            items={hotels}
            perView={{ lg: 3.6, md: 2.4, sm: 1.25 }}
            renderItem={(item) => <HotelChip item={item} />}
        />
    );
}

export default HomeHotel;
