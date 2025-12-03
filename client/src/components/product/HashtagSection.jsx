import React from "react";

export default function HashtagSection({ hashtagsList, selectedHashtags, toggleHashtag, editMode }) {
    return (
        <div className="form-group full-width">
            <label>Hashtags</label>
            <div className="hashtag-selection-container" style={{ opacity: editMode ? 1 : 0.7 }}>
                {hashtagsList.length > 0 ? (
                    hashtagsList.map((tag) => {
                        const isSelected = selectedHashtags.includes(Number(tag.id));
                        return (
                            <div
                                key={tag.id}
                                className={`hashtag-badge ${isSelected ? 'active' : ''}`}
                                onClick={() => toggleHashtag(tag.id)}
                                style={{ cursor: editMode ? 'pointer' : 'default' }}
                            >
                                {tag.name}
                            </div>
                        );
                    })
                ) : (
                    <p style={{ fontSize: "13px", color: "#888" }}>Chưa có hashtag nào.</p>
                )}
            </div>
        </div>
    );
}