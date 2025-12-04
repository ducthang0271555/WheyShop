import '../../styles/admin/ManageCategory.css';
import {useEffect, useState} from "react";
import LoadingSpinner from "../../loading-spinner/LoadingSpinner";
import ConfirmModal from "../../components/modals/ConfirmModal";
import categoryApi from "../../api/categoryApi";

function ManageCategory() {
    const [selected, setSelected] = useState("list");
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [editId, setEditId] = useState(null);
    const [editName, setEditName] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [categoryName, setCategoryName] = useState('');

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
            await categoryApi.update(id, editName);

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
            await categoryApi.delete(deleteId);
            setCategories((prev) => prev.filter((item) => item.id !== deleteId));
        } catch (error) {
            console.log(error);
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
            await categoryApi.create(categoryName);
            alert('Thêm loại sản phẩm thành công!');
            setCategoryName('');
            fetchCategories();

        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const res = await categoryApi.getAll();
            setCategories(res.categories);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    });

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
