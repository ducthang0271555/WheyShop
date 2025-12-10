import "../../styles/components/body/CategorySection.css";
import React, { useEffect, useState } from "react";
import LoadingSpinner from "../../loading-spinner/LoadingSpinner";
import ProductCard from "../product/ProductCard";
import productApi from "../../api/productApi";

const CategorySection = ({ title, categoryId, bannerImg, bannerLink = "#" }) => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchCategoryProducts = async () => {
        setIsLoading(true);
        try {
            const response = await productApi.getProductByCategory(categoryId, {limit: 5, page: 1});
            setProducts(response.products);
        } catch (error) {
            console.error("Error fetching category products:", error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchCategoryProducts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [categoryId]);

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


            <div className="cat-header">
                <a href={`listing/category/${categoryId}`}><h2 className="cat-title">{title}</h2></a>

                <div className="cat-header-right">
                    <a href={`/category/${categoryId}`} className="cat-view-all-top">Xem tất cả</a>
                </div>
            </div>

            <div className="cat-product-grid">
                {products.map((product) => (
                    <div key={product.id} className="cat-product-item">
                        <ProductCard
                            product={product}
                            // onClick={() => console.log("Clicked product:", product.description)}
                        />
                    </div>
                ))}
            </div>

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