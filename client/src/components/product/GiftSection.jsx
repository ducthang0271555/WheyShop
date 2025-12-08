import React from "react";

export default function GiftSection({ giftsList, selectedGifts, toggleGift, editMode }) {
    return (
        <div className="form-group full-width">
            <label>Quà tặng kèm</label>
            <div className="hashtag-selection-container" style={{ opacity: editMode ? 1 : 0.7 }}>
                {giftsList && giftsList.length > 0 ? (
                    giftsList.map((gift) => {
                        const isSelected = selectedGifts.includes(Number(gift.id));
                        return (
                            <div
                                key={gift.id}
                                className={`hashtag-badge ${isSelected ? 'active' : ''}`}
                                onClick={() => toggleGift(gift.id)}
                                style={{
                                    cursor: editMode ? 'pointer' : 'default',
                                    backgroundColor: isSelected ? '#ff9800' : '#f0f0f0',
                                    color: isSelected ? 'white' : '#333'
                                }}
                            >
                                {gift.name}
                            </div>
                        );
                    })
                ) : (
                    <p style={{ fontSize: "13px", color: "#888" }}>Chưa có quà tặng nào.</p>
                )}
            </div>
        </div>
    );
}