import {useState} from "react";
import "../../styles/account/Login.css";
import LoadingSpinner from "../../loading-spinner/LoadingSpinner";
import Header from "../../components/header/Header";
import {useNavigate} from "react-router-dom";
import userApi from "../../api/userApi";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
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

        setLoading(true);
        try {
            const loginRes = await userApi.login({username, password});
            const token = loginRes.access_token;
            localStorage.setItem("access_token", token);

            const dashboardRes = await userApi.getProfile();
            const currentUser = dashboardRes.user;

            if (currentUser.role === 1) {
                navigate("/admin/dashboard");
            } else {
                navigate("/");
            }

        } catch (err) {
            console.error(err)
            setError("Đăng nhập thất bại! Sai tài khoản hoặc mật khẩu hoặc token không hợp lệ.");
            localStorage.removeItem("access_token");
        } finally {
            setLoading(false);
        }
    };



    return (
        <>
            <Header/>
            <div className="form-container">
                <p className="title">Welcome back</p>
                <form className="form" onSubmit={handleLogin}>
                    <input
                        type="text"
                        className="input"
                        placeholder="Tên đăng nhập"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
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

                    <p className="page-link">
                        <span className="page-link-label"
                                onClick={() => navigate('/auth/forgot-password')}
                        >Forgot Password?</span>
                    </p>

                    {error && <p style={{color: "red", fontSize: "12px", textAlign: "center"}}>{error}</p>}

                    <button className="form-btn" type="submit" disabled={loading}>
                        {loading ? <LoadingSpinner/> : "Log in"}
                    </button>

                    <p className="sign-up-label">
                        Don't have an account?
                        <span
                            className="sign-up-link"
                            onClick={() => navigate('/auth/register')}
                        >
                        Sign up
                    </span>
                    </p>

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
    );
}

