import React, {useEffect, useState} from 'react';
import "../../styles/components/body/QuickNav.css"
import {useNavigate} from 'react-router-dom';
import {getBannerKey} from "../config/bannerConfig";
import hashtagApi from "../../api/hashtagApi";


const STATIC_ITEMS = [
    {
        id: 'flash-sale',
        name: 'Flash Sale',
        image: '/assets/icons/flash-sale.png',
        link: '/listing/flash-sale',
        type: 'flashSale'
    },
    {
        id: 'san-pham-moi',
        name: 'Sản Phẩm Mới',
        image: '/assets/icons/new-product.png',
        link: '/listing/new-products',
        type: 'newArrival'
    }
];

function QuickNav() {
    const apiUrl = process.env.REACT_APP_API_URL;
    const [navItems, setNavItems] = useState(STATIC_ITEMS);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchHashtags = async () => {
            try {
                const data = await hashtagApi.getAll();
                if (data.hash_tags) {
                    const apiItems = data.hash_tags.map(tag => ({
                        id: tag.id,       // VD: 14
                        name: tag.name,   // VD: "Whey Protein"
                        image: `${apiUrl}/${tag.image_url}`,
                        link: `/hashtag/${tag.id}`,
                        type: getBannerKey(tag.name)
                    }));
                    setNavItems([...STATIC_ITEMS, ...apiItems]);
                }
            } catch (error) {
                console.error("Lỗi kết nối API:", error);
            }
        };

        fetchHashtags();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleNavigate = (item) => {
            navigate(item.link, {
                state: {
                    bannerKey: item.type,
                    title: item.name
                }
            });
        };

    return (
        <div className="quick-nav-container">
            <div className="quick-nav-grid">
                {navItems.map((item, index) => (
                    <div
                        key={index}
                        className="quick-nav-item"
                        onClick={() => handleNavigate(item)}
                    >
                        <div className="quick-nav-icon-box">
                            <img
                                src={item.image}
                                alt={item.name}
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