import React from "react";
export default function SelectionSection({
    label,
    items,
    selectedIds,
    onToggle,
    editMode,
    placeholder = "Chưa có dữ liệu."
}) {
    return (
        <div className="form-group full-width">
            <label>{label}</label>
            <div className="hashtag-selection-container" style={{ opacity: editMode ? 1 : 0.7 }}>
                {items && items.length > 0 ? (
                    items.map((item) => {
                        const isSelected = selectedIds.includes(Number(item.id));
                        return (
                            <div
                                key={item.id}
                                className={`hashtag-badge ${isSelected ? 'active' : ''}`}
                                onClick={() => onToggle(item.id)}
                                style={{
                                    cursor: editMode ? 'pointer' : 'default',
                                }}
                            >
                                {item.name}
                            </div>
                        );
                    })
                ) : (
                    <p style={{ fontSize: "13px", color: "#888" }}>{placeholder}</p>
                )}
            </div>
        </div>
    );
}