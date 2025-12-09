import "../../styles/components/product/ProductCard.css";
import { Link } from "react-router-dom";
export default function ProductCard({ product, onClick }) {
    const apiUrl = process.env.REACT_APP_API_URL;
    const {
        name,
        image,
        price,
        discount_percent,
        sold_count
    } = product;

    const discountedPrice = price - (price * discount_percent) / 100;

    return (
        <Link to={`/product/${product.id}`}>
            <div className="admin-product-card" onClick={() => console.log("Clicked product:", product.id)}>

            {/* Badge giảm giá nếu discount > 0 */}
            {discount_percent > 0 && (
                <span className="discount-badge">Giảm {discount_percent}%</span>
            )}

            <img src={`${apiUrl}/${image}`} alt={name} className="product-img" />


            <h3 className="product-name">{name}</h3>

            <div className="price-box">
                <span className="final-price">
                    {discountedPrice.toLocaleString()}đ
                </span>

                {discount_percent > 0 && (
                    <span className="original-price">
                        {price.toLocaleString()}đ
                    </span>
                )}
            </div>
            <span className="sold">{sold_count} đã bán</span>
        </div>
        </Link>
        
    );
}
