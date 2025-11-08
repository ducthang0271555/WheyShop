import '../../styles/admin/ManageBrand.css';
import {useEffect, useState} from "react";
import LoadingSpinner from "../../LoadingSpinner/LoadingSpinner";
import ConfirmModal from "../../components/modals/ConfirmModal";
import axios from "axios";

function ManageBrand() {
    const apiUrl = process.env.REACT_APP_API_URL;
    const [selected, setSelected] = useState("list");
    const [loading, setLoading] = useState(true);
    const [brands, setBrands] = useState([]);
    const [editId, setEditId] = useState(null);
    const [editName, setEditName] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [brandName, setBrandName] = useState('');

    const handleEdit = (brand) => {
        setEditId(brand.id);
        setEditName(brand.name);
    };

    const handleCancelEdit = () => {
        setEditId(null);
        setEditName("");
    };

    const handleSaveEdit = async (id) => {
        try {
            await axios.put(`${apiUrl}/brands/update-brand/${id}`, {
                name: editName
            });

            // cập nhật lại danh sách sau khi sửa
            setBrands((prev) =>
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
            const response = await axios.delete(`${apiUrl}/brands/delete-brand/${deleteId}`);
            if (response.status === 200) {
                setBrands((prev) => prev.filter((item) => item.id !== deleteId));
            }
        } catch (error) {
            if (error.response?.status === 400) {
                alert("❌ Không thể xóa! Loại thương hiệu có sản phẩm liên quan.");
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
            const response = await axios.post(`${apiUrl}/brands/create-brand`, {
                name: brandName
            });
            if (response.status === 201) {
                alert('Thêm thương hiệu mới thành công!');
                setBrandName('');
                fetchBrands();
            } else {
                alert('❌ Lỗi khi thêm thương hiệu mới!');
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

    const fetchBrands = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${apiUrl}/brands/get-all-brands`);
            setBrands(res.data.brands);
        } catch (error) {
            alert("Lỗi khi tải danh sách thương hiệu:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBrands();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [apiUrl]);

    return (
        <div className="manage-brand-page">
            <h1 className="title-page">Quản lý thương hiệu</h1>
            <hr/>

            {/* Radio chọn giữa Danh sách & Thêm loại */}
            <div className="radio-input">
                <label>
                    <input
                        type="radio"
                        name="brand-option"
                        value="list"
                        checked={selected === "list"}
                        onChange={() => setSelected("list")}
                    />
                    <span>List thương hiệu</span>
                </label>

                <label>
                    <input
                        type="radio"
                        name="brand-option"
                        value="add"
                        checked={selected === "add"}
                        onChange={() => setSelected("add")}
                    />
                    <span>Thêm thương hiệu</span>
                </label>

                <span className="selection"></span>
            </div>

            {/* Hiển thị nội dung tùy theo lựa chọn */}
            <div className="content-area">
                {selected === "list" ? (
                    <table className="brand-table">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Tên thương hiệu</th>
                            <th>Tùy chỉnh</th>
                        </tr>
                        </thead>
                        <tbody>
                        {Array.isArray(brands) && brands.length > 0 ? (
                            brands.map((brand) => (
                                <tr key={brand.id}>
                                    <td>{brand.id}</td>

                                    <td>
                                        {editId === brand.id ? (
                                            <input
                                                type="text"
                                                className="edit-input"
                                                value={editName}
                                                onChange={(e) => setEditName(e.target.value)}
                                            />
                                        ) : (
                                            brand.name
                                        )}
                                    </td>

                                    <td className="action-buttons">
                                        {editId === brand.id ? (
                                            <>
                                                <button className="save-btn"
                                                        onClick={() => handleSaveEdit(brand.id)}>
                                                    Lưu
                                                </button>
                                                <button className="cancel-btn" onClick={handleCancelEdit}>
                                                    Hủy
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button className="edit-btn" onClick={() => handleEdit(brand)}>
                                                    Sửa
                                                </button>
                                                <button className="delete-btn"
                                                        onClick={() => handleAskDelete(brand.id)}>
                                                    Xóa
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3">Không có thương hiệu nào.</td>
                            </tr>
                        )}
                        </tbody>


                    </table>

                ) : (
                    <form>
                        <div className="add-brand">
                            <label htmlFor="brandName"><h2>Tên thương hiệu</h2></label>
                            <input
                                type="text"
                                className="form-control"
                                id="brandName"
                                placeholder="Nhập tên thương hiệu"
                                value={brandName}
                                onChange={(e) => setBrandName(e.target.value)}
                            />
                        </div>
                        <button type="submit" className={"button"} onClick={handleSubmit}>
                            Thêm thương hiệu
                        </button>
                    </form>
                )}

                {showModal && (
                    <ConfirmModal
                        title="Xác nhận xóa"
                        message="Bạn có chắc chắn muốn xóa thương hiệu này?"
                        onConfirm={handleConfirmDelete}
                        onCancel={() => setShowModal(false)}
                    />
                )}

            </div>
            {loading && <LoadingSpinner/>}
        </div>

    );
}

export default ManageBrand;
