import '../../styles/admin/ManageUser.css';
import {useEffect, useState} from 'react';
import LoadingSpinner from "../../LoadingSpinner/LoadingSpinner";
import axios from 'axios';

const ManageUser = () => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('access_token');
                const res = await axios.get(`${apiUrl}/users/get-all-users`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setUsers(res.data);
            } catch (error) {
                console.error("Lỗi khi tải danh sách người dùng:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="manage-user-page">
            <h1 className="title-page">Quản lý người dùng</h1>
            <hr/>

            {loading ? (
                <LoadingSpinner />
            ) : (
                <table className="user-table">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Tên đăng nhập</th>
                        <th>Email</th>
                        <th>Vai trò</th>
                        <th>Tổng chi tiêu (VNĐ)</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>{user.role === 1 ? "Admin" : "Khách hàng"}</td>
                            <td>{user["total spent"]}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ManageUser;
