import "../../styles/admin/ManageHashtag.css";
import { useEffect, useState } from "react";
import LoadingSpinner from "../../loading-spinner/LoadingSpinner";
import ConfirmModal from "../../components/modals/ConfirmModal";
import axios from "axios";

function ManageHashtag() {
    const apiUrl = process.env.REACT_APP_API_URL;
    const token = localStorage.getItem("access_token");

    // --- State Dữ liệu ---
    const [hashtags, setHashtags] = useState([]);
    const [loading, setLoading] = useState(false);

    // --- State UI ---
    const [selected, setSelected] = useState("list"); // 'list' hoặc 'form'
    const [showModal, setShowModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    // --- State Form (Dùng chung cho Thêm & Sửa) ---
    const [isEditing, setIsEditing] = useState(false); // True nếu đang sửa
    const [editId, setEditId] = useState(null); // ID đang sửa
    const [name, setName] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [previewImage, setPreviewImage] = useState(null); // Để hiện ảnh cũ hoặc ảnh vừa chọn

    // ================== 1. FETCH DATA ==================
    const fetchHashtags = async () => {
        setLoading(true);
        try {
            // Gọi API lấy danh sách (giả sử đường dẫn này, nếu khác bạn sửa lại nhé)
            const res = await axios.get(`${apiUrl}/hash_tags/get-all-hash-tags`);
            setHashtags(res.data.hash_tags || []);
        } catch (error) {
            console.error("Lỗi lấy danh sách hashtag:", error);
            alert("Không thể tải danh sách hashtag");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHashtags();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ================== 2. HANDLERS UI ==================

    // Chuyển sang chế độ Thêm mới (Reset form)
    const handleSwitchToAdd = () => {
        setSelected("form");
        setIsEditing(false);
        setEditId(null);
        setName("");
        setImageFile(null);
        setPreviewImage(null);
    };

    // Chuyển sang chế độ Sửa (Điền dữ liệu cũ)
    const handleEditClick = (hashtag) => {
        setSelected("form");
        setIsEditing(true);
        setEditId(hashtag.id);
        setName(hashtag.name);

        // Xử lý ảnh hiển thị
        // Nếu ảnh lưu trong server dạng 'static/...', cần thêm apiUrl vào trước
        // Nếu ảnh là link online thì giữ nguyên
        const imgUrl = hashtag.image_url
            ? (hashtag.image_url.startsWith('http') ? hashtag.image_url : `${apiUrl}/${hashtag.image_url}`)
            : null;

        setPreviewImage(imgUrl);
        setImageFile(null); // Reset file upload
    };

    // Xử lý chọn file ảnh từ máy tính
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setPreviewImage(URL.createObjectURL(file)); // Tạo link tạm để preview
        }
    };

    // ================== 3. SUBMIT FORM (ADD / UPDATE) ==================
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name.trim()) {
            alert("Vui lòng nhập tên Hashtag!");
            return;
        }

        const formData = new FormData();
        formData.append("name", name);
        if (imageFile) {
            formData.append("image", imageFile);
        }

        try {
            setLoading(true);
            if (isEditing) {
                // --- API UPDATE ---
                await axios.put(`${apiUrl}/hash_tags/update-hash-tag/${editId}`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                });
                alert("✅ Cập nhật Hashtag thành công!");
            } else {
                // --- API CREATE ---
                await axios.post(`${apiUrl}/hash_tags/create-hash-tag`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                });
                alert("✅ Thêm Hashtag thành công!");
            }

            // Reset và quay về list
            fetchHashtags();
            setSelected("list");
            setName("");
            setImageFile(null);

        } catch (error) {
            console.error("Lỗi submit:", error);
            alert("❌ Có lỗi xảy ra: " + (error.response?.data?.error || error.message));
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
            await axios.delete(`${apiUrl}/hash_tags/delete-hash-tag/${deleteId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert("✅ Đã xóa Hashtag!");
            fetchHashtags();
        } catch (error) {
            console.error("Lỗi xóa:", error);
            alert("❌ Không thể xóa Hashtag này!");
        } finally {
            setShowModal(false);
            setDeleteId(null);
        }
    };

    const handleCancelEdit = () => {
            setIsEditing(false); // Tắt chế độ sửa -> Menu sẽ hiện lại
            setSelected("list"); // Chuyển view về danh sách

            // Reset sạch dữ liệu form
            setEditId(null);
            setName("");
            setImageFile(null);
            setPreviewImage(null);
        };


    // ================== 5. RENDER ==================
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
                                            <td> {/* Giữ nguyên td để nó tự căn giữa và full chiều cao */}
                                                <div className="action-buttons"> {/* Bọc flex box vào trong div */}
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
                                {/* Preview Ảnh */}
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

            {/* Modal Xác nhận xóa */}
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