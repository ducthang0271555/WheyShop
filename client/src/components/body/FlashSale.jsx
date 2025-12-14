import "../../styles/components/body/FlashSale.css";
import ProductCard from "../product/ProductCard";
import React, { useEffect, useState } from "react";
import LoadingSpinner from "../../loading-spinner/LoadingSpinner";
import productApi from "../../api/productApi";

function FlashSale() {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchFlashSaleProducts = async () => {
        setIsLoading(true);
        try {
            const response = await productApi.getProductFlashSale({limit: 5});
            setProducts(response.products);
        } catch (error) {
            console.error("Error fetching flash sale products:", error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchFlashSaleProducts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);

    

    return (
        <div className="flash-sale-container">
            {isLoading && <LoadingSpinner/>}
            <div className="flash-sale-header">
                <div className="fs-title-wrapper">
                    <h2 className="fs-title">FLASH SALE</h2>
                </div>
                <a href="/listing/flash-sale" className="fs-view-all">Xem tất cả {'>'}</a>
            </div>

            <div className="flash-sale-list">
                {products.length > 0 ? (
                    products.map((product) => (
                        <div key={product.id} className="fs-item-wrapper">
                            <ProductCard
                                product={product}
                            />
                        </div>
                    ))
                ) : (
                    <div style={{color: 'white', gridColumn: '1 / -1', textAlign: 'center'}}>
                        Hiện chưa có chương trình Flash Sale nào.
                    </div>
                )}
            </div>
        </div>
    )
}

export default FlashSale;