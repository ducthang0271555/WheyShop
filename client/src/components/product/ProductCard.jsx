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

    const CardContent = (
        <div className="admin-product-card">
            {discount_percent > 0 && (
                <span className="discount-badge">Giảm {discount_percent}%</span>
            )}

            <img
                src={image && image.startsWith('http') ? image : `${apiUrl}/${image}`}
                alt={name}
                className="product-img"
            />

            <h3 className="product-name">{name}</h3>

            <div className="price-box">
                <span className="final-price">
                    {discountedPrice.toLocaleString()}đ
                </span>

                {discount_percent > 0 && (
                    <span className="original-price">
                        {Number(price).toLocaleString()}đ
                    </span>
                )}
            </div>
            <span className="sold">{sold_count} đã bán</span>
        </div>
    );

    if (onClick) {
        return (
            <div onClick={onClick} style={{ cursor: "pointer", display: "block" }}>
                {CardContent}
            </div>
        );
    }

    return (
        <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            {CardContent}
        </Link>
    );
}