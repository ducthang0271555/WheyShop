import "../../styles/components/body/CategorySection.css";
import React, { useEffect, useState } from "react";
import LoadingSpinner from "../../loading-spinner/LoadingSpinner";
import ProductCard from "../product/ProductCard";
import axios from "axios";

const CategorySection = ({ title, categoryId, bannerImg, bannerLink = "#" }) => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const apiUrl = process.env.REACT_APP_API_URL;

    const fetchCategoryProducts = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${apiUrl}/products/top-product-sold-by-category/${categoryId}`);
            setProducts(response.data);
        } catch (error) {
            console.error("Error fetching category products:", error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchCategoryProducts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [apiUrl, categoryId]);

    return (
        <div className="category-section-wrapper">
            {bannerImg && (
                <div className="featured-banner-container">
                    <a href={bannerLink} className="featured-banner-link">
                        <img
                            src={bannerImg}
                            alt={title}
                            className="featured-banner-img"
                        />
                    </a>
                </div>
            )}


            {/* 1. HEADER: Tên danh mục + Filter Tags */}
            <div className="cat-header">
                <a href={`listing/category/${categoryId}`}><h2 className="cat-title">{title}</h2></a>

                <div className="cat-header-right">
                    {/* Nút xem tất cả góc trên (tùy chọn) */}
                    <a href={`/category/${categoryId}`} className="cat-view-all-top">Xem tất cả</a>
                </div>
            </div>

            {/* 2. LIST SẢN PHẨM: 5 cái */}
            <div className="cat-product-grid">
                {products.map((product) => (
                    <div key={product.id} className="cat-product-item">
                        <ProductCard
                            product={product}
                            onClick={() => console.log("Click", product.id)}
                        />
                    </div>
                ))}
            </div>

            {/* 3. NÚT XEM TẤT CẢ (Dưới cùng) */}
            <div className="cat-footer-action">
                <a href={`listing/category/${categoryId}`} className="btn-cat-view-all">
                    Xem tất cả {'>'}
                </a>
            </div>

            {isLoading && <LoadingSpinner/>}
        </div>
    )
}

export default CategorySection;