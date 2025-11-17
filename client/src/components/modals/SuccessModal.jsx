import React from "react";
import "../../styles/components/modals/SuccessModal.css";

export default function SuccessModal({ message, onClose }) {
    return (
        <div className="modal-overlay">
            <div className="modal-box">
                <h2>🎉 Thành công!</h2>
                <p>{message}</p>
                <button className="modal-btn" onClick={onClose}>OK</button>
            </div>
        </div>
    );
}
