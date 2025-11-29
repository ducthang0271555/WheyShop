import React, {useEffect, useState} from 'react';
import "../../styles/components/body/QuickNav.css"
import {useNavigate} from 'react-router-dom';
import axios from "axios";


const STATIC_ITEMS = [
    {
        id: 'flash-sale',
        name: 'Flash Sale',
        image: '/assets/icons/flash-sale.png',
        link: '/flash-sale'
    },
    {
        id: 'san-pham-moi',
        name: 'Sản Phẩm Mới',
        image: '/assets/icons/new-product.png',
        link: '/new-products'
    }
];

function QuickNav() {
    const apiUrl = process.env.REACT_APP_API_URL;
    const [navItems, setNavItems] = useState(STATIC_ITEMS);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchHashtags = async () => {
            try {
                // 2. Gọi API lấy danh sách Hashtag
                const response = await axios(`${apiUrl}/hash_tags/get-all-hash-tags`);
                const data = await response.data;

                // Kiểm tra dữ liệu trả về có đúng format { "hash_tags": [...] } không
                if (data.hash_tags) {
                    const apiItems = data.hash_tags.map(tag => ({
                        id: tag.id,       // VD: 14
                        name: tag.name,   // VD: "Whey Protein"

                        // XỬ LÝ ẢNH: Nối domain backend vào đường dẫn static
                        // VD: http://127.0.0.1:5000/static/images/hash_tag_image/whey.png
                        image: `${apiUrl}/${tag.image_url}`,

                        // XỬ LÝ LINK: Dùng ID để định tuyến
                        link: `/hashtag/${tag.id}`
                    }));

                    // Gộp Static + API
                    setNavItems([...STATIC_ITEMS, ...apiItems]);
                }
            } catch (error) {
                console.error("Lỗi kết nối API:", error);
            }
        };

        fetchHashtags();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="quick-nav-container">
            <div className="quick-nav-grid">
                {navItems.map((item, index) => (
                    <div
                        key={index}
                        className="quick-nav-item"
                        onClick={() => navigate(item.link)}
                    >
                        <div className="quick-nav-icon-box">
                            <img
                                src={item.image}
                                alt={item.name}
                                // Nếu ảnh lỗi thì hiện ảnh mặc định
                                onError={(e) => {
                                    e.target.src = '/assets/icons/default.png'
                                }}
                            />
                        </div>
                        <div className="quick-nav-text">{item.name}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default QuickNav;