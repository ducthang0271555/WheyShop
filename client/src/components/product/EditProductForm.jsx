import {useState, useEffect} from "react";
import "../../styles/components/product/EditProductForm.css"
import ConfirmModal from "../modals/ConfirmModal";
import LoadingSpinner from "../../loading-spinner/LoadingSpinner";
import axios from "axios";

import ProductMainInfo from "./ProductMainInfo";
import HashtagSection from "./HashtagSection";
import FlavorList from "./FlavorList";
import FlavorModal from "./FlavorModal";

export default function EditProductForm({ product, onSave, onDelete, onCancel }) {
    const apiUrl = process.env.REACT_APP_API_URL;
    const token = localStorage.getItem("access_token");

    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showDeleteProductModal, setShowDeleteProductModal] = useState(false);
    const [imageFile, setImageFile] = useState(null);

    const [categoriesList, setCategoriesList] = useState([]);
    const [brandsList, setBrandsList] = useState([]);
    const [hashtagsList, setHashtagsList] = useState([]);

    const [selectedHashtags, setSelectedHashtags] = useState([]);
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

    const [flavorList, setFlavorList] = useState([]);
    const [activeFlavorModal, setActiveFlavorModal] = useState({
        isOpen: false,
        mode: "view", // "view" | "add"
        data: null
    });

    useEffect(() => {
        if (product && product.hashtags && Array.isArray(product.hashtags)) {
            setSelectedHashtags(product.hashtags.map(tag => Number(tag.id)));
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

    useEffect(() => {
        fetchFlavorData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [product.id]);

    // --- HANDLERS: MAIN PRODUCT ---
    const handleChange = (field, value) => {
        setForm({ ...form, [field]: value });
    };

    const toggleHashtag = (id) => {
        if (!editMode) return;
        const numId = Number(id);
        setSelectedHashtags(prev => prev.includes(numId) ? prev.filter(itemId => itemId !== numId) : [...prev, numId]);
    };

    const handleSaveClick = () => {
        const dataToSave = { ...form };
        dataToSave.hash_tags = selectedHashtags;
        onSave(product.id, dataToSave, imageFile);
        setEditMode(false);
    };

    const fetchFlavorData = async () => {
        try {
            const response = await axios.get(`${apiUrl}/product_flavors/get-flavors/${product.id}`);
            setFlavorList(response.data);
        } catch (error) {
            console.error("Lỗi tải hương vị:", error);
        }
    };

    const handleOpenFlavorDetail = async (id) => {
        setLoading(true);
        try {
            const response = await axios.get(`${apiUrl}/product_flavors/get-flavor/${id}`);
            setActiveFlavorModal({ isOpen: true, mode: "view", data: response.data });
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleFlavorSave = async (formData, flavorId) => {
        setLoading(true);
        try {
            const isAdd = !flavorId;
            const url = isAdd
                ? `${apiUrl}/product_flavors/create-flavor/${product.id}`
                : `${apiUrl}/product_flavors/update-flavor/${flavorId}`;

            const method = isAdd ? axios.post : axios.put;

            await method(url, formData, {
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
            });

            alert(isAdd ? "Thêm hương vị thành công" : "Cập nhật hương vị thành công");
            fetchFlavorData();
            setActiveFlavorModal({ ...activeFlavorModal, isOpen: false });
        } catch (error) {
            console.error("Lỗi lưu hương vị:", error);
            alert("Có lỗi xảy ra");
        } finally {
            setLoading(false);
        }
    };

    const handleFlavorDelete = async (id) => {
        setLoading(true);
        try {
            await axios.delete(`${apiUrl}/product_flavors/delete-flavor/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setActiveFlavorModal({ ...activeFlavorModal, isOpen: false });
            fetchFlavorData();
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="edit-product-section add-product-section">
            {loading && <LoadingSpinner />}
            <h2 style={{ marginBottom: "20px" }}>Chi tiết sản phẩm: {product.name}</h2>

            <form className="product-form" onSubmit={(e) => e.preventDefault()}>
                <ProductMainInfo
                    form={form}
                    handleChange={handleChange}
                    editMode={editMode}
                    categoriesList={categoriesList}
                    brandsList={brandsList}
                    product={product}
                    apiUrl={apiUrl}
                    setImageFile={setImageFile}
                />

                {/* 2. HASHTAGS */}
                <HashtagSection
                    hashtagsList={hashtagsList}
                    selectedHashtags={selectedHashtags}
                    toggleHashtag={toggleHashtag}
                    editMode={editMode}
                />

                <FlavorList
                    flavorList={flavorList}
                    onSelectFlavor={handleOpenFlavorDetail}
                    apiUrl={apiUrl}
                />

                <div className="actions" style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                    {!editMode ? (
                        <>
                            <button type="button" className="add-flavor-btn" onClick={() => setActiveFlavorModal({ isOpen: true, mode: "add", data: null })}>
                                Thêm hương vị
                            </button>
                            <button type="button" className="edit-btn" onClick={() => setEditMode(true)}>Sửa</button>
                            <button type="button" className="delete-btn" onClick={() => setShowDeleteProductModal(true)}>Xóa</button>
                            <button type="button" className="cancel-btn" onClick={onCancel}>Đóng</button>
                        </>
                    ) : (
                        <>
                            <button type="button" className="save-btn" onClick={handleSaveClick}>Lưu</button>
                            <button type="button" className="cancel-btn" onClick={() => {
                                setEditMode(false);
                                if (product.hashtags) setSelectedHashtags(product.hashtags.map(tag => Number(tag.id)));
                            }}>Hủy</button>
                        </>
                    )}
                </div>
            </form>

            {showDeleteProductModal && (
                <ConfirmModal
                    title="Xác nhận xóa"
                    message="Xóa sản phẩm này?"
                    onConfirm={() => { onDelete(product.id); setShowDeleteProductModal(false); }}
                    onCancel={() => setShowDeleteProductModal(false)}
                />
            )}

            <FlavorModal
                isOpen={activeFlavorModal.isOpen}
                mode={activeFlavorModal.mode}
                data={activeFlavorModal.data}
                onClose={() => setActiveFlavorModal({ ...activeFlavorModal, isOpen: false })}
                onSave={handleFlavorSave}
                onDelete={handleFlavorDelete}
                apiUrl={apiUrl}
            />
        </div>
    );
}