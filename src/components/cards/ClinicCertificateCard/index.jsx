import CardSlot from '../CardSlot.jsx';
import CertificateTile from '../CertificateCard/CertificateTile.jsx';

/**
 * Clinic certificate tile.
 * Props: image (absolute URL), number, text; [bare]; [wrapperClassName]
 * (`index` is accepted for backwards compatibility.)
 */
// eslint-disable-next-line no-unused-vars
const CardCertificate = ({ image, number, text, index, bare = false, wrapperClassName = 'col-10 col-md-20 col-sm-30 col-xs-30' }) => (
    <CardSlot bare={bare} className={`${wrapperClassName} cert-slot`}>
        <CertificateTile image={image} number={number} text={text} />
    </CardSlot>
);

export default CardCertificate;
