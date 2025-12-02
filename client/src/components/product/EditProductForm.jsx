import {useState, useEffect} from "react";
import "../../styles/components/product/EditProductForm.css"
import ConfirmModal from "../modals/ConfirmModal";
import LoadingSpinner from "../../loading-spinner/LoadingSpinner";
import axios from "axios";

export default function EditProductForm({product, onSave, onDelete, onCancel}) {
    const apiUrl = process.env.REACT_APP_API_URL;
    const [editMode, setEditMode] = useState(false);
    const [addFlavor, setAddFlavor] = useState(false);

    const [categoriesList, setCategoriesList] = useState([]);
    const [brandsList, setBrandsList] = useState([]);
    const [hashtagsList, setHashtagsList] = useState([]);
    const [selectedHashtags, setSelectedHashtags] = useState([]);
    const [flavorList, setFlavorList] = useState([]);
    const [selectedFlavor, setSelectedFlavor] = useState(null);
    const [editFlavor, setEditFlavor] = useState(false);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showDeleteFlavorModal, setShowDeleteFlavorModal] = useState(false)
    const [imageFile, setImageFile] = useState(null);

    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [stock, setStock] = useState(0);
    const [imageFlavor, setImageFlavor] = useState(null);

    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem("access_token");


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



    useEffect(() => {
        if (product && product.hashtags && Array.isArray(product.hashtags)) {
            const ids = product.hashtags.map(tag => Number(tag.id));
            setSelectedHashtags(ids);
        } else {
            setSelectedHashtags([]);
        }
    }, [product]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [catRes, brandRes, hashRes] = await Promise.all([
                    axios.get(`${apiUrl}/categories/get-all-categories`),
                    axios.get(`${apiUrl}/brands/get-all-brands`),
                    axios.get(`${apiUrl}/hash_tags/get-all-hash-tags`)
                ]);
                setCategoriesList(catRes.data.categories);
                setBrandsList(brandRes.data.brands);
                setHashtagsList(hashRes.data.hash_tags || []);
            } catch (error) {
                console.error("Lỗi tải dữ liệu form:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [apiUrl]);

    const handleChange = (field, value) => {
        setForm({...form, [field]: value});
    };

    const handleFlavorChange = (field, value) => {
        setSelectedFlavor(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const toggleHashtag = (id) => {
        if (!editMode) return;
        const numId = Number(id);

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

    const handleConfirmDeleteFlavor = async (id) => {
        setLoading(true);
        try {
            await axios.delete(`${apiUrl}/product_flavors/delete-flavor/${selectedFlavor.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            alert("Xóa hương vị thành công!");
            setSelectedFlavor(false);
            setShowDeleteFlavorModal(false);
            fetchFlavorData()
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    const fetchFlavorData = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${apiUrl}/product_flavors/get-flavors/${product.id}`);
            setFlavorList(response.data)
        } catch (error) {
            console.error("Lỗi tải hương vị:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchFlavorData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [product.id]);

    const handleSaveFlavor = async (e) => {
        e.preventDefault();

        const flavorData = new FormData();
        const product_id = product.id;
        flavorData.append("name", name);
        flavorData.append("price", price);
        flavorData.append("stock", stock);
        if (imageFlavor) {
            flavorData.append("image", imageFlavor);
        }
        setLoading(true);
        try {
            await axios.post(`${apiUrl}/product_flavors/create-flavor/${product_id}`, flavorData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                },
            });
            alert("Thêm hương vị thành công");
            fetchFlavorData()
            setName(""); setStock(0); setPrice(""); setImageFlavor(null);
        } catch (error) {
            console.error("Lỗi thêm hương vị:", error);
            alert("Lỗi thêm hương vị");
        } finally {
            setLoading(false);
        }
    }

    const handleSelectFlavor = async (id) => {
        const response = await axios.get(`${apiUrl}/product_flavors/get-flavor/${id}`);
        setSelectedFlavor(response.data);
    }

    const updateFlavor = async () => {
        if (!selectedFlavor) return;

        const flavorData = new FormData();
        flavorData.append("name", selectedFlavor.flavor_name);
        flavorData.append("price", selectedFlavor.price);
        flavorData.append("stock", selectedFlavor.stock);

        if (imageFlavor) {
            flavorData.append("image", imageFlavor);
        }

        setLoading(true);
        try {
            await axios.put(`${apiUrl}/product_flavors/update-flavor/${selectedFlavor.id}`, flavorData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                },
            })
            alert("Cập nhật hương vị thành công");
            setEditFlavor(false);
            setImageFlavor(null);
            fetchFlavorData();
            const refreshRes = await axios.get(`${apiUrl}/product_flavors/get-flavor/${selectedFlavor.id}`);
            setSelectedFlavor(refreshRes.data);
        } catch (error) {
            console.log("Lỗi cập nhật hương vị", error);
        } finally {
            setLoading(false);
        }
    }

    const handleCancelEditFlavor = async (e) => {
        setLoading(true);
        try {
            const response = await axios.get(`${apiUrl}/product_flavors/get-flavor/${selectedFlavor.id}`);
            setSelectedFlavor(response.data);
            setEditFlavor(false);
            setImageFlavor(null);
        } catch (error) {
            console.error(error);
            setEditFlavor(false);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="edit-product-section add-product-section">
            {loading && <LoadingSpinner/>}
            <h2 style={{marginBottom: "20px"}}>Chi tiết sản phẩm: {product.name}</h2>

            <form className="product-form" onSubmit={(e) => e.preventDefault()}>

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
                    <label>Hashtags</label>
                    <div className="hashtag-selection-container" style={{opacity: editMode ? 1 : 0.7}}>
                        {hashtagsList.length > 0 ? (
                            hashtagsList.map((tag) => {
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

                <div className="form-group full-width">
                    <label>Danh sách Hương vị ({flavorList.length})</label>
                    <div className="flavor-list-container">
                        {flavorList && flavorList.length > 0 ? (
                            <div className="flavor-grid">
                                {flavorList.map((flavor) => (
                                    <div key={flavor.id} className="flavor-item-card" onClick={() => handleSelectFlavor(flavor.id)}>
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
                                                {flavor.flavor_name || flavor.name} {/* Handle tùy theo backend trả về key nào */}
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
                                <button type="button" className="add-flavor-btn" onClick={() => setAddFlavor(true)}>
                                    Thêm hương vị
                                </button>

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
                                <button type="button" className="save-btn" onClick={handleSaveClick}>Lưu</button>
                                <button type="button" className="cancel-btn" onClick={() => {
                                    setEditMode(false);
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

            {selectedFlavor && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>{editFlavor ? "Chỉnh sửa hương vị" : "Chi tiết hương vị"}</h3>

                        <div className="form-group">
                            <label>Tên hương vị</label>
                            <input
                                type="text"
                                disabled={!editFlavor}
                                value={selectedFlavor.flavor_name || ""}
                                onChange={(e) => handleFlavorChange("flavor_name", e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label>Giá</label>
                            <input
                                type="number"
                                min="0"
                                disabled={!editFlavor}
                                value={selectedFlavor.price || 0}
                                onChange={(e) => handleFlavorChange("price", e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label>Tồn kho</label>
                            <input
                                type="number"
                                min="0"
                                disabled={!editFlavor}
                                value={selectedFlavor.stock || 0}
                                onChange={(e) => handleFlavorChange("stock", e.target.value)}
                            />
                        </div>

                        <div className="form-group image-upload">
                            <label>Ảnh hương vị</label>
                            <div style={{display: "flex", alignItems: "center", gap: "10px", marginBottom: "5px"}}>
                                {selectedFlavor.image_url && (
                                    <img
                                        src={selectedFlavor.image_url.startsWith('http') ? selectedFlavor.image_url : `${apiUrl}/${selectedFlavor.image_url}`}
                                        alt="thumb"
                                        style={{
                                            width: "50px",
                                            height: "50px",
                                            objectFit: "cover",
                                            borderRadius: "4px",
                                            border: "1px solid #ccc"
                                        }}/>
                                )}
                                <input type="file" disabled={!editFlavor} accept="image/*"
                                       onChange={(e) => setImageFlavor(e.target.files[0])}/>
                            </div>
                        </div>

                        <div className="actions">
                            {editFlavor ? (
                                <>
                                    <button type="button" className="button submit-btn" onClick={updateFlavor}>
                                        Lưu
                                    </button>

                                    <button type="button" className="button cancel-btn" onClick={handleCancelEditFlavor}>
                                        Hủy
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button type="button" className="edit-btn"
                                            onClick={() => setEditFlavor(true)}>
                                        Sửa
                                    </button>

                                    <button type="button" className="delete-btn" onClick={() => setShowDeleteFlavorModal(true)}>
                                        Xóa
                                    </button>

                                    <button type="button" className="cancel-btn" onClick={() => {
                                        setSelectedFlavor(null);
                                        setEditFlavor(false);
                                    }}>
                                        Đóng
                                    </button>
                                </>
                            )}

                            {showDeleteFlavorModal && <ConfirmModal title="Xác nhận xóa" message="Xóa hương vị này?"
                                                                    onConfirm={() => handleConfirmDeleteFlavor(selectedFlavor.id)}
                                                                    onCancel={() => setShowDeleteFlavorModal(false)}/>}
                        </div>

                    </div>
                </div>
            )}

            {addFlavor && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Thêm hương vị cho {product.name}</h3>
                        <form onSubmit={handleSaveFlavor}>
                            <div className="form-group">
                                <label>Tên hương vị</label>
                                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required/>
                            </div>

                            <div className="form-group">
                                <label>Giá</label>
                                <input type="number" min="0" value={price} onChange={(e) => setPrice(e.target.value)}/>
                            </div>

                            <div className="form-group">
                                <label>Tồn kho</label>
                                <input type="number" min="0" value={stock} onChange={(e) => setStock(e.target.value)}/>
                            </div>

                            <div className="form-group">
                                <label>Ảnh hương vị</label>
                                <input type="file" accept="image/*"
                                       onChange={(e) => setImageFlavor(e.target.files[0])}/>
                            </div>

                            <div className="actions">
                                <button type="submit" className="button submit-btn">
                                    Thêm sản phẩm
                                </button>

                                <button type="button" className="button cancel-btn" onClick={() => setAddFlavor(false)}>
                                    Hủy
                                </button>
                            </div>
                        </form>

                    </div>
                </div>
            )}
        </div>
    );
}