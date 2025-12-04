import "../../styles/account/Register.css"
import Header from "../../components/header/Header";
import SuccessModal from "../../components/modals/SuccessModal";
import LoadingSpinner from "../../loading-spinner/LoadingSpinner";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import userApi from "../../api/userApi";

function ChangePassword() {
    const [loading, setLoading] = useState(false);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setError("");

        if (oldPassword.length < 8) {
            setError("Mật khẩu hiện tại phải có ít nhất 8 ký tự.");
            return;
        }

        if (newPassword.length < 8) {
            setError("Mật khẩu mới phải có ít nhất 8 ký tự.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Mật khẩu mới và xác nhận mật khẩu không khớp.");
            return;
        }

        setLoading(true);
        try {
            const dataPassword = {old_password: oldPassword, new_password: newPassword, confirm_password: confirmPassword}
            await userApi.changePassword(dataPassword);
            setShowModal(true);
        } catch (err) {
            setError(err.response?.data?.error || "Đổi mật khẩu thất bại.");
        } finally {
            setLoading(false);
        }
    }

    const handleCloseModal = () => {
                setShowModal(false);
                navigate("/");
        };


    return (
        <>
            <Header/>
            <div className="form-container">

                {showModal && (
                    <SuccessModal
                        message="Bạn đã đổi mật khẩu thành công!"
                        onClose={handleCloseModal}
                    />
                )}

                <p className="title">Đổi mật khẩu</p>
                <form className="form" onSubmit={handleChangePassword}>
                    <input
                        type="password"
                        className="input"
                        placeholder="Mật khẩu hiện tại"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        className="input"
                        placeholder="Mật khẩu mới"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        className="input"
                        placeholder="Nhập lại mật khẩu mới"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />

                    {error && <p style={{color: "red", fontSize: "12px", textAlign: "center"}}>{error}</p>}

                    <button className="form-btn" type="submit" disabled={loading}>
                        {loading ? <LoadingSpinner/> : "Đổi mật khẩu"}
                    </button>

                </form>

                {loading && (<LoadingSpinner/>)}
            </div>
        </>
    );
}

export default ChangePassword;