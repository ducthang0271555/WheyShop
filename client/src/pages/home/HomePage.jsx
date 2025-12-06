import "../../styles/HomePage.css"
import Header from '../../components/header/Header';
import Banner from "../../components/body/Banner";
import QuickNav from "../../components/body/QuickNav";
import FlashSale from "../../components/body/FlashSale";
import CategorySection from "../../components/body/CategorySection";
import Footer from "../../components/footer/Footer";
import ContactButton from "../../components/common/ContactButton";

export default function HomePage() {
    return (
        <>
            <div className="home-page-wrapper">
                <div className="sticky-header">
                    <Header/>
                </div>

                <div className="home-content">
                    <Banner/>
                    <QuickNav/>
                    <FlashSale/>

                    <CategorySection
                        title="WHEY PROTEIN"
                        categoryId={25}
                        bannerImg="/assets/image-banner/tang-co-vuot-troi.png"
                        bannerLink="/hashtag/14"
                    />

                    <CategorySection
                        title="THỰC PHẨM BỔ SUNG"
                        categoryId={27}
                        bannerImg="/assets/image-banner/thuc-pham-bo-sung.png"
                        bannerLink="listing/category/27"
                    />

                    <CategorySection
                        title="VITAMIN"
                        categoryId={26}
                        bannerImg="/assets/image-banner/vitamin.png"
                        bannerLink="/listing/category/26"
                    />

                    <CategorySection
                        title="PHỤ KIỆN TẬP LUYỆN"
                        categoryId={29}
                        bannerImg="/assets/image-banner/phu-kien.png"
                        bannerLink="/listing/category/29"
                    />
                </div>

                <div className="home-footer">
                    <Footer/>
                </div>
                <ContactButton />
            </div>
        </>
    );
}
