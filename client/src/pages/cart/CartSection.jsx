import React from 'react';

const CartSection = ({
    cartItems,
    totalPrice,
    apiUrl,
    formatVND,
    onNavigateBack,
    onRemoveClick,
    onQuantityChange
}) => {
    return (
        <div className="cart-section">
            <div className="cart-header">
                <span className="back-btn" onClick={onNavigateBack}>‹</span>
                Giỏ hàng ({cartItems.length})
            </div>

            {cartItems.length === 0 ? (
                <p style={{textAlign: "center", padding: 20}}>Giỏ hàng trống</p>
            ) : (
                cartItems.map((item) => (
                    <div className="cart-item" key={item.cart_id || item.id}>
                        <div className="remove-btn"
                             onClick={() => onRemoveClick(item.cart_id || item.id)}>×
                        </div>

                        <img
                            src={`${apiUrl}/${item.image_url || item.image}`}
                            alt={item.product_name}
                            className="item-image"
                        />

                        <div className="item-info">
                            <div className="item-name">{item.product_name}</div>

                            {item.flavor_name && <div className="item-flavor">{item.flavor_name}</div>}

                            {item.gift_name && (
                                <div className="gift-info">
                                    <span className="gift-icon">🎁</span> Quà tặng: {item.gift_name}
                                </div>
                            )}

                            <div className="item-controls">
                                <div className="qty-control-sm">
                                    <button className="qty-btn-sm"
                                            onClick={() => onQuantityChange(item.cart_id || item.id, item.quantity, -1)}>−
                                    </button>
                                    <input type="text" className="qty-input-sm" value={item.quantity}
                                           readOnly/>
                                    <button className="qty-btn-sm"
                                            onClick={() => onQuantityChange(item.cart_id || item.id, item.quantity, 1)}>+
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="price-area">
                            <span className="current-price">
                                {formatVND(item.final_price || item.price_after_discount)}
                            </span>
                            {(item.price > (item.final_price || item.price_after_discount)) && (
                                <span className="old-price">{formatVND(item.price)}</span>
                            )}
                        </div>
                    </div>
                ))
            )}

            <div className="summary-row" style={{borderTop: 'none'}}>
                <div className="total-label">Tạm tính:</div>
                <div className="total-price">{formatVND(totalPrice)}</div>
            </div>
        </div>
    );
};

export default CartSection;