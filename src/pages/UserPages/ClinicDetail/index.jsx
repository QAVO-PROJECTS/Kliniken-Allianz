import './index.scss';
import {Link} from 'react-router-dom';
import image from '/src/assets/ClinicDetialFirst.png';
import CardCertificate from '../../../components/UserComponents/ClinicDetail/CertCard/index.jsx';
import sert1 from '/src/assets/Sertifikat/1.png';
import sert2 from '/src/assets/Sertifikat/2.png';
import sert3 from '/src/assets/Sertifikat/3.png';
import sert4 from '/src/assets/Sertifikat/4.png';
import sert5 from '/src/assets/Sertifikat/5.png';
import sert6 from '/src/assets/Sertifikat/6.png';
import {useRef, useState} from 'react';
import Pagination from '../../../components/Pagination/index.jsx';
import ClinicDetailServiceCard from '../../../components/UserComponents/ClinicDetail/ServiceCard/index.jsx';
import {GoArrowDown} from 'react-icons/go';
import DoktorCard from '../../../components/UserComponents/ClinicDetail/DoktorCard/index.jsx';
import {HiOutlineArrowLeft, HiOutlineArrowRight} from 'react-icons/hi';

// Import gallery images (replace with your actual image paths)
import gallery1 from '/src/assets/1212.jpg';
import gallery2 from '/src/assets/1212.jpg';
import gallery3 from '/src/assets/1212.jpg';
import gallery4 from '/src/assets/1212.jpg';
import Title from "../../../components/UserComponents/Title/index.jsx";
import {MdCall, MdEmail} from "react-icons/md";
import {FaLocationDot} from "react-icons/fa6";

const galleryImages = [gallery1, gallery2, gallery3, gallery4];

function ClinicDetail() {
    const cardsData = [
        {id: 1, image: sert1, number: '01'},
        {id: 2, image: sert2, number: '02'},
        {id: 3, image: sert3, number: '03'},
        {id: 4, image: sert4, number: '04'},
        {id: 5, image: sert5, number: '05'},
        {id: 6, image: sert6, number: '06'},
        {id: 7, image: sert6, number: '07'},
        {id: 8, image: sert6, number: '08'},
    ];

    const [currentPage, setCurrentPage] = useState(1);
    const [showAllServices, setShowAllServices] = useState(false);
    const itemsPerPage = 6;
    const totalPages = Math.ceil(cardsData.length / itemsPerPage);
    const [name, setFirstName] = useState("");
    const [surname, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhone] = useState("");
    const [description, setNote] = useState("");

    // Validasiya error state-i
    const [errors, setErrors] = useState({})
    const handlePageChange = (page) => {
        console.log('Səhifə dəyişdi:', page);
        setCurrentPage(page);
    };

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedCards = cardsData.slice(startIndex, endIndex);

    const serviceCards = [
        <ClinicDetailServiceCard key={1}/>,
        <ClinicDetailServiceCard key={2}/>,
        <ClinicDetailServiceCard key={3}/>,
        <ClinicDetailServiceCard key={4}/>,
        <ClinicDetailServiceCard key={5}/>,
        <ClinicDetailServiceCard key={6}/>,
        <ClinicDetailServiceCard key={7}/>,
    ];

    const displayedServiceCards = showAllServices ? serviceCards : serviceCards.slice(0, 4);
    const sliderRef = useRef(null);
    const gallerySliderRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [galleryIndex, setGalleryIndex] = useState(0);
    const cards = [1, 2, 3, 4, 5, 6];
    const visibleCards = 4;
    const maxIndex = cards.length - visibleCards;
    const maxGalleryIndex = galleryImages.length - 1;

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            sliderRef.current.style.transform = `translateX(-${(currentIndex - 1) * 25}%)`;
        }
    };

    const handleNext = () => {
        if (currentIndex < maxIndex) {
            setCurrentIndex(currentIndex + 1);
            sliderRef.current.style.transform = `translateX(-${(currentIndex + 1) * 25}%)`;
        }
    };

    const handleBulletClick = (index) => {
        if (index <= maxIndex) {
            setCurrentIndex(index);
            sliderRef.current.style.transform = `translateX(-${index * 25}%)`;
        }
    };

    const handleGalleryPrev = () => {
        if (galleryIndex > 0) {
            setGalleryIndex(galleryIndex - 1);
            gallerySliderRef.current.style.transform = `translateX(-${(galleryIndex - 1) * 100}%)`;
        }
    };

    const handleGalleryNext = () => {
        if (galleryIndex < maxGalleryIndex) {
            setGalleryIndex(galleryIndex + 1);
            gallerySliderRef.current.style.transform = `translateX(-${(galleryIndex + 1) * 100}%)`;
        }
    };

    const handleGalleryBulletClick = (index) => {
        setGalleryIndex(index);
        gallerySliderRef.current.style.transform = `translateX(-${index * 100}%)`;
    };

    return (
        <div id={'clinic-detail'}>
            <div className={'container'}>
                <div className={'head'}>
                    <p data-aos='fade-up' data-aos-delay='100'>
                        <Link to={'/'}>Ana səhifə</Link>
                        <div className={'dot'}></div>
                        <Link to={'/clinics/1'}>Klinika</Link>
                    </p>
                </div>
                <div className={'row first-section'}>
                    <div className={'col-7'}>
                        <div className={'content'}>
                            <h3>GlobalMed Klinikası</h3>
                            <p>
                                GlobalMed Klinikası Almaniyada yerləşən, geniş tibbi xidmət sahələr və ən son
                                texnologiyalarla təchiz olunmuş aparıcı sağlamlıq mərkəzlərindən biridir. Klinikada
                                kardiologiya, onkologiya, ortopediya, estetik və digər sahələr üzrə müalicə və
                                diaqnostika xidmətləri təqdim olunur.
                            </p>
                        </div>
                    </div>
                    <div className={'col-5'}>
                        <div className={'image'}>
                            <img src={image} alt="GlobalMed Klinikası"/>
                        </div>
                    </div>
                </div>
                <div className={'second-section'}>
                    <h2>Sertifikatlar</h2>
                    <div className={'row'}>
                        {paginatedCards.map((card, index) => (
                            <CardCertificate
                                key={card.id}
                                index={index}
                                image={card.image}
                                number={card.number}
                                text='Sertifikat'
                                data-aos='zoom-in'
                                data-aos-delay={index * 100}
                            />
                        ))}
                    </div>
                </div>
                <div
                    style={{display: 'flex', justifyContent: 'end', marginTop: '30px', marginBottom: '45px'}}
                    data-aos='fade-up'
                >
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
                <div className={'third-section'}>
                    <div className={'header'}>
                        <h2>Xəstəxananın Təklif Etdiyi Tibbi Xidmətlər</h2>
                        <p>Sizin ehtiyaclarınıza uyğun tibbi xidmət sahələrini kəşf edin.</p>
                    </div>
                    <div className={'row'} style={{marginBottom: '50px'}}>
                        {displayedServiceCards}
                    </div>
                    <div style={{textAlign: 'center'}}>
                        <button onClick={() => setShowAllServices(!showAllServices)}>
                            {showAllServices ? 'Daha az' : 'Daha çox'} <GoArrowDown/>
                        </button>
                    </div>
                </div>
                <div className={'fourth-section'}>
                    <div className={'header'}>
                        <div>
                            <h2>GlobalMed-in Peşəkar Komandası</h2>
                            <p>Müxtəlif sahələr üzrə ixtisaslaşmış mütəxəssislərimiz yüksək tibbi bilik və praktiki
                                təcrübəyə malikdir.</p>
                        </div>
                        <div className="navigationBtn">
                            <button className="prev" onClick={handlePrev} aria-label="Previous doctors">
                                <HiOutlineArrowLeft/>
                            </button>
                            <button className="next" onClick={handleNext} aria-label="Next doctors">
                                <HiOutlineArrowRight/>
                            </button>
                        </div>
                    </div>
                    <div className="slider-wrapper">
                        <div className="slider-card row" ref={sliderRef}>
                            {cards.map((_, index) => (
                                <DoktorCard key={index}/>
                            ))}
                        </div>
                    </div>
                    <div className="custom-pagination">
                        {Array.from({length: maxIndex + 1}).map((_, index) => (
                            <span
                                key={index}
                                className={`custom-bullet ${currentIndex === index ? 'active' : ''}`}
                                onClick={() => handleBulletClick(index)}
                                aria-label={`Go to doctor slide ${index + 1}`}
                                role="button"
                            />
                        ))}
                    </div>
                </div>
                <div className={'fifth-section'}>
                    <h2>Image gallery</h2>
                    <div className={'gallery'}>
                        <div className="gallery-slider-wrapper">
                            <div className="gallery-slider" ref={gallerySliderRef}>
                                {galleryImages.map((img, index) => (
                                    <div className="gallery-slide" key={index}>
                                        <img src={img} alt={`Clinic gallery image ${index + 1}`}/>
                                    </div>
                                ))}
                            </div>
                            <button className="gallery-prev" onClick={handleGalleryPrev} aria-label="Previous image">
                                <HiOutlineArrowLeft/>
                            </button>
                            <button className="gallery-next" onClick={handleGalleryNext} aria-label="Next image">
                                <HiOutlineArrowRight/>
                            </button>
                        </div>
                        <div className="gallery-pagination">
                            {galleryImages.map((_, index) => (
                                <span
                                    key={index}
                                    className={`gallery-bullet ${galleryIndex === index ? 'active' : ''}`}
                                    onClick={() => handleGalleryBulletClick(index)}
                                    aria-label={`Go to gallery image ${index + 1}`}
                                    role="button"
                                />
                            ))}
                        </div>
                    </div>
                </div>
                <div className={"contact"}>

                    <div className={"row form-section"}>
                        <div className={"col-6 col-md-12 col-sm-12 col-xs-12"}>
                            <div className={"form"} data-aos="fade-right">
                                <div className={"form-head"}>
                                    <hr/>
                                    <h2>Formu dolduraraq bizimlə əlaqə saxlayın</h2>
                                </div>
                                <div className={"form-body"}>
                                    <form onSubmit={""}>
                                        <div className={"row"}>
                                            <div className={"col-6 col-md-12 col-sm-12 col-xs-12"}>
                                                <label>Ad</label> <br/>
                                                <input
                                                    placeholder="Adınızı daxil edin"
                                                    value={name}
                                                    onChange={(e) => setFirstName(e.target.value)}
                                                    maxLength={50}
                                                    required
                                                />
                                                {errors.name && <span className="error-message">{errors.name}</span>}
                                            </div>
                                            <div className={"col-6 col-md-12 col-sm-12 col-xs-12"}>
                                                <label>Soyad</label> <br/>
                                                <input
                                                    placeholder="Soyadınızı daxil edin"
                                                    value={surname}
                                                    onChange={(e) => setLastName(e.target.value)}
                                                    maxLength={50}
                                                    required
                                                />
                                                {errors.surname &&
                                                    <span className="error-message">{errors.surname}</span>}
                                            </div>
                                            <div className={"col-12"}>
                                                <label>Email</label> <br/>
                                                <input
                                                    type="email"
                                                    placeholder="examle@gmail.com"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    maxLength={100}
                                                    required
                                                />
                                                {errors.email && <span className="error-message">{errors.email}</span>}
                                            </div>
                                            <div className={"col-12"}>
                                                <label>Nömrə</label> <br/>
                                                <input
                                                    type="tel"
                                                    placeholder="+994 99 999 99 99"
                                                    value={phoneNumber}
                                                    onChange={(e) => setPhone(e.target.value)}
                                                    maxLength={20}
                                                    required
                                                />
                                                {errors.phoneNumber &&
                                                    <span className="error-message">{errors.phoneNumber}</span>}
                                            </div>
                                            <div className={"col-12"}>
                                                <label>Qeyd</label> <br/>
                                                <textarea
                                                    rows={5}
                                                    value={description}
                                                    onChange={(e) => setNote(e.target.value)}
                                                    maxLength={700}
                                                    required
                                                />
                                                {errors.description &&
                                                    <span className="error-message">{errors.description}</span>}
                                            </div>
                                            <div className={"col-12"}>
                                                <button type="submit">Göndər</button>
                                            </div>
                                        </div>
                                    </form>

                                </div>
                            </div>
                        </div>
                        <div className={"col-6 col-md-12 col-sm-12 col-xs-12"}>
                            <div className="map" data-aos="fade-left">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d2143.2871150885803!2d49.820814339935694!3d40.39212129227946!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zNDDCsDIzJzMyLjYiTiA0OcKwNDknMTkuMiJF!5e1!3m2!1saz!2saz!4v1744207493172!5m2!1saz!2saz"
                                    width="100%"
                                    height="580"
                                    style={{border: 0}}
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Google Map"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ClinicDetail;