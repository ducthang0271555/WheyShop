import {useState, useEffect} from "react";
import "../../styles/components/product/EditProductForm.css"
import ConfirmModal from "../modals/ConfirmModal";
import LoadingSpinner from "../../loading-spinner/LoadingSpinner";
import categoryApi from "../../api/categoryApi";
import brandApi from "../../api/brandApi";
import hashtagApi from "../../api/hashtagApi";
import giftApi from "../../api/giftApi";
import flavorApi from "../../api/flavorApi";

import ProductMainInfo from "./ProductMainInfo";
import FlavorList from "./FlavorList";
import FlavorModal from "./FlavorModal";
import SelectionSection from "./SelectionSection";

export default function EditProductForm({ product, onSave, onDelete, onCancel }) {
    const apiUrl = process.env.REACT_APP_API_URL;

    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showDeleteProductModal, setShowDeleteProductModal] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);

    const [categoriesList, setCategoriesList] = useState([]);
    const [brandsList, setBrandsList] = useState([]);
    const [hashtagsList, setHashtagsList] = useState([]);
    const [selectedHashtags, setSelectedHashtags] = useState([]);
    const [giftsList, setGiftsList] = useState([]);
    const [selectedGifts, setSelectedGifts] = useState([]);

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
        if (product && product.img_url) {
            const imgUrl = product.img_url.startsWith('http')
                ? product.img_url
                : `${apiUrl}/${product.img_url}`;
            setPreviewImage(imgUrl);
        } else {
            setPreviewImage(null);
        }
    }, [product, apiUrl]);

    useEffect(() => {
        if (product && product.hashtags && Array.isArray(product.hashtags)) {
            setSelectedHashtags(product.hashtags.map(tag => Number(tag.id)));
        } else {
            setSelectedHashtags([]);
        }

        if (product && product.gifts && Array.isArray(product.gifts)) {
            setSelectedGifts(product.gifts.map(gift => Number(gift.id)));
        } else {
            setSelectedGifts([]);
        }
    }, [product]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [catRes, brandRes, hashRes, giftRes] = await Promise.all([
                    categoryApi.getAll(),
                    brandApi.getAll(),
                    hashtagApi.getAll(),
                    giftApi.getAll()
                ]);
                setCategoriesList(catRes.categories);
                setBrandsList(brandRes.brands);
                setHashtagsList(hashRes.hash_tags || []);
                setGiftsList(giftRes.gifts || [])
            } catch (error) {
                console.error("Lỗi tải dữ liệu form:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        fetchFlavorData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [product.id]);

    const handleChange = (field, value) => {
        setForm({ ...form, [field]: value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            // Tạo URL tạm thời để hiển thị ngay
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const toggleHashtag = (id) => {
        if (!editMode) return;
        const numId = Number(id);
        setSelectedHashtags(prev => prev.includes(numId) ? prev.filter(itemId => itemId !== numId) : [...prev, numId]);
    };

    const toggleGift = (id) => {
        if (!editMode) return;
        const numId = Number(id);
        setSelectedGifts(prev =>
            prev.includes(numId) ? prev.filter(itemId => itemId !== numId) : [...prev, numId]
        );
    };

    const handleSaveClick = () => {
        const dataToSave = { ...form };
        dataToSave.hash_tags = selectedHashtags;
        dataToSave.gifts = selectedGifts
        onSave(product.id, dataToSave, imageFile);
        setEditMode(false);
    };

    const fetchFlavorData = async () => {
        try {
            const response = await flavorApi.getFlavorsByProduct(product.id);
            setFlavorList(response);
        } catch (error) {
            console.error("Lỗi tải hương vị:", error);
        }
    };

    const handleOpenFlavorDetail = async (id) => {
        setLoading(true);
        try {
            const response = await flavorApi.getFlavor(id);
            setActiveFlavorModal({ isOpen: true, mode: "view", data: response });
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
            if (isAdd) {
                await flavorApi.create(product.id, formData);
            } else {
                await flavorApi.update(flavorId, formData)
            }
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
            await flavorApi.delete(id);
            setActiveFlavorModal({ ...activeFlavorModal, isOpen: false });
            fetchFlavorData();
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelClick = () => {
        setEditMode(false);
        if (product.img_url) {
            setPreviewImage(product.img_url.startsWith('http') ? product.img_url : `${apiUrl}/${product.img_url}`);
        }
        setImageFile(null);
        if (product.hashtags) setSelectedHashtags(product.hashtags.map(tag => Number(tag.id)));
        if (product.gifts) setSelectedGifts(product.gifts.map(gift => Number(gift.id)));
        else setSelectedGifts([]);
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
                    previewImage={previewImage}
                    onImageChange={handleImageChange}
                />

                <SelectionSection
                    label="Hashtags"
                    items={hashtagsList}
                    selectedIds={selectedHashtags}
                    onToggle={toggleHashtag}
                    editMode={editMode}
                    placeholder="Chưa có hashtag nào."
                />

                <SelectionSection
                    label="Quà tặng kèm"
                    items={giftsList}
                    selectedIds={selectedGifts}
                    onToggle={toggleGift}
                    editMode={editMode}
                    placeholder="Chưa có quà tặng nào."
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
                            <button type="button" className="cancel-btn" onClick={handleCancelClick}>Hủy</button>
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