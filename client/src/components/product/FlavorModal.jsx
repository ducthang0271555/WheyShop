import React, { useState, useEffect } from "react";
import ConfirmModal from "../modals/ConfirmModal";

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
        } else {
            setLocalData({ name: "", price: "", stock: 0, image_url: "" });
        }
        setInternalEdit(mode === "add");
        setImageFile(null);
    }, [data, mode, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = () => {
        const formData = new FormData();
        formData.append("name", localData.name);
        formData.append("price", localData.price);
        formData.append("stock", localData.stock);
        if (imageFile) {
            formData.append("image", imageFile);
        }
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
                        {localData.image_url && (
                            <img
                                src={localData.image_url.startsWith('http') ? localData.image_url : `${apiUrl}/${localData.image_url}`}
                                alt="thumb"
                                style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "4px", border: "1px solid #ccc" }}
                            />
                        )}
                        <input
                            type="file"
                            disabled={!internalEdit}
                            accept="image/*"
                            onChange={(e) => setImageFile(e.target.files[0])}
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