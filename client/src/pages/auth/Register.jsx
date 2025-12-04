import {useState} from "react";
import "../../styles/account/Register.css"
import Header from "../../components/header/Header";
import LoadingSpinner from "../../loading-spinner/LoadingSpinner";
import SuccessModal from "../../components/modals/SuccessModal";
import {useNavigate} from "react-router-dom";
import userApi from "../../api/userApi";


function Register() {
    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");

        if (username.length < 5) {
            setError("Tên đăng nhập phải có ít nhất 5 ký tự.");
            return;
        }

        if (password.length < 8) {
            setError("Mật khẩu phải có ít nhất 8 ký tự.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Mật khẩu và xác nhận mật khẩu không khớp.");
            return;
        }

        setLoading(true);
        try {
            await userApi.register({username, email, password});
            setShowModal(true);
        } catch (err) {
            setError(err.response?.data?.message || "Đăng ký thất bại.");
        } finally {
            setLoading(false);
        }
    }

    const handleCloseModal = () => {
            setShowModal(false);
            navigate("/auth/login");
    };

    return (
        <>
            <Header/>
            <div className="form-container">

                {showModal && (
                    <SuccessModal
                        message="Bạn đã đăng ký tài khoản thành công!"
                        onClose={handleCloseModal}
                    />
                )}

                <p className="title">Đăng ký tài khoản</p>
                <form className="form" onSubmit={handleRegister}>
                    <input
                        type="text"
                        className="input"
                        placeholder="Tên đăng nhập"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <input
                        type="email"
                        className="input"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        className="input"
                        placeholder="Mật khẩu"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        className="input"
                        placeholder="Xác nhận mật khẩu"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />

                    {error && <p style={{color: "red", fontSize: "12px", textAlign: "center"}}>{error}</p>}

                    <button className="form-btn" type="submit" disabled={loading}>
                        {loading ? <LoadingSpinner/> : "Đăng ký"}
                    </button>

                    <div className="buttons-container">
                        <div className="apple-login-button">
                            <svg
                                stroke="currentColor"
                                fill="currentColor"
                                strokeWidth="0"
                                className="apple-icon"
                                viewBox="0 0 1024 1024"
                                height="1em"
                                width="1em"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d=""></path>
                            </svg>
                            <span>Log in with Apple</span>
                        </div>

                        <div className="google-login-button">
                            <svg
                                stroke="currentColor"
                                fill="currentColor"
                                strokeWidth="0"
                                version="1.1"
                                x="0px"
                                y="0px"
                                className="google-icon"
                                viewBox="0 0 48 48"
                                height="1em"
                                width="1em"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fill="#FFC107"
                                    d=""
                                ></path>
                                <path
                                    fill="#FF3D00"
                                    d=""
                                ></path>
                                <path
                                    fill="#4CAF50"
                                    d=""
                                ></path>
                                <path
                                    fill=""
                                ></path>
                            </svg>
                            <span>Log in with Google</span>
                        </div>
                    </div>

                </form>

                {loading && (<LoadingSpinner/>)}
            </div>
        </>
    )
}

export default Register;