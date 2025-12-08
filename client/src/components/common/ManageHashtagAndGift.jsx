import { useEffect, useState } from "react";
import "../../styles/admin/ManageHashtag.css";
import LoadingSpinner from "../../loading-spinner/LoadingSpinner";
import ConfirmModal from "../../components/modals/ConfirmModal";
import { objectToFormData } from "../../utils/formDataHelper";
import ViewToggle from "./ViewToggle";

function ManageHashtagAndGift({ title, resourceName, api, responseKey }) {
    const apiUrl = process.env.REACT_APP_API_URL;
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState("list");
    const [isEditing, setIsEditing] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [editId, setEditId] = useState(null);
    const [name, setName] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);

    const fetchItems = async () => {
        setLoading(true);
        try {
            const res = await api.getAll();
            setItems(res[responseKey] || []);
        } catch (error) {
            console.error(`Lỗi lấy danh sách ${resourceName}:`, error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSwitchToAdd = () => {
        setSelected("form");
        setIsEditing(false);
        setEditId(null);
        setName("");
        setImageFile(null);
        setPreviewImage(null);
    };

    const handleEditClick = (item) => {
        setSelected("form");
        setIsEditing(true);
        setEditId(item.id);
        setName(item.name);

        const imgUrl = item.image_url
            ? (item.image_url.startsWith('http') ? item.image_url : `${apiUrl}/${item.image_url}`)
            : null;

        setPreviewImage(imgUrl);
        setImageFile(null);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setSelected("list");
        setEditId(null);
        setName("");
        setImageFile(null);
        setPreviewImage(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name.trim()) {
            alert(`Vui lòng nhập tên ${resourceName}!`);
            return;
        }

        const dataObj = { name: name };
        const formData = objectToFormData(dataObj, imageFile);

        setLoading(true);
        try {
            if (isEditing) {
                await api.update(editId, formData);
                alert(`Cập nhật ${resourceName} thành công!`);
            } else {
                await api.create(formData);
                alert(`Thêm ${resourceName} thành công!`);
            }

            fetchItems();
            setSelected("list");
            setName("");
            setImageFile(null);
        } catch (error) {
            console.error(error);
            alert("Có lỗi xảy ra!");
        } finally {
            setLoading(false);
        }
    };

    const handleAskDelete = (id) => {
        setDeleteId(id);
        setShowModal(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await api.delete(deleteId);
            fetchItems();
        } catch (error) {
            console.error("Lỗi xóa:", error);
        } finally {
            setShowModal(false);
            setDeleteId(null);
        }
    };

    return (
        <div className="manage-hashtag-page">
            <h1 className="title-page">{title}</h1>
            <hr />

            {!isEditing && (
                <ViewToggle
                    resourceName={resourceName}
                    viewMode={selected}
                    onSwitchToList={() => setSelected("list")}
                    onSwitchToAdd={handleSwitchToAdd}
                />
            )}

            <div className="content-area">
                {selected === "list" ? (
                    <div className="table-container">
                        <table className="hashtag-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Ảnh</th>
                                    <th>Tên {resourceName}</th>
                                    <th>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.isArray(items) && items.length > 0 ? (
                                    items.map((item) => (
                                        <tr key={item.id}>
                                            <td>{item.id}</td>
                                            <td>
                                                {item.image_url ? (
                                                    <img
                                                        src={item.image_url.startsWith('http') ? item.image_url : `${apiUrl}/${item.image_url}`}
                                                        alt={item.name}
                                                        className="hashtag-thumbnail"
                                                        style={{
                                                            width: '50px',
                                                            height: '50px',
                                                            objectFit: 'cover',
                                                            borderRadius: '4px'
                                                        }}
                                                    />
                                                ) : (
                                                    <span style={{ fontSize: '12px', color: '#999' }}>No Image</span>
                                                )}
                                            </td>
                                            <td style={{ fontWeight: "bold" }}>{item.name}</td>
                                            <td>
                                                <div className="action-buttons">
                                                    <button className="edit-btn" onClick={() => handleEditClick(item)}>Sửa</button>
                                                    <button className="delete-btn" onClick={() => handleAskDelete(item.id)}>Xóa</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" style={{ textAlign: "center", padding: "20px" }}>
                                            Chưa có {resourceName} nào.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="form-container">
                        <h2>{isEditing ? `Cập nhật ${resourceName}` : `Thêm ${resourceName} mới`}</h2>

                        <form onSubmit={handleSubmit} className="hashtag-form">
                            <div className="form-group">
                                <label>Tên {resourceName}</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder={`Nhập tên ${resourceName}...`}
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Ảnh minh họa</label>
                                <input type="file" accept="image/*" onChange={handleFileChange} />
                                {previewImage && (
                                    <div className="image-preview" style={{ marginTop: '10px' }}>
                                        <img
                                            src={previewImage}
                                            alt="Preview"
                                            style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #ddd' }}
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="form-actions" style={{ marginTop: '20px' }}>
                                <button type="submit" className="button save-btn">
                                    {isEditing ? "Lưu thay đổi" : "Thêm mới"}
                                </button>
                                {isEditing && (
                                    <button
                                        type="button"
                                        className="button cancel-btn"
                                        style={{ marginLeft: '10px', backgroundColor: '#666' }}
                                        onClick={handleCancelEdit}
                                    >
                                        Hủy bỏ
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                )}
            </div>

            {showModal && (
                <ConfirmModal
                    title="Xác nhận xóa"
                    message={`Bạn có chắc chắn muốn xóa ${resourceName} này?`}
                    onConfirm={handleConfirmDelete}
                    onCancel={() => setShowModal(false)}
                />
            )}
            {loading && <LoadingSpinner />}
        </div>
    );
}

export default ManageHashtagAndGift;