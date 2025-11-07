import {useState} from "react";
import "../../styles/account/Login.css";
import LoadingSpinner from "../../LoadingSpinner/LoadingSpinner";
import Header from "../../components/Header";
import axios from 'axios';
import {useNavigate} from "react-router-dom";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const apiUrl = process.env.REACT_APP_API_URL;

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const { data } = await axios.post(`${apiUrl}/users/login`, {
                username,
                password
            });

            localStorage.setItem("access_token", data.access_token);
            if (data.role === 1) {
                navigate("/admin/dashboard");
            } else {
                navigate("/");
            }


        } catch (err) {
            setError("Đăng nhập thất bại! Sai tài khoản hoặc mật khẩu.");
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
                        <span className="page-link-label">Forgot Password?</span>
                    </p>

                    {error && <p style={{color: "red", fontSize: "12px", textAlign: "center"}}>{error}</p>}

                    <button className="form-btn" type="submit" disabled={loading}>
                        {loading ? <LoadingSpinner/> : "Log in"}
                    </button>

                    <p className="sign-up-label">
                        Don't have an account?
                        <span
                            className="sign-up-link"
                            onClick={() => (window.location.href = "/register")}
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

