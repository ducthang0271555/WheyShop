import "../../styles/components/header/SearchBar.css";
import {Link} from "react-router-dom";
import {useState, useEffect, useRef} from "react";
import LoadingSpinner from "../../loading-spinner/LoadingSpinner";
import productApi from "../../api/productApi";
import {FaSearch} from "react-icons/fa";

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {style: 'decimal'}).format(amount);
};

function SearchBar() {
    const [keyword, setKeyword] = useState('');
    const [results, setResults] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const searchRef = useRef(null);
    const apiUrl = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const timer = setTimeout(() => {
            if (keyword.length > 1) {
                fetchSearch(keyword);
            } else {
                setResults([]);
                setShowDropdown(false);
            }
        }, 500);
        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [keyword]);

    const fetchSearch = async (query) => {
        setIsLoading(true);
        setShowDropdown(true);
        try {
            const response = await productApi.searchProduct(query);
            setResults(response);
        } catch (error) {
            console.error("Error fetching search results:", error);
        } finally {
            setIsLoading(false);
        }
    }

    const handleClose = () => {
        setShowDropdown(false);
    };

    return (
        <>
            {showDropdown && <div className="search-overlay" onClick={handleClose}></div>}

            <div className="search-wrapper" ref={searchRef}>
                <div className="search-input-group">
                    <input
                        type="text"
                        placeholder="Tìm kiếm sản phẩm..."
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        onFocus={() => {
                            if (keyword.length > 1) setShowDropdown(true);
                        }}
                    />
                    <button className="search-btn">
                        <FaSearch/>
                    </button>
                </div>

                {showDropdown && (
                    <div className="search-dropdown">
                        {isLoading ? (
                            <div className="search-loading">
                                <LoadingSpinner/>
                            </div>
                        ) : results.length > 0 ? (
                            <>
                                <div className="dropdown-header">Có thể bạn muốn tìm</div>
                                <div className="dropdown-list">
                                    {results.map((product) => (
                                        <Link
                                            to={`/product/${product.id}`}
                                            key={product.id}
                                            className="search-item"
                                            onClick={handleClose}
                                        >
                                            <div className="item-img">
                                                <img
                                                    src={product.image.startsWith('http') ? product.image : `${apiUrl}/${product.image}`}
                                                    alt={product.name}/>
                                            </div>
                                            <div className="item-info">
                                                <div className="item-name">{product.name}</div>
                                                <div className="item-price">
                                                    <span
                                                        className="new-price">{formatCurrency(product.final_price)}đ</span>
                                                    {product.discount_percent > 0 && (
                                                        <span
                                                            className="old-price">{formatCurrency(product.original_price)}đ</span>
                                                    )}
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </>
                        ) : keyword.length > 1 ? (
                            <div className="no-results">Không tìm thấy sản phẩm nào.</div>
                        ) : null}
                    </div>
                )}
            </div>
        </>
    );
}

export default SearchBar;