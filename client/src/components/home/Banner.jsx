import {useState, useEffect} from "react";
import "../../styles/components/home/Banner.css"


const bannerData = [
    {
        id: 1,
        image: "/assets/image-banner/black-friday-banner.png",
        title: "Black Friday Sale",
        desc: "Ưu đãi đặc biệt"
    },
    {
        id: 2,
        image: "/assets/image-banner/banner2.png",
        title: "Diện mạo mới",
        desc: "Công thức mới"
    },
    {
        id: 3,
        image: "/assets/image-banner/banner3.png",
        title: "NUTRABIO CREATINE MONOHYDRATE",
        desc: "Tinh khiết chuẩn"
    },
    {
        id: 4,
        image: "/assets/image-banner/banner4.png",
        title: "Trợ giá đặc biệt",
        desc: "Creatine giảm 35%"
    }
];

const rightBanners = [
    "/assets/image-banner/whey-protein.png",
    "/assets/image-banner/dau-ca.png",
    "/assets/image-banner/cham-soc-suc-khoe.png"
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
                    <img
                        src={bannerData[currentIndex].image}
                        alt={bannerData[currentIndex].title}
                        className="banner-img"
                    />
                </div>
                <div className="banner-nav">
                    {bannerData.map((item, index) => (
                        <div
                            key={item.id}
                            // Nếu index hiện tại trùng với item này thì thêm class 'active'
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
                {rightBanners.map((img, index) => (
                    <div className="right-banner-item" key={index}>
                        <img src={img} alt={`Promo ${index + 1}`}/>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Banner;