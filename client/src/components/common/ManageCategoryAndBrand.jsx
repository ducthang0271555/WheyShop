import { useEffect, useState } from "react";
import LoadingSpinner from "../../loading-spinner/LoadingSpinner";
import ConfirmModal from "../../components/modals/ConfirmModal";
import ViewToggle from "../../components/common/ViewToggle";
import "../../styles/admin/ManageCategory.css";

function ManageSimpleResource({ title, resourceName, api, responseKey }) {
    const [selected, setSelected] = useState("list");
    const [loading, setLoading] = useState(true);
    const [items, setItems] = useState([]);
    const [editId, setEditId] = useState(null);
    const [editName, setEditName] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [newItemName, setNewItemName] = useState('');

    const fetchItems = async () => {
        setLoading(true);
        try {
            const res = await api.getAll();
            setItems(res[responseKey]);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleEdit = (item) => {
        setEditId(item.id);
        setEditName(item.name);
    };

    const handleCancelEdit = () => {
        setEditId(null);
        setEditName("");
    };

    const handleSaveEdit = async (id) => {
        try {
            await api.update(id, editName);
            setItems((prev) => prev.map((c) => (c.id === id ? { ...c, name: editName } : c)));
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
            await api.delete(deleteId);
            setItems((prev) => prev.filter((item) => item.id !== deleteId));
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
            await api.create(newItemName);
            alert(`Thêm ${resourceName} thành công!`);
            setNewItemName('');
            fetchItems();
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="manage-category-page">
            <h1 className="title-page">{title}</h1>
            <hr />

            <ViewToggle
                resourceName={resourceName}
                viewMode={selected === "add" ? "form" : "list"}
                onSwitchToList={() => setSelected("list")}
                onSwitchToAdd={() => setSelected("add")}
            />

            <div className="content-area">
                {selected === "list" ? (
                    <table className="category-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Tên {resourceName}</th>
                                <th>Tùy chỉnh</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(items) && items.length > 0 ? (
                                items.map((item) => (
                                    <tr key={item.id}>
                                        <td>{item.id}</td>
                                        <td>
                                            {editId === item.id ? (
                                                <input
                                                    type="text"
                                                    className="edit-input"
                                                    value={editName}
                                                    onChange={(e) => setEditName(e.target.value)}
                                                />
                                            ) : (
                                                item.name
                                            )}
                                        </td>
                                        <td className="action-buttons">
                                            {editId === item.id ? (
                                                <>
                                                    <button className="save-btn" onClick={() => handleSaveEdit(item.id)}>Lưu</button>
                                                    <button className="cancel-btn" onClick={handleCancelEdit}>Hủy</button>
                                                </>
                                            ) : (
                                                <>
                                                    <button className="edit-btn" onClick={() => handleEdit(item)}>Sửa</button>
                                                    <button className="delete-btn" onClick={() => handleAskDelete(item.id)}>Xóa</button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="3">Không có dữ liệu.</td></tr>
                            )}
                        </tbody>
                    </table>
                ) : (
                    <form>
                        <div className="add-category">
                            <label htmlFor="itemName"><h2>Tên {resourceName}</h2></label>
                            <input
                                type="text"
                                className="form-control"
                                id="itemName"
                                placeholder={`Nhập tên ${resourceName}`}
                                value={newItemName}
                                onChange={(e) => setNewItemName(e.target.value)}
                            />
                        </div>
                        <button type="submit" className={"button"} onClick={handleSubmit}>
                            Thêm {resourceName}
                        </button>
                    </form>
                )}

                {showModal && (
                    <ConfirmModal
                        title="Xác nhận xóa"
                        message={`Bạn có chắc chắn muốn xóa ${resourceName} này?`}
                        onConfirm={handleConfirmDelete}
                        onCancel={() => setShowModal(false)}
                    />
                )}
            </div>
            {loading && <LoadingSpinner />}
        </div>
    );
}

export default ManageSimpleResource;