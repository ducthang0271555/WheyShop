import "../../styles/admin/ManageHashtag.css";
import { useEffect, useState } from "react";
import LoadingSpinner from "../../loading-spinner/LoadingSpinner";
import ConfirmModal from "../../components/modals/ConfirmModal";
import {objectToFormData} from "../../utils/formDataHelper";
import hashtagApi from "../../api/hashtagApi";


function ManageHashtag() {
    const apiUrl = process.env.REACT_APP_API_URL;

    const [hashtags, setHashtags] = useState([]);
    const [loading, setLoading] = useState(false);

    const [selected, setSelected] = useState("list");
    const [showModal, setShowModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [name, setName] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);

    // ================== 1. FETCH DATA ==================
    const fetchHashtags = async () => {
        setLoading(true);
        try {
            const res = await hashtagApi.getAll();
            setHashtags(res.hash_tags || []);
        } catch (error) {
            console.error("Lỗi lấy danh sách hashtag:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHashtags();
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

    const handleEditClick = (hashtag) => {
        setSelected("form");
        setIsEditing(true);
        setEditId(hashtag.id);
        setName(hashtag.name);


        const imgUrl = hashtag.image_url
            ? (hashtag.image_url.startsWith('http') ? hashtag.image_url : `${apiUrl}/${hashtag.image_url}`)
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

    // ================== 3.FORM (ADD / UPDATE) ==================
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name.trim()) {
            alert("Vui lòng nhập tên Hashtag!");
            return;
        }

        const hashtagData = {
            name: name
        };

        const formData = objectToFormData(hashtagData, imageFile);

        setLoading(true);
        try {
            if (isEditing) {
                await hashtagApi.update(editId, formData);
                alert("Cập nhật Hashtag thành công!");
            } else {
                await hashtagApi.create(formData);
                alert("Thêm Hashtag thành công!");
            }

            fetchHashtags();
            setSelected("list");
            setName("");
            setImageFile(null);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // ================== 4. DELETE ==================
    const handleAskDelete = (id) => {
        setDeleteId(id);
        setShowModal(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await hashtagApi.delete(deleteId);
            fetchHashtags();
        } catch (error) {
            console.error("Lỗi xóa:", error);
        } finally {
            setShowModal(false);
            setDeleteId(null);
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

    return (
        <div className="manage-hashtag-page">
            <h1 className="title-page">Quản lý Hashtag</h1>
            <hr />

            {!isEditing && (
                <div className="radio-input">
                    <label>
                        <input
                            type="radio"
                            name="view-mode"
                            value="list"
                            checked={selected === "list"}
                            onChange={() => setSelected("list")}
                        />
                        <span>Danh sách Hashtag</span>
                    </label>

                    <label>
                        <input
                            type="radio"
                            name="view-mode"
                            value="form"
                            checked={selected === "form"}
                            onChange={handleSwitchToAdd}
                        />
                        <span>Thêm Hashtag</span>
                    </label>
                    <span className="selection"></span>
                </div>
            )}

            <div className="content-area">
                {/* ------------ VIEW: LIST ------------ */}
                {selected === "list" ? (
                    <div className="table-container">
                        <table className="hashtag-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Ảnh</th>
                                    <th>Tên Hashtag</th>
                                    <th>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.isArray(hashtags) && hashtags.length > 0 ? (
                                    hashtags.map((tag) => (
                                        <tr key={tag.id}>
                                            <td>{tag.id}</td>
                                            <td>
                                                {tag.image_url ? (
                                                    <img
                                                        src={tag.image_url.startsWith('http') ? tag.image_url : `${apiUrl}/${tag.image_url}`}
                                                        alt={tag.name}
                                                        className="hashtag-thumbnail"
                                                        style={{
                                                            width: '50px',
                                                            height: '50px',
                                                            objectFit: 'cover',
                                                            borderRadius: '4px'
                                                        }}
                                                    />
                                                ) : (
                                                    <span style={{fontSize: '12px', color: '#999'}}>No Image</span>
                                                )}
                                            </td>
                                            <td style={{fontWeight: "bold"}}>{tag.name}</td>
                                            <td>
                                                <div className="action-buttons">
                                                    <button
                                                        className="edit-btn"
                                                        onClick={() => handleEditClick(tag)}
                                                    >
                                                        Sửa
                                                    </button>
                                                    <button
                                                        className="delete-btn"
                                                        onClick={() => handleAskDelete(tag.id)}
                                                    >
                                                        Xóa
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" style={{textAlign: "center", padding: "20px"}}>
                                            Chưa có hashtag nào.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    /* ------------ VIEW: FORM (ADD / EDIT) ------------ */
                    <div className="form-container">
                        <h2>{isEditing ? "Cập nhật Hashtag" : "Thêm Hashtag mới"}</h2>

                        <form onSubmit={handleSubmit} className="hashtag-form">
                            <div className="form-group">
                                <label>Tên Hashtag</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Ví dụ: GiamCan, TangCo..."
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Ảnh minh họa</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                                {previewImage && (
                                    <div className="image-preview" style={{marginTop: '10px'}}>
                                        <img
                                            src={previewImage}
                                            alt="Preview"
                                            style={{width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #ddd'}}
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="form-actions" style={{marginTop: '20px'}}>
                                <button type="submit" className="button save-btn">
                                    {isEditing ? "Lưu thay đổi" : "Thêm mới"}
                                </button>

                                {isEditing && (
                                    <button
                                        type="button"
                                        className="button cancel-btn"
                                        style={{marginLeft: '10px', backgroundColor: '#666'}}
                                        onClick={() => handleCancelEdit()}
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
                    message="Bạn có chắc chắn muốn xóa Hashtag này? Các sản phẩm gắn thẻ này sẽ không bị xóa."
                    onConfirm={handleConfirmDelete}
                    onCancel={() => setShowModal(false)}
                />
            )}

            {loading && <LoadingSpinner />}
        </div>
    );
}

export default ManageHashtag;