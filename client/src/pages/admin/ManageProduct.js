import { useEffect, useState } from "react";
import "../../styles/admin/ManageProduct.css";
import LoadingSpinner from "../../LoadingSpinner/LoadingSpinner";
import AdminProductCard from "../../components/AdminProductCard";
import EditProductForm from "../../components/EditProductForm";
import axios from "axios";

function ManageProduct() {
    const apiUrl = process.env.REACT_APP_API_URL;

    // Dữ liệu chính
    const [categories, setCategories] = useState([]);
    const [categoriesList, setCategoriesList] = useState([]);
    const [brandsList, setBrandsList] = useState([]);

    // UI state
    const [selected, setSelected] = useState("list");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    // Form add product
    const [name, setName] = useState("");
    const [sku, setSku] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [brandId, setBrandId] = useState("");
    const [price, setPrice] = useState("");
    const [discountPercent, setDiscountPercent] = useState(0);
    const [stock, setStock] = useState(0);
    const [weight, setWeight] = useState("");
    const [origin, setOrigin] = useState("");
    const [description, setDescription] = useState("");
    const [imageFile, setImageFile] = useState(null);

    const token = localStorage.getItem("access_token");

    // ====================== FETCH DATA =========================

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${apiUrl}/products/get-all-products`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setCategories(res.data);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const fetchLists = async () => {
            const resCat = await axios.get(`${apiUrl}/categories/get-all-categories`);
            const resBrand = await axios.get(`${apiUrl}/brands/get-all-brands`);

            setCategoriesList(resCat.data.categories);
            setBrandsList(resBrand.data.brands);
        };
        fetchLists();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ====================== ADD PRODUCT =========================

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("name", name);
        formData.append("sku", sku);
        formData.append("category_id", categoryId);
        formData.append("brand_id", brandId);
        formData.append("price", price);
        formData.append("discount_percent", discountPercent);
        formData.append("stock", stock);
        formData.append("weight", weight);
        formData.append("origin", origin);
        formData.append("description", description);

        if (imageFile) {
            formData.append("image", imageFile);
        }

        try {
            await axios.post(`${apiUrl}/products/create-product`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                },
            });

            alert("✅ Thêm sản phẩm thành công!");
            fetchData();
        } catch (err) {
            console.log(err);
            alert("❌ Lỗi khi thêm sản phẩm!");
        }
    };

    // ====================== UPDATE PRODUCT =========================

    const handleUpdateProduct = async (id, form, imageFile) => {
        const fd = new FormData();

        for (const key in form) {
            fd.append(key, form[key]);
        }

        if (imageFile) {
            fd.append("image", imageFile);
        }

        const res = await axios.put(`${apiUrl}/products/update-product/${id}`, fd, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data"
            }
        });
        alert("✅ Cập nhật sản phẩm thành công!");
        fetchData();

        return res;
    };


    // ====================== DELETE PRODUCT =========================

    const handleDeleteProduct = async (id) => {
        await axios.delete(`${apiUrl}/products/delete-product/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        fetchData();
        setSelectedProduct(null);
    };

    const handleSelectProduct = async (id) => {
        const res = await axios.get(`${apiUrl}/products/get-product/${id}`);
        setSelectedProduct(res.data.product);
    };


    // ====================== UI HIỂN THỊ =========================

    return (
        <div className="manage-product-page">
            <h1 className="title-page">Quản lý sản phẩm</h1>
            <hr />

            {/* Nếu đang chọn 1 sản phẩm → hiện form edit */}
            {selectedProduct ? (
                <EditProductForm
                    product={selectedProduct}
                    onSave={handleUpdateProduct}
                    onDelete={handleDeleteProduct}
                    onCancel={() => setSelectedProduct(null)}
                />
            ) : (
                <>
                    {/* Radio chọn chế độ */}
                    <div className="radio-input">
                        <label>
                            <input
                                type="radio"
                                name="mode"
                                value="list"
                                checked={selected === "list"}
                                onChange={() => setSelected("list")}
                            />
                            <span>List sản phẩm</span>
                        </label>

                        <label>
                            <input
                                type="radio"
                                name="mode"
                                value="add"
                                checked={selected === "add"}
                                onChange={() => setSelected("add")}
                            />
                            <span>Thêm sản phẩm</span>
                        </label>

                        <span className="selection"></span>
                    </div>

                    {/* ================= LIST SẢN PHẨM ================= */}
                    {selected === "list" ? (
                        loading ? (
                            <LoadingSpinner />
                        ) : (
                            <div className="product-list-section">
                                <div className="sort-container">
                                    <label htmlFor="SortBy" className="sort-label">
                                        Tìm theo loại
                                    </label>

                                    <select
                                        id="SortBy"
                                        className="sort-select"
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                    >
                                        <option value="all">Tất cả</option>
                                        {categoriesList.map((cat) => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="products-grid">
                                    {categories
                                        .filter((cat) =>
                                            selectedCategory === "all"
                                                ? true
                                                : cat.category_id === Number(selectedCategory)
                                        )
                                        .map((cat) => (
                                            <div key={cat.category_id} className="category-block">
                                                <h2 className="category-title">{cat.category_name}</h2>

                                                <div className="category-products">
                                                    {cat.products.map((p) => (
                                                        <AdminProductCard
                                                            key={p.id}
                                                            product={p}
                                                            onClick={() => handleSelectProduct(p.id)}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        )
                    ) : (
                        /* ================= FORM THÊM SẢN PHẨM ================= */
                        <div className="add-product-section">
                            <h2>Thêm sản phẩm mới</h2>

                            <form className="product-form" onSubmit={handleSubmit}>

                                {/* 5 TRƯỜNG BÊN TRÁI */}
                                <div className="form-group"><label>Tên sản phẩm</label>
                                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                                </div>

                                <div className="form-group"><label>Mã SKU</label>
                                    <input type="text" value={sku} onChange={(e) => setSku(e.target.value)} required />
                                </div>

                                <div className="form-group"><label>Loại</label>
                                    <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
                                        <option value="">-- chọn loại --</option>
                                        {categoriesList.map((c) => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group"><label>Giá</label>
                                    <input type="number" min="0" value={price} onChange={(e) => setPrice(e.target.value)} />
                                </div>

                                <div className="form-group"><label>Khối lượng</label>
                                    <input type="text" value={weight} onChange={(e) => setWeight(e.target.value)} />
                                </div>

                                {/* 5 TRƯỜNG BÊN PHẢI */}
                                <div className="form-group"><label>Thương hiệu</label>
                                    <select value={brandId} onChange={(e) => setBrandId(e.target.value)}>
                                        <option value="">-- chọn brand --</option>
                                        {brandsList.map((b) => (
                                            <option key={b.id} value={b.id}>{b.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group"><label>Giảm giá (%)</label>
                                    <input type="number" min="0" max="100" value={discountPercent} onChange={(e) => setDiscountPercent(e.target.value)} />
                                </div>

                                <div className="form-group"><label>Tồn kho</label>
                                    <input type="number" min="0" value={stock} onChange={(e) => setStock(e.target.value)} />
                                </div>

                                <div className="form-group"><label>Xuất xứ</label>
                                    <input type="text" value={origin} onChange={(e) => setOrigin(e.target.value)} />
                                </div>

                                <div className="form-group full-width"><label>Mô tả</label>
                                    <textarea value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                                </div>

                                {/* Ảnh + nút submit */}
                                <div className="full-width bottom-row">
                                    <div className="form-group image-upload">
                                        <label>Ảnh sản phẩm</label>
                                        <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />
                                    </div>

                                    <button type="submit" className="button submit-btn">
                                        Thêm sản phẩm
                                    </button>
                                </div>
                            </form>

                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default ManageProduct;
