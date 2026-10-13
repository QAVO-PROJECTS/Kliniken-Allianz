import CardSlot from '../CardSlot.jsx';
import CertificateTile from './CertificateTile.jsx';

/**
 * Doctor certificate tile.
 * Props: image (absolute URL), number, text; [bare]; [wrapperClassName]
 * (`index` is accepted for backwards compatibility.)
 */
// eslint-disable-next-line no-unused-vars
const CardCertificateCategory = ({ image, number, text, index, bare = false, wrapperClassName = 'col-60 col-md-60 col-sm-60 col-xs-60' }) => (
    <CardSlot bare={bare} className={`${wrapperClassName} cert-slot`}>
        <CertificateTile image={image} number={number} text={text} />
    </CardSlot>
);

export default CardCertificateCategory;
