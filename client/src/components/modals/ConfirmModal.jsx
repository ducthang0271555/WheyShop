import '../../styles/components/modals/ConfirmModal.css';
import React from 'react';

const ConfirmModal = ({title, message, onConfirm, onCancel}) => {
    return (
        <div className="modal-overlay">
            <div className="modal-box">
                <h3>{title}</h3>
                <p>{message}</p>
                <div className="modal-actions">
                    <button className="confirm-btn" onClick={onConfirm}>Xác nhận</button>
                    <button className="cancel-btn" onClick={onCancel}>Hủy</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
