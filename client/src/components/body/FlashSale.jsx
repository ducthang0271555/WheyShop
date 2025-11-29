import "../../styles/components/body/FlashSale.css";
import ProductCard from "../product/ProductCard";
import React, { useEffect, useState } from "react";
import LoadingSpinner from "../../loading-spinner/LoadingSpinner";
import axios from "axios";

function FlashSale() {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const apiUrl = process.env.REACT_APP_API_URL;

    const fetchFlashSaleProducts = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${apiUrl}/products/flash-sale`);
            setProducts(response.data);
        } catch (error) {
            console.error("Error fetching flash sale products:", error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchFlashSaleProducts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [apiUrl]);

    const handleProductClick = (product) => {
        console.log("Click:", product);
    };

    return (
        <div className="flash-sale-container">
            <div className="flash-sale-header">
                <div className="fs-title-wrapper">
                    <h2 className="fs-title">FLASH SALE</h2>
                </div>
                <a href="/flash-sale" className="fs-view-all">Xem tất cả {'>'}</a>
            </div>

            {/* 4. Xử lý hiển thị */}
            {isLoading ? (
                // Trường hợp đang tải: Hiển thị Spinner
                <div style={{height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    {/* Spinner màu trắng cho nổi trên nền cam */}
                    <LoadingSpinner/>
                </div>
            ) : (
                // Trường hợp tải xong: Hiển thị danh sách
                <div className="flash-sale-list">
                    {products.length > 0 ? (
                        products.map((product) => (
                            <div key={product.id} className="fs-item-wrapper">
                                <ProductCard
                                    product={product}
                                    onClick={handleProductClick}
                                />
                            </div>
                        ))
                    ) : (
                        // Trường hợp API trả về rỗng (không có sản phẩm sale)
                        <div style={{color: 'white', gridColumn: '1 / -1', textAlign: 'center'}}>
                            Hiện chưa có chương trình Flash Sale nào.
                        </div>
                    )}
                </div>
            )}
            {isLoading && <LoadingSpinner/>}
        </div>
    )
}

export default FlashSale;