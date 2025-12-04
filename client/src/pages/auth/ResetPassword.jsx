import "../../styles/account/Register.css"
import SuccessModal from "../../components/modals/SuccessModal";
import LoadingSpinner from "../../loading-spinner/LoadingSpinner";
import {useContext, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {OtpContext} from "../../contexts/OtpContext";
import userApi from "../../api/userApi";


function ResetPassword() {
    const { otpRequested } = useContext(OtpContext);
    const [loading, setLoading] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!otpRequested?.resetToken) {
            navigate("/auth/forgot-password");
        }
    }, [otpRequested, navigate]);

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError("");

        if (newPassword.length < 8) {
            setError("Mật khẩu mới phải có ít nhất 8 ký tự.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Mật khẩu mới và xác nhận mật khẩu không khớp.");
            return;
        }

        if (!otpRequested?.resetToken) {
            setError("Token đặt lại mật khẩu không hợp lệ. Vui lòng thử lại.");
            return;
        }

        setLoading(true);
        try {
            const dataResetPass = {new_password: newPassword, confirm_password: confirmPassword};
            await userApi.resetPassword(dataResetPass,otpRequested.resetToken);
            setShowModal(true);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || "Đã xảy ra lỗi khi đặt lại mật khẩu.");
        } finally {
            otpRequested.resetToken = null
            setLoading(false);
        }
    }

    const handleCloseModal = () => {
        setShowModal(false);
        navigate("/auth/login");
    }


    return (
        <div className="form-container">

            {showModal && (
                <SuccessModal
                    message="Chúc mừng! Mật khẩu của bạn đã được đặt lại thành công."
                    onClose={handleCloseModal}
                />
            )}


            <p className="title">Đặt lại mật khẩu</p>
            <form className="form" onSubmit={handleResetPassword}>
                <input
                    type="password"
                    className="input"
                    placeholder="Nhập mật khẩu mới"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                />

                <input
                    type="password"
                    className="input"
                    placeholder="Xác nhận mật khẩu mới"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />

                {error && <p style={{color: "red", fontSize: "12px", textAlign: "center"}}>{error}</p>}

                <button className="form-btn" type="submit" disabled={loading}>
                    {loading ? <LoadingSpinner/> : "Đặt lại mật khẩu"}
                </button>

            </form>

            {loading && (<LoadingSpinner/>)}
        </div>
    );
}

export default ResetPassword;