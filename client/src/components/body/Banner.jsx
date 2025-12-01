import {useState, useEffect} from "react";
import { Link } from "react-router-dom";
import "../../styles/components/body/Banner.css"


const bannerData = [
    {
        id: 1,
        image: "/assets/image-banner/black-friday-banner.png",
        title: "Black Friday Sale",
        desc: "Ưu đãi đặc biệt",
        url: "/listing/flash-sale"
    },
    {
        id: 2,
        image: "/assets/image-banner/banner2.png",
        title: "Diện mạo mới",
        desc: "Công thức mới",
        url: "/listing/hashtag/17"
    },
    {
        id: 3,
        image: "/assets/image-banner/banner3.png",
        title: "NUTRABIO CREATINE MONOHYDRATE",
        desc: "Tinh khiết chuẩn",
        url: "/listing/hashtag/18"
    },
    {
        id: 4,
        image: "/assets/image-banner/banner4.png",
        title: "Trợ giá đặc biệt",
        desc: "Creatine giảm 35%",
        url: "/listing/hashtag/18"
    }
];

const rightBanners = [
    {
        image: "/assets/image-banner/whey-protein.png",
        url: "/listing/hashtag/14"
    },
    {
        image: "/assets/image-banner/dau-ca.png",
        url: "/listing/hashtag/20"
    },
    {
        image: "/assets/image-banner/cham-soc-suc-khoe.png",
        url: "/listing/category/27"
    }
];

function Banner() {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentIndex((prevIndex) =>
                prevIndex === bannerData.length - 1 ? 0 : prevIndex + 1
            );
        }, 5000);
        return () => clearInterval(intervalId);
    }, [currentIndex]);

    const handleTabClick = (index) => {
        setCurrentIndex(index);
    }

    return (
        <div className="banner-container">
            <div className="left-banner-container">
                <div className="banner-image-wrapper">
                    <Link to={bannerData[currentIndex].url} className="banner-link">
                        <img
                            src={bannerData[currentIndex].image}
                            alt={bannerData[currentIndex].title}
                            className="banner-img"
                        />
                    </Link>
                </div>
                <div className="banner-nav">
                    {bannerData.map((item, index) => (
                        <div
                            key={item.id}
                            className={`nav-item ${index === currentIndex ? "active" : ""}`}
                            onClick={() => handleTabClick(index)}
                        >
                            <div className="nav-title">{item.title}</div>
                            <div className="nav-desc">{item.desc}</div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="right-banner-container">
                {rightBanners.map((item, index) => (
                    <div className="right-banner-item" key={index}>
                        <Link to={item.url} className="right-banner-link">
                            <img src={item.image} alt={`Promo ${index + 1}`}/>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Banner;