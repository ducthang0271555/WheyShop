import React from "react";

export default function FlavorList({ flavorList, onSelectFlavor, apiUrl }) {
    return (
        <div className="form-group full-width">
            <label>Danh sách Hương vị ({flavorList.length})</label>
            <div className="flavor-list-container">
                {flavorList && flavorList.length > 0 ? (
                    <div className="flavor-grid">
                        {flavorList.map((flavor) => (
                            <div key={flavor.id} className="flavor-item-card" onClick={() => onSelectFlavor(flavor.id)}>
                                <div className="flavor-img-wrapper">
                                    {flavor.image_url ? (
                                        <img
                                            src={flavor.image_url.startsWith('http') ? flavor.image_url : `${apiUrl}/${flavor.image_url}`}
                                            alt={flavor.flavor_name}
                                            onError={(e) => e.target.src = "https://via.placeholder.com/50?text=No+Img"}
                                        />
                                    ) : (
                                        <div className="no-img">No Img</div>
                                    )}
                                </div>
                                <div className="flavor-info">
                                    <div className="flavor-name" title={flavor.flavor_name}>
                                        {flavor.flavor_name}
                                    </div>
                                    <div className="flavor-meta">
                                        <span className="stock">Kho: <strong>{flavor.stock}</strong></span>
                                        <span className="price">{Number(flavor.price).toLocaleString()}đ</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-flavor">
                        <p>Sản phẩm này chưa có phân loại hương vị nào.</p>
                    </div>
                )}
            </div>
        </div>
    );
}