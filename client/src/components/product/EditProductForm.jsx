import {useState, useEffect} from "react";
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
    const [hashtagsList, setHashtagsList] = useState([]);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [imageFile, setImageFile] = useState(null);

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
        is_best_seller: Number(product.is_best_seller) === 1 ? 1 : 0,
        is_new: Number(product.is_new) === 1 ? 1 : 0
    });

    const [selectedHashtags, setSelectedHashtags] = useState([]);

    // --- SỬA LOGIC NÀY ĐỂ CHECK CHẮC CHẮN HƠN ---
    useEffect(() => {
        // Kiểm tra xem backend có trả về mảng hashtags không
        if (product && product.hashtags && Array.isArray(product.hashtags)) {
            // Map lấy ID và đảm bảo chuyển về Number
            const ids = product.hashtags.map(tag => Number(tag.id));
            setSelectedHashtags(ids);
        } else {
            setSelectedHashtags([]);
        }
    }, [product]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [catRes, brandRes, hashRes] = await Promise.all([
                    axios.get(`${apiUrl}/categories/get-all-categories`),
                    axios.get(`${apiUrl}/brands/get-all-brands`),
                    axios.get(`${apiUrl}/hash_tags/get-all-hash-tags`) // Sửa đúng đường dẫn API hashtag của bạn
                ]);
                setCategoriesList(catRes.data.categories);
                setBrandsList(brandRes.data.brands);
                setHashtagsList(hashRes.data.hash_tags || []);
            } catch (error) {
                console.error("Lỗi tải dữ liệu form:", error);
            }
        };
        fetchData();
    }, [apiUrl]);

    const handleChange = (field, value) => {
        setForm({...form, [field]: value});
    };

    const toggleHashtag = (id) => {
        if (!editMode) return;
        const numId = Number(id); // Luôn xử lý với số

        setSelectedHashtags(prev => {
            if (prev.includes(numId)) {
                return prev.filter(itemId => itemId !== numId);
            } else {
                return [...prev, numId];
            }
        });
    };

    const handleSaveClick = () => {
        const dataToSave = {...form};
        dataToSave.hash_tags = selectedHashtags;
        onSave(product.id, dataToSave, imageFile);
        setEditMode(false);
    };

    const handleConfirmDelete = () => {
        onDelete(product.id);
        setShowDeleteModal(false);
    };

    return (
        <div className="edit-product-section add-product-section">
            <h2 style={{marginBottom: "20px"}}>Chi tiết sản phẩm: {product.name}</h2>

            <form className="product-form" onSubmit={(e) => e.preventDefault()}>

                {/* ... CÁC FIELD KHÁC GIỮ NGUYÊN ... */}
                <div className="form-group">
                    <label>Tên sản phẩm</label>
                    <input disabled={!editMode} value={form.name}
                           onChange={(e) => handleChange("name", e.target.value)}/>
                </div>

                <div className="form-group">
                    <label>Mã SKU</label>
                    <input disabled={!editMode} value={form.sku}
                           onChange={(e) => handleChange("sku", e.target.value)}/>
                </div>

                <div className="form-group">
                    <label>Loại</label>
                    <select disabled={!editMode} value={form.category_id}
                            onChange={(e) => handleChange("category_id", e.target.value)}>{categoriesList.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Giá</label>
                    <input type="number" disabled={!editMode}
                           value={form.price}
                           onChange={(e) => handleChange("price", e.target.value)}/>
                </div>

                <div className="form-group">
                    <label>Khối lượng</label>
                    <input disabled={!editMode} value={form.weight}
                           onChange={(e) => handleChange("weight", e.target.value)}/>
                </div>

                <div className="form-group">
                    <label>Sản phẩm Mới (New)</label>
                    <select disabled={!editMode}
                            value={form.is_new}
                            onChange={(e) => handleChange("is_new", Number(e.target.value))}>
                        <option value={1}>Có</option>
                        <option value={0}>Không</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Thương hiệu</label>
                    <select disabled={!editMode} value={form.brand_id}
                            onChange={(e) => handleChange("brand_id", e.target.value)}>{brandsList.map((b) => (
                        <option key={b.id} value={b.id}>{b.name}</option>))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Giảm giá (%)</label>
                    <input type="number" min="0" max="100"
                           disabled={!editMode}
                           value={form.discount_percent}
                           onChange={(e) => handleChange("discount_percent", e.target.value)}/>
                </div>

                <div className="form-group">
                    <label>Tồn kho</label>
                    <input type="number" disabled={!editMode}
                           value={form.stock}
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
                    <select disabled={!editMode}
                            value={form.is_best_seller}
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
                    <textarea disabled={!editMode}
                              value={form.description}
                              onChange={(e) => handleChange("description", e.target.value)}/>
                </div>

                {/* ===== HASHTAG SELECT ===== */}
                <div className="form-group full-width">
                    <label>Hashtags {!editMode && "(Bấm 'Sửa' để thay đổi)"}</label>
                    <div className="hashtag-selection-container" style={{opacity: editMode ? 1 : 0.7}}>
                        {hashtagsList.length > 0 ? (
                            hashtagsList.map((tag) => {
                                // Kiểm tra ID (Chuyển cả 2 về Number để so sánh an toàn)
                                const isSelected = selectedHashtags.includes(Number(tag.id));
                                return (
                                    <div
                                        key={tag.id}
                                        className={`hashtag-badge ${isSelected ? 'active' : ''}`}
                                        onClick={() => toggleHashtag(tag.id)}
                                        style={{cursor: editMode ? 'pointer' : 'default'}}
                                    >
                                        {tag.name}
                                    </div>
                                );
                            })
                        ) : (
                            <p style={{fontSize: "13px", color: "#888"}}>Chưa có hashtag nào.</p>
                        )}
                    </div>
                </div>

                {/* ===== FOOTER ===== */}
                <div className="full-width bottom-row" style={{marginTop: "20px"}}>
                    <div className="form-group image-upload">
                        <label>Ảnh sản phẩm</label>
                        <div style={{display: "flex", alignItems: "center", gap: "10px", marginBottom: "5px"}}>
                            {product.img_url && (
                                <img
                                    src={product.img_url.startsWith('http') ? product.img_url : `${apiUrl}/${product.img_url}`}
                                    alt="thumb"
                                    style={{
                                        width: "50px",
                                        height: "50px",
                                        objectFit: "cover",
                                        borderRadius: "4px",
                                        border: "1px solid #ccc"
                                    }}/>
                            )}
                            <input type="file" disabled={!editMode} accept="image/*"
                                   onChange={(e) => setImageFile(e.target.files[0])}/>
                        </div>
                    </div>

                    <div className="actions" style={{display: "flex", gap: "10px"}}>
                        {!editMode ? (
                            <>
                                <button type="button" className="edit-btn" onClick={() => setEditMode(true)}>Sửa
                                </button>
                                <button type="button" className="delete-btn"
                                        onClick={() => setShowDeleteModal(true)}>Xóa
                                </button>
                                <button type="button" className="cancel-btn" onClick={onCancel}>Đóng</button>
                            </>
                        ) : (
                            <>
                                <button type="button" className="save-btn" onClick={handleSaveClick}>Lưu</button>
                                <button type="button" className="cancel-btn" onClick={() => {
                                    setEditMode(false);
                                    // Reset hashtag về trạng thái ban đầu nếu hủy
                                    if (product.hashtags) setSelectedHashtags(product.hashtags.map(tag => Number(tag.id)));
                                }}>Hủy
                                </button>
                            </>
                        )}
                        {showDeleteModal && <ConfirmModal title="Xác nhận xóa" message="Xóa sản phẩm này?"
                                                          onConfirm={handleConfirmDelete}
                                                          onCancel={() => setShowDeleteModal(false)}/>}
                    </div>
                </div>
            </form>
        </div>
    );
}