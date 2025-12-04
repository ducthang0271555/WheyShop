import React from "react";

export default function ProductMainInfo({ form, handleChange, editMode, categoriesList, brandsList, previewImage, onImageChange }) {
    return (
        <>
            <div className="form-group">
                <label>Tên sản phẩm</label>
                <input disabled={!editMode} value={form.name} onChange={(e) => handleChange("name", e.target.value)}/>
            </div>

            <div className="form-group">
                <label>Mã SKU</label>
                <input disabled={!editMode} value={form.sku} onChange={(e) => handleChange("sku", e.target.value)}/>
            </div>

            <div className="form-group">
                <label>Loại</label>
                <select disabled={!editMode} value={form.category_id}
                        onChange={(e) => handleChange("category_id", e.target.value)}>
                    {categoriesList.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                <label>Giá</label>
                <input type="number" disabled={!editMode} value={form.price}
                       onChange={(e) => handleChange("price", e.target.value)}/>
            </div>

            <div className="form-group">
                <label>Khối lượng</label>
                <input disabled={!editMode} value={form.weight}
                       onChange={(e) => handleChange("weight", e.target.value)}/>
            </div>

            <div className="form-group">
                <label>Sản phẩm Mới (New)</label>
                <select disabled={!editMode} value={form.is_new}
                        onChange={(e) => handleChange("is_new", Number(e.target.value))}>
                    <option value={1}>Có</option>
                    <option value={0}>Không</option>
                </select>
            </div>

            <div className="form-group">
                <label>Thương hiệu</label>
                <select disabled={!editMode} value={form.brand_id}
                        onChange={(e) => handleChange("brand_id", e.target.value)}>
                    {brandsList.map((b) => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                <label>Giảm giá (%)</label>
                <input type="number" min="0" max="100" disabled={!editMode} value={form.discount_percent}
                       onChange={(e) => handleChange("discount_percent", e.target.value)}/>
            </div>

            <div className="form-group">
                <label>Tồn kho</label>
                <input type="number" disabled={!editMode} value={form.stock}
                       onChange={(e) => handleChange("stock", e.target.value)}/>
            </div>

            <div className="form-group">
                <label>Trạng thái</label>
                <select disabled={!editMode} value={form.is_active}
                        onChange={(e) => handleChange("is_active", Number(e.target.value))}>
                    <option value={1}>Hoạt động</option>
                    <option value={0}>Ngừng bán</option>
                </select>
            </div>

            <div className="form-group">
                <label>Bán chạy</label>
                <select disabled={!editMode} value={form.is_best_seller}
                        onChange={(e) => handleChange("is_best_seller", Number(e.target.value))}>
                    <option value={1}>Có</option>
                    <option value={0}>Không</option>
                </select>
            </div>

            <div className="form-group">
                <label>Xuất xứ</label>
                <input disabled={!editMode} value={form.origin}
                       onChange={(e) => handleChange("origin", e.target.value)}/>
            </div>

            <div className="form-group full-width">
                <label>Mô tả</label>
                <textarea disabled={!editMode} value={form.description}
                          onChange={(e) => handleChange("description", e.target.value)}/>
            </div>

            <div className="full-width bottom-row" style={{marginTop: "20px"}}>
                <div className="form-group image-upload">
                    <label>Ảnh sản phẩm</label>
                    <div style={{display: "flex", alignItems: "center", gap: "10px", marginBottom: "5px"}}>
                        {previewImage ? (
                            <img
                                src={previewImage}
                                alt="thumb"
                                style={{
                                    width: "50px",
                                    height: "50px",
                                    objectFit: "cover",
                                    borderRadius: "4px",
                                    border: "1px solid #ccc"
                                }}
                            />
                        ) : (
                            <div style={{fontSize: "12px", color: "#888"}}>Chưa có ảnh</div>
                        )}


                        <input
                            type="file"
                            disabled={!editMode}
                            accept="image/*"
                            onChange={onImageChange}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}