import React, { useRef, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { OtpContext } from "../../contexts/OtpContext";
import LoadingSpinner from "../../loading-spinner/LoadingSpinner";
import SuccessModal from "../../components/modals/SuccessModal";
import userApi from "../../api/userApi";
import styled from "styled-components";

const StyledWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.05);

    .otp-Form {
        width: 300px;
        padding: 30px 20px;
        background-color: #fff;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
        position: relative;
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
        border-radius: 15px;
    }

    .mainHeading { font-size: 1.2em; font-weight: 700; color: #0f0f0f; }
    .otpSubheading { font-size: 0.8em; text-align: center; color: #333; }
    .inputContainer { display: flex; justify-content: space-between; width: 100%; }
    .otp-input {
        width: 40px; height: 40px; text-align: center;
        border: none; border-radius: 7px; background-color: #e4e4e4;
        font-weight: 600; font-size: 1.1em; outline: none; caret-color: #7f81ff; color: #2c2c2c;
    }
    .otp-input:focus { background-color: rgba(127,129,255,0.2); transition:0.3s; }
    .verifyButton { width:100%; padding:8px 0; border:none; background-color:#7f81ff; color:white; font-weight:600; border-radius:10px; cursor:pointer; transition:0.2s; }
    .verifyButton:hover { background-color:#9091ff; }
    .resendNote { font-size:0.75em; text-align:center; }
    .resendBtn { border:none; background:none; color:#7f81ff; cursor:pointer; font-weight:700; font-size:1em; }
    .error { color:red; font-size:0.85em; text-align:center; }
`;

function VerifyOTP() {
    const [otp, setOtp] = useState(new Array(6).fill(""));
    const inputRefs = useRef([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [countdown, setCountdown] = useState(60); // 60s countdown
    const { otpRequested, setOtpRequested } = useContext(OtpContext);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!otpRequested?.username) {
            navigate("/auth/forgot-password");
        }
    }, [otpRequested, navigate]);

    // Countdown timer
    useEffect(() => {
        if (countdown <= 0) return;
        const timer = setInterval(() => {
            setCountdown((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [countdown]);

    const handleChange = (e, index) => {
        const value = e.target.value.replace(/\D/, "");
        if (!value) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (index < inputRefs.current.length - 1) {
            inputRefs.current[index + 1].focus();
            inputRefs.current[index + 1].select();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace") {
            e.preventDefault();

            const newOtp = [...otp];
            if (newOtp[index] !== "") {
                newOtp[index] = "";
                setOtp(newOtp);
            } else if (index > 0) {
                inputRefs.current[index - 1].focus();
                const prevOtp = [...otp];
                prevOtp[index - 1] = "";
                setOtp(prevOtp);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const otpCode = otp.join("");
        setLoading(true);
        setError("");

        try {
            const dataVerify = {username: otpRequested.username, otp: otpCode}
            const response = await userApi.verifyOtp(dataVerify);

            const { reset_token } = response;

            setOtpRequested({ ...otpRequested, resetToken: reset_token });

            navigate("/auth/reset-password");
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || "Đã xảy ra lỗi khi xác thực OTP");
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (countdown > 0) return;

        setLoading(true);
        try {
            await userApi.resendOtp(otpRequested.username);
            setCountdown(60); // reset countdown
            setShowModal(true);
        } catch (err) {
            alert(err.response?.data?.error || "Có lỗi xảy ra");
        } finally {
            setLoading(false);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
    }

    return (
        <StyledWrapper>
            <form className="otp-Form" onSubmit={handleSubmit}>

                {showModal && (
                    <SuccessModal
                        message="Đã gửi lại mã OTP. Vui lòng kiểm tra email của bạn!"
                        onClose={handleCloseModal}
                    />
                )}

                <span className="mainHeading">Enter OTP</span>
                <p className="otpSubheading">We have sent a verification code to your Email</p>

                <div className="inputContainer">
                    {otp.map((value, index) => (
                        <input
                            key={index}
                            type="text"
                            className="otp-input"
                            maxLength={1}
                            value={value}
                            onChange={(e) => handleChange(e, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            ref={(el) => (inputRefs.current[index] = el)}
                            required
                        />
                    ))}
                </div>

                {error && <div className="error">{error}</div>}

                <button className="verifyButton" type="submit">
                    {loading ? <LoadingSpinner /> : "Verify"}
                </button>

                <p className="resendNote">
                    Didn't receive the code?{" "}
                    <button
                        type="button"
                        className="resendBtn"
                        onClick={handleResend}
                        disabled={countdown > 0}
                    >
                        Resend Code {countdown > 0 ? `(${countdown}s)` : ""}
                    </button>
                </p>
            </form>
        </StyledWrapper>
    );
}

export default VerifyOTP;
