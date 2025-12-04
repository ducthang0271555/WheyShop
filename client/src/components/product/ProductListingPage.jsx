import React, {useEffect, useState} from 'react';
import {useParams, useLocation} from 'react-router-dom';
import categoryApi from "../../api/categoryApi";
import productApi from "../../api/productApi";
import Header from "../header/Header";
import ProductCard from "./ProductCard";

import banners, {getBannerKey} from "../config/bannerConfig";
import LoadingSpinner from "../../loading-spinner/LoadingSpinner";
import Footer from "../footer/Footer";
import ContactButton from "../body/ContactButton";
import "../../styles/components/product/ProductListingPage.css";

const ProductListingPage = () => {
    const {id, type} = useParams();
    const location = useLocation();

    const [originalProducts, setOriginalProducts] = useState([]);
    const [displayedProducts, setDisplayedProducts] = useState([]);
    const [categories, setCategories] = useState([]);

    const [pageTitle, setPageTitle] = useState("Danh sách sản phẩm");
    const [currentBanners, setCurrentBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeKey, setActiveKey] = useState('');

    const [sortOption, setSortOption] = useState('default');
    const [selectedCategories, setSelectedCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await categoryApi.getAll();
                setCategories(res.categories);
            } catch (err) {
                console.error("Lỗi lấy danh mục:", err);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        let key = '';
        let title = 'Sản phẩm';

        if (location.state && location.state.bannerKey) {
            key = location.state.bannerKey;
            title = location.state.title || title;
        } else {
            if (type === 'category') {
                key = 'category_view';
                title = 'Đang tải...';
            } else if (id) {
                key = 'hashtag_loading';
            } else if (type === 'flash-sale') {
                key = 'flashSale';
                title = 'Flash Sale';
            } else if (type === 'new-products' || type === 'new-arrival') {
                key = 'newArrival';
                title = 'Sản phẩm mới';
            }
        }

        setActiveKey(key);
        setPageTitle(title);

        setSortOption('default');
        setSelectedCategories([]);

        if (banners[key]) {
            setCurrentBanners(banners[key]);
        } else {
            setCurrentBanners([]);
        }

        const fetchProducts = async () => {
            setLoading(true);
            try {
                let response = null;
                if (type === 'category' && id) {
                    response = await productApi.getProductByCategory(id);
                } else if (id) {
                    response = await productApi.getProductByHashtag(id);
                } else if (key === 'flashSale') {
                    response = await productApi.getProductFlashSale();
                } else if (key === 'newArrival') {
                    response = await productApi.getNewProduct();
                }

                if (response) {
                    const list = Array.isArray(response) ? response : (response.products || []);

                    setOriginalProducts(list);
                    setDisplayedProducts(list);

                    if (response.hashtag && type !== 'category') {
                        setPageTitle(response.hashtag);
                        if (!location.state) {
                            const mappedKey = getBannerKey(response.hashtag);
                            if (banners[mappedKey]) setCurrentBanners(banners[mappedKey]);
                        }
                    }
                } else {
                    setOriginalProducts([]);
                    setDisplayedProducts([]);
                }
            } catch (error) {
                console.error("Lỗi tải sản phẩm:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
        window.scrollTo(0, 0);
    }, [id, type, location.state]);

    useEffect(() => {
        if (type === 'category' && categories.length > 0 && id) {
            const matchedCat = categories.find(cat => cat.id.toString() === id.toString());

            if (matchedCat) {
                setPageTitle(matchedCat.name);

                const mappedKey = getBannerKey(matchedCat.name);

                if (banners[mappedKey]) {
                    setCurrentBanners(banners[mappedKey]);
                } else {
                    setCurrentBanners([]);
                }
            }
        }
    }, [categories, type, id]);

    useEffect(() => {
        let result = [...originalProducts];
        if (selectedCategories.length > 0) {
            result = result.filter(p => selectedCategories.includes(p.category_id));
        }

        if (sortOption === 'price_asc') {
            result.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        } else if (sortOption === 'price_desc') {
            result.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        }

        setDisplayedProducts(result);
    }, [originalProducts, selectedCategories, sortOption]);

    const handleCategoryToggle = (catId) => {
        setSelectedCategories(prev => {
            if (prev.includes(catId)) return prev.filter(id => id !== catId);
            else return [...prev, catId];
        });
    };

    const showCategoryFilter = !id && type !== 'category' && (activeKey === 'flashSale' || activeKey === 'newArrival');

    return (
        <>
            <ContactButton/>
            <div className="listing-page">
                <Header/>
                <div className="container">
                    {/* BANNER */}
                    <div className="listing-banners">
                        {currentBanners.length > 0 ? (
                            currentBanners.map((banner) => (
                                <div key={banner.id} className="listing-banner-item">
                                    <img src={banner.image} alt="Banner"
                                         onError={(e) => e.target.style.display = 'none'}/>
                                </div>
                            ))
                        ) : <div className="no-banner"></div>}
                    </div>

                    <h1 className="listing-title" style={{textTransform: 'none'}}>{pageTitle}</h1>

                    <div className="filter-bar">
                        {showCategoryFilter && (
                            <div className="filter-group category-filter">
                                <span className="filter-label">Lọc theo loại:</span>
                                <div className="category-chips">
                                    {categories.map(cat => (
                                        <label key={cat.id}
                                               className={`chip ${selectedCategories.includes(cat.id) ? 'active' : ''}`}>
                                            <input
                                                type="checkbox"
                                                value={cat.id}
                                                checked={selectedCategories.includes(cat.id)}
                                                onChange={() => handleCategoryToggle(cat.id)}
                                            />
                                            {cat.name}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="filter-group sort-filter">
                            <span className="filter-label">Sắp xếp:</span>
                            <select
                                value={sortOption}
                                onChange={(e) => setSortOption(e.target.value)}
                                className="sort-select"
                            >
                                <option value="default">Mặc định</option>
                                <option value="price_asc">Giá: Thấp đến Cao</option>
                                <option value="price_desc">Giá: Cao đến Thấp</option>
                            </select>
                        </div>
                    </div>

                    {loading ? (
                        <LoadingSpinner/>
                    ) : (
                        <div className="product-list-grid">
                            {displayedProducts.length > 0 ? (
                                displayedProducts.map((product) => (
                                    <ProductCard key={product.id} product={product}/>
                                ))
                            ) : (
                                <div className="empty-state">
                                    <p>Không tìm thấy sản phẩm phù hợp.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
            <Footer/>
        </>
    );
};

export default ProductListingPage;