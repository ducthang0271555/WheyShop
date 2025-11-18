import React, { createContext, useState, useContext } from "react";

export const OtpContext = createContext();

export function OtpProvider({ children }) {
    const [otpRequested, setOtpRequested] = useState({
        username: null,
        resetToken: null
    });

    return (
        <OtpContext.Provider value={{ otpRequested, setOtpRequested }}>
            {children}
        </OtpContext.Provider>
    );
}

export function useOtp() {
    return useContext(OtpContext);
}
