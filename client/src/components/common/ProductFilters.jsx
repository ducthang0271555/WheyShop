import React from 'react';

const ProductFilters = ({
    showCategoryFilter,
    categories,
    selectedCategories,
    onCategoryToggle,
    sortOption,
    onSortChange
}) => {
    return (
        <div className="filter-bar">
            {showCategoryFilter && (
                <div className="filter-group category-filter">
                    <span className="filter-label">Lọc theo loại:</span>
                    <div className="category-chips">
                        {categories.map(cat => (
                            <label
                                key={cat.id}
                                className={`chip ${selectedCategories.includes(cat.id) ? 'active' : ''}`}
                            >
                                <input
                                    type="checkbox"
                                    value={cat.id}
                                    checked={selectedCategories.includes(cat.id)}
                                    onChange={() => onCategoryToggle(cat.id)}
                                />
                                {cat.name}
                            </label>
                        ))}
                    </div>
                </div>
            )}

            <div className="filter-group sort-filter">
                <span className="filter-label">Sắp xếp:</span>
                <select
                    value={sortOption}
                    onChange={onSortChange}
                    className="sort-select"
                >
                    <option value="default">Mặc định</option>
                    <option value="price_asc">Giá: Thấp đến Cao</option>
                    <option value="price_desc">Giá: Cao đến Thấp</option>
                </select>
            </div>
        </div>
    );
};

export default ProductFilters;