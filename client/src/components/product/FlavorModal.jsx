import React, { useState, useEffect } from "react";
import ConfirmModal from "../modals/ConfirmModal";
import {objectToFormData} from "../../utils/formDataHelper";

export default function FlavorModal({
    isOpen,
    mode,
    data,
    onClose,
    onSave,
    onDelete,
    apiUrl
}) {
    const [localData, setLocalData] = useState({
        name: "",
        price: 0,
        stock: 0,
        image_url: ""
    });
    const [imageFile, setImageFile] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [internalEdit, setInternalEdit] = useState(mode === "add");

    useEffect(() => {
        if (data) {
            setLocalData({
                name: data.flavor_name || data.name || "",
                price: data.price || 0,
                stock: data.stock || 0,
                image_url: data.image_url || ""
            });

            if (data.image_url) {
                const url = data.image_url.startsWith('http')
                    ? data.image_url
                    : `${apiUrl}/${data.image_url}`;
                setPreviewImage(url);
            } else {
                setPreviewImage(null);
            }

        } else {
            setLocalData({ name: "", price: "", stock: 0, image_url: "" });
            setPreviewImage(null);
        }
        setInternalEdit(mode === "add");
        setImageFile(null);
    }, [data, mode, apiUrl, isOpen]);

    if (!isOpen) return null;

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleSubmit = () => {
        const flavorData = {
            name: localData.name,
            price: localData.price,
            stock: localData.stock
        }
        const formData = objectToFormData(flavorData, imageFile);
        onSave(formData, data?.id);
    };

    const handleChange = (field, value) => {
        setLocalData({ ...localData, [field]: value });
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>{mode === "add" ? "Thêm hương vị mới" : (internalEdit ? "Chỉnh sửa hương vị" : "Chi tiết hương vị")}</h3>

                <div className="form-group">
                    <label>Tên hương vị</label>
                    <input
                        type="text"
                        disabled={!internalEdit}
                        value={localData.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label>Giá</label>
                    <input
                        type="number"
                        min="0"
                        disabled={!internalEdit}
                        value={localData.price}
                        onChange={(e) => handleChange("price", e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label>Tồn kho</label>
                    <input
                        type="number"
                        min="0"
                        disabled={!internalEdit}
                        value={localData.stock}
                        onChange={(e) => handleChange("stock", e.target.value)}
                    />
                </div>

                <div className="form-group image-upload">
                    <label>Ảnh hương vị</label>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "5px" }}>
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
                            disabled={!internalEdit}
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                    </div>
                </div>

                <div className="actions">
                    {mode === "add" && (
                        <>
                            <button type="button" className="button submit-btn" onClick={handleSubmit}>Thêm</button>
                            <button type="button" className="button cancel-btn" onClick={onClose}>Hủy</button>
                        </>
                    )}

                    {mode !== "add" && internalEdit && (
                        <>
                            <button type="button" className="button submit-btn" onClick={handleSubmit}>Lưu</button>
                            <button type="button" className="button cancel-btn" onClick={() => { setInternalEdit(false); onClose(); }}>Hủy</button>
                        </>
                    )}

                    {mode !== "add" && !internalEdit && (
                        <>
                            <button type="button" className="edit-btn" onClick={() => setInternalEdit(true)}>Sửa</button>
                            <button type="button" className="delete-btn" onClick={() => setShowDeleteConfirm(true)}>Xóa</button>
                            <button type="button" className="cancel-btn" onClick={onClose}>Đóng</button>
                        </>
                    )}
                </div>

                {showDeleteConfirm && (
                    <ConfirmModal
                        title="Xác nhận xóa"
                        message="Xóa hương vị này?"
                        onConfirm={() => { onDelete(data.id); setShowDeleteConfirm(false); }}
                        onCancel={() => setShowDeleteConfirm(false)}
                    />
                )}
            </div>
        </div>
    );
}