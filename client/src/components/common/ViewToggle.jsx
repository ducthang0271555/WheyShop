import React from 'react';
import "../../styles/components/common/ViewToggle.css"

const ViewToggle = ({ resourceName, viewMode, onSwitchToList, onSwitchToAdd }) => {
    return (
        <div className="radio-input">
            <label>
                <input
                    type="radio"
                    name={`view-mode-${resourceName}`}
                    value="list"
                    checked={viewMode === "list"}
                    onChange={onSwitchToList}
                />
                <span>Danh sách {resourceName}</span>
            </label>

            <label>
                <input
                    type="radio"
                    name={`view-mode-${resourceName}`}
                    value="form"
                    checked={viewMode === "form"}
                    onChange={onSwitchToAdd}
                />
                <span>Thêm {resourceName}</span>
            </label>
            <span className="selection"></span>
        </div>
    );
};

export default ViewToggle;