import { useState, useEffect } from "react";
import "../../styles/admin/ManageProduct.css";
import ConfirmModal from "../modals/ConfirmModal";
import axios from "axios";

export default function EditProductForm({
    product,
    onSave,
    onDelete,
    onCancel
}) {
    const apiUrl = process.env.REACT_APP_API_URL;
    const [editMode, setEditMode] = useState(false);

    const [categoriesList, setCategoriesList] = useState([]);
    const [brandsList, setBrandsList] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);


    const [form, setForm] = useState({
        name: product.name,
        price: product.price,
        sku: product.sku,
        stock: product.stock,
        weight: product.weight,
        origin: product.origin,
        category_id: product.category_id,
        brand_id: product.brand_id,
        discount_percent: product.discount_percent,
        description: product.description,
        is_active: Number(product.is_active) === 1 ? 1 : 0,
        is_best_seller: Number(product.is_best_seller) === 1 ? 1 : 0
    });
    console.log("data:", form);

    const [imageFile, setImageFile] = useState(null);

    const handleChange = (field, value) => {
        setForm({ ...form, [field]: value });
    };

    const handleConfirmDelete = () => {
        onDelete(product.id);
        setShowDeleteModal(false);
    };


    useEffect(() => {
        const fetchData = async () => {
            const catRes = await axios.get(`${apiUrl}/categories/get-all-categories`);
            const brandRes = await axios.get(`${apiUrl}/brands/get-all-brands`);

            setCategoriesList(catRes.data.categories);
            setBrandsList(brandRes.data.brands);
        };

        fetchData();
    }, [apiUrl]);

    const handleSaveClick = () => {
        onSave(product.id, form, imageFile);
        setEditMode(false);
    };

    return (
        <div className="edit-product-modal">
            <h2>Chi tiết sản phẩm</h2>

            <form className="product-form" onSubmit={(e) => e.preventDefault()}>


                {/* ===== LEFT SIDE ===== */}
                <div className="form-group">
                    <label>Tên sản phẩm</label>
                    <input
                        disabled={!editMode}
                        value={form.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label>Mã SKU</label>
                    <input
                        disabled={!editMode}
                        value={form.sku}
                        onChange={(e) => handleChange("sku", e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label>Loại</label>
                    <select
                        disabled={!editMode}
                        value={form.category_id}
                        onChange={(e) => handleChange("category_id", e.target.value)}
                    >
                        {categoriesList.map((c) => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Giá</label>
                    <input
                        type="number"
                        disabled={!editMode}
                        value={form.price}
                        onChange={(e) => handleChange("price", e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label>Khối lượng</label>
                    <input
                        disabled={!editMode}
                        value={form.weight}
                        onChange={(e) => handleChange("weight", e.target.value)}
                    />
                </div>

                {/* ===== RIGHT SIDE ===== */}
                <div className="form-group">
                    <label>Thương hiệu</label>
                    <select
                        disabled={!editMode}
                        value={form.brand_id}
                        onChange={(e) => handleChange("brand_id", e.target.value)}
                    >
                        {brandsList.map((b) => (
                            <option key={b.id} value={b.id}>{b.name}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Giảm giá</label>
                    <input
                        type="number"
                        min="0"
                        max="100"
                        disabled={!editMode}
                        value={form.discount_percent}
                        onChange={(e) => handleChange("discount_percent", e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label>Tồn kho</label>
                    <input
                        type="number"
                        disabled={!editMode}
                        value={form.stock}
                        onChange={(e) => handleChange("stock", e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label>Hoạt động</label>
                    <select
                        disabled={!editMode}
                        value={String(form.is_active)}
                        onChange={(e) => handleChange("is_active", Number(e.target.value))}
                    >
                        <option value="1">Hoạt động</option>
                        <option value="0">Ngừng bán</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Bán chạy</label>
                    <select
                        disabled={!editMode}
                        value={String(form.is_best_seller)}
                        onChange={(e) => handleChange("is_best_seller", Number(e.target.value))}
                    >
                        <option value="1">Có</option>
                        <option value="0">Không</option>
                    </select>
                </div>

                {/* ===== DESCRIPTION – FULL WIDTH ===== */}
                <div className="form-group full-width">
                    <label>Mô tả</label>
                    <textarea
                        disabled={!editMode}
                        value={form.description}
                        onChange={(e) => handleChange("description", e.target.value)}
                    />
                </div>

                {/* ===== IMAGE + ACTIONS ===== */}
                <div className="full-width bottom-row">
                    <div className="form-group image-upload">
                        <label>Ảnh sản phẩm</label>
                        <input
                            type="file"
                            disabled={!editMode}
                            accept="image/*"
                            onChange={(e) => setImageFile(e.target.files[0])}
                        />
                    </div>

                    <div className="actions">
                        {!editMode ? (
                            <>
                                <button type="button" className="edit-btn" onClick={() => setEditMode(true)}>
                                    Sửa
                                </button>
                                <button type="button" className="delete-btn" onClick={() => setShowDeleteModal(true)}>
                                    Xóa
                                </button>
                                <button type="button" className="cancel-btn" onClick={onCancel}>
                                    Đóng
                                </button>
                            </>
                        ) : (
                            <>
                                <button type="button" className="save-btn" onClick={handleSaveClick}>
                                    Lưu
                                </button>
                                <button type="button" className="cancel-btn" onClick={() => setEditMode(false)}>
                                    Hủy
                                </button>
                            </>
                        )}

                        {showDeleteModal && (
                            <ConfirmModal
                                title="Xác nhận xóa"
                                message="Bạn có chắc chắn muốn xóa sản phẩm này?"
                                onConfirm={handleConfirmDelete}
                                onCancel={() => setShowDeleteModal(false)}
                            />
                        )}
                    </div>
                </div>

            </form>
        </div>
    );
}
