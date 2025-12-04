import "../../styles/components/body/ContactButton.css"
import React, { useState } from 'react';
import { FaFacebookMessenger, FaTimes, FaCommentDots } from 'react-icons/fa';
import { SiZalo } from 'react-icons/si';

function ContactButton() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="contact-wrapper">
            {isOpen && (
                <div className="contact-overlay" onClick={() => setIsOpen(false)}></div>
            )}

            <div className={`contact-menu ${isOpen ? 'show' : ''}`}>
                <div className="contact-header">
                    <span>Chọn hình thức liên hệ</span>
                    <button className="close-btn" onClick={() => setIsOpen(false)}>
                        <FaTimes/>
                    </button>
                </div>

                {/*<a href="tel:0981335858" className="menu-item">*/}
                {/*    <div className="icon-box phone-bg"><FaPhoneAlt/></div>*/}
                {/*    <span>Gọi ngay cho chúng tôi</span>*/}
                {/*</a>*/}

                <a href="https://zalo.me/0973620850" target="_blank" rel="noreferrer" className="menu-item">
                    <div className="icon-box zalo-bg"><SiZalo/></div>
                    <span>Chat với chúng tôi qua Zalo</span>
                </a>

                {/*<a href="/he-thong-cua-hang" className="menu-item">*/}
                {/*    <div className="icon-box map-bg"><FaMapMarkerAlt/></div>*/}
                {/*    <span>Hệ thống cửa hàng</span>*/}
                {/*</a>*/}

                <a href="#!" target="_blank" rel="noreferrer" className="menu-item">
                    <div className="icon-box mess-bg"><FaFacebookMessenger/></div>
                    <span>Chat với chúng tôi qua Messenger</span>
                </a>
            </div>

            <div className="contact-main-btn" onClick={toggleMenu}>
                <div className="btn-ring"></div>
                <div className="btn-ring-circle"></div>
                <div className="btn-icon">
                    {isOpen ? <FaTimes className="main-icon open"/> : <FaCommentDots className="main-icon"/>}
                </div>
                {!isOpen && <span className="btn-text">Liên hệ</span>}
            </div>
        </div>
    )
}

export default ContactButton;