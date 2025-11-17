import '../../styles/admin/ManageCategory.css';
import {useEffect, useState} from "react";
import LoadingSpinner from "../../LoadingSpinner/LoadingSpinner";
import ConfirmModal from "../../components/modals/ConfirmModal";
import axios from "axios";

function ManageCategory() {
    const apiUrl = process.env.REACT_APP_API_URL;
    const [selected, setSelected] = useState("list");
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [editId, setEditId] = useState(null);
    const [editName, setEditName] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [categoryName, setCategoryName] = useState('');

    const token = localStorage.getItem('access_token');

    const handleEdit = (category) => {
        setEditId(category.id);
        setEditName(category.name);
    };

    const handleCancelEdit = () => {
        setEditId(null);
        setEditName("");
    };

    const handleSaveEdit = async (id) => {
        try {
            await axios.put(`${apiUrl}/categories/update-category/${id}`, {name: editName}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            // cập nhật lại danh sách sau khi sửa
            setCategories((prev) =>
                prev.map((c) => (c.id === id ? {...c, name: editName} : c))
            );
            handleCancelEdit();
        } catch (error) {
            alert("Không thể lưu!");
        }
    };

    const handleAskDelete = (id) => {
        setDeleteId(id);
        setShowModal(true);
    }

    const handleConfirmDelete = async () => {
        setLoading(true);
        try {
            const response = await axios.delete(`${apiUrl}/categories/delete-category/${deleteId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.status === 200) {
                setCategories((prev) => prev.filter((item) => item.id !== deleteId));
            }
        } catch (error) {
            if (error.response?.status === 400) {
                alert("❌ Không thể xóa! Loại sản phẩm có sản phẩm liên quan.");
            } else {
                alert("⚠️ Lỗi: " + (error.response?.data?.message || error.message));
            }

        } finally {
            setLoading(false)
            setShowModal(false);
            setDeleteId(null);
        }
    }

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();
        try {
            const response = await axios.post(`${apiUrl}/categories/create-category`, {name: categoryName}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.status === 201) {
                alert('Thêm loại sản phẩm thành công!');
                setCategoryName('');
                fetchCategories();
            } else {
                alert('❌ Lỗi khi thêm loại sản phẩm');
            }
        } catch (error) {
            if (error.response?.status === 400) {
                alert('Vui lòng nhập đầy đủ thông tin!');
            }
            else {
                alert('Lỗi: ' + (error.response?.data?.message || error.message));
            }
        } finally {
            setLoading(false);
        }
    }

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${apiUrl}/categories/get-all-categories`);
            setCategories(res.data.categories);
        } catch (error) {
            alert("Lỗi khi tải danh loại sản phẩm:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [apiUrl]);

    return (
        <div className="manage-category-page">
            <h1 className="title-page">Quản lý loại sản phẩm</h1>
            <hr/>

            {/* Radio chọn giữa Danh sách & Thêm loại */}
            <div className="radio-input">
                <label>
                    <input
                        type="radio"
                        name="category-option"
                        value="list"
                        checked={selected === "list"}
                        onChange={() => setSelected("list")}
                    />
                    <span>Danh sách loại</span>
                </label>

                <label>
                    <input
                        type="radio"
                        name="category-option"
                        value="add"
                        checked={selected === "add"}
                        onChange={() => setSelected("add")}
                    />
                    <span>Thêm loại sản phẩm</span>
                </label>

                <span className="selection"></span>
            </div>

            {/* Hiển thị nội dung tùy theo lựa chọn */}
            <div className="content-area">
                {selected === "list" ? (
                    <table className="category-table">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Tên loại sản phẩm</th>
                            <th>Tùy chỉnh</th>
                        </tr>
                        </thead>
                        <tbody>
                        {Array.isArray(categories) && categories.length > 0 ? (
                            categories.map((category) => (
                                <tr key={category.id}>
                                    <td>{category.id}</td>

                                    <td>
                                        {editId === category.id ? (
                                            <input
                                                type="text"
                                                className="edit-input"
                                                value={editName}
                                                onChange={(e) => setEditName(e.target.value)}
                                            />
                                        ) : (
                                            category.name
                                        )}
                                    </td>

                                    <td className="action-buttons">
                                        {editId === category.id ? (
                                            <>
                                                <button className="save-btn"
                                                        onClick={() => handleSaveEdit(category.id)}>
                                                    Lưu
                                                </button>
                                                <button className="cancel-btn" onClick={handleCancelEdit}>
                                                    Hủy
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button className="edit-btn" onClick={() => handleEdit(category)}>
                                                    Sửa
                                                </button>
                                                <button className="delete-btn"
                                                        onClick={() => handleAskDelete(category.id)}>
                                                    Xóa
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3">Không có loại sản phẩm nào.</td>
                            </tr>
                        )}
                        </tbody>


                    </table>

                ) : (
                    <form>
                        <div className="add-category">
                            <label htmlFor="categoryName"><h2>Tên loại sản phẩm</h2></label>
                            <input
                                type="text"
                                className="form-control"
                                id="categoryName"
                                placeholder="Nhập tên loại sản phẩm"
                                value={categoryName}
                                onChange={(e) => setCategoryName(e.target.value)}
                            />
                        </div>
                        <button type="submit" className={"button"} onClick={handleSubmit}>
                            Thêm loại sản phẩm
                        </button>
                    </form>
                )}

                {showModal && (
                    <ConfirmModal
                        title="Xác nhận xóa"
                        message="Bạn có chắc chắn muốn xóa loại sản phẩm này?"
                        onConfirm={handleConfirmDelete}
                        onCancel={() => setShowModal(false)}
                    />
                )}

            </div>
            {loading && <LoadingSpinner/>}
        </div>

    );
}

export default ManageCategory;
