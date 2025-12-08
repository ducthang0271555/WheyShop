import { useEffect, useState } from "react";
import "../../styles/admin/ManageProduct.css";
import LoadingSpinner from "../../loading-spinner/LoadingSpinner";
import ProductCard from "../../components/product/ProductCard";
import EditProductForm from "../../components/product/EditProductForm";
import {objectToFormData} from "../../utils/formDataHelper";
import productApi from "../../api/productApi";
import categoryApi from "../../api/categoryApi";
import brandApi from "../../api/brandApi";
import hashtagApi from "../../api/hashtagApi";
import ViewToggle from "../../components/common/ViewToggle";

function ManageProduct() {

    const [products, setProducts] = useState([]);
    const [categoriesList, setCategoriesList] = useState([]);
    const [brandsList, setBrandsList] = useState([]);
    const [hashtagsList, setHashtagsList] = useState([]);

    const [selected, setSelected] = useState("list");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [loading, setLoading] = useState(true);

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
    const [isNew, setIsNew] = useState(0);

    const [selectedHashtags, setSelectedHashtags] = useState([]);

    // ====================== FETCH DATA =========================

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await productApi.getAll()
            setProducts(res);
        } catch (error) {
            console.log(error)
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
            const resCat = await categoryApi.getAll();
            const resBrand = await brandApi.getAll();
            const resHash = await hashtagApi.getAll();

            setCategoriesList(resCat.categories);
            setBrandsList(resBrand.brands);
            setHashtagsList(resHash.hash_tags || []);
        };
        fetchLists();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

        const toggleHashtag = (id) => {
            setSelectedHashtags(prev => {
                if (prev.includes(id)) {
                    return prev.filter(itemId => itemId !== id);
                } else {
                    return [...prev, id];
                }
            });
        };
    //=================== CREATE =================
    const handleSubmit = async (e) => {
        e.preventDefault();

        const productData = {
            name, sku, brand_id: brandId,
            category_id: categoryId,
            price, discount_percent: discountPercent,
            stock, weight, origin, description,
            is_new: isNew, hash_tags: selectedHashtags
        };

        const formData = objectToFormData(productData, imageFile);

        setLoading(true);
        try {
            await productApi.create(formData);

            alert("Thêm sản phẩm thành công!");

            // Reset form sau khi thành công
            setName(""); setSku(""); setCategoryId(""); setBrandId("");
            setPrice(""); setDiscountPercent(0); setStock(0);
            setWeight(""); setOrigin(""); setDescription("");
            setImageFile(null); setSelectedHashtags([]);
            setIsNew(0);

            fetchData();
        } catch (err) {
            console.log(err);
            alert("Lỗi khi thêm sản phẩm!");
        } finally {
            setLoading(false);
        }
    };

    // ====================== UPDATE PRODUCT =========================

    const handleUpdateProduct = async (id, form, imageFile) => {
        const fd = objectToFormData(form, imageFile)

        setLoading(true);
        try {
            await productApi.update(id, fd);
            alert("Cập nhật sản phẩm thành công!");
            fetchData();
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };


    // ====================== DELETE PRODUCT =========================

    const handleDeleteProduct = async (id) => {
        await productApi.delete(id);
        fetchData();
        setSelectedProduct(null);
    };

    const handleSelectProduct = async (id) => {
        const res = await productApi.get(id);
        setSelectedProduct(res.product);
    };

    return (
        <div className="manage-product-page">
            <h1 className="title-page">Quản lý sản phẩm</h1>
            <hr />

            {selectedProduct ? (
                <EditProductForm
                    product={selectedProduct}
                    onSave={handleUpdateProduct}
                    onDelete={handleDeleteProduct}
                    onCancel={() => setSelectedProduct(null)}
                />
            ) : (
                <>
                    <ViewToggle
                        resourceName="Sản phẩm"
                        viewMode={selected === "add" ? "form" : "list"}
                        onSwitchToList={() => setSelected("list")}
                        onSwitchToAdd={() => setSelected("add")}
                    />

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
                                    {products
                                        .filter((cat) =>
                                            selectedCategory === "all"
                                                ? true
                                                : cat.category_id === Number(selectedCategory)
                                        )
                                        .map((pro) => (
                                            <div key={pro.category_id} className="category-block">
                                                <h2 className="category-title">{pro.category_name}</h2>

                                                <div className="category-products">
                                                    {pro.products.map((p) => (
                                                        <ProductCard
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
                        <div className="add-product-section">
                            <h2>Thêm sản phẩm mới</h2>

                            <form className="product-form" onSubmit={handleSubmit}>

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

                                <div className="form-group"><label>Là sản phẩm mới?</label>
                                    <select
                                        value={isNew}
                                        onChange={(e) => setIsNew(Number(e.target.value))}
                                    >
                                        <option value={0}>Không</option>
                                        <option value={1}>Có</option>
                                    </select>
                                </div>

                                <div className="form-group full-width"><label>Mô tả</label>
                                    <textarea value={description}
                                              onChange={(e) => setDescription(e.target.value)}></textarea>
                                </div>

                                <div className="form-group full-width">
                                    <label>Hashtags (Chọn nhiều)</label>
                                    <div className="hashtag-selection-container">
                                        {hashtagsList.length > 0 ? (
                                            hashtagsList.map((tag) => (
                                                <div
                                                    key={tag.id}
                                                    className={`hashtag-badge ${selectedHashtags.includes(tag.id) ? 'active' : ''}`}
                                                    onClick={() => toggleHashtag(tag.id)}
                                                >
                                                    {tag.name}
                                                </div>
                                            ))
                                        ) : (
                                            <p style={{fontSize: "14px", color: "#666"}}>Chưa có hashtag nào trong hệ
                                                thống.</p>
                                        )}
                                    </div>
                                </div>

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
