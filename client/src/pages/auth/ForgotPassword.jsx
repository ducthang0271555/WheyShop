import "../../styles/account/Register.css"
import {useContext} from "react";
import {OtpContext} from "../../contexts/OtpContext";
import Header from "../../components/header/Header";
import LoadingSpinner from "../../loading-spinner/LoadingSpinner";
import SuccessModal from "../../components/modals/SuccessModal";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import userApi from "../../api/userApi";

const USERNAME_REGEX = /^[a-zA-Z0-9_.-]{3,30}$/;


function ForgotPassword() {
    const { setOtpRequested } = useContext(OtpContext);
    const [username, setUsername] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    const validateUsername = (value) => {
        if (!value.trim()) return "Vui lòng nhập tên tài khoản";
        if (value.length < 3 || value.length > 30)
          return "Tên tài khoản phải từ 3–30 ký tự";
        if (!USERNAME_REGEX.test(value))
          return "Tên tài khoản chỉ chứa chữ, số, ., -, _";
        return null;
      };

    function extractErrorMessage(data) {
        if (!data) return "Đã xảy ra lỗi.";

        if (typeof data === "string") return data;

        if (typeof data === "object") {
            // flatten object recursively
            const messages = [];

            function recurse(obj) {
                if (typeof obj === "string") {
                    messages.push(obj);
                } else if (Array.isArray(obj)) {
                    obj.forEach(recurse);
                } else if (typeof obj === "object") {
                    Object.values(obj).forEach(recurse);
                }
            }

            recurse(data);
            return messages.join(" ");
        }

        return "Đã xảy ra lỗi.";
    }

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setError("");

        const validationError = validateUsername(username);
            if (validationError) {
              setError(validationError);
              return;
            }

        setLoading(true);
        try {
            await userApi.forgotPassword(username);

            setOtpRequested({
                username: username,
                resetToken: null
            });
            setShowModal(true);
        } catch (err) {
            const message = extractErrorMessage(err.response?.data);
            setError(message);
        }
         finally {
            setLoading(false);
        }
    }

    const handleCloseModal = () => {
        setShowModal(false);
        navigate("/auth/forgot-password/verify-otp");
    }

    return (
        <>
            <Header/>
            <div className="form-container">

                {showModal && (
                    <SuccessModal
                        message="Hãy kiểm tra email của bạn để lấy mã OTP đặt lại mật khẩu!"
                        onClose={handleCloseModal}
                    />
                )}


                <p className="title">Quên mật khẩu</p>
                <form className="form" onSubmit={handleForgotPassword}>
                    <input
                        type="text"
                        className="input"
                        placeholder="Nhập tên tài khoản"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />

                    {error && <p style={{color: "red", fontSize: "12px", textAlign: "center"}}>{error}</p>}

                    <button className="form-btn" type="submit" disabled={loading}>
                        {loading ? <LoadingSpinner/> : "Lấy lại mật khẩu"}
                    </button>

                </form>

                {loading && (<LoadingSpinner/>)}
            </div>
        </>
    )
}

export default ForgotPassword;