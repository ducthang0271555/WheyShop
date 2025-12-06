import React, {useEffect, useState} from 'react';
import {useParams, useLocation} from 'react-router-dom';
import categoryApi from "../../api/categoryApi";
import productApi from "../../api/productApi";
import Header from "../header/Header";
import ProductCard from "./ProductCard";

import banners, {getBannerKey} from "../config/bannerConfig";
import LoadingSpinner from "../../loading-spinner/LoadingSpinner";
import Footer from "../footer/Footer";
import ContactButton from "../common/ContactButton";
import ProductFilters from "../common/ProductFilters";
import Pagination from "../common/Pagination";
import "../../styles/components/product/ProductListingPage.css";

function ProductListingPage() {
    const {id, type} = useParams();
    const location = useLocation();

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);

    const [pageTitle, setPageTitle] = useState("Danh sách sản phẩm");
    const [currentBanners, setCurrentBanners] = useState([]);
    const [loading, setLoading] = useState(true);

    const [sortOption, setSortOption] = useState('default');
    const [selectedCategories, setSelectedCategories] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [paginationInfo, setPaginationInfo] = useState(null);

    let activeKey = '';
    if (location.state && location.state.bannerKey) {
        activeKey = location.state.bannerKey;
    } else {
        if (type === 'flash-sale') activeKey = 'flashSale';
        else if (type === 'new-products' || type === 'new-arrival') activeKey = 'newArrival';
        else if (id && !type) activeKey = 'hashtag_loading';
        else if (type === 'category') activeKey = 'category_view';
    }

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
        setCurrentPage(1);
        setSortOption('default');
        setSelectedCategories([]);

        let title = 'Sản phẩm';

        if (location.state && location.state.bannerKey) {
            title = location.state.title || title;
        }
        else if (type === 'flash-sale') title = 'Flash Sale';
        else if (type === 'new-products' || type === 'new-arrival') title = 'Sản phẩm mới';

        setPageTitle(title);

        if (banners[activeKey]) setCurrentBanners(banners[activeKey]);
        else setCurrentBanners([]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, type, activeKey]);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);

            const params = {
                limit: 10,
                page: currentPage,
                sort: sortOption,
                category_filter: selectedCategories.join(',')
            };

            try {
                let response = null;
                if (type === 'category' && id) {
                    response = await productApi.getProductByCategory(id, params);
                } else if (id && !type) {
                    response = await productApi.getProductByHashtag(id, params);
                } else if (activeKey === 'flashSale') {
                    response = await productApi.getProductFlashSale(params);
                } else if (activeKey === 'newArrival') {
                    response = await productApi.getNewProduct(params);
                }

                if (response) {
                    const list = response.products || (Array.isArray(response) ? response : []);

                    setProducts(list)
                    setPaginationInfo(response.pagination);

                    if (response.hashtag && type !== 'category') {
                        setPageTitle(response.hashtag);
                        if (!location.state) {
                            const mappedKey = getBannerKey(response.hashtag);
                            if (banners[mappedKey]) setCurrentBanners(banners[mappedKey]);
                        }
                    }
                } else {
                    setProducts([])
                    setPaginationInfo(null);
                }
            } catch (error) {
                console.error("Lỗi tải sản phẩm:", error);
            } finally {
                setLoading(false);
            }
        };
        if (id || type || activeKey) {
            fetchProducts();
        }

        window.scrollTo({top: 450, behavior: 'smooth'});

    }, [id, type, currentPage, sortOption, selectedCategories, activeKey, location.state]);

    useEffect(() => {
        if (type === 'category' && categories.length > 0 && id) {
            const matchedCat = categories.find(cat => cat.id.toString() === id.toString());

            if (matchedCat) {
                setPageTitle(matchedCat.name);

                const mappedKey = getBannerKey(matchedCat.name);

                if (banners[mappedKey]) setCurrentBanners(banners[mappedKey]);
                else setCurrentBanners([]);
            }
        }
    }, [categories, type, id]);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= (paginationInfo?.total_pages || 1)) {
            setCurrentPage(newPage);
        }
    };

    const handleCategoryToggle = (catId) => {
        setCurrentPage(1);
        setSelectedCategories(prev => {
            if (prev.includes(catId)) return prev.filter(id => id !== catId);
            else return [...prev, catId];
        });
    };

    const handleSortChange = (e) => {
        setCurrentPage(1);
        setSortOption(e.target.value);
    }

    const showCategoryFilter = !id && type !== 'category' && (activeKey === 'flashSale' || activeKey === 'newArrival');

    return (
        <>
            <ContactButton/>
            <div className="listing-page">
                <Header/>
                <div className="container">
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

                    <ProductFilters
                        showCategoryFilter={showCategoryFilter}
                        categories={categories}
                        selectedCategories={selectedCategories}
                        onCategoryToggle={handleCategoryToggle}
                        sortOption={sortOption}
                        onSortChange={handleSortChange}
                    />

                    {loading ? (
                        <LoadingSpinner/>
                    ) : (
                        <>
                            <div className="product-list-grid">
                                {products.length > 0 ? (
                                    products.map((product) => (
                                        <ProductCard key={product.id} product={product}/>
                                    ))
                                ) : (
                                    <div className="empty-state">
                                        <p>Không tìm thấy sản phẩm phù hợp.</p>
                                    </div>
                                )}
                            </div>

                            <Pagination
                                paginationInfo={paginationInfo}
                                currentPage={currentPage}
                                onPageChange={handlePageChange}
                            />
                        </>
                    )}
                </div>
            </div>
            <Footer/>
        </>
    );
};

export default ProductListingPage;